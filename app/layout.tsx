import type { Metadata } from 'next'
import { Cormorant_Garamond, Rubik } from 'next/font/google'
import { BodyScope } from '@/components/layout/BodyScope'
import '@/styles/globals.css'

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
  title: 'Aracá Interiores — Blog profissional',
  description: 'Blog com Next.js 15 e Payload CMS. Design System Lab.',
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
      <body>
        <BodyScope>{children}</BodyScope>
      </body>
    </html>
  )
}
