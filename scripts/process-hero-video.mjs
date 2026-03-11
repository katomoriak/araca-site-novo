import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Add ffmpeg to fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

// Helper to load env vars
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

const r2Client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const bucketName = process.env.S3_BUCKET;
const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
const videoFilename = process.env.NEXT_PUBLIC_HERO_VIDEO_FILENAME || 'FJO__VIDEOFACHADA_01_R00.mp4';

if (!videoUrl) {
    console.error("No NEXT_PUBLIC_HERO_VIDEO_URL defined.");
    process.exit(1);
}

const originalPath = path.join(rootDir, 'temp', videoFilename);
const posterFilename = videoFilename.replace(/\.[^/.]+$/, "_poster.webp");
const lowResFilename = videoFilename.replace(/\.[^/.]+$/, "_low.mp4");

const posterPath = path.join(rootDir, 'temp', posterFilename);
const lowResPath = path.join(rootDir, 'temp', lowResFilename);

async function downloadFile(url, dest) {
    console.log(`Downloading ${url}...`);
    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
    }

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download: ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', reject);
    });
}

function generatePoster(input, output) {
    console.log(`Generating poster ${output}...`);
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .screenshots({
                count: 1,
                timemarks: ['00:00:01.000'],
                filename: path.basename(output),
                folder: path.dirname(output),
            })
            .on('end', () => resolve())
            .on('error', reject);
    });
}

function generateLowResVideo(input, output) {
    console.log(`Generating low-res video ${output}...`);
    return new Promise((resolve, reject) => {
        // Generate a 1280x720 30fps heavily compressed video
        ffmpeg(input)
            .outputOptions([
                '-vf scale=-2:720',
                '-c:v libx264',
                '-crf 32',
                '-preset veryfast',
                '-c:a copy', // usually hero videos are muted but if we want audio
                '-an',       // remove audio entirely to save even more space since it's muted
            ])
            .save(output)
            .on('end', () => resolve())
            .on('error', reject);
    });
}

async function uploadToR2(filePath, s3Key, contentType) {
    console.log(`Uploading ${filePath} to R2 as ${s3Key}...`);
    const fileContent = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
    });
    await r2Client.send(command);
    console.log(`Successfully uploaded ${s3Key}.`);
}

async function main() {
    try {
        if (!fs.existsSync(originalPath)) {
            await downloadFile(videoUrl, originalPath);
        } else {
            console.log(`Using cached original video at ${originalPath}`);
        }

        if (!fs.existsSync(posterPath)) {
            await generatePoster(originalPath, posterPath);
            // Wait for the screenshot folder command to fully complete the IO
            await new Promise(r => setTimeout(r, 500));
        }

        if (!fs.existsSync(lowResPath)) {
            await generateLowResVideo(originalPath, lowResPath);
        }

        await uploadToR2(posterPath, posterFilename, 'image/webp');
        await uploadToR2(lowResPath, lowResFilename, 'video/mp4');

        console.log("Processing complete!");
        console.log(`Added poster: ${posterFilename}`);
        console.log(`Added low-res: ${lowResFilename}`);

    } catch (error) {
        console.error("Error during processing:", error);
    }
}

main();
