import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Cookie de autenticação do Payload (default: payload-token). */
const PAYLOAD_TOKEN_COOKIE = 'payload-token'

const dashboardAttempts = new Map<string, number[]>()

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  return realIp?.trim() || 'anonymous'
}

function checkDashboardRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = dashboardAttempts.get(ip) || []
  const recent = timestamps.filter((t) => now - t < 60000)

  if (recent.length >= 30) {
    return false
  }

  recent.push(now)
  dashboardAttempts.set(ip, recent)

  if (Math.random() < 0.05) {
    for (const [key, times] of dashboardAttempts.entries()) {
      const filtered = times.filter((t) => now - t < 60000)
      if (filtered.length === 0) {
        dashboardAttempts.delete(key)
      } else {
        dashboardAttempts.set(key, filtered)
      }
    }
  }

  return true
}

function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const loginUrl = new URL('/dashboard/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

/**
 * Proxy de autenticação (Next.js 16: proxy.ts substitui middleware.ts).
 *
 * - /admin e /admin/*: sem cookie → redirect /dashboard/login?redirect=...
 * - /dashboard/* (exceto login): rate limit + token → redirect ou next
 *
 * Validação completa do JWT fica no Server Layout Guard e nas APIs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(PAYLOAD_TOKEN_COOKIE)?.value
    if (!token) {
      return redirectToLogin(request, pathname)
    }
    return NextResponse.next()
  }

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }
  if (pathname === '/dashboard/login' || pathname.startsWith('/dashboard/login?')) {
    return NextResponse.next()
  }

  const clientIP = getClientIP(request)
  if (!checkDashboardRateLimit(clientIP)) {
    console.warn(`[proxy] Rate limit exceeded for IP: ${clientIP}`)
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const token = request.cookies.get(PAYLOAD_TOKEN_COOKIE)?.value

  if (!token) {
    console.warn(`[proxy] Access denied - no token for IP: ${clientIP}, path: ${pathname}`)
    import('@/lib/audit-log')
      .then(({ logAccessDenied }) => logAccessDenied(pathname, undefined, clientIP, 'Token ausente'))
      .catch(() => {})
    return redirectToLogin(request, pathname)
  }

  if (token.length < 10) {
    console.warn(`[proxy] Access denied - invalid token format for IP: ${clientIP}, path: ${pathname}`)
    import('@/lib/audit-log')
      .then(({ logAccessDenied }) => logAccessDenied(pathname, undefined, clientIP, 'Token inválido (formato)'))
      .catch(() => {})
    return redirectToLogin(request, pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/dashboard/:path*'],
}
