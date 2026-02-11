import { NextRequest, NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { getPayloadClient } from '@/lib/payload'
import {
  listProjetosMediaFromStorage,
  createSignedUploadUrlProjetosMedia,
  deleteProjetosMediaFromStorage,
  moveProjetosMediaInStorage,
  PROJETOS_MIDIAS_PREFIX,
} from '@/lib/supabase-server'

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'JPG', jpeg: 'JPEG', png: 'PNG', gif: 'GIF', webp: 'WEBP',
    mp4: 'MP4', mov: 'MOV', avi: 'AVI', webm: 'WEBM',
  }
  return map[ext ?? ''] ?? (ext?.toUpperCase() ?? '')
}

/**
 * Extrai a "pasta" (subpasta de midias) do path. midias/arquivo.jpg -> "", midias/slug/arquivo.jpg -> "slug".
 */
function folderFromPath(path: string): string {
  const prefix = `${PROJETOS_MIDIAS_PREFIX}/`
  if (path.startsWith(prefix)) {
    const after = path.slice(prefix.length)
    const idx = after.indexOf('/')
    return idx < 0 ? '' : after.slice(0, idx)
  }
  const idx = path.indexOf('/')
  return idx < 0 ? '' : path.slice(0, idx)
}

/**
 * GET /api/dashboard/projetos/media
 * Lista mídias apenas do banco midias/ (com subpastas por projeto). Retorna projects para o seletor de pastas.
 */
export async function GET(request: NextRequest) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 200)
    const offset = Number(searchParams.get('offset')) || 0
    const search = searchParams.get('search')?.trim() || ''

    const payload = await getPayloadClient()
    const projetosRes = await payload.find({
      collection: 'projetos',
      limit: 200,
      pagination: false,
      overrideAccess: true,
    })
    const projects = (projetosRes.docs ?? []).map((d) => {
      const doc = d as { slug?: string; title?: string }
      return { slug: doc.slug ?? '', title: (doc.title as string) ?? doc.slug ?? '' }
    })

    const projectSlugs = projects
      .map((p) => p.slug?.trim())
      .filter((slug): slug is string => !!slug && slug !== PROJETOS_MIDIAS_PREFIX)
    const prefixes = Array.from(new Set([PROJETOS_MIDIAS_PREFIX, ...projectSlugs]))

    const files = await listProjetosMediaFromStorage({
      prefixes,
      limit: 500,
      offset: 0,
      search: search || undefined,
    })

    const media = files.map((f) => {
      const folder = folderFromPath(f.path)
      return {
        id: `projetos-${f.path}`,
        url: f.publicUrl,
        path: f.path,
        filename: f.name,
        alt: f.name,
        fileType: getFileType(f.name),
        folder,
      }
    })

    const start = offset
    const paginated = media.slice(start, start + limit)

    return NextResponse.json({
      media: paginated,
      projects,
      totalDocs: media.length,
      totalPages: Math.max(1, Math.ceil(media.length / limit)),
      page: Math.floor(offset / limit) + 1,
    })
  } catch (e) {
    console.error('[api/dashboard/projetos/media GET]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao listar mídias.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/projetos/media
 * Body: { filename: string } — retorna signedUrl e publicUrl para o cliente fazer PUT (upload direto ao Supabase).
 * Ou FormData com "file" para upload via servidor (limitado pelo body size).
 */
export async function POST(request: NextRequest) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}))
      const filename =
        typeof body?.filename === 'string' && body.filename.length > 0
          ? body.filename.replace(/[/\\]/g, '').trim()
          : null
      if (!filename) {
        return NextResponse.json(
          { message: 'Envie filename (nome do arquivo).' },
          { status: 400 }
        )
      }
      const folder = typeof body?.folder === 'string' ? body.folder.replace(/[/\\]/g, '').trim() || undefined : undefined
      const result = await createSignedUploadUrlProjetosMedia(filename, folder)
      if (!result) {
        return NextResponse.json(
          { message: 'Supabase não configurado ou erro ao gerar URL.' },
          { status: 503 }
        )
      }
      return NextResponse.json({
        signedUrl: result.signedUrl,
        publicUrl: result.publicUrl,
        path: result.path,
        filename,
        folder: folder ?? '',
      })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file?.size) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado.' }, { status: 400 })
    }
    const folderParam = formData.get('folder')
    const folder = typeof folderParam === 'string' ? folderParam.replace(/[/\\]/g, '').trim() || undefined : undefined
    const filename = file.name.replace(/[/\\]/g, '').trim() || `upload-${Date.now()}.bin`
    const result = await createSignedUploadUrlProjetosMedia(filename, folder)
    if (!result) {
      return NextResponse.json(
        { message: 'Supabase não configurado ou erro ao gerar URL.' },
        { status: 503 }
      )
    }
    const putRes = await fetch(result.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    })
    if (!putRes.ok) {
      return NextResponse.json(
        { message: 'Falha ao enviar arquivo ao storage.' },
        { status: 502 }
      )
    }
    const displayName = result.path.slice(result.path.lastIndexOf('/') + 1)
    return NextResponse.json({
      id: `projetos-${result.path}`,
      url: result.publicUrl,
      path: result.path,
      filename: displayName,
      alt: filename,
      fileType: getFileType(filename),
      folder: folder ?? '',
    })
  } catch (e) {
    console.error('[api/dashboard/projetos/media POST]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao enviar mídia.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dashboard/projetos/media?path=midias/arquivo.jpg
 * Remove a mídia do storage.
 */
export async function DELETE(request: NextRequest) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get('path')?.trim()
  if (!path) {
    return NextResponse.json({ message: 'Parâmetro path é obrigatório.' }, { status: 400 })
  }

  try {
    const ok = await deleteProjetosMediaFromStorage(path)
    if (!ok) {
      return NextResponse.json(
        { message: 'Não foi possível excluir o arquivo.' },
        { status: 502 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/dashboard/projetos/media DELETE]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao excluir mídia.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/dashboard/projetos/media
 * Body: { path: string, newFilename: string } — renomeia o arquivo no storage.
 */
export async function PATCH(request: NextRequest) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  let body: { path?: string; newFilename?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Body JSON inválido.' }, { status: 400 })
  }

  const path = typeof body?.path === 'string' ? body.path.trim() : ''
  const newFilename = typeof body?.newFilename === 'string'
    ? body.newFilename.replace(/[/\\]/g, '').trim()
    : ''

  if (!path || !newFilename) {
    return NextResponse.json(
      { message: 'Envie path e newFilename.' },
      { status: 400 }
    )
  }

  const lastSlash = path.lastIndexOf('/')
  const dir = lastSlash >= 0 ? path.slice(0, lastSlash) : ''
  const toPath = dir ? `${dir}/${newFilename}` : newFilename

  try {
    const ok = await moveProjetosMediaInStorage(path, toPath)
    if (!ok) {
      return NextResponse.json(
        { message: 'Não foi possível renomear o arquivo.' },
        { status: 502 }
      )
    }
    const ext = newFilename.split('.').pop()?.toLowerCase()
    const fileType = getFileType(newFilename)
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? ''
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET ?? 'a_public'
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${toPath}`

    return NextResponse.json({
      id: `projetos-${toPath}`,
      url: publicUrl,
      path: toPath,
      filename: lastSlash >= 0 ? newFilename : newFilename,
      alt: newFilename,
      fileType,
    })
  } catch (e) {
    console.error('[api/dashboard/projetos/media PATCH]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao renomear mídia.' },
      { status: 500 }
    )
  }
}
