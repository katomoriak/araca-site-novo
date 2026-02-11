'use client'

import { usePathname } from 'next/navigation'
import { ParallaxProvider } from 'react-scroll-parallax'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageGradientBackground } from '@/components/layout/PageGradientBackground'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isBlogPage = pathname === '/blog'
  const showHeader = !isHomePage && !isBlogPage

  return (
    <ParallaxProvider>
      <div className="flex min-h-screen flex-col">
        {showHeader && <Header />}
        <main className="flex-1">
          <PageGradientBackground>{children}</PageGradientBackground>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </ParallaxProvider>
  )
}
