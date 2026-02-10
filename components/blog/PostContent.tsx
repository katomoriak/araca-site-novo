import { cn } from '@/lib/utils'
import { RichText } from './RichText'
import type { SerializedEditorState } from 'lexical'

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
  return (
    <div
      className={cn('prose prose-lg max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
