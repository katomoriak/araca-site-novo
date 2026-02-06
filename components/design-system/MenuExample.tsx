'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Início' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre' },
  {
    label: 'Mais',
    children: [
      { href: '/design-system', label: 'Design System' },
      { href: '/admin', label: 'Admin' },
    ],
  },
]

export function MenuExample() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-4" aria-label="Exemplo de menu">
      {items.map((item) =>
        'href' in item && item.href ? (
          <Link key={item.href} href={item.href} className="text-neutral-700 transition hover:text-primary-600">
            {item.label}
          </Link>
        ) : (
          <div key={item.label} className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-neutral-700 transition hover:text-primary-600"
              aria-expanded={open}
            >
              {item.label}
              <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
            </button>
            {open && (
              <ul className="absolute left-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
                {item.children?.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}
    </nav>
  )
}
