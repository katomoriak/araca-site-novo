import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://araca.arq.br'

export const metadata: Metadata = {
  title: 'Arquitetura Comercial e Corporativa | Aracá Interiores',
  description: 'Projetos de arquitetura comercial e corporativa em Santo André e SP. Espaços estratégicos que geram conversão, produtividade e valorizam sua marca.',
  alternates: {
    canonical: `${baseUrl}/servicos/comercial`,
  },
}

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
