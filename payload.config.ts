import sharp from 'sharp'
import { createRequire } from 'node:module'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Node 24: evita ERR_REQUIRE_CYCLE_MODULE carregando collections só quando acessadas (getter)
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url)
function getCollections() {
  return [
    (req('./payload/collections/Posts') as { Posts: unknown }).Posts,
    (req('./payload/collections/Media') as { Media: unknown }).Media,
    (req('./payload/collections/Users') as { Users: unknown }).Users,
  ]
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
  editor: lexicalEditor(),
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
  },
  plugins: [
    // Vercel Blob Storage (configurar BLOB_READ_WRITE_TOKEN no .env / Vercel)
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
