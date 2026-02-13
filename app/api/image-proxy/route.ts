import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { fileExistsInStorage, uploadFileToStorage, getStoragePublicUrl } from '@/lib/storage-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')
const R2_ORIGIN = R2_PUBLIC ? new URL(R2_PUBLIC).origin : null

/** Largura máxima permitida para resize (evita abuse). */
const MAX_WIDTH = 2048

/** Qualidade máxima. */
const MAX_QUALITY = 90

/** Cache no CDN (Vercel) e no browser. Reduzido para não acumular tanto no Vercel. Configurável por env. */
const CACHE_MAX_AGE =
  typeof process.env.IMAGE_PROXY_CACHE_MAX_AGE !== 'undefined'
    ? Math.max(0, parseInt(process.env.IMAGE_PROXY_CACHE_MAX_AGE, 10) || 0)
    : 60 * 60 // padrão: 1 hora (3600s). 0 = no-store; 86400 = 1 dia
const CACHE_SWR = Math.min(60 * 60 * 6, Math.max(0, CACHE_MAX_AGE * 2)) // stale-while-revalidate até 6h
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
    const quality = qualityParam ? Math.min(Math.max(parseInt(qualityParam, 10) || 80, 1), MAX_QUALITY) : 80
    const shouldResize = width > 0

    const decodedUrl = decodeURIComponent(urlParam)
    let targetUrl: URL
    try {
      targetUrl = new URL(decodedUrl)
    } catch {
      return new NextResponse('Invalid url', { status: 400 })
    }

    // SSRF: permitir apenas URLs do storage configurado (Supabase ou R2)
    const allowedOrigins: string[] = []
    if (SUPABASE_URL) allowedOrigins.push(new URL(SUPABASE_URL.replace(/\/$/, '')).origin)
    if (R2_ORIGIN) allowedOrigins.push(R2_ORIGIN)
    if (allowedOrigins.length === 0) {
      return new NextResponse('Proxy not configured', { status: 503 })
    }
    if (!allowedOrigins.includes(targetUrl.origin)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const isR2 = R2_ORIGIN && targetUrl.origin === R2_ORIGIN

    // Se for R2 e tiver resize, tentar carregar do cache _thumbs/ no própio R2
    let thumbKey = ''
    if (isR2 && shouldResize) {
      const cleanPath = targetUrl.pathname.startsWith('/') ? targetUrl.pathname.slice(1) : targetUrl.pathname
      // Caminho determinístico para a miniatura
      thumbKey = `_thumbs/${cleanPath}_w${width}_q${quality}.webp`

      try {
        if (await fileExistsInStorage(thumbKey)) {
          return NextResponse.redirect(getStoragePublicUrl(thumbKey), 307)
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
    const res = await fetch(targetUrl.toString(), {
      headers: { Accept: 'image/*' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse(`Upstream ${res.status}`, { status: res.status })
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'

    if (shouldResize) {
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
