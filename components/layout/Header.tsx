'use client'

import { SiteNav } from './SiteNav'

export function Header() {
  return (
    <header className="sticky top-0 z-50 pt-4 pb-2">
      <SiteNav theme="light-bg" logoVariant="cafe" noEnterAnimation />
    </header>
  )
}
