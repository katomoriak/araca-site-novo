import { NextResponse } from 'next/server'

const DEFAULT_HERO_VIDEO_KEY = 'FJO__VIDEOFACHADA_01_R00.mp4'

/**
 * GET /api/hero-video
 * Aceita query ?quality=low (para mp4 comprimido) ou ?quality=poster (para webp)
 * Redireciona (302) para a URL real no R2 ou fallback.
 */
function getRedirectUrl(quality: string | null): string | null {
  let videoKey = process.env.NEXT_PUBLIC_HERO_VIDEO_FILENAME || DEFAULT_HERO_VIDEO_KEY
  let heroUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim()

  // Apply quality modifier to filename or URL
  if (quality === 'low') {
    videoKey = videoKey.replace(/\.[^/.]+$/, "_low.mp4")
    if (heroUrl) heroUrl = heroUrl.replace(/\.[^/.]+$/, "_low.mp4")
  } else if (quality === 'poster') {
    videoKey = videoKey.replace(/\.[^/.]+$/, "_poster.webp")
    if (heroUrl) heroUrl = heroUrl.replace(/\.[^/.]+$/, "_poster.webp")
  }

  const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')

  // Se já temos uma URL completa e ela é do R2, usamos direto
  if (heroUrl && heroUrl.includes('r2.dev')) return heroUrl

  const isVercelBlob = heroUrl?.includes('blob.vercel-storage.com')
  if (r2Base) return `${r2Base}/${videoKey}`
  if (heroUrl && !isVercelBlob) return heroUrl

  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (supabase) return `${supabase}/storage/v1/object/public/media/${videoKey}`

  return heroUrl || null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const quality = searchParams.get('quality')

  const target = getRedirectUrl(quality)
  if (!target) {
    return new NextResponse('Hero video not configured', { status: 503 })
  }

  // 308 (Permanent Redirect) + Cache-Control longo:
  // 302 não é cacheado por browser/CDN — cada visita faz o round-trip novamente.
  // 308 com max-age=604800 faz o browser cachear o redirect por 7 dias.
  return NextResponse.redirect(target, {
    status: 308,
    headers: {
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
    },
  })
}
