import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/gestao-acompanhamento-de-obra`

export const metadata: Metadata = {
  title: {
    absolute: 'Gestão e Acompanhamento de Obra | Aracá Interiores',
  },
  description:
    'Acompanhamento presencial e gestão técnica de obras no ABC e SP. Controle de prazos, acabamentos e fidelidade ao projeto.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Gestão e Acompanhamento de Obra | Aracá Interiores',
    description:
      'Acompanhamento presencial e gestão técnica de obras no ABC e SP. Controle de prazos, acabamentos e fidelidade ao projeto.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function GestaoAcompanhamentoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
