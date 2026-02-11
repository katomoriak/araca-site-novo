import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

/**
 * GET /api/image-proxy?url=ENCODED_URL
 * Faz proxy de imagens do Supabase Storage (evita mixed content, CORS e hotlink).
 * Aceita apenas URLs do nosso Supabase.
 */
export async function GET(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get('url')
    if (!urlParam) {
      return new NextResponse('url required', { status: 400 })
    }

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

    const res = await fetch(targetUrl.toString(), {
      headers: { Accept: 'image/*' },
      cache: 'force-cache',
      next: { revalidate: 86400 }, // cache 24h
    })

    if (!res.ok) {
      return new NextResponse(`Upstream ${res.status}`, { status: res.status })
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const body = await res.arrayBuffer()

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (e) {
    console.error('[image-proxy]', e)
    return new NextResponse('Proxy error', { status: 500 })
  }
}
