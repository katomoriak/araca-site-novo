import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/residencial/reformas-retrofit`

export const metadata: Metadata = {
  title: {
    absolute: 'Reforma e Retrofit de Interiores Residencial | Aracá Interiores',
  },
  description:
    'Projetos de reforma completa e retrofit para casas e apartamentos no ABC e SP. Modernização estrutural, acabamentos nobres e gestão sem imprevistos.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Reforma e Retrofit de Interiores Residencial | Aracá Interiores',
    description:
      'Projetos de reforma completa e retrofit para casas e apartamentos no ABC e SP. Modernização estrutural, acabamentos nobres e gestão sem imprevistos.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Reforma e Retrofit de Interiores Residencial — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reforma e Retrofit de Interiores Residencial | Aracá Interiores',
    description:
      'Projetos de reforma completa e retrofit para casas e apartamentos no ABC e SP.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function ReformasRetrofitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
