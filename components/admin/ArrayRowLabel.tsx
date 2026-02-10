'use client'

import { useRowLabel } from '@payloadcms/ui'
import { Tag } from 'lucide-react'

type TagRow = { tag?: string }

export function ArrayRowLabel() {
  const { data, rowNumber } = useRowLabel<TagRow>()
  const label = data?.tag?.trim() || `Tag ${rowNumber}`
  return (
    <span className="flex items-center gap-2">
      <Tag className="h-4 w-4 shrink-0 text-[var(--theme-elevation-600)]" aria-hidden />
      <span>{label}</span>
    </span>
  )
}
