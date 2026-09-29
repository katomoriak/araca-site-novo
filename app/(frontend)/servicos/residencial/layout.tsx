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

const residentialSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Design de Interiores Residencial | Aracá Interiores',
      description:
        'Projetos de interiores para casas e apartamentos no Grande ABC e SP. Ambientes acolhedores, funcionais e sob medida para seu lar.',
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
          name: 'Serviços',
          item: `${baseUrl}/servicos`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Residencial',
          item: canonical,
        },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'Design de Interiores Residencial',
      name: 'Projetos de Interiores para Casas e Apartamentos',
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
        'Projetos autorais de interiores para casas, apartamentos, penthouses e coberturas no Grande ABC e São Paulo.',
    },
  ],
}

export default function ResidentialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residentialSchema) }}
      />
      {children}
    </>
  )
}

