import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/servicos/comercial-corporativo`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores Comercial e Corporativo | Aracá',
  },
  description:
    'Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Ambientes corporativos modernos que valorizam a sua marca.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores Comercial e Corporativo | Aracá',
    description:
      'Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Ambientes corporativos modernos que valorizam a sua marca.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
}

const commercialSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Design de Interiores Comercial & Corporativo | Aracá Interiores',
      description:
        'Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Espaços corporativos que valorizam a sua marca.',
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
          name: 'Comercial & Corporativo',
          item: canonical,
        },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'Design de Interiores Comercial e Corporativo',
      name: 'Projetos de Interiores para Escritórios, Clínicas e Lojas',
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
        'Projetos corporativos e comerciais autorais com foco em ergonomia NR-17, acústica e identidade visual corporativa no Grande ABC e SP.',
    },
  ],
}

export default function ComercialCorporativoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(commercialSchema) }}
      />
      {children}
    </>
  )
}

