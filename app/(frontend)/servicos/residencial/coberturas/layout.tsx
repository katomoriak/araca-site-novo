import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/residencial/coberturas`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Coberturas e Penthouses | Aracá Interiores',
  },
  description:
    'Projetos para coberturas e penthouses em SP e ABC. Áreas externas com lazer privativo, espaço gourmet e livings integrados exclusivos.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Coberturas e Penthouses | Aracá Interiores',
    description:
      'Projetos para coberturas e penthouses em SP e ABC. Áreas externas com lazer privativo, espaço gourmet e livings integrados exclusivos.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Coberturas — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Coberturas e Penthouses | Aracá Interiores',
    description:
      'Projetos exclusivos para coberturas duplex e penthouses em SP e ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function CoberturasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
