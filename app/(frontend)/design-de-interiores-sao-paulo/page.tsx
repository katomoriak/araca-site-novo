import type { Metadata } from 'next'
import { SaoPauloClient } from './SaoPauloClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/design-de-interiores-sao-paulo`

export const metadata: Metadata = {
  title: 'Designer de Interiores em São Paulo SP | Aracá Interiores',
  description:
    'Escritório de design de interiores em São Paulo. Projetos residenciais de alto padrão e reformas executivas nos Jardins, Moema, Pinheiros e Itaim. Fale conosco.',
  keywords: [
    'designer de interiores sp',
    'escritorio de design de interiores sp',
    'design de interiores sp capital',
    'arquiteto de interiores sp',
    'reforma de alto padrao sao paulo',
    'design de interiores jardins moema',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Designer de Interiores em São Paulo SP | Aracá Interiores',
    description:
      'Projetos autorais de interiores e reformas de alto padrão na capital paulista. Jardins, Moema, Pinheiros, Itaim e região. Agende sua consultoria.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Designer de Interiores em São Paulo — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Designer de Interiores em São Paulo SP | Aracá Interiores',
    description:
      'Projetos autorais de interiores e reformas de alto padrão na capital paulista.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function SaoPauloPage() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: 'Aracá Interiores — São Paulo',
    url: canonical,
    telephone: '+5511939155979',
    email: 'contato@araca.arq.br',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'AdministrativeArea', name: 'Moema' },
      { '@type': 'AdministrativeArea', name: 'Pinheiros' },
      { '@type': 'AdministrativeArea', name: 'Jardins' },
      { '@type': 'AdministrativeArea', name: 'Itaim Bibi' },
      { '@type': 'AdministrativeArea', name: 'Vila Nova Conceição' },
      { '@type': 'AdministrativeArea', name: 'Perdizes' },
    ],
    description:
      'Escritório de arquitetura e design de interiores em São Paulo especializado em projetos residenciais de alto padrão, design biofílico e reformas completas.',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Como funciona a contratação de um designer de interiores em São Paulo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O processo começa com uma reunião de alinhamento e briefing (presencial ou online) e visita técnica ao imóvel. Em seguida, desenvolvemos o estudo de layout preliminar, modelagem 3D fotorrealista e, após sua aprovação, o caderno executivo técnico completo com detalhamento de marcenaria, iluminação, gesso, elétrica e hidráulica.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Aracá faz acompanhamento e gestão de obras em apartamentos na capital de SP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim. Atuamos com gestão completa e acompanhamento técnico de obras em condomínios da capital. Cuidamos da emissão de RRT/ART, compatibilização com as regras de reforma do prédio (ABNT NBR 16.280), cronograma físico-financeiro e fiscalização do padrão de acabamento dos fornecedores.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais bairros de São Paulo a Aracá Interiores atende?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Atendemos toda a capital paulista, com forte atuação em bairros como Moema, Pinheiros, Vila Madalena, Jardins, Itaim Bibi, Vila Nova Conceição, Brooklin, Campo Belo, Perdizes, Higienópolis e Santana, além de condomínios fechados da Grande SP.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo leva para desenvolver um projeto de interiores residencial em SP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Em média, o desenvolvimento do projeto completo (do conceito criativo 3D até a entrega de todos os cadernos executivos para os prestadores de obra) leva entre 45 e 75 dias, dependendo da metragem do imóvel e da agilidade nos feedbacks do cliente.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual o investimento para contratar o escritório Aracá Interiores?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O valor do projeto é calculado de acordo com a área do imóvel (m²), complexidade da intervenção estrutural e escopo contratado (apenas projeto executivo ou projeto com gestão de obra). Trabalhamos com propostas transparentes e personalizadas — entre em contato para receber um orçamento detalhado.',
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
        name: 'Design de Interiores em São Paulo',
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
      <SaoPauloClient />
    </>
  )
}
