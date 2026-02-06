import { cn } from '@/lib/utils'

interface PostContentProps {
  content: string
  className?: string
}

/**
 * Wrapper para conteúdo de post (rich text do Payload ou HTML).
 * Usa estilos .prose definidos em globals.css.
 */
export function PostContent({ content, className }: PostContentProps) {
  return (
    <div
      className={cn('prose prose-lg max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
