import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'

import { Posts } from './payload/collections/Posts'
import { Media } from './payload/collections/Media'
import { Users } from './payload/collections/Users'

// Fallback para desenvolvimento/build sem banco
const databaseURL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/payload'
const payloadSecret = process.env.PAYLOAD_SECRET || 'development-secret-please-change-in-production'

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Posts, Media, Users],
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
