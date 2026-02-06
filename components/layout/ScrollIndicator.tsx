'use client'

import { ChevronDown } from 'lucide-react'

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-down">
      <ChevronDown className="h-8 w-8 text-white/80" aria-hidden />
      <span className="sr-only">Role para baixo</span>
    </div>
  )
}
