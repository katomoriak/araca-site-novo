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
      '@type': ['LocalBusiness', 'Organization'],
      '@id': 'https://www.araca.arq.br/#organization',
      additionalType: 'https://en.wikipedia.org/wiki/Interior_design',
      name: 'Aracá Interiores',
      alternateName: [
        'Aracá Interiores Santo André',
        'Aracá Design de Interiores',
      ],
      description:
        'Estúdio de design de interiores e reformas residenciais de alto padrão no Grande ABC e em São Paulo, unindo estética com significado, projetos executivos precisos e acompanhamento de obra.',
      knowsAbout: [
        'Design de Interiores',
        'Arquitetura de Interiores',
        'Decoração de Ambientes',
        'Reformas Residenciais de Alto Padrão',
        'Marcenaria Sob Medida',
        'Gestão de Obras de Interiores',
      ],
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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '15',
        bestRating: '5',
        worstRating: '1',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços e Simuladores Aracá Interiores',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design de Interiores Residencial',
              url: 'https://www.araca.arq.br/servicos/residencial',
              description: 'Projetos autorais de interiores para apartamentos, casas e coberturas de alto padrão.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Projetos Comerciais & Corporativos',
              url: 'https://www.araca.arq.br/servicos/comercial-corporativo',
              description: 'Projetos executivos para sedes corporativas, consultórios e lojas.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Gestão e Acompanhamento de Obras',
              url: 'https://www.araca.arq.br/servicos/gestao-acompanhamento-de-obra',
              description: 'Supervisão técnica, cronograma físico-financeiro e fiscalização de obra.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Calculadora de Custo de Reforma',
              serviceType: 'Simulador de Custos Online',
              url: 'https://www.araca.arq.br/quanto-custa-reformar',
              description: 'Simulador interativo de custo de reforma por m² e ambientes em SP e ABC.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Calculadora de Projeto de Interiores',
              serviceType: 'Simulador de Investimento Online',
              url: 'https://www.araca.arq.br/calculadora-custo-projeto-design-interiores',
              description: 'Simulador online de investimento para projeto executivo de interiores.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design de Interiores Clássico e Neoclássico',
              url: 'https://www.araca.arq.br/design-de-interiores-classico-neoclassico',
              description: 'Estética clássica refinada, boiseries nobres e acabamentos atemporais de luxo.',
            },
          },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.araca.arq.br/#navigation',
      name: 'Navegação Estratégica Aracá Interiores',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Calculadora de Reforma',
          description: 'Simule o custo estimado da sua reforma residencial ou comercial em São Paulo e Grande ABC.',
          url: 'https://www.araca.arq.br/quanto-custa-reformar',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Calculadora de Projeto de Interiores',
          description: 'Simule o investimento estimado para projetos completos de design de interiores.',
          url: 'https://www.araca.arq.br/calculadora-custo-projeto-design-interiores',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Tabelas CUB & SINAPI SP',
          description: 'Guia comparativo oficial dos custos da construção civil e reformas em São Paulo.',
          url: 'https://www.araca.arq.br/tabela-cub-sinapi',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Design de Interiores Residencial',
          description: 'Projetos completos para apartamentos, casas e coberturas de alto padrão.',
          url: 'https://www.araca.arq.br/servicos/residencial',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Projetos Comerciais & Corporativos',
          description: 'Design de interiores para escritórios, clínicas e lojas com foco em identidade e ergonomia.',
          url: 'https://www.araca.arq.br/servicos/comercial-corporativo',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'Gestão e Acompanhamento de Obra',
          description: 'Supervisão técnica, cronograma físico-financeiro e fiscalização executiva de obras.',
          url: 'https://www.araca.arq.br/servicos/gestao-acompanhamento-de-obra',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 7,
          name: 'Projetos Autorais (Portfólio)',
          description: 'Galeria fotográfica de projetos residenciais e comerciais concluídos pelo estúdio.',
          url: 'https://www.araca.arq.br/projetos',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 8,
          name: 'Design Clássico & Neoclássico',
          description: 'Ambientes sofisticados com boiseries, iluminação cenográfica e molduras clássicas.',
          url: 'https://www.araca.arq.br/design-de-interiores-classico-neoclassico',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 9,
          name: 'Blog de Decoração & Arquitetura',
          description: 'Dicas de decoração, tendências da Expo Revestir e guias práticos de interiores.',
          url: 'https://www.araca.arq.br/blog',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 10,
          name: 'Sobre o Estúdio',
          description: 'Conheça o estúdio Aracá Interiores, nossa equipe e manifesto de design.',
          url: 'https://www.araca.arq.br/sobre',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 11,
          name: 'Contato & Orçamento',
          description: 'Fale com nossa equipe e solicite uma proposta personalizada para seu espaço.',
          url: 'https://www.araca.arq.br/contato',
        },
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

