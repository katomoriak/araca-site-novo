/**
 * Cliente Supabase no servidor (Node.js).
 * Usa SUPABASE_SERVICE_ROLE_KEY para operações que precisam bypass de RLS (ex.: criar signed upload URL).
 * Nunca exponha a service role key no frontend.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getSupabaseServer() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

const bucketProjetos = process.env.NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET ?? 'a_public'
const bucketMedia = 'media'

/** Expiração da URL assinada de upload (segundos). 5 min é suficiente para o cliente fazer o PUT. */
const UPLOAD_SIGNED_EXPIRES = 60 * 5

/**
 * Gera uma URL assinada para upload de imagens do blog.
 * Caminho: blog/{timestamp}-{random}.{ext}
 * Evita limite de 4 MB da Vercel (upload direto do cliente ao Supabase).
 */
export async function createSignedUploadUrlForBlog(filename: string): Promise<{
  signedUrl: string
  path: string
  publicUrl: string
} | null> {
  const supabase = getSupabaseServer()
  if (!supabase) return null

  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
  const path = `blog/${timestamp}-${randomStr}.${safeExt}`

  const { data, error } = await supabase.storage
    .from(bucketMedia)
    .createSignedUploadUrl(path, { upsert: true })

  if (error || !data?.signedUrl) {
    console.error('[supabase-server] createSignedUploadUrlForBlog:', error?.message ?? String(error))
    return null
  }

  const actualPath = data.path ?? path
  const { data: urlData } = supabase.storage
    .from(bucketMedia)
    .getPublicUrl(actualPath)

  return {
    signedUrl: data.signedUrl,
    path: actualPath,
    publicUrl: urlData?.publicUrl ?? `${supabaseUrl!.replace(/\/$/, '')}/storage/v1/object/public/${bucketMedia}/${actualPath}`,
  }
}

/**
 * Gera uma URL assinada para o cliente fazer upload direto ao Storage (evita limite de 4 MB da Vercel).
 * Caminho no bucket: {slug}/{filename}
 * Retorna a signedUrl para PUT e a URL pública final do arquivo.
 */
export async function createSignedUploadUrl(slug: string, filename: string): Promise<{
  signedUrl: string
  path: string
  publicUrl: string
} | null> {
  const supabase = getSupabaseServer()
  if (!supabase) return null

  const path = `${slug}/${filename}`

  const { data, error } = await supabase.storage
    .from(bucketProjetos)
    .createSignedUploadUrl(path, { upsert: true })

  if (error || !data?.signedUrl) {
    console.error('[supabase-server] createSignedUploadUrl:', error?.message ?? String(error))
    return null
  }

  const baseUrl = supabaseUrl!.replace(/\/$/, '')
  const publicUrl = `${baseUrl}/storage/v1/object/public/${bucketProjetos}/${path}`

  return {
    signedUrl: data.signedUrl,
    path: data.path ?? path,
    publicUrl,
  }
}

/**
 * Lista arquivos no bucket media, prefixo blog/ (para o banco de mídias do blog).
 * Retorna no máximo limit itens, ordenados por nome (mais recentes primeiro).
 */
export async function listBlogMediaFromStorage(options: {
  limit?: number
  offset?: number
  search?: string
}): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const supabase = getSupabaseServer()
  if (!supabase) return []

  const limit = Math.min(options.limit ?? 200, 500)
  const offset = options.offset ?? 0
  const search = options.search?.trim().toLowerCase()

  const { data, error } = await supabase.storage
    .from(bucketMedia)
    .list('blog', {
      limit: 1000,
      sortBy: { column: 'name', order: 'desc' },
    })

  if (error) {
    console.error('[supabase-server] listBlogMediaFromStorage:', error.message)
    return []
  }

  const baseUrl = supabaseUrl?.replace(/\/$/, '') ?? ''
  const items: { path: string; name: string; publicUrl: string }[] = []

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  for (const row of data ?? []) {
    const name = typeof row.name === 'string' ? row.name : ''
    if (!name) continue
    // Incluir apenas arquivos (com extensão de imagem); pastas não têm extensão
    const isFile = imageExtensions.some((ext) => name.toLowerCase().endsWith(ext))
    if (!isFile) continue
    if (search && !name.toLowerCase().includes(search)) continue
    const path = `blog/${name}`
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucketMedia}/${path}`
    items.push({ path, name, publicUrl })
  }

  const from = offset
  const to = offset + limit
  return items.slice(from, to)
}

/**
 * Remove um arquivo do bucket media (pasta blog). Path é relativo ao bucket, ex: "blog/1770831620754-tbnfn1.png".
 */
export async function deleteBlogMediaFromStorage(path: string): Promise<boolean> {
  const supabase = getSupabaseServer()
  if (!supabase) return false
  const { error } = await supabase.storage.from(bucketMedia).remove([path])
  if (error) {
    console.error('[supabase-server] deleteBlogMediaFromStorage:', error.message)
    return false
  }
  return true
}

/** Pasta no bucket de projetos usada como banco de mídias compartilhadas. */
export const PROJETOS_MIDIAS_PREFIX = 'midias'

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
const videoExtensions = ['.mp4', '.mov', '.avi', '.webm']

function isMediaFile(name: string): boolean {
  const n = name.toLowerCase()
  return (
    imageExtensions.some((ext) => n.endsWith(ext)) ||
    videoExtensions.some((ext) => n.endsWith(ext))
  )
}

/**
 * Lista recursivamente todos os arquivos de mídia dentro de um prefixo (pasta).
 * Supabase list() retorna um nível; itens sem extensão de mídia são tratados como subpastas.
 */
async function listFolderRecursive(
  supabase: NonNullable<ReturnType<typeof getSupabaseServer>>,
  prefix: string,
  baseUrl: string
): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const { data, error } = await supabase.storage
    .from(bucketProjetos)
    .list(prefix, { limit: 1000 })

  if (error) {
    console.error('[supabase-server] listFolderRecursive:', prefix, error.message)
    return []
  }

  const items: { path: string; name: string; publicUrl: string }[] = []

  for (const row of data ?? []) {
    const name = typeof row.name === 'string' ? row.name : ''
    if (!name) continue
    const fullPath = prefix ? `${prefix}/${name}` : name
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucketProjetos}/${fullPath}`

    if (isMediaFile(name)) {
      items.push({ path: fullPath, name, publicUrl })
    } else {
      const sub = await listFolderRecursive(supabase, fullPath, baseUrl)
      items.push(...sub)
    }
  }

  return items
}

