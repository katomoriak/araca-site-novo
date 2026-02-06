'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  label: string
}

interface SectionNavProps {
  sections: Section[]
  className?: string
}

export function SectionNav({ sections, className }: SectionNavProps) {
  return (
    <nav
      className={cn(
        'sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block',
        className
      )}
      aria-label="Navegação do Design System"
    >
      <ul className="space-y-1 border-l-2 border-border pl-4">
        {sections.map((s) => (
          <li key={s.id}>
            <Link
              href={`#${s.id}`}
              className="block py-1.5 text-sm text-muted-foreground transition hover:text-primary"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
