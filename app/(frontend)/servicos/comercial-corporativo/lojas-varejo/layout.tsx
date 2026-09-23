import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/comercial-corporativo/lojas-varejo`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores para Lojas e Showrooms | Aracá Interiores',
  },
  description:
    'Arquitetura comercial e retail design para lojas e showrooms em SP e ABC. Visual merchandising, fluxo de clientes e experiência de compra.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores para Lojas e Showrooms | Aracá Interiores',
    description:
      'Arquitetura comercial e retail design para lojas e showrooms em SP e ABC. Visual merchandising, fluxo de clientes e experiência de compra.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Lojas e Varejo — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Lojas e Showrooms | Aracá Interiores',
    description:
      'Arquitetura comercial e retail design para lojas e showrooms em SP e ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function LojasVarejoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
