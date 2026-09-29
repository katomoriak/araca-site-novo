import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/residencial/apartamentos`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Apartamentos em SP e ABC | Aracá Interiores',
  },
  description:
    'Projetos de interiores para apartamentos em SP e Grande ABC. Varanda integrada, marcenaria sob medida e layout funcional para seu lar.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Apartamentos em SP e ABC | Aracá Interiores',
    description:
      'Projetos de interiores para apartamentos em SP e Grande ABC. Varanda integrada, marcenaria sob medida e layout funcional para seu lar.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Apartamentos — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Apartamentos em SP e ABC | Aracá Interiores',
    description:
      'Projetos de interiores para apartamentos novos e na planta em SP e Grande ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function ApartamentosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
