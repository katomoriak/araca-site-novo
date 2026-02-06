'use client'

import { ChevronDown } from 'lucide-react'

export function ScrollExample() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-8">
      <p className="text-sm text-neutral-600">Indicador de scroll</p>
      <div className="animate-scroll-down text-neutral-500">
        <ChevronDown className="h-10 w-10" aria-hidden />
      </div>
    </div>
  )
}