/**
 * Lista mídias do bucket de projetos em todas as pastas indicadas (ex.: pastas de cada projeto + midias).
 * Mantém a organização: path = "slug/arquivo.jpg" ou "slug/subpasta/arquivo.jpg".
 * prefixes: lista de pastas no root do bucket (ex. slugs dos projetos e "midias").
 */
export async function listProjetosMediaFromStorage(options: {
  prefixes: string[]
  limit?: number
  offset?: number
  search?: string
}): Promise<{ path: string; name: string; publicUrl: string }[]> {
  const supabase = getSupabaseServer()
  if (!supabase) return []

  const limit = Math.min(options.limit ?? 200, 500)
  const offset = options.offset ?? 0
  const search = options.search?.trim().toLowerCase()
  const baseUrl = supabaseUrl?.replace(/\/$/, '') ?? ''

  const all: { path: string; name: string; publicUrl: string }[] = []

  for (const prefix of options.prefixes) {
    const folderItems = await listFolderRecursive(supabase, prefix, baseUrl)
    all.push(...folderItems)
  }

  const filtered = search
    ? all.filter((f) => f.name.toLowerCase().includes(search) || f.path.toLowerCase().includes(search))
    : all

  const sorted = filtered.sort((a, b) => b.path.localeCompare(a.path))
  return sorted.slice(offset, offset + limit)
}

/**
 * Gera URL assinada para upload no banco de mídias dos projetos (pasta midias/ ou midias/{subfolder}/).
 * subfolder: slug do projeto para organizar em pasta (ex: "residencia-x"). Opcional = arquivo na raiz de midias/.
 */
export async function createSignedUploadUrlProjetosMedia(
  filename: string,
  subfolder?: string
): Promise<{ signedUrl: string; path: string; publicUrl: string } | null> {
  const supabase = getSupabaseServer()
  if (!supabase) return null

  const safeName = filename.replace(/[/\\]/g, '').trim()
  if (!safeName) return null

  const safeSub = subfolder?.replace(/[/\\]/g, '').trim()
  const path = safeSub
    ? `${PROJETOS_MIDIAS_PREFIX}/${safeSub}/${safeName}`
    : `${PROJETOS_MIDIAS_PREFIX}/${safeName}`

  const { data, error } = await supabase.storage
    .from(bucketProjetos)
    .createSignedUploadUrl(path, { upsert: true })

  if (error || !data?.signedUrl) {
    console.error('[supabase-server] createSignedUploadUrlProjetosMedia:', error?.message ?? String(error))
    return null
  }

  const baseUrl = supabaseUrl!.replace(/\/$/, '')
  const publicUrl = `${baseUrl}/storage/v1/object/public/${bucketProjetos}/${data.path ?? path}`

  return {
    signedUrl: data.signedUrl,
    path: data.path ?? path,
    publicUrl,
  }
}

/**
 * Remove um arquivo do bucket de projetos. Path é relativo ao bucket, ex: "midias/arquivo.jpg" ou "slug/arquivo.jpg".
 */
export async function deleteProjetosMediaFromStorage(path: string): Promise<boolean> {
  const supabase = getSupabaseServer()
  if (!supabase) return false
  const { error } = await supabase.storage.from(bucketProjetos).remove([path])
  if (error) {
    console.error('[supabase-server] deleteProjetosMediaFromStorage:', error.message)
    return false
  }
  return true
}

/**
 * Move/renomeia um arquivo dentro do bucket de projetos (ex.: renomear em midias/).
 */
export async function moveProjetosMediaInStorage(fromPath: string, toPath: string): Promise<boolean> {
  const supabase = getSupabaseServer()
  if (!supabase) return false
  const { error } = await supabase.storage.from(bucketProjetos).move(fromPath, toPath)
  if (error) {
    console.error('[supabase-server] moveProjetosMediaInStorage:', error.message)
    return false
  }
  return true
}

export { bucketProjetos, bucketMedia, getSupabaseServer }
