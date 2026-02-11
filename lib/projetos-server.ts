/**
 * Leitura de projetos a partir de public/projetos (manifests) ou da collection Payload Projetos.
 * URLs das mídias: Supabase Storage (bucket a_public) se NEXT_PUBLIC_SUPABASE_URL estiver definida;
 * caso contrário, arquivos locais em /projetos/{slug}/.
 * Usado pela API /api/projetos e pela Home (SSR) para evitar waterfall no cliente.
 */
import fs from 'fs/promises'
import path from 'path'
import { projectSlugSchema } from '@/lib/validation-schemas'
import type { ProjectGalleryItem, GalleryMediaItem } from '@/components/home/ProjectGallery'
import { getPayloadClient } from '@/lib/payload'

const SUPABASE_PROJETOS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET ?? 'a_public'

export function getProjetosBaseUrl(slug: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${SUPABASE_PROJETOS_BUCKET}/${slug}`
  }
  return `/projetos/${slug}`
}

/** URL base do bucket de projetos (sem slug), para arquivos em pastas como midias/. */
export function getProjetosBucketBaseUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${SUPABASE_PROJETOS_BUCKET}`
  }
  return '/projetos'
}

/** Documento da collection Payload Projetos (shape usado na leitura). */
interface ProjetoDoc {
  id: string
  slug: string
  title: string
  description?: string | null
  tag?: string | null
  cover: string
  media?: Array<{ type: 'image' | 'video'; file: string; name?: string | null }> | null
}

/** Busca projetos na collection Payload. Retorna array vazio se Payload não disponível ou sem documentos. */
export async function getProjetosFromPayload(): Promise<ProjectGalleryItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      limit: 100,
      pagination: false,
      sort: 'slug',
      overrideAccess: true,
    })
    const bucketBase = getProjetosBucketBaseUrl()
    const docs = (result.docs ?? []) as ProjetoDoc[]
    const projects: ProjectGalleryItem[] = docs.map((doc) => {
      const base = getProjetosBaseUrl(doc.slug)
      const coverUrl = doc.cover.includes('/')
        ? `${bucketBase}/${doc.cover}`
        : `${base}/${encodeURIComponent(doc.cover)}`
      const media: GalleryMediaItem[] = (doc.media ?? []).map((m) => {
        const url = m.file.includes('/')
          ? `${bucketBase}/${m.file}`
          : `${base}/${encodeURIComponent(m.file)}`
        return {
          type: m.type === 'video' ? 'video' : 'image',
          url,
          ...(m.name != null && m.name !== '' && { name: m.name }),
        }
      })
      return {
        id: doc.slug,
        title: doc.title,
        description: doc.description ?? '',
        tag: doc.tag ?? undefined,
        coverImage: coverUrl,
        media,
      }
    })
    return projects
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
    const coverImage = `${baseUrl}/${encodeURIComponent(manifest.cover)}`
    const media: GalleryMediaItem[] = manifest.media.map((m) => ({
      type: m.type === 'video' ? 'video' : 'image',
      url: `${baseUrl}/${encodeURIComponent(m.file)}`,
      ...(m.name != null && m.name !== '' && { name: m.name }),
    }))

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
  const fromPayload = await getProjetosFromPayload()
  if (fromPayload.length > 0) return fromPayload
  return getProjetosFromManifests()
}

/**
 * Fonte principal: collection Payload Projetos. Se não houver nenhum projeto no Payload, usa manifests em public/projetos.
 * Versão cacheada para a Home (ISR 60s). Em dev sem cache para testar imagens.
 */
export const getProjetosCached = async (): Promise<ProjectGalleryItem[]> => {
  if (process.env.NODE_ENV === 'development') {
    return getProjetosForHome()
  }
  const { unstable_cache } = await import('next/cache')
  return unstable_cache(getProjetosForHome, ['projetos-home'], {
    revalidate: 60,
    tags: ['projetos-home'],
  })()
}
