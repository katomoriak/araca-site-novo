'use client'

import { SiteNav } from './SiteNav'

const EXTRA_LINKS = [
  { href: '/design-system', label: 'Design System' },
  { href: '/admin', label: 'Admin' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 pt-4 pb-2">
      <SiteNav theme="light-bg" extraLinks={EXTRA_LINKS} />
    </header>
  )
}
