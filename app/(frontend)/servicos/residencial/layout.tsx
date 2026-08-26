import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata: Metadata = {
  title: 'Arquitetura Residencial | Aracá Interiores',
  description: 'Projetos de interiores residenciais sob medida em Santo André e SP. Transformamos seu apartamento ou casa em um refúgio funcional com alma e estilo.',
  alternates: {
    canonical: `${baseUrl}/servicos/residencial`,
  },
}

export default function ResidentialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
