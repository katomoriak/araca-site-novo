/**
 * Transforma src das imagens do conteúdo para usar o proxy quando a URL é do Supabase ou R2.
 * Evita mixed content (HTTP em página HTTPS) e problemas de CORS/hotlink.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const R2_PUBLIC = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')

function getStorageOrigins(): string[] {
  const origins: string[] = []
  if (SUPABASE_URL) {
    try {
      origins.push(new URL(SUPABASE_URL.replace(/\/$/, '')).origin)
    } catch {
      // ignore
    }
  }
  if (R2_PUBLIC) {
    try {
      origins.push(new URL(R2_PUBLIC).origin)
    } catch {
      // ignore
    }
  }
  return origins
}

const STORAGE_ORIGINS = getStorageOrigins()

export function isSupabaseStorageUrl(url: string): boolean {
  return isStorageProxyUrl(url)
}

/** URLs do Supabase ou R2 que devem passar pelo proxy. */
export function isStorageProxyUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url.trim())
    return STORAGE_ORIGINS.some((o) => parsed.origin === o)
  } catch {
    return false
  }
}

/**
 * Retorna a URL para exibir a imagem no editor (dashboard).
 * URLs do Supabase são convertidas para o proxy da mesma origem, evitando CORS e "Falha ao carregar imagem".
 * O conteúdo salvo continua com a URL original; só a exibição no editor usa o proxy.
 */
export function getProxiedImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!isStorageProxyUrl(trimmed)) return trimmed
  return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`
}

/**
 * Retorna URL do proxy de vídeo para URLs do Supabase ou R2 Storage.
 * Reduz Cached Egress: após o primeiro hit, CDN/browser atendem.
 */
export function getProxiedVideoUrl(url: string): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!isStorageProxyUrl(trimmed)) return trimmed
  return `/api/video-proxy?url=${encodeURIComponent(trimmed)}`
}

/**
 * Retorna URL do proxy com resize (w, q) para imagens do Supabase ou R2.
 * Reduz tempo de carregamento ao servir versões menores.
 */
export function getProxiedImageUrlWithResize(url: string, w?: number, q = 80): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!isStorageProxyUrl(trimmed)) return trimmed
  const params = new URLSearchParams({ url: trimmed })
  if (w && w > 0) params.set('w', String(Math.min(w, 2048)))
  if (q > 0) params.set('q', String(Math.min(q, 90)))
  return `/api/image-proxy?${params.toString()}`
}

/**
 * Extrai a URL bruta quando o argumento é uma URL do proxy (/api/image-proxy?url=...).
 * Caso contrário retorna a própria URL.
 */
function getRawUrlFromMaybeProxied(url: string): string {
  const trimmed = url.trim()
  if (!trimmed || !trimmed.includes('image-proxy')) return trimmed
  try {
    const parsed = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, 'https://_')
    const urlParam = parsed.searchParams.get('url')
    if (urlParam) return decodeURIComponent(urlParam)
  } catch {
    // fallthrough
  }
  return trimmed
}

/**
 * Retorna URL do proxy em baixa resolução para uso como placeholder (carregamento progressivo).
 * Aceita URL bruta do Supabase/R2 ou URL já proxada (/api/image-proxy?url=...).
 * Para outras origens retorna null (usar BLUR_DATA_URL estático).
 */
export function getBlurPlaceholderUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  const rawUrl = getRawUrlFromMaybeProxied(trimmed)
  if (!isStorageProxyUrl(rawUrl)) return null
  return getProxiedImageUrlWithResize(rawUrl, 40, 25)
}

/**
 * Retorna URL do proxy em tamanho médio para prévia (segundo estágio do carregamento progressivo).
 * Aceita URL bruta do Supabase/R2 ou URL já proxada.
 * Para outras origens retorna null.
 */
export function getPreviewImageUrl(url: string, w = 800, q = 65): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  const rawUrl = getRawUrlFromMaybeProxied(trimmed)
  if (!isStorageProxyUrl(rawUrl)) return null
  return getProxiedImageUrlWithResize(rawUrl, w, q)
}

export function transformImageUrls(html: string): string {
  if ((!SUPABASE_URL && !R2_PUBLIC) || !html.includes('<img')) {
    return html
  }

  return html.replace(
    /<img([^>]*?)src=["']([^"']+)["']([^>]*)>/gi,
    (_, before, src, after) => {
      const trimmed = src.trim()
      if (!isStorageProxyUrl(trimmed)) {
        return `<img${before}src="${src}"${after}>`
      }
      const proxyUrl = getProxiedImageUrlWithResize(trimmed, 1024, 80)
      return `<img${before}src="${proxyUrl}"${after}>`
    }
  )
}

/** Verifica se o href é URL externa (http/https). */
function isExternalUrl(href: string): boolean {
  const t = href.trim()
  return t.startsWith('http://') || t.startsWith('https://')
}

/**
 * Adiciona target="_blank" e rel="noopener noreferrer" em links externos.
 * Garante que links no conteúdo da postagem abram em nova aba com segurança.
 */
export function transformLinks(html: string): string {
  if (!html.includes('<a ')) return html

  return html.replace(
    /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*)>/gi,
    (_, before, href, after) => {
      if (!isExternalUrl(href)) {
        return `<a ${before}href="${href}"${after}>`
      }
      const full = before + after
      let extra = ''
      if (!/\btarget\s*=/i.test(full)) extra += ' target="_blank"'
      if (!/\brel\s*=/i.test(full)) extra += ' rel="noopener noreferrer"'
      return `<a ${before}href="${href}"${after}${extra}>`
    }
  )
}
