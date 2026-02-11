/**
 * Transforma src das imagens do conteúdo para usar o proxy quando a URL é do Supabase.
 * Evita mixed content (HTTP em página HTTPS) e problemas de CORS/hotlink.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export function isSupabaseStorageUrl(url: string): boolean {
  if (!SUPABASE_URL) return false
  try {
    const parsed = new URL(url)
    const base = new URL(SUPABASE_URL.replace(/\/$/, ''))
    return parsed.origin === base.origin && parsed.pathname.includes('/storage/')
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
  if (!isSupabaseStorageUrl(trimmed)) return trimmed
  return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`
}

export function transformImageUrls(html: string): string {
  if (!SUPABASE_URL || !html.includes('<img')) {
    return html
  }

  return html.replace(
    /<img([^>]*?)src=["']([^"']+)["']([^>]*)>/gi,
    (_, before, src, after) => {
      const trimmed = src.trim()
      if (!isSupabaseStorageUrl(trimmed)) {
        return `<img${before}src="${src}"${after}>`
      }
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(trimmed)}`
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
