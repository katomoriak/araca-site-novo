import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { fileExistsInStorage, uploadFileToStorage, getStoragePublicUrl } from '@/lib/storage-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')
const R2_ORIGIN = R2_PUBLIC ? new URL(R2_PUBLIC).origin : null

/** Largura máxima permitida para resize (evita abuse). */
const MAX_WIDTH = 3840

/** Qualidade padrão (se não especificada) — balance bom entre visual e tamanho. */
const DEFAULT_QUALITY = 72

/** Qualidade máxima permitida (evita imagens muito pesadas). */
const MAX_QUALITY = 82

/**
 * Cache no CDN (Vercel) e no browser.
 * 7 dias (604800s) + stale-while-revalidate de 30 dias.
 * As imagens são servidas com URL única (?w=&q=) portanto cache longo é seguro.
 */
const CACHE_MAX_AGE =
  typeof process.env.IMAGE_PROXY_CACHE_MAX_AGE !== 'undefined'
    ? Math.max(0, parseInt(process.env.IMAGE_PROXY_CACHE_MAX_AGE, 10) || 0)
    : 604800 // padrão: 7 dias (604800s)
const CACHE_SWR = 2592000 // stale-while-revalidate: 30 dias
const CACHE_HEADER =
  CACHE_MAX_AGE <= 0
    ? 'public, max-age=0, s-maxage=0, no-store'
    : `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_SWR}`

/**
 * GET /api/image-proxy?url=ENCODED_URL&w=800&q=80
 * Faz proxy de imagens do Supabase Storage ou R2 (evita mixed content, CORS e hotlink).
 * Cache longo aqui reduz hits no Storage.
 * Params opcionais: w (largura máxima em px), q (qualidade 1-90).
 * Com w/q, redimensiona e comprime com sharp.
 * Para R2: salva a miniatura gerada no próprio R2 (_thumbs/) para acelerar hits futuros.
 */
