import type { Metadata } from 'next'
import { ServicosClient } from './ServicosClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos`

export const metadata: Metadata = {
  title: {
    absolute: 'Serviços de Interiores no ABC e SP | Aracá Interiores',
  },
  description:
    'Projetos de interiores residenciais, comerciais e gestão de obra no Grande ABC e São Paulo. Conheça nossos serviços sob medida.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Serviços de Interiores no ABC e SP | Aracá Interiores',
    description:
      'Projetos de interiores residenciais, comerciais e gestão de obra no Grande ABC e São Paulo. Conheça nossos serviços sob medida.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
}

const servicosSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Aracá Interiores',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Serviços de Interiores no ABC e SP | Aracá Interiores',
      description:
        'Projetos de interiores residenciais, comerciais e gestão de obra no Grande ABC e São Paulo. Conheça nossos serviços sob medida.',
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Serviços de Interiores',
          item: canonical,
        },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'Design de Interiores e Gestão de Obra',
      name: 'Serviços de Design de Interiores e Gestão de Obra',
      provider: {
        '@id': `${baseUrl}/#organization`,
      },
      areaServed: [
        'Santo André',
        'São Bernardo do Campo',
        'São Caetano do Sul',
        'Grande ABC',
        'São Paulo',
      ],
      description:
        'Projetos de interiores residenciais, comerciais e gestão de obra no Grande ABC e São Paulo.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Catálogo de Serviços de Interiores',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design de Interiores Residencial',
              url: `${baseUrl}/servicos/residencial`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design de Interiores Comercial & Corporativo',
              url: `${baseUrl}/servicos/comercial-corporativo`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Gestão e Acompanhamento de Obra',
              url: `${baseUrl}/servicos/gestao-acompanhamento-de-obra`,
            },
          },
        ],
      },
    },
  ],
}

export default function ServicosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicosSchema) }}
      />
      <ServicosClient />
    </>
  )
}
