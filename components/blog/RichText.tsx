'use client'

import { RichText as LexicalRichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'
import { cn } from '@/lib/utils'

interface RichTextProps {
  data: SerializedEditorState
  className?: string
}

/**
 * Renderiza conteúdo rich text do Payload (Lexical) no frontend.
 */
export function RichText({ data, className }: RichTextProps) {
  if (!data?.root) {
    return null
  }
  return (
    <LexicalRichText
      data={data}
      className={cn('prose prose-lg max-w-none', className)}
      converters={defaultJSXConverters}
    />
  )
}
