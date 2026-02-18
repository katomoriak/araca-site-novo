/**
 * Sanitização de HTML simples para conteúdo de blog.
 * 
 * Funciona tanto no servidor (SSR/prerender) quanto no cliente,
 * sem depender de jsdom ou DOMPurify (que requer DOM), evitando
 * erros de ESM no Vercel serverless (ERR_REQUIRE_ESM).
 *
 * Para conteúdo do Payload CMS (fonte confiável), remove apenas
 * tags perigosas (script, iframe, object, etc.) e atributos de evento.
 */

const DANGEROUS_TAGS = [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'textarea',
    'button',
    'select',
    'style',
    'link',
    'meta',
    'base',
    'applet',
    'svg',
    'math',
]

const DANGEROUS_TAG_PATTERN = new RegExp(
    `<\\/?(${DANGEROUS_TAGS.join('|')})(\\s[^>]*)?\\/?>`,
    'gi'
)

// Remove on* event handler attributes (onclick, onerror, onload, etc.)
const EVENT_HANDLER_PATTERN = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi

// Remove javascript: URLs
const JS_URL_PATTERN = /\s+(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi

/**
 * Sanitiza HTML removendo tags perigosas, event handlers e URLs javascript:.
 * Seguro para uso em SSR (não precisa de DOM).
 */
export function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') return ''

    let cleaned = html
    // Remove dangerous tags and their content for script/style
    cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    cleaned = cleaned.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove remaining dangerous tags (self-closing or open/close)
    cleaned = cleaned.replace(DANGEROUS_TAG_PATTERN, '')
    // Remove event handlers
    cleaned = cleaned.replace(EVENT_HANDLER_PATTERN, '')
    // Remove javascript: URLs
    cleaned = cleaned.replace(JS_URL_PATTERN, '')

    return cleaned
}
