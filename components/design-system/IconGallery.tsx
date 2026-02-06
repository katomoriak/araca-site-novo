'use client'

import { useMemo, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { IconCard } from './IconCard'
import { Input } from '@/components/ui'
import { Search } from 'lucide-react'

const iconNames = Object.keys(LucideIcons).filter(
  (k) =>
    typeof (LucideIcons as Record<string, unknown>)[k] === 'function' &&
    k !== 'default' &&
    k !== 'createLucideIcon' &&
    !k.startsWith('Icon')
) as string[]

const categories = ['Todos', 'Arrows', 'Media', 'Actions', 'Communication', 'Content', 'Layout', 'Other']

export function IconGallery() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  const filtered = useMemo(() => {
    let list = iconNames
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((name) => name.toLowerCase().includes(q))
    }
    if (category !== 'Todos') {
      list = list.filter((name) => {
        if (category === 'Arrows') return /Arrow|Chevron|Move|Trending/.test(name)
        if (category === 'Media') return /Image|Video|Music|Play|Pause|Volume/.test(name)
        if (category === 'Actions') return /Plus|Minus|Edit|Trash|Save|Send|Copy|Check|X/.test(name)
        if (category === 'Communication') return /Mail|Message|Phone|Share/.test(name)
        if (category === 'Content') return /File|Folder|Book|Calendar/.test(name)
        if (category === 'Layout') return /Layout|Grid|List|Menu|Sidebar/.test(name)
        return true
      })
    }
    return list.slice(0, 84)
  }, [search, category])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-neutral-500">
        {filtered.length}+ ícones Lucide. Clique para copiar o import.
      </p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((name) => {
          const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
          if (!Icon) return null
          return (
            <IconCard
              key={name}
              icon={Icon}
              name={name}
            />
          )
        })}
      </div>
    </div>
  )
}
