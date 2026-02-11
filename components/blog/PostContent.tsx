import { cn } from '@/lib/utils'
import { RichText } from './RichText'
import type { SerializedEditorState } from 'lexical'
import DOMPurify from 'isomorphic-dompurify'
import { transformImageUrls, transformLinks } from '@/lib/transform-content-images'

interface PostContentProps {
  /** Conteúdo do post: HTML (string) do mock ou estado Lexical (objeto) do Payload */
  content: string | SerializedEditorState | unknown
  className?: string
}

function isLexicalState(value: unknown): value is SerializedEditorState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    typeof (value as SerializedEditorState).root === 'object'
  )
}

/**
 * Wrapper para conteúdo de post (rich text do Payload/Lexical ou HTML do mock).
 * Usa estilos .prose definidos em globals.css.
 */
export function PostContent({ content, className }: PostContentProps) {
  if (isLexicalState(content)) {
    return <RichText data={content} className={className} />
  }
  
  const html = typeof content === 'string' ? content : ''
  
  // Sanitizar HTML para prevenir XSS
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'data-media-id', 'target', 'rel'],
  })

  // Usar proxy para imagens do Supabase; garantir links externos com target/rel
  const finalHTML = transformLinks(transformImageUrls(sanitizedHTML))

  return (
    <div
      className={cn('prose prose-lg max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: finalHTML }}
    />
  )
}
