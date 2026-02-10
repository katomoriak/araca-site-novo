/**
 * Configuração Payload CMS 3.
 * Imports estáticos para o Next (webpack); evita require/require.context que quebram no bundle.
 * Migrate no Node 24 falha (Lexical usa top-level await). Use: npm run migrate (roda com Node 20).
 */
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { CollectionConfig } from 'payload'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'node:url'

import { Posts } from './payload/collections/Posts'
import { Media } from './payload/collections/Media'
import { Users } from './payload/collections/Users'
import { Subscribers } from './payload/collections/Subscribers'
import { Newsletters } from './payload/collections/Newsletters'
import { Leads } from './payload/collections/Leads'
import { Negociacoes } from './payload/collections/Negociacoes'
import { Transactions } from './payload/collections/Transactions'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getCollections(): CollectionConfig[] {
  return [Posts, Media, Users, Subscribers, Newsletters, Leads, Negociacoes, Transactions]
}

// Fallback para desenvolvimento/build sem banco
const rawUrl = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/payload'
// Rejeitar placeholders de documentação (hosts de exemplo não existem)
if (rawUrl.includes('ep-....vercel-storage.com')) {
  throw new Error(
    'DATABASE_URL contém um host de exemplo. Use a connection string real do Supabase: ' +
    'Project Settings → Database → Connection string (URI). Prefira "Session mode" (porta 6543) para Vercel.',
  )
}
// Supabase: manter sslmode=require e adicionar uselibpqcompat=true para silenciar aviso do pg (evita verify-full que causa SELF_SIGNED_CERT_IN_CHAIN)
// Outros provedores: usar verify-full para evitar aviso de segurança do pg
const databaseURL = rawUrl.includes('supabase.com')
  ? (rawUrl.includes('uselibpqcompat=') ? rawUrl : `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}uselibpqcompat=true`)
  : rawUrl.replace(
      /([?&])sslmode=(require|prefer|verify-ca)(&|$)/i,
      '$1sslmode=verify-full$3',
    )
const defaultSecret = 'development-secret-please-change-in-production'
const payloadSecret = process.env.PAYLOAD_SECRET || defaultSecret
if (process.env.NODE_ENV === 'production' && payloadSecret === defaultSecret) {
  throw new Error(
    'Em produção, defina PAYLOAD_SECRET no ambiente (ex.: Vercel → Settings → Environment Variables). ' +
    'Use um valor aleatório longo (32+ caracteres).',
  )
}

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_EMAIL || 'newsletter@example.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Aracá Interiores',
    transportOptions:
      process.env.SMTP_HOST && process.env.SMTP_USER
        ? {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS || '',
            },
          }
        : undefined,
  }),
  i18n: {
    supportedLanguages: { pt, en },
    fallbackLanguage: 'pt',
  },
  editor: lexicalEditor(),
  upload: {
    limits: {
      fileSize: 4194304, // 4 MB — limite compatível com Vercel serverless
    },
  },
  get collections() {
    return getCollections()
  },
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
    prodMigrations: [],
  }),
  sharp,
  admin: {
    autoLogin: process.env.NODE_ENV === 'development' ? {
      email: 'dev@payloadcms.com',
      password: 'test',
      prefillOnly: true,
    } : false,
    meta: {
      title: 'Aracá Interiores',
      titleSuffix: ' – Aracá',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/logotipos/LOGOTIPO%20REDONDO@300x.png',
        },
      ],
    },
    components: {
      graphics: {
        Icon: '/components/admin/AracaIcon#AracaIcon',
        Logo: '/components/admin/AracaLogo#AracaLogo',
      },
    },
  },
  plugins: [
    // Supabase Storage (S3-compatible) — prioridade quando S3_* estiverem definidas
    ...(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_ENDPOINT
      ? [
          s3Storage({
            collections: {
              media: {
                signedDownloads: {
                  shouldUseSignedURL: ({ filename }) => filename?.endsWith('.mp4') ?? false,
                },
              },
            },
            bucket: process.env.S3_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
    // Vercel Blob Storage — fallback se S3 não configurado (BLOB_READ_WRITE_TOKEN)
    ...(!process.env.S3_BUCKET && process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
