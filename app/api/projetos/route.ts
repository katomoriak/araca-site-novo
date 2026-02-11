import { NextResponse } from 'next/server'
import { getProjetosFromManifests } from '@/lib/projetos-server'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, 30, 60000)

    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.resetAt
        ? Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)
        : 60

      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }

    const projects = await getProjetosFromManifests()

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (e) {
    console.error('[api/projetos]', e)
    return NextResponse.json([], { status: 500 })
  }
}
