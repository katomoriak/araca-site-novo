'use client'

import { usePathname } from 'next/navigation'
import { ParallaxProvider } from 'react-scroll-parallax'
import { GalleryOpenProvider } from '@/components/context/GalleryOpenContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageGradientBackground } from '@/components/layout/PageGradientBackground'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { useGalleryOpen } from '@/components/context/GalleryOpenContext'

function HeaderWhenNotGallery() {
  const { galleryOpen } = useGalleryOpen()
  if (galleryOpen) return null
  return <Header />
}

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
      <GalleryOpenProvider>
        <div className="flex min-h-screen flex-col">
          {showHeader && <HeaderWhenNotGallery />}
          <main className="flex-1">
            <PageGradientBackground>{children}</PageGradientBackground>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </GalleryOpenProvider>
    </ParallaxProvider>
  )
}
