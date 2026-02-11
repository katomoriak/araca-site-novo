import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { projectSlugSchema } from '@/lib/validation-schemas'

interface ManifestMedia {
  type: 'image' | 'video'
  file: string
  name?: string
}
interface Manifest {
  title: string
  description?: string
  tag?: string
  cover: string
  media: ManifestMedia[]
}

/**
 * POST /api/dashboard/projetos/seed
 * Importa projetos a partir dos manifest.json em public/projetos (uma pasta por projeto)
 * para a collection Payload Projetos.
 * Só cria documentos para slugs que ainda não existem. Requer admin ou editor.
 */
export async function POST() {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const baseDir = path.join(process.cwd(), 'public', 'projetos')
  let dirs: string[] = []
  try {
    dirs = await fs.readdir(baseDir, { withFileTypes: true })
      .then((entries) => entries.filter((e) => e.isDirectory()).map((e) => e.name))
  } catch {
    return NextResponse.json(
      { message: 'Pasta public/projetos não encontrada.' },
      { status: 404 }
    )
  }

  const created: string[] = []
  const skipped: string[] = []

  const payload = await getPayloadClient()
  const existingResult = await payload.find({
    collection: 'projetos',
    limit: 500,
    pagination: false,
    overrideAccess: true,
  })
  const existingSlugs = new Set(
    (existingResult.docs ?? []).map((d) => (d as unknown as { slug: string }).slug)
  )

  const resolvedBase = path.resolve(baseDir)

  for (const slug of dirs) {
    if (!projectSlugSchema.safeParse(slug).success) continue
    if (existingSlugs.has(slug)) {
      skipped.push(slug)
      continue
    }

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

    try {
      await payload.create({
        collection: 'projetos',
        data: {
          slug,
          title: manifest.title,
          description: manifest.description ?? '',
          tag: manifest.tag ?? '',
          cover: manifest.cover,
          media: manifest.media.map((m) => ({
            type: m.type === 'video' ? 'video' : 'image',
            file: m.file,
            name: m.name ?? undefined,
          })),
        },
        overrideAccess: true,
      })
      created.push(slug)
      existingSlugs.add(slug)
    } catch (e) {
      console.error('[api/dashboard/projetos/seed] create', slug, e)
    }
  }

  if (created.length > 0) {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({
    message: 'Seed concluído.',
    created,
    skipped,
  })
}
