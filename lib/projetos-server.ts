/**
 * Leitura de projetos a partir de public/projetos (manifests) ou da collection Payload Projetos.
 * URLs das mídias: apenas R2 (NEXT_PUBLIC_R2_PUBLIC_URL) ou arquivos locais em /projetos/{slug}/.
 * Usado pela API /api/projetos e pela Home (SSR) para evitar waterfall no cliente.
 */
import fs from 'fs/promises'
import path from 'path'
import { projectSlugSchema } from '@/lib/validation-schemas'
import type { ProjectGalleryItem, GalleryMediaItem } from '@/components/home/ProjectGallery'
import { getPayloadClient } from '@/lib/payload'
import { getProxiedImageUrlWithResize, getProxiedVideoUrl } from '@/lib/transform-content-images'

const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')

export function getProjetosBaseUrl(slug: string): string {
  if (R2_PUBLIC) return `${R2_PUBLIC}/${slug}`
  return `/projetos/${slug}`
}

/**
 * URL pública da capa do projeto. Se cover contém '/', é path no bucket (ex: midias/slug/capa.jpg);
 * senão é arquivo na pasta do projeto (slug/cover).
 * Usa proxy para R2 para evitar CORS e melhorar carregamento.
 */
export function getProjetoCoverUrl(slug: string, cover: string): string {
  const bucketBase = getProjetosBucketBaseUrl()
  const base = getProjetosBaseUrl(slug)
  let rawUrl: string
  if (cover.includes('/')) {
    rawUrl = `${bucketBase}/${cover}`
  } else {
    rawUrl = `${base}/${encodeURIComponent(cover)}`
  }
  return getProxiedImageUrlWithResize(rawUrl, 800, 80) || rawUrl
}

/** URL base do bucket de projetos (sem slug), para arquivos em pastas como midias/. Apenas R2. */
export function getProjetosBucketBaseUrl(): string {
  if (R2_PUBLIC) return R2_PUBLIC
  return '/projetos'
}

/** Converte URL de imagem (R2) para proxy com resize. URLs locais retornam inalteradas. */
function toOptimizedImageUrl(url: string, w: number, q = 80): string {
  return getProxiedImageUrlWithResize(url, w, q) || url
}

/** Converte URL de vídeo (R2) para proxy (cache CDN). Outras origens retornam inalteradas. */
function toProxiedVideoUrl(url: string): string {
  return getProxiedVideoUrl(url) || url
}

/** Nome de arquivo válido para evitar URLs quebradas (ex.: cover "_" ou vazio). */
function isValidFileName(name: string | null | undefined): boolean {
  const s = typeof name === 'string' ? name.trim() : ''
  return s.length > 0 && s !== '_'
}

/** Documento da collection Payload Projetos (shape usado na leitura). */
interface ProjetoDoc {
  id: string
  slug: string
  title: string
  description?: string | null
  tag?: string | null
  cover: string
  showOnHome?: boolean | null
  showOnProjectsPage?: boolean | null
  media?: Array<{ type: 'image' | 'video'; file: string; name?: string | null }> | null
}

export type ProjetosWhere = 'home' | 'projects'

/** Mapeia um doc Payload para ProjectGalleryItem. */
function docToGalleryItem(doc: ProjetoDoc): ProjectGalleryItem {
  const base = getProjetosBaseUrl(doc.slug)
  const bucketBase = getProjetosBucketBaseUrl()

  const mediaItems = (doc.media ?? []).filter((m) => isValidFileName(m.file))
  const media: GalleryMediaItem[] = mediaItems.map((m) => {
    const rawUrl = m.file.includes('/')
      ? `${bucketBase}/${m.file}`
      : `${base}/${encodeURIComponent(m.file)}`
    const url =
      m.type === 'image'
        ? toOptimizedImageUrl(rawUrl, 1200)
        : toProxiedVideoUrl(rawUrl)
    return {
      type: m.type === 'video' ? 'video' : 'image',
      url,
      ...(m.name != null && m.name !== '' && { name: m.name }),
    }
  })

  let coverUrl: string
  if (isValidFileName(doc.cover)) {
    const coverRaw = doc.cover.includes('/')
      ? `${bucketBase}/${doc.cover}`
      : `${base}/${encodeURIComponent(doc.cover)}`
    coverUrl = toOptimizedImageUrl(coverRaw, 1200)
  } else {
    const firstImage = media.find((m) => m.type === 'image')
    coverUrl =
      firstImage?.url ??
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
  }

  return {
    id: doc.slug,
    title: doc.title,
    description: doc.description ?? '',
    tag: doc.tag ?? undefined,
    coverImage: coverUrl,
    media,
  }
}

