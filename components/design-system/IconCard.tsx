'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconCardProps {
  icon: LucideIcon
  name: string
  className?: string
}

export function IconCard({ icon: Icon, name, className }: IconCardProps) {
  const [copied, setCopied] = useState(false)
  const importLine = `import { ${name} } from 'lucide-react'`

  const copy = () => {
    void navigator.clipboard.writeText(importLine)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      aria-label={`Copiar import do ícone ${name}`}
    >
      <span className="flex h-12 w-12 items-center justify-center text-neutral-700">
        <Icon className="h-8 w-8" />
      </span>
      <span className="max-w-full truncate font-mono text-xs text-neutral-600">
        {name}
      </span>
      {copied && (
        <span className="flex items-center gap-1 text-xs text-primary-600">
          <Check className="h-3 w-3" /> Copiado
        </span>
      )}
    </button>
  )
}
