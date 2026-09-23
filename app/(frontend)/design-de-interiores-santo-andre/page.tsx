import type { Metadata } from 'next'
import { SantoAndreClient } from './SantoAndreClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/design-de-interiores-santo-andre`

export const metadata: Metadata = {
  title: 'Design de Interiores em Santo André e ABC | Aracá Interiores',
  description:
    'Escritório de design de interiores em Santo André. Projetos residenciais biofílicos e reformas de alto padrão no Bairro Jardim, Campestre e ABC. Fale conosco.',
  keywords: [
    'designer de interiores em santo andre',
    'design de interiores abc',
    'arquiteto de interiores santo andre',
    'projetos de interiores santo andre',
    'escritorio de design de interiores abc',
    'reforma de interiores santo andre',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores em Santo André e ABC | Aracá Interiores',
    description:
      'Projetos autorais de interiores, design biofílico e reformas de alto padrão em Santo André e no ABC Paulista. Agende sua consultoria.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores em Santo André — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores em Santo André e ABC | Aracá Interiores',
    description:
      'Projetos autorais de interiores e reformas de alto padrão em Santo André e ABC Paulista.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function SantoAndrePage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: 'Aracá Interiores — Santo André & ABC',
    url: canonical,
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
      { '@type': 'AdministrativeArea', name: 'Bairro Jardim' },
      { '@type': 'AdministrativeArea', name: 'Vila Bastos' },
      { '@type': 'AdministrativeArea', name: 'Vila Assunção' },
      { '@type': 'AdministrativeArea', name: 'Campestre' },
    ],
    description:
      'Estúdio de design de interiores e arquitetura em Santo André especializado em projetos biofílicos, sustentáveis e reformas residenciais completas no ABC.',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quanto custa contratar um designer de interiores ou arquiteto em Santo André?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O valor de um projeto de design de interiores em Santo André varia de acordo com a metragem do espaço, o tipo de intervenção (reforma completa com demolição ou apenas repaginação de interiores) e o nível de detalhamento de marcenaria e iluminação. Na Aracá Interiores trabalhamos com propostas transparentes e personalizadas — entre em contato para uma avaliação sem compromisso.',
        },
      },
      {
        '@type': 'Question',
        name: 'O que é design biofílico e como ele se aplica aos imóveis em Santo André?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O design biofílico integra elementos naturais — luz do sol, vegetação, ventilação cruzada, pedras e madeiras naturais — aos ambientes internos. Em apartamentos e casas de Santo André, ele proporciona maior conforto térmico, saúde e bem-estar para a rotina familiar, conectando a vida urbana à natureza.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Aracá faz acompanhamento e gestão de obras no ABC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim. Além do projeto executivo completo, temos equipe própria para gestão e fiscalização de obra em Santo André, São Caetano e São Bernardo do Campo. Supervisionamos os prestadores de serviço e fornecedores locais para garantir qualidade e cumprimento de prazos do início ao acabamento.',
        },
      },
      {
        '@type': 'Question',
        name: 'Em quais bairros de Santo André a Aracá mais atua?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Atendemos com presença constante em bairros como Bairro Jardim, Vila Bastos, Vila Assunção, Campestre, Parque Jaçatuba, Vila Gilda, Casa Branca, Valparaíso e condomínios de Santo André e região do ABC.',
        },
      },
      {
        '@type': 'Question',
        name: 'Vocês atendem outras cidades do Grande ABC além de Santo André?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Atendemos toda a região do Grande ABC: Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá e Ribeirão Pires, além de projetos selecionados na capital paulista.',
        },
      },
    ],
  }

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
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
        name: 'Design de Interiores em Santo André',
        item: canonical,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <SantoAndreClient />
    </>
  )
}
