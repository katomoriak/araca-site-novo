import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

/** Largura máxima permitida para resize (evita abuse). */
const MAX_WIDTH = 2048

/** Qualidade máxima. */
const MAX_QUALITY = 90

/** Cache longo no nosso lado (Vercel + browser) para reduzir requisições ao Supabase e evitar limite de cache do Supabase. */
const CACHE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias
const CACHE_HEADER = `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400`

/**
 * GET /api/image-proxy?url=ENCODED_URL&w=800&q=80
 * Faz proxy de imagens do Supabase Storage (evita mixed content, CORS e hotlink).
 * Cache longo aqui reduz hits no Supabase (útil quando o limite de cache do Supabase é atingido).
 * Params opcionais: w (largura máxima em px), q (qualidade 1-90).
 * Com w/q, redimensiona e comprime com sharp.
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

    let targetUrl: URL
    try {
      targetUrl = new URL(decodeURIComponent(urlParam))
    } catch {
      return new NextResponse('Invalid url', { status: 400 })
    }

    // SSRF: permitir apenas URLs do Supabase configurado
    if (!SUPABASE_URL) {
      return new NextResponse('Proxy not configured', { status: 503 })
    }
    const allowedOrigin = new URL(SUPABASE_URL.replace(/\/$/, '')).origin
    if (targetUrl.origin !== allowedOrigin) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Restringir ao path de storage público
    if (!targetUrl.pathname.startsWith('/storage/v1/object/public/')) {
      return new NextResponse('Forbidden', { status: 403 })
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
