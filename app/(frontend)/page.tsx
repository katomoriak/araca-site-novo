import type { Metadata } from 'next'
import { HomePage } from '@/components/home/HomePage'
import { getProjetosCachedForHome } from '@/lib/projetos-server'

export const dynamic = 'force-static'
export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: 'Aracá Interiores | Design de Interiores em SP e ABC',
  },
  description:
    'Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC. Solicite sua proposta comercial.',
  alternates: {
    canonical: 'https://www.araca.arq.br',
  },
  openGraph: {
    title: 'Aracá Interiores | Design de Interiores em SP e ABC',
    description:
      'Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC. Solicite sua proposta comercial.',
    url: 'https://www.araca.arq.br',
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aracá Interiores | Design de Interiores em SP e ABC',
    description:
      'Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC. Solicite sua proposta comercial.',
  },
}

export default async function Page() {
  const initialProjects = await getProjetosCachedForHome()
  return <HomePage initialProjects={initialProjects} />
}

