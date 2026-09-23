import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/comercial-corporativo/escritorios`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores para Escritórios e Sedes | Aracá Interiores',
  },
  description:
    'Projetos corporativos para escritórios e sedes empresariais no ABC e SP. Ergonomia NR-17, acústica, salas de reunião e open space integrado.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores para Escritórios e Sedes | Aracá Interiores',
    description:
      'Projetos corporativos para escritórios e sedes empresariais no ABC e SP. Ergonomia NR-17, acústica, salas de reunião e open space integrado.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Escritórios — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Escritórios e Sedes | Aracá Interiores',
    description:
      'Projetos corporativos para escritórios e sedes empresariais no ABC e SP.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function EscritoriosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
