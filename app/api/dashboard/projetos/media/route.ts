import { NextRequest, NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { getPayloadClient } from '@/lib/payload'
import {
  listProjetosMediaFromStorage,
  createSignedUploadUrlProjetosMedia,
  deleteProjetosMediaFromStorage,
  moveProjetosMediaInStorage,
  getStoragePublicUrl,
  PROJETOS_MIDIAS_PREFIX,
} from '@/lib/storage-server'
import { getProxiedImageUrlWithResize } from '@/lib/transform-content-images'

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
 * Resposta padronizada quando o storage falha (R2/S3 deserialization, rede, etc.).
 * Retorna sempre 200 para o cliente poder exibir mensagem; evita 500 em prod.
 */
function mediaListErrorResponse(projects: { slug: string; title: string }[], logError: unknown) {
  console.error('[api/dashboard/projetos/media GET] Storage:', logError)
  return NextResponse.json(
    {
      media: [],
      projects,
      totalDocs: 0,
      totalPages: 1,
      page: 1,
      error: 'storage',
      message: 'Não foi possível conectar ao storage de mídias. Configure R2 (S3_* e NEXT_PUBLIC_R2_PUBLIC_URL).',
    },
    { status: 200 }
  )
}

/**
 * GET /api/dashboard/projetos/media
 * Lista mídias apenas do banco midias/ (com subpastas por projeto). Retorna projects para o seletor de pastas.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    // Limite menor para evitar 413 (resposta grande) em proxies/Vercel
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100)
    const offset = Number(searchParams.get('offset')) || 0
    const search = searchParams.get('search')?.trim() || ''
    /** Filtro por pasta: "" ou "__geral__" = Geral, slug = pasta do projeto, "__all__" ou omitido = todas */
    const folderParam = searchParams.get('folder')?.trim() ?? ''

    let projects: { slug: string; title: string }[] = []
    try {
      const payload = await getPayloadClient()
      const projetosRes = await payload.find({
        collection: 'projetos',
        limit: 200,
        pagination: false,
        overrideAccess: true,
      })
      projects = (projetosRes.docs ?? []).map((d) => {
        const doc = d as { slug?: string; title?: string }
        return { slug: doc.slug ?? '', title: (doc.title as string) ?? doc.slug ?? '' }
      })
    } catch (e) {
      console.error('[api/dashboard/projetos/media GET] Payload projetos:', e)
      // Continua com projects vazio para ainda tentar listar o storage
    }

    const projectSlugs = projects
      .map((p) => p.slug?.trim())
      .filter((slug): slug is string => !!slug && slug !== PROJETOS_MIDIAS_PREFIX)
    const prefixes = Array.from(new Set([PROJETOS_MIDIAS_PREFIX, ...projectSlugs]))

    let files: { path: string; name: string; publicUrl: string }[] = []
    try {
      files = await listProjetosMediaFromStorage({
        prefixes,
        limit: 500,
        offset: 0,
        search: search || undefined,
      })
    } catch (e) {
      return mediaListErrorResponse(projects, e)
    }

    const isImageType = (name: string) => {
      const ext = name.split('.').pop()?.toLowerCase()
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext ?? '')
    }
    let media = files.map((f) => {
      const folder = folderFromPath(f.path)
      const isImage = isImageType(f.name)
      const thumbnailUrl = isImage
        ? (getProxiedImageUrlWithResize(f.publicUrl, 400, 75) || f.publicUrl)
        : f.publicUrl
      return {
        id: `projetos-${f.path}`,
        url: f.publicUrl,
        thumbnailUrl,
        path: f.path,
        filename: f.name,
        alt: f.name,
        fileType: getFileType(f.name),
        folder,
      }
    })

    if (folderParam && folderParam !== '__all__') {
      const filterFolder = folderParam === '__geral__' ? '' : folderParam
      media = media.filter((m) => (m.folder ?? '') === filterFolder)
    }

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
    // Qualquer outro erro (ex.: deserialization do SDK antes do catch interno) → 200 com lista vazia
    console.error('[api/dashboard/projetos/media GET]', e)
    return NextResponse.json(
      {
        media: [],
        projects: [],
        totalDocs: 0,
        totalPages: 1,
        page: 1,
        error: 'storage',
        message: 'Não foi possível conectar ao storage de mídias. Configure R2 (S3_* e NEXT_PUBLIC_R2_PUBLIC_URL).',
      },
      { status: 200 }
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
          { message: 'R2 não configurado ou erro ao gerar URL. Configure S3_* e NEXT_PUBLIC_R2_PUBLIC_URL.' },
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
        { message: 'R2 não configurado ou erro ao gerar URL. Configure S3_* e NEXT_PUBLIC_R2_PUBLIC_URL.' },
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
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(filename.split('.').pop()?.toLowerCase() ?? '')
    const thumbnailUrl = isImage
      ? (getProxiedImageUrlWithResize(result.publicUrl, 400, 75) || result.publicUrl)
      : result.publicUrl
    return NextResponse.json({
      id: `projetos-${result.path}`,
      url: result.publicUrl,
      thumbnailUrl,
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
    const fileType = getFileType(newFilename)
    const publicUrl = getStoragePublicUrl(toPath)
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(newFilename.split('.').pop()?.toLowerCase() ?? '')
    const thumbnailUrl = isImage
      ? (getProxiedImageUrlWithResize(publicUrl, 400, 75) || publicUrl)
      : publicUrl

    return NextResponse.json({
      id: `projetos-${toPath}`,
      url: publicUrl,
      thumbnailUrl,
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
