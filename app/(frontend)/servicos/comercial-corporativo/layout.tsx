import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/comercial-corporativo`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores Comercial | Aracá Interiores',
  },
  description:
    'Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Espaços corporativos que valorizam a sua marca.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores Comercial | Aracá Interiores',
    description:
      'Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Espaços corporativos que valorizam a sua marca.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function ComercialCorporativoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
