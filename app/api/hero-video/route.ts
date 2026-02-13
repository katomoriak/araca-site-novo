import { NextResponse } from 'next/server'

const HERO_VIDEO_KEY = 'FJO__VIDEOFACHADA_01_R00.mp4'

/**
 * GET /api/hero-video
 * Redireciona (302) para a URL real do vídeo no R2 ou fallback.
 * O navegador baixa o vídeo direto da origem; a Vercel só entrega o redirect
 * (quase zero peso de cache/bandwidth).
 */
function getRedirectUrl(): string | null {
  const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')
  const heroUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim()
  const isVercelBlob = heroUrl?.includes('blob.vercel-storage.com')
  if (r2Base) return `${r2Base}/${HERO_VIDEO_KEY}`
  if (heroUrl && !isVercelBlob) return heroUrl
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (supabase) return `${supabase}/storage/v1/object/public/media/${HERO_VIDEO_KEY}`
  return heroUrl || null
}

export async function GET() {
  const target = getRedirectUrl()
  if (!target) {
    return new NextResponse('Hero video not configured', { status: 503 })
  }
  return NextResponse.redirect(target, 302)
}
