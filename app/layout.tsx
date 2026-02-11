import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { BodyScope } from '@/components/layout/BodyScope'
import '@/styles/globals.css'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const siteName = 'Aracá Interiores'
const siteDescription =
  'Aracá Interiores — projetos de interiores residenciais e comerciais. Projeto criativo, executivo, detalhamentos e acompanhamento de obra em um modelo inovador e sob medida.'
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aracainteriores.com.br'

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: baseUrl,
  description: siteDescription,
  logo: `${baseUrl}/logotipos/LOGOTIPO%20REDONDO@300x.png`,
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: baseUrl,
  description: siteDescription,
  publisher: { '@id': `${baseUrl}#organization` },
  inLanguage: 'pt-BR',
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} — Projetos de interiores residenciais e comerciais`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'interiores',
    'design de interiores',
    'projeto residencial',
    'projeto comercial',
    'arquitetura de interiores',
    'decoración',
    'consultoria de interiores',
    'Aracá',
  ],
  authors: [{ name: siteName, url: baseUrl }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName,
    title: `${siteName} — Projetos de interiores residenciais e comerciais`,
    description: siteDescription,
    images: [
      {
        url: '/logotipos/LOGOTIPO%20REDONDO@300x.png',
        width: 300,
        height: 300,
        alt: `${siteName} — Logo`,
      },
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: `${siteName} — Projetos de interiores`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Projetos de interiores`,
    description: siteDescription,
    images: ['/hero-interiores.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      // Light mode: logo verde escuro (#3c5945) — boa leitura em abas/claro
      {
        url: '/logotipos/LOGOTIPO%20REDONDO@300x.png',
        type: 'image/png',
        sizes: '300x300',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logotipos/LOGOTIPO%20REDONDO.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      // Dark mode: logo em cor clara (#e7e5e4) — boa leitura em abas escuras
      {
        url: '/favicon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [
      { url: '/logotipos/LOGOTIPO%20REDONDO@300x.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
  },
  manifest: '/manifest.json',
  alternates: { canonical: baseUrl },
  category: 'design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={rubik.variable}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />
        <BodyScope>{children}</BodyScope>
      </body>
    </html>
  )
}
