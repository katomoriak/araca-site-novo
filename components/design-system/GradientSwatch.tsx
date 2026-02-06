'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GradientSwatchProps {
  name: string
  gradient: string
  className?: string
}

export function GradientSwatch({
  name,
  gradient,
  className,
}: GradientSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(`background: ${gradient};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={copy}
        className="flex h-24 w-full overflow-hidden rounded-lg border border-neutral-200 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        style={{ background: gradient }}
        aria-label={`Copiar gradiente ${name}`}
      >
        <span
          className={cn(
            'flex h-full w-full items-center justify-center text-white transition',
            copied ? 'bg-black/30' : 'bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/20'
          )}
        >
          {copied ? <Check className="h-8 w-8" /> : <Copy className="h-6 w-6" />}
        </span>
      </button>
      <span className="font-mono text-xs text-neutral-600">{name}</span>
    </div>
  )
}
