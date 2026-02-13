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
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.S3_BUCKET ?? ''
const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '') ?? ''

/** Normaliza endpoint R2: https://<account_id>.r2.cloudflarestorage.com (sem trailing slash). */
function normalizeR2Endpoint(url: string | undefined): string | null {
  if (!url?.trim()) return null
  const u = url.trim().replace(/\/+$/, '')
  return u.startsWith('http://') || u.startsWith('https://') ? u : null
}

function getClient(): S3Client | null {
  const endpoint = normalizeR2Endpoint(process.env.S3_ENDPOINT)
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

/** Log amigável para 403 (UnknownError costuma ser credenciais/endpoint/permissão no R2). */
function logS3Error(context: string, e: unknown): void {
  const err = e as { $metadata?: { httpStatusCode?: number }; message?: string; name?: string }
  const status = err?.$metadata?.httpStatusCode
  const msg = err?.message ?? (e instanceof Error ? e.message : String(e))
  console.error(`[storage-r2] ${context}:`, msg)
  if (status === 403) {
    console.error(
      '[storage-r2] 403 Forbidden: confira S3_ENDPOINT (https://<account_id>.r2.cloudflarestorage.com), ' +
      'S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, nome do bucket e permissão "Object Read & Write" do token. Ver docs/STORAGE_R2.md'
    )
  }
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

  try {
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
  } catch (e) {
    logS3Error('listBlogMediaFromStorage failed', e)
    return []
  }

  items.sort((a, b) => b.name.localeCompare(a.name))
  return items.slice(offset, offset + limit)
}

/** Lista recursivamente arquivos sob um prefixo (S3 não tem pastas, só chaves). Em falha (ex.: resposta não-XML do endpoint), retorna []. */
async function listPrefix(
  client: S3Client,
  prefix: string
): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const items: { path: string; name: string; publicUrl: string }[] = []
  let continuationToken: string | undefined

  try {
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
  } catch (e) {
    const err = e as { $metadata?: { httpStatusCode?: number }; message?: string }
    const msg = err?.message ?? (e instanceof Error ? e.message : String(e))
    logS3Error(`listPrefix failed (prefix: ${prefix})`, e)
    if (err?.$metadata?.httpStatusCode === 403 || msg.includes('Access Denied')) {
      console.error(
        '[storage-r2] Dica: o token R2 (S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY) precisa de permissão "Object Read & Write" no bucket inteiro. Ver docs/STORAGE_R2.md'
      )
    }
    return []
  }

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
    try {
      const items = await listPrefix(client, prefix)
      all.push(...items)
    } catch (e) {
      console.error('[storage-r2] listProjetosMediaFromStorage prefix:', prefix, e)
      // Continua com os outros prefixos
    }
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
    logS3Error('deleteBlogMediaFromStorage', e)
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
    logS3Error('deleteProjetosMediaFromStorage', e)
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
    logS3Error('moveProjetosMediaInStorage', e)
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
    logS3Error('uploadBlogFile', e)
    return null
  }
}

/** Verifica se um arquivo existe no storage. */
export async function fileExistsInStorage(path: string): Promise<boolean> {
  const client = getClient()
  if (!client) return false
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: path }))
    return true
  } catch (e) {
    const err = e as { name?: string }
    if (err.name === 'NotFound' || err.name === 'NoSuchKey') return false
    logS3Error('fileExistsInStorage', e)
    return false
  }
}

/** Upload genérico (buffer) para qualquer path. */
export async function uploadFileToStorage(
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
        // Cache-Control longo para thumbnails
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )
    return { publicUrl: getR2PublicUrl(path) }
  } catch (e) {
    logS3Error('uploadFileToStorage', e)
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
