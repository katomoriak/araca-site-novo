import { SobrePageContent } from '@/components/sobre/SobrePageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: {
    absolute: 'Sobre a Aracá | Design de Interiores no Grande ABC e SP',
  },
  description:
    'Conheça a Aracá: estúdio de design de interiores no Grande ABC e São Paulo focado em afeto, história e bem-viver.',
  alternates: {
    canonical: `${baseUrl}/sobre`,
  },
}

const sobreSchema = {
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
      '@type': 'AboutPage',
      '@id': 'https://www.araca.arq.br/sobre#webpage',
      url: 'https://www.araca.arq.br/sobre',
      name: 'Sobre a Aracá | Design de Interiores no Grande ABC e SP',
      isPartOf: {
        '@id': 'https://www.araca.arq.br/#website',
      },
      about: {
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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '15',
        bestRating: '5',
        worstRating: '1',
      },
      founder: [
        {
          '@type': 'Person',
          name: 'Marcos Paulo',
          jobTitle: 'Co-fundador & Designer de Interiores',
          description:
            'Especialista em harmonia clássica, proporções atemporais e curadoria de mobiliário.',
        },
        {
          '@type': 'Person',
          name: 'Rafaela Garbuio',
          jobTitle: 'Co-fundadora & Designer de Interiores',
          description:
            'Especialista em maximalismo, texturas, iluminação cênica e ergonomia executiva.',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços de Interiores Aracá',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Projeto Criativo e Conceitual de Interiores',
              description:
                'Estudo de layout, paleta de cores, volumetria 3D e conceito estético sob medida.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Projeto Executivo e Detalhamentos Técnicos',
              description:
                'Plantas técnicas completas, pontos elétricos e hidráulicos, detalhamento de marcenaria e marmoraria.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Reforma Residencial e Acompanhamento de Obra',
              description:
                'Suporte próximo e fiscalização técnica na execução da obra para garantir fidelidade ao projeto.',
            },
          },
        ],
      },
    },
  ],
}

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sobreSchema) }}
      />
      <SobrePageContent />
    </>
  )
}