/** Busca projetos na collection Payload. Filtra por showOnHome ou showOnProjectsPage conforme where. */
export async function getProjetosFromPayload(
  where?: ProjetosWhere
): Promise<ProjectGalleryItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      limit: 100,
      pagination: false,
      sort: 'slug',
      overrideAccess: true,
    })
    let docs = (result.docs ?? []) as ProjetoDoc[]
    if (where === 'home') {
      docs = docs.filter((d) => d.showOnHome !== false)
    } else if (where === 'projects') {
      docs = docs.filter((d) => d.showOnProjectsPage !== false)
    }
    return docs.map((doc) => docToGalleryItem(doc))
  } catch {
    return []
  }
}

interface ManifestMedia {
  type: 'image' | 'video'
  file: string
  /** Nome exibido abaixo da imagem na galeria (opcional). */
  name?: string
}
interface Manifest {
  title: string
  description: string
  tag?: string
  cover: string
  media: ManifestMedia[]
}

export async function getProjetosFromManifests(): Promise<ProjectGalleryItem[]> {
  const baseDir = path.join(process.cwd(), 'public', 'projetos')
  let dirs: string[] = []
  try {
    dirs = await fs.readdir(baseDir, { withFileTypes: true })
      .then((entries) => entries.filter((e) => e.isDirectory()).map((e) => e.name))
  } catch {
    return []
  }

  const projects: ProjectGalleryItem[] = []
  const resolvedBase = path.resolve(baseDir)

  for (const slug of dirs) {
    const slugValidation = projectSlugSchema.safeParse(slug)
    if (!slugValidation.success) continue

    const manifestPath = path.join(baseDir, slug, 'manifest.json')
    const resolvedPath = path.resolve(manifestPath)
    if (!resolvedPath.startsWith(resolvedBase)) continue

    let raw: string
    try {
      raw = await fs.readFile(manifestPath, 'utf-8')
    } catch {
      continue
    }

    let manifest: Manifest
    try {
      manifest = JSON.parse(raw) as Manifest
    } catch {
      continue
    }

    if (!manifest.title || !manifest.cover || !Array.isArray(manifest.media)) continue

    const baseUrl = getProjetosBaseUrl(slug)
    const coverRaw = `${baseUrl}/${encodeURIComponent(manifest.cover)}`
    const coverImage = toOptimizedImageUrl(coverRaw, 1200)
    const media: GalleryMediaItem[] = manifest.media.map((m) => {
      const rawUrl = `${baseUrl}/${encodeURIComponent(m.file)}`
      const url =
        m.type === 'image'
          ? toOptimizedImageUrl(rawUrl, 1200)
          : toProxiedVideoUrl(rawUrl)
      return {
        type: m.type === 'video' ? 'video' : 'image',
        url,
        ...(m.name != null && m.name !== '' && { name: m.name }),
      }
    })

    projects.push({
      id: slug,
      title: manifest.title,
      description: manifest.description ?? '',
      tag: manifest.tag,
      coverImage,
      media,
    })
  }

  projects.sort((a, b) => a.id.localeCompare(b.id))
  return projects
}

async function getProjetosForHome(): Promise<ProjectGalleryItem[]> {
  const fromPayload = await getProjetosFromPayload('home')
  if (fromPayload.length > 0) return fromPayload
  return getProjetosFromManifests()
}

async function getProjetosForProjectsPage(): Promise<ProjectGalleryItem[]> {
  const fromPayload = await getProjetosFromPayload('projects')
  if (fromPayload.length > 0) return fromPayload
  return getProjetosFromManifests()
}

/**
 * Projetos para a home (seção da página inicial). Cache separado por contexto.
 */
export const getProjetosCachedForHome = async (): Promise<ProjectGalleryItem[]> => {
  if (process.env.NODE_ENV === 'development') {
    return getProjetosForHome()
  }
  const { unstable_cache } = await import('next/cache')
  return unstable_cache(getProjetosForHome, ['projetos-home'], {
    revalidate: 60,
    tags: ['projetos-home'],
  })()
}

/**
 * Projetos para a página /projetos do site. Cache separado por contexto.
 */
export const getProjetosCachedForProjectsPage = async (): Promise<ProjectGalleryItem[]> => {
  if (process.env.NODE_ENV === 'development') {
    return getProjetosForProjectsPage()
  }
  const { unstable_cache } = await import('next/cache')
  return unstable_cache(getProjetosForProjectsPage, ['projetos-page'], {
    revalidate: 60,
    tags: ['projetos-home'],
  })()
}

/**
 * @deprecated Use getProjetosCachedForHome ou getProjetosCachedForProjectsPage
 * Mantido para compatibilidade; retorna projetos da home.
 */
export const getProjetosCached = async (): Promise<ProjectGalleryItem[]> => {
  return getProjetosCachedForHome()
}

/** Busca um projeto por slug (qualquer um, independente de exibir na home/aba). */
export async function getProjetoBySlug(slug: string): Promise<ProjectGalleryItem | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = (result.docs?.[0] ?? null) as ProjetoDoc | null
    if (doc) return docToGalleryItem(doc)
  } catch {
    // fallback abaixo
  }
  // Fallback: manifests em public/projetos
  const manifests = await getProjetosFromManifests()
  return manifests.find((p) => p.id === slug) ?? null
}
