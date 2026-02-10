import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import type { ProjectGalleryItem, GalleryMediaItem } from '@/components/home/ProjectGallery'

interface ManifestMedia { type: 'image' | 'video'; file: string }
interface Manifest {
  title: string
  description: string
  tag?: string
  cover: string
  media: ManifestMedia[]
}

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'public', 'projetos')
    let dirs: string[] = []
    try {
      dirs = await fs.readdir(baseDir, { withFileTypes: true })
        .then(entries => entries.filter(e => e.isDirectory()).map(e => e.name))
    } catch {
      return NextResponse.json([])
    }

    const projects: ProjectGalleryItem[] = []

    for (const slug of dirs) {
      const manifestPath = path.join(baseDir, slug, 'manifest.json')
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

      const baseUrl = `/projetos/${slug}`
      const coverImage = `${baseUrl}/${manifest.cover}`
      const media: GalleryMediaItem[] = manifest.media.map((m) => ({
        type: m.type === 'video' ? 'video' : 'image',
        url: `${baseUrl}/${m.file}`,
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

    // Ordenar por id para manter ordem estável
    projects.sort((a, b) => a.id.localeCompare(b.id))
    return NextResponse.json(projects)
  } catch (e) {
    console.error('[api/projetos]', e)
    return NextResponse.json([], { status: 500 })
  }
}
