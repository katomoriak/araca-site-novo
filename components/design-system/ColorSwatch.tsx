'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  name: string
  value: string
  className?: string
  showValue?: boolean
}

export function ColorSwatch({
  name,
  value,
  className,
  showValue = true,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={copy}
        className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        style={{ backgroundColor: value }}
        aria-label={`Copiar ${value}`}
      >
        <span
          className={cn(
            'flex h-20 w-full items-center justify-center transition',
            copied ? 'bg-primary-600/90 text-white' : 'bg-black/0 text-transparent group-hover:bg-black/20 group-hover:text-white'
          )}
        >
          {copied ? <Check className="h-6 w-6" /> : <Copy className="h-5 w-5" />}
        </span>
      </button>
      {showValue && (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-neutral-600">{name}</span>
          <span className="font-mono text-xs text-neutral-500">{value}</span>
        </div>
      )}
    </div>
  )
}
