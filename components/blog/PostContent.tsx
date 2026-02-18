import { cn } from '@/lib/utils'
import { RichText } from './RichText'
import type { SerializedEditorState } from 'lexical'
import { sanitizeHTML } from '@/lib/sanitize-html'
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

  // Sanitizar HTML para prevenir XSS (funciona no servidor e cliente)
  const sanitizedHTML = sanitizeHTML(html)

  // Usar proxy para imagens do Supabase; garantir links externos com target/rel
  const finalHTML = transformLinks(transformImageUrls(sanitizedHTML))

  return (
    <div
      className={cn('prose prose-lg max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: finalHTML }}
    />
  )
}
