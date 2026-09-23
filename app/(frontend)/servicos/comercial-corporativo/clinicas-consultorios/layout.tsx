import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/comercial-corporativo/clinicas-consultorios`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores para Clínicas e Consultórios | Aracá Interiores',
  },
  description:
    'Arquitetura de interiores para clínicas médicas e consultórios em SP e ABC. Conformidade total com normas da ANVISA, acolhimento e requinte.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores para Clínicas e Consultórios | Aracá Interiores',
    description:
      'Arquitetura de interiores para clínicas médicas e consultórios em SP e ABC. Conformidade total com normas da ANVISA, acolhimento e requinte.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores para Clínicas e Consultórios — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores para Clínicas e Consultórios | Aracá Interiores',
    description:
      'Arquitetura de interiores para clínicas médicas e consultórios em SP e ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function ClinicasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
