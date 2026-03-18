import Script from 'next/script'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { BodyScope } from '@/components/layout/BodyScope'
import '@/styles/globals.css'

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-B0F0PY4FW8'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const siteName = 'Aracá Interiores'
const siteDescription =
  'A Aracá Interiores é um escritório de arquitetura e design de interiores em Santo André e SP focado em arquitetura de interiores com modelo flexível.'
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://araca.arq.br'

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
    default: 'Aracá Interiores | Escritório de Arquitetura e Design de Interiores em Santo André e SP',
    template: `%s | Aracá Interiores`,
  },
  description: 'A Aracá Interiores é um escritório de arquitetura e design de interiores em Santo André e SP focado em arquitetura de interiores com modelo flexível.',
  keywords: [
    'aracá interiores',
    'escritório aracá interiores santo andré',
    'arquitetos em santo andré',
    'arquitetura de interiores são paulo sp',
    'arquitetura e design de interiores',
    'design de interiores santo andré',
    'projeto de interiores sp'
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
    title: 'Aracá Interiores | Escritório de Arquitetura e Design de Interiores em Santo André e SP',
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
    title: 'Aracá Interiores | Escritório de Arquitetura e Design de Interiores em Santo André e SP',
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
  const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    ? process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, '')
    : 'https://pub-9ca9f8ba8c9d47518d53ef4b3818ed26.r2.dev'

  return (
    <html
      lang="pt-BR"
      className={rubik.variable}
    >
      <head>
        <link rel="preconnect" href={r2Url} />
        <link rel="dns-prefetch" href={r2Url} />
        <link 
          rel="preload" 
          href="/fonts/Bellamora-Free-Personal-Use.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="antialiased">
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
        {/* Google Analytics - Script do Next.js pode ficar fora do head */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
        <BodyScope>{children}</BodyScope>
      </body>
    </html>
  )
}
