import type { Metadata } from 'next'
import { HomePage } from '@/components/home/HomePage'
import { getProjetosCachedForHome } from '@/lib/projetos-server'
import { getPosts, toBlogPostListItem } from '@/lib/payload'
import { MOCK_POSTS } from '@/lib/blog-mock'
import type { Post } from '@/lib/blog-mock'

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

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.araca.arq.br/#website',
      url: 'https://www.araca.arq.br/',
      name: 'Aracá Interiores',
      description:
        'Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC.',
      publisher: {
        '@id': 'https://www.araca.arq.br/#organization',
      },
      inLanguage: 'pt-BR',
    },
    {
      '@type': ['HomeAndConstructionBusiness', 'ProfessionalService'],
      '@id': 'https://www.araca.arq.br/#organization',
      name: 'Aracá Interiores',
      alternateName: [
        'Aracá Interiores Santo André',
        'Aracá Design de Interiores',
      ],
      description:
        'Estúdio de design de interiores e reformas residenciais de alto padrão no Grande ABC e em São Paulo, unindo estética com significado, projetos executivos precisos e acompanhamento de obra.',
      url: 'https://www.araca.arq.br/',
      logo: 'https://www.araca.arq.br/logotipos/LOGOTIPO%20REDONDO@300x.png',
      image: 'https://www.araca.arq.br/projetos/areasocial_residencia-ninhoverce/cover.png',
      telephone: '+5511939155979',
      email: 'contato@araca.arq.br',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Santo André',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      areaServed: [
        { '@type': 'City', name: 'Santo André' },
        { '@type': 'City', name: 'São Bernardo do Campo' },
        { '@type': 'City', name: 'São Caetano do Sul' },
        { '@type': 'AdministrativeArea', name: 'Grande ABC' },
        { '@type': 'City', name: 'São Paulo' },
        { '@type': 'AdministrativeArea', name: 'Zona Sul de São Paulo' },
      ],
      sameAs: [
        'https://www.instagram.com/aracainteriores/',
        'https://www.linkedin.com/company/araca-arq',
        'https://br.pinterest.com/aracainteriores/_created/',
      ],
    },
  ],
}

export default async function Page() {
  const [initialProjects, payloadPosts] = await Promise.all([
    getProjetosCachedForHome(),
    getPosts().catch(() => []),
  ])

  const posts: Post[] =
    payloadPosts.length > 0
      ? payloadPosts.map(toBlogPostListItem)
      : MOCK_POSTS

  const latestPosts = posts.slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HomePage
        initialProjects={initialProjects}
        latestPosts={latestPosts}
      />
    </>
  )
}

