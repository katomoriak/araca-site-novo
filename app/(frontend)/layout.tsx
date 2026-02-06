'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      {!isHomePage && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
