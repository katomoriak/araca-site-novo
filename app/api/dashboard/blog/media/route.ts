import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { listBlogMediaFromStorage, uploadBlogFile, isR2Configured } from '@/lib/storage-server'
import { getProxiedImageUrlWithResize } from '@/lib/transform-content-images'

function getFileType(filename: string, mimeType?: string | null): string {
  if (mimeType) {
    const parts = mimeType.split('/')
    return parts[1]?.toUpperCase() ?? ''
  }
  const ext = filename.split('.').pop()
  const map: Record<string, string> = { jpg: 'JPG', jpeg: 'JPEG', png: 'PNG', gif: 'GIF', webp: 'WEBP', mp4: 'MP4', mov: 'MOV', avi: 'AVI' }
  return map[ext?.toLowerCase() ?? ''] ?? (ext?.toUpperCase() ?? '')
}

/**
 * Cria nova mídia: prioriza Supabase Storage (bucket media/blog); fallback para Payload.
 * Garante buffer válido ao usar Payload para evitar erro "Expected Uint8Array or ArrayBuffer, got undefined".
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }

    const payload = await getPayloadClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = (formData.get('alt') as string) || file?.name || ''

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
    const fileName = `blog/${timestamp}-${randomStr}.${safeExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (isR2Configured()) {
      const result = await uploadBlogFile(fileName, buffer, file.type)
      if (result) {
        return NextResponse.json({
          id: `storage-${fileName}`,
          url: result.publicUrl,
          filename: file.name,
          alt,
          fileType: getFileType(file.name, file.type),
        })
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })

      const { error } = await supabase.storage
        .from('media')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error('[API] Erro Supabase upload mídia blog:', error)
        const msg =
          error.message?.includes('Bucket') || error.message?.includes('bucket')
            ? 'Bucket "media" não encontrado. Crie no Supabase: Storage → New bucket → "media" (público).'
            : error.message || 'Falha no Supabase Storage'
        return NextResponse.json({ message: msg }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      return NextResponse.json({
        id: `supabase-${fileName}`,
        url: publicUrlData.publicUrl,
        filename: file.name,
        alt,
        fileType: getFileType(file.name, file.type),
      })
    }

    const fileWithBuffer = new File([buffer], file.name, { type: file.type })

    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: fileWithBuffer as never,
      overrideAccess: true,
    })

    return NextResponse.json({
      id: String(media.id),
      url: media.url ?? '',
      filename: media.filename ?? '',
      alt: media.alt ?? '',
      fileType: getFileType(media.filename ?? '', (media as { mimeType?: string }).mimeType),
    })
  } catch (error) {
    console.error('[API] Erro ao criar mídia:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Erro ao enviar mídia' },
      { status: 500 }
    )
  }
}

/**
 * Lista mídias (imagens) para o seletor no editor do blog.
 * Inclui arquivos do Supabase bucket media/blog e da collection Payload "media".
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }

    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 200)
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search')?.trim() || ''

    const [storageFiles, payloadResult] = await Promise.all([
      listBlogMediaFromStorage({
        limit: 1000,
        offset: 0,
        search: search || undefined,
      }),
      (async () => {
        const where = search
          ? {
              or: [
                { filename: { contains: search } },
                { alt: { contains: search } },
              ],
            }
          : undefined
        return payload.find({
          collection: 'media',
          limit: 500,
          page: 1,
          sort: '-createdAt',
          where: where as unknown as import('payload').Where,
          overrideAccess: true,
        })
      })(),
    ])

    const thumbnailFor = (url: string) =>
      getProxiedImageUrlWithResize(url, 400, 75) || url
    const storagePrefix = isR2Configured() ? 'storage-' : 'supabase-'
    const storageItems = storageFiles.map((f) => ({
      id: `${storagePrefix}${f.path}`,
      url: f.publicUrl,
      thumbnailUrl: thumbnailFor(f.publicUrl),
      filename: f.name,
      alt: f.name,
      fileType: getFileType(f.name, null),
    }))

    const payloadItems = (payloadResult.docs ?? []).map(
      (doc: { id: string | number; url?: string; filename?: string; alt?: string; mimeType?: string | null }) => {
        const url = doc.url ?? ''
        return {
          id: String(doc.id),
          url,
          thumbnailUrl: thumbnailFor(url),
          filename: doc.filename ?? '',
          alt: doc.alt ?? doc.filename ?? '',
          fileType: getFileType(doc.filename ?? '', doc.mimeType),
        }
      }
    )

    const seenUrls = new Set<string>()
    const merged: typeof storageItems = []
    for (const item of [...storageItems, ...payloadItems]) {
      const key = item.url
      if (seenUrls.has(key)) continue
      seenUrls.add(key)
      merged.push(item)
    }

    const totalMerged = merged.length
    const start = (page - 1) * limit
    const paginated = merged.slice(start, start + limit)

    return NextResponse.json({
      media: paginated,
      totalDocs: totalMerged,
      totalPages: Math.max(1, Math.ceil(totalMerged / limit)),
      page,
    })
  } catch (error) {
    console.error('[API] Erro ao listar mídia:', error)
    return NextResponse.json(
      { message: 'Erro ao listar mídia' },
      { status: 500 }
    )
  }
}