export async function GET(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get('url')
    if (!urlParam) {
      return new NextResponse('url required', { status: 400 })
    }

    const widthParam = request.nextUrl.searchParams.get('w')
    const qualityParam = request.nextUrl.searchParams.get('q')

    const width = widthParam ? Math.min(parseInt(widthParam, 10) || 0, MAX_WIDTH) : 0
    const quality = qualityParam ? Math.min(Math.max(parseInt(qualityParam, 10) || DEFAULT_QUALITY, 1), MAX_QUALITY) : DEFAULT_QUALITY
    const shouldResize = width > 0

    // URL decoded by searchParams.get is enough. decoding again breaks encoded characters like %20 or %2B (plus)
    // if the original URL had them encoded.
    const decodedUrl = urlParam
    let targetUrl: URL
    try {
      targetUrl = new URL(decodedUrl)
    } catch {
      return new NextResponse('Invalid url', { status: 400 })
    }

    // SSRF: permitir apenas URLs do storage configurado (Supabase ou R2)
    const allowedOrigins: string[] = []
    if (SUPABASE_URL) {
      try {
        allowedOrigins.push(new URL(SUPABASE_URL.replace(/\/$/, '')).origin)
      } catch { }
    }
    if (R2_ORIGIN) allowedOrigins.push(R2_ORIGIN)

    // Permitir também o hostname público padrão do R2 (útil para URLs legadas no banco)
    const R2_DEV_HOST = 'pub-9ca9f8ba8c9d47518d53ef4b3818ed26.r2.dev'
    allowedOrigins.push(`https://${R2_DEV_HOST}`)

    if (allowedOrigins.length === 0) {
      console.error('[image-proxy] No allowed origins configured')
      return new NextResponse('Proxy not configured', { status: 503 })
    }

    if (!allowedOrigins.includes(targetUrl.origin)) {
      console.error('[image-proxy] Origin forbidden:', targetUrl.origin, 'Allowed:', allowedOrigins)
      return new NextResponse('Forbidden: Origin not allowed', { status: 403 })
    }

    const isR2 = (R2_ORIGIN && targetUrl.origin === R2_ORIGIN) || targetUrl.origin === `https://${R2_DEV_HOST}`

    // Se for R2 e tiver resize, tentar carregar do cache _thumbs/ no própio R2 (Opção 2: Redirecionamento)
    let thumbKey = ''
    if (isR2 && shouldResize) {
      const rawPath = targetUrl.pathname.startsWith('/') ? targetUrl.pathname.slice(1) : targetUrl.pathname
      let cleanPath = rawPath
      while (cleanPath.includes('%')) {
        const decoded = decodeURIComponent(cleanPath)
        if (decoded === cleanPath) break
        cleanPath = decoded
      }
      // Caminho determinístico para a miniatura
      thumbKey = `_thumbs/${cleanPath}_w${width}_q${quality}.webp`

      try {
        // Se a miniatura já existe no R2, redirecionar o navegador para lá.
        // Isso economiza "Cached Egress" na Vercel.
        if (await fileExistsInStorage(thumbKey)) {
          return NextResponse.redirect(getStoragePublicUrl(thumbKey), 308)
        }
      } catch (e) {
        console.error('[image-proxy] error checking thumbKey:', e)
      }
    }

    // Supabase: path /storage/v1/object/public/...
    if (SUPABASE_URL && targetUrl.origin === new URL(SUPABASE_URL.replace(/\/$/, '')).origin) {
      if (!targetUrl.pathname.startsWith('/storage/v1/object/public/')) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // cache: 'no-store' evita "items over 2MB can not be cached" do Next.js; a resposta do proxy
    // ainda usa Cache-Control para cache no browser/CDN
    let buffer: Buffer
    let contentType: string

    if (isR2) {
      // Tentar baixar diretamente do R2 (bypassing public access restriction)
      const rawPath = targetUrl.pathname.startsWith('/') ? targetUrl.pathname.slice(1) : targetUrl.pathname
      // Decodificar recursivamente para resolver espaços/caracteres duplamente codificados (ex: %2520 -> %20 -> space)
      let cleanPath = rawPath
      while (cleanPath.includes('%')) {
        const decoded = decodeURIComponent(cleanPath)
        if (decoded === cleanPath) break
        cleanPath = decoded
      }
      // Check import path. It should be from '@/lib/storage-server'
      const { downloadFileFromStorage } = await import('@/lib/storage-server')

      const file = await downloadFileFromStorage(cleanPath)
      if (!file) {
        console.error('[image-proxy] Failed to download from R2:', cleanPath)
        return new NextResponse('Upstream error or not found', { status: 404 })
      }
      buffer = file.buffer
      contentType = file.contentType
    } else {
      // Fallback para Supabase ou outras origens permitidas via fetch
      const res = await fetch(targetUrl.toString(), {
        headers: { Accept: 'image/*' },
        cache: 'no-store',
      })

      if (!res.ok) {
        return new NextResponse(`Upstream ${res.status}`, { status: res.status })
      }

      buffer = Buffer.from(await res.arrayBuffer())
      contentType = res.headers.get('content-type') ?? 'image/jpeg'
    }

    if (shouldResize) {
      // Validação básica do content-type antes do sharp
      if (!contentType.startsWith('image/')) {
        console.warn('[image-proxy] Warning: content-type is not image:', contentType)
        // Tentar processar igual, sharp pode descobrir.
      }

      const isGif = contentType.includes('gif')

      // GIF: não redimensionar (perde animação); retornar original
      if (isGif) {
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': CACHE_HEADER,
          },
        })
      }

      const output = await sharp(buffer)
        .resize(width, undefined, { withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()

      // Se for R2, salvar a miniatura para o próximo request (em background)
      if (isR2 && thumbKey) {
        uploadFileToStorage(thumbKey, output, 'image/webp').catch((e) => {
          console.error('[image-proxy] background upload failed:', e)
        })
      }

      return new NextResponse(new Uint8Array(output), {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': CACHE_HEADER,
          'Vary': 'Accept',
        },
      })
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': CACHE_HEADER,
      },
    })
  } catch (e) {
    console.error('[image-proxy]', e)
    return new NextResponse('Proxy error', { status: 500 })
  }
}
