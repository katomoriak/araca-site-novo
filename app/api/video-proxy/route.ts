import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

/** Cache longo (Vercel CDN + browser) para reduzir egress. */
const CACHE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias
const CACHE_HEADER = `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400`

/**
 * GET /api/video-proxy?url=ENCODED_URL
 * Faz proxy de vídeos do Supabase Storage. Repassa Range para permitir seek.
 * Cache longo reduz egress: após o primeiro hit, CDN/browser atendem.
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

    const allowedOrigins: string[] = []
    if (SUPABASE_URL) allowedOrigins.push(new URL(SUPABASE_URL.replace(/\/$/, '')).origin)
    if (R2_PUBLIC) allowedOrigins.push(new URL(R2_PUBLIC.replace(/\/$/, '')).origin)
    if (allowedOrigins.length === 0) {
      return new NextResponse('Proxy not configured', { status: 503 })
    }
    if (!allowedOrigins.includes(targetUrl.origin)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
    if (SUPABASE_URL && targetUrl.origin === new URL(SUPABASE_URL.replace(/\/$/, '')).origin) {
      if (!targetUrl.pathname.startsWith('/storage/v1/object/public/')) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    const range = request.headers.get('range')
    const headers: HeadersInit = { Accept: 'video/*' }
    if (range) headers['Range'] = range

    const res = await fetch(targetUrl.toString(), {
      headers,
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse(`Upstream ${res.status}`, { status: res.status })
    }

    const contentType = res.headers.get('content-type') ?? 'video/mp4'
    const contentLength = res.headers.get('content-length')
    const contentRange = res.headers.get('content-range')

    const responseHeaders: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': CACHE_HEADER,
    }
    if (contentLength) responseHeaders['Content-Length'] = contentLength
    if (contentRange) responseHeaders['Content-Range'] = contentRange

    return new NextResponse(res.body ?? null, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch (e) {
    console.error('[video-proxy]', e)
    return new NextResponse('Proxy error', { status: 500 })
  }
}
