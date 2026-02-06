import type { Metadata } from 'next'
import { Cormorant_Garamond, Rubik } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Aracá Interiores',
  description: 'Site Aracá Interiores - Blog e Design System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorantGaramond.variable} ${rubik.variable}`}
    >
      <body className="min-h-screen font-body antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
