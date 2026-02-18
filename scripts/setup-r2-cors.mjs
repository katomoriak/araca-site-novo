/**
 * Script one-time para configurar CORS no bucket R2.
 * Permite upload direto (PUT) do navegador para o R2 via Signed URL.
 *
 * Uso: node scripts/setup-r2-cors.mjs
 *
 * Requer as variáveis de ambiente S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET
 * (as mesmas usadas pelo app).
 */
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { resolve } from 'path'

// Carrega .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const endpoint = process.env.S3_ENDPOINT?.replace(/\/+$/, '')
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const bucket = process.env.S3_BUCKET

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    console.error('❌ Variáveis S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY e S3_BUCKET são obrigatórias.')
    console.error('   Verifique o arquivo .env.local')
    process.exit(1)
}

const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
})

const corsRules = [
    {
        AllowedOrigins: [
            'https://www.araca.arq.br',
            'https://araca.arq.br',
            'http://localhost:3000',
            'http://localhost:3001',
        ],
        AllowedMethods: ['GET', 'PUT', 'HEAD'],
        AllowedHeaders: ['*'],
        ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
        MaxAgeSeconds: 3600,
    },
]

async function main() {
    console.log(`\n🔧 Configurando CORS no bucket: ${bucket}`)
    console.log(`   Endpoint: ${endpoint}\n`)

    try {
        await client.send(
            new PutBucketCorsCommand({
                Bucket: bucket,
                CORSConfiguration: { CORSRules: corsRules },
            })
        )
        console.log('✅ CORS configurado com sucesso!\n')
        console.log('   Origens permitidas:')
        corsRules[0].AllowedOrigins.forEach((o) => console.log(`     - ${o}`))
        console.log(`   Métodos: ${corsRules[0].AllowedMethods.join(', ')}`)
        console.log()
    } catch (e) {
        console.error('❌ Falha ao configurar CORS:', e.message)
        console.error('   Verifique se o token R2 tem permissão "Admin Read & Write" ou "Object Read & Write".')
        process.exit(1)
    }

    // Verificar
    try {
        const result = await client.send(new GetBucketCorsCommand({ Bucket: bucket }))
        console.log('📋 Regras CORS atuais:')
        console.log(JSON.stringify(result.CORSRules, null, 2))
    } catch (e) {
        console.warn('⚠️  Não foi possível ler a configuração CORS (pode ser normal):', e.message)
    }
}

main()
