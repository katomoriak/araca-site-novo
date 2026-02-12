/**
 * Operações de storage no Cloudflare R2 (S3-compatible).
 * Usado quando NEXT_PUBLIC_R2_PUBLIC_URL e S3_* estão configurados.
 * Um único bucket para tudo: blog/, {slug}/, midias/.
 */
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.S3_BUCKET ?? ''
const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '') ?? ''

function getClient(): S3Client | null {
  const endpoint = process.env.S3_ENDPOINT
  const accessKey = process.env.S3_ACCESS_KEY_ID
  const secretKey = process.env.S3_SECRET_ACCESS_KEY
  if (!endpoint || !accessKey || !secretKey || !bucket || !publicBase) return null

  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    forcePathStyle: true,
  })
}

/** URL pública de um arquivo no bucket. */
export function getR2PublicUrl(key: string): string {
  return `${publicBase}/${key}`
}

const UPLOAD_EXPIRES = 60 * 5 // 5 min

/** Gera URL assinada para upload de imagens do blog. Caminho: blog/{timestamp}-{random}.{ext} */
export async function createSignedUploadUrlForBlog(
  filename: string
): Promise<{ signedUrl: string; path: string; publicUrl: string } | null> {
  const client = getClient()
  if (!client) return null

  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
  const path = `blog/${timestamp}-${randomStr}.${safeExt}`

  const command = new PutObjectCommand({ Bucket: bucket, Key: path })
  const signedUrl = await getSignedUrl(client, command, { expiresIn: UPLOAD_EXPIRES })
  return { signedUrl, path, publicUrl: getR2PublicUrl(path) }
}

/** Gera URL assinada para upload de arquivo de projeto. Caminho: {slug}/{filename} */
export async function createSignedUploadUrl(
  slug: string,
  filename: string
): Promise<{ signedUrl: string; path: string; publicUrl: string } | null> {
  const client = getClient()
  if (!client) return null

  const path = `${slug}/${filename}`
  const command = new PutObjectCommand({ Bucket: bucket, Key: path })
  const signedUrl = await getSignedUrl(client, command, { expiresIn: UPLOAD_EXPIRES })
  return { signedUrl, path, publicUrl: getR2PublicUrl(path) }
}

export const PROJETOS_MIDIAS_PREFIX = 'midias'

/** Gera URL assinada para upload em midias/ ou midias/{subfolder}/ */
export async function createSignedUploadUrlProjetosMedia(
  filename: string,
  subfolder?: string
): Promise<{ signedUrl: string; path: string; publicUrl: string } | null> {
  const client = getClient()
  if (!client) return null

  const safeName = filename.replace(/[/\\]/g, '').trim()
  if (!safeName) return null

  const safeSub = subfolder?.replace(/[/\\]/g, '').trim()
  const path = safeSub
    ? `${PROJETOS_MIDIAS_PREFIX}/${safeSub}/${safeName}`
    : `${PROJETOS_MIDIAS_PREFIX}/${safeName}`

  const command = new PutObjectCommand({ Bucket: bucket, Key: path })
  const signedUrl = await getSignedUrl(client, command, { expiresIn: UPLOAD_EXPIRES })
  return { signedUrl, path, publicUrl: getR2PublicUrl(path) }
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
const mediaExtensions = [...imageExtensions, '.mp4', '.mov', '.avi', '.webm']

function isImage(name: string): boolean {
  return imageExtensions.some((ext) => name.toLowerCase().endsWith(ext))
}
function isMedia(name: string): boolean {
  return mediaExtensions.some((ext) => name.toLowerCase().endsWith(ext))
}

/** Lista arquivos em blog/ */
export async function listBlogMediaFromStorage(options: {
  limit?: number
  offset?: number
  search?: string
}): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const client = getClient()
  if (!client) return []

  const limit = Math.min(options.limit ?? 200, 500)
  const offset = options.offset ?? 0
  const search = options.search?.trim().toLowerCase()

  const items: { path: string; name: string; publicUrl: string }[] = []
  let continuationToken: string | undefined

  do {
    const { Contents, NextContinuationToken } = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: 'blog/',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      })
    )

    for (const obj of Contents ?? []) {
      const key = obj.Key ?? ''
      const name = key.split('/').pop() ?? ''
      if (!name || !isImage(name)) continue
      if (search && !name.toLowerCase().includes(search)) continue
      items.push({ path: key, name, publicUrl: getR2PublicUrl(key) })
    }
    continuationToken = NextContinuationToken
  } while (continuationToken)

  items.sort((a, b) => b.name.localeCompare(a.name))
  return items.slice(offset, offset + limit)
}

