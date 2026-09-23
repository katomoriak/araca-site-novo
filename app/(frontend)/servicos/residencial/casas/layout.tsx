import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/residencial/casas`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores para Casas no ABC e SP | Aracá Interiores',
  },
  description:
    'Projetos de interiores para casas e sobrados de alto padrão em SP e Grande ABC. Ambientes integrados, espaço gourmet, suítes e marcenaria sob medida.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores para Casas no ABC e SP | Aracá Interiores',
    description:
      'Projetos de interiores para casas e sobrados de alto padrão em SP e Grande ABC. Ambientes integrados, espaço gourmet, suítes e marcenaria sob medida.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Casas — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Casas no ABC e SP | Aracá Interiores',
    description:
      'Projetos de interiores para casas e sobrados de alto padrão em SP e Grande ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function CasasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
