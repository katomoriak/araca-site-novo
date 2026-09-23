import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Helper to load env vars from .env.local
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
      }
    });
  }
}
loadEnv();

const inputPath = path.join(rootDir, 'temp', 'video_input.mp4');
const baseKey = 'video_designinteriores_arq_classica_neoclassica_maximalista';
const optimizedFilename = `${baseKey}.mp4`;
const posterFilename = `${baseKey}_poster.webp`;
const lowResFilename = `${baseKey}_low.mp4`;

const optimizedPath = path.join(rootDir, 'temp', optimizedFilename);
const posterPath = path.join(rootDir, 'temp', posterFilename);
const lowResPath = path.join(rootDir, 'temp', lowResFilename);

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    console.log(`Running ffmpeg with args: ${args.join(' ')}`);
    execFile(ffmpegStatic, args, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}

async function uploadToR2(filePath, s3Key, contentType) {
  const r2Client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET;
  console.log(`Uploading ${filePath} to R2 (${bucketName}/${s3Key})...`);
  const fileContent = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await r2Client.send(command);
  console.log(`Successfully uploaded ${s3Key} to R2!`);
}

async function main() {
  console.log('--- Step 1: Probe Original Video ---');
  try {
    await runFfmpeg(['-i', inputPath, '-hide_banner']);
  } catch (probeError) {
    // ffmpeg exits with code 1 when no output file is provided; stderr still has stream info
    console.log('Probed stream info successfully.');
  }

  console.log('--- Step 2: Generate Poster (WebP at 1.5s) ---');
  // Extrai 1 frame aos 1.5s com alta qualidade webp
  await runFfmpeg([
    '-y',
    '-ss', '00:00:01.500',
    '-i', inputPath,
    '-frames:v', '1',
    '-c:v', 'libwebp',
    '-lossless', '0',
    '-q:v', '85',
    posterPath
  ]);
  const posterStat = fs.statSync(posterPath);
  console.log(`Poster generated: ${posterPath} (${(posterStat.size / 1024).toFixed(1)} KB)`);

  console.log('--- Step 3: Generate Optimized Hero Video (1080p, CRF 26, faststart, muted) ---');
  // Otimização:
  // - scale: max width 1920, preservando proporção
  // - c:v libx264
  // - crf 26 (excelente qualidade visual para vídeo contínuo em background)
  // - preset slow (melhor compressão por byte)
  // - movflags +faststart (moov atom na frente para reprodução instantânea no navegador)
  // - an (remove áudio, pois hero é muted)
  // - pix_fmt yuv420p (compatibilidade universal Safari/iOS/Chrome/Firefox)
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-vf', 'scale=w=1920:h=1080:force_original_aspect_ratio=decrease:flags=bicubic,scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-crf', '26',
    '-preset', 'slow',
    '-movflags', '+faststart',
    '-an',
    '-pix_fmt', 'yuv420p',
    optimizedPath
  ]);
  const optStat = fs.statSync(optimizedPath);
  console.log(`Optimized video generated: ${optimizedPath} (${(optStat.size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log('--- Step 4: Generate Low-Res Video (720p, CRF 30, faststart, muted) ---');
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-vf', 'scale=w=1280:h=720:force_original_aspect_ratio=decrease:flags=bicubic,scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-crf', '30',
    '-preset', 'veryfast',
    '-movflags', '+faststart',
    '-an',
    '-pix_fmt', 'yuv420p',
    lowResPath
  ]);
  const lowStat = fs.statSync(lowResPath);
  console.log(`Low-res video generated: ${lowResPath} (${(lowStat.size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log('--- Step 5: Upload to Cloudflare R2 ---');
  await uploadToR2(posterPath, posterFilename, 'image/webp');
  await uploadToR2(optimizedPath, optimizedFilename, 'video/mp4');
  await uploadToR2(lowResPath, lowResFilename, 'video/mp4');

  console.log('--- Processing & Upload Complete! ---');
  console.log(`Public URL: ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${optimizedFilename}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
