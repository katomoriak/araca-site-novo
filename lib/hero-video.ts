const DEFAULT_HERO_VIDEO_KEY = 'FJO__VIDEOFACHADA_01_R00.mp4'

/**
 * Retorna a URL final (R2, Supabase ou externa) de forma síncrona
 * evitando um redirecionamento 308 via API.
 * Suporta 'low' (para mp4 comprimido) e 'poster' (para webp).
 */
export function getHeroVideoUrl(quality: 'default' | 'low' | 'poster' | 'video' = 'default'): string | null {
  let videoKey = process.env.NEXT_PUBLIC_HERO_VIDEO_FILENAME || DEFAULT_HERO_VIDEO_KEY
  let heroUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim()

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