/** Lista recursivamente arquivos sob um prefixo (S3 não tem pastas, só chaves). */
async function listPrefix(
  client: S3Client,
  prefix: string
): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const items: { path: string; name: string; publicUrl: string }[] = []
  let continuationToken: string | undefined

  do {
    const { Contents, NextContinuationToken } = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix ? `${prefix}/` : '',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      })
    )

    for (const obj of Contents ?? []) {
      const key = obj.Key ?? ''
      const name = key.split('/').pop() ?? ''
      if (!name) continue
      if (isMedia(name)) {
        items.push({ path: key, name, publicUrl: getR2PublicUrl(key) })
      }
    }
    continuationToken = NextContinuationToken
  } while (continuationToken)

  return items
}

/** Lista mídias em múltiplos prefixos (ex.: slugs e midias) */
export async function listProjetosMediaFromStorage(options: {
  prefixes: string[]
  limit?: number
  offset?: number
  search?: string
}): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const client = getClient()
  if (!client) return []

  const limit = Math.min(options.limit ?? 200, 500)
  const offset = options.offset ?? 0
  const search = options.search?.trim().toLowerCase()

  const all: { path: string; name: string; publicUrl: string }[] = []
  for (const prefix of options.prefixes) {
    const items = await listPrefix(client, prefix)
    all.push(...items)
  }

  const filtered = search
    ? all.filter(
        (f) =>
          f.name.toLowerCase().includes(search) || f.path.toLowerCase().includes(search)
      )
    : all

  filtered.sort((a, b) => b.path.localeCompare(a.path))
  return filtered.slice(offset, offset + limit)
}

export async function deleteBlogMediaFromStorage(path: string): Promise<boolean> {
  const client = getClient()
  if (!client) return false
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: path }))
    return true
  } catch (e) {
    console.error('[storage-r2] deleteBlogMediaFromStorage:', e)
    return false
  }
}

export async function deleteProjetosMediaFromStorage(path: string): Promise<boolean> {
  const client = getClient()
  if (!client) return false
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: path }))
    return true
  } catch (e) {
    console.error('[storage-r2] deleteProjetosMediaFromStorage:', e)
    return false
  }
}

/** R2/S3 não tem move nativo; faz copy + delete */
export async function moveProjetosMediaInStorage(
  fromPath: string,
  toPath: string
): Promise<boolean> {
  const client = getClient()
  if (!client) return false
  try {
    await client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${fromPath}`,
        Key: toPath,
      })
    )
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: fromPath }))
    return true
  } catch (e) {
    console.error('[storage-r2] moveProjetosMediaInStorage:', e)
    return false
  }
}

/** Upload direto (buffer) para blog - usado por rotas que fazem upload via servidor */
export async function uploadBlogFile(
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<{ publicUrl: string } | null> {
  const client = getClient()
  if (!client) return null
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: buffer,
        ContentType: contentType,
      })
    )
    return { publicUrl: getR2PublicUrl(path) }
  } catch (e) {
    console.error('[storage-r2] uploadBlogFile:', e)
    return null
  }
}

export function isR2Configured(): boolean {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET &&
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  )
}

/** Retorna a URL pública base para construir URLs (usado quando não há prefixo de bucket). */
export function getR2BaseUrl(): string {
  return publicBase
}
