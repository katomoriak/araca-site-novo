'use client'

import { ChevronsDown } from 'lucide-react'

interface ScrollIndicatorProps {
  className?: string
  label?: string
}

/**
 * Indicador de scroll para hero (chevron animado)
 */
export function ScrollIndicator({ className, label = 'Role para explorar' }: ScrollIndicatorProps) {
  return (
    <div
      className={className}
      role="presentation"
      aria-hidden
    >
      <span className="sr-only">{label}</span>
      <ChevronsDown
        className="h-8 w-8 animate-scroll-down text-white/90"
        strokeWidth={2}
      />
    </div>
  )
}
