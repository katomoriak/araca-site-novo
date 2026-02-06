'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'text', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-neutral-200', className)}>
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2">
        <span className="font-mono text-xs text-neutral-600">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 rounded px-2 py-1 text-xs text-neutral-600 transition hover:bg-neutral-200"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-neutral-900 p-4">
        <code className="font-mono text-sm text-neutral-100">{code}</code>
      </pre>
    </div>
  )
}
