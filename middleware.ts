import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Cookie de autenticação do Payload (default: payload-token). */
const PAYLOAD_TOKEN_COOKIE = 'payload-token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }
  const token = request.cookies.get(PAYLOAD_TOKEN_COOKIE)?.value
  if (!token) {
    const loginUrl = new URL('/admin', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
