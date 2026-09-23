import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/residencial`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores Residencial | Aracá Interiores',
  },
  description:
    'Projetos de interiores para casas e apartamentos no Grande ABC e SP. Ambientes acolhedores, funcionais e sob medida para seu lar.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores Residencial | Aracá Interiores',
    description:
      'Projetos de interiores para casas e apartamentos no Grande ABC e SP. Ambientes acolhedores, funcionais e sob medida para seu lar.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function ResidentialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
