import type { Metadata } from 'next'
import { ClassicoClient } from './ClassicoClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/design-de-interiores-classico-neoclassico`

export const metadata: Metadata = {
  title: {
    absolute: 'Design de Interiores Clássico e Neoclássico | Aracá Interiores',
  },
  description:
    'Especialistas em design de interiores clássico e neoclássico contemporâneo em SP.',
  keywords: [
    'design de interiores classico',
    'interiores neoclassico',
    'decoracao neoclassica sp',
    'arquiteto neoclassico sp',
    'boiserie moderno apartamento',
    'marcenaria classica alto padrao',
    'estilo neoclassico contemporaneo',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Design de Interiores Clássico e Neoclássico | Aracá Interiores',
    description:
      'Especialistas em design de interiores clássico e neoclássico contemporâneo em SP.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://img.araca.arq.br/_thumbs/midias/apto_elysee/Sala%204.jpg_w1200_q80.webp',
        width: 1200,
        height: 630,
        alt: 'Design de Interiores Clássico e Neoclássico — Edifício Elysée — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design de Interiores Clássico e Neoclássico | Aracá Interiores',
    description:
      'Projetos autorais de interiores clássicos e neoclássicos de alto luxo em SP.',
    images: ['https://img.araca.arq.br/_thumbs/midias/apto_elysee/Sala%204.jpg_w1200_q80.webp'],
  },
}

export default function ClassicoNeoclassicoPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores Clássico e Neoclássico de Alto Luxo',
    serviceType: 'Design de Interiores Residencial de Alto Padrão',
    provider: {
      '@type': 'InteriorDesigner',
      name: 'Aracá Interiores',
      url: baseUrl,
      telephone: '+5511939155979',
      email: 'contato@araca.arq.br',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'City', name: 'Santo André' },
      { '@type': 'AdministrativeArea', name: 'Jardins' },
      { '@type': 'AdministrativeArea', name: 'Higienópolis' },
      { '@type': 'AdministrativeArea', name: 'Moema' },
      { '@type': 'AdministrativeArea', name: 'Alphaville' },
      { '@type': 'AdministrativeArea', name: 'Grande ABC' },
    ],
    description:
      'Projetos autorais de design de interiores em estilo clássico e neoclássico contemporâneo. Especialidade em paginação de boiserie, sancas clássicas, marcenaria sob medida com usinagem clássica e ornamentos, pedras e porcelanatos marmorizados nobres e iluminação cênica.',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'O que diferencia o estilo clássico do neoclássico contemporâneo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O estilo clássico tradicional é caracterizado por ornamentos nobres e simetria harmônica. O neoclássico contemporâneo (linguagem da Aracá Interiores) preserva a elegância das molduras de boiserie, rodapés altos e proporções áureas, integrando novos materiais tecnológicos, facilidade de execução, paletas de cores claras e neutras (off-white, fendi, linho), iluminação cênica e mobiliário moderno.',
        },
      },
      {
        '@type': 'Question',
        name: 'É possível aplicar boiserie e linguagem neoclássica em apartamentos modernos com pé-direito padrão (2,50m - 2,70m)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Com certeza! O segredo está no cálculo milimétrico das proporções verticais das molduras. Desenhamos cada requadro de boiserie para alongar a percepção vertical do ambiente, evitando sobrecarga visual e integrando as molduras com interruptores, cabeceiras e portas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual o melhor material para boiserie: gesso tradicional ou poliuretano / poliestireno?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Atualmente recomendamos molduras em poliuretano ou poliestireno de alta densidade. Diferente do gesso antigo, eles são 100% resistentes à umidade, não trincam com facilidade, aceitam qualquer acabamento de tinta e permitem encaixes de meia-esquadria perfeitos e limpos.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como a marcenaria se integra ao estilo clássico sem parecer antiga?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Desenvolvemos marcenaria sob medida com usinagem clássica precisa, molduras e ornamentos elegantes em laca acetinada, combinadas com ferragens de última geração com amortecedores, iluminação LED embutida e mobiliário com estofados almofadados confortáveis.',
        },
      },
      {
        '@type': 'Question',
        name: 'Um projeto neoclássico valoriza o imóvel no mercado de alto padrão?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, expressivamente. A estética clássica e neoclássica é considerada atemporal pelos compradores de imóveis nos bairros mais nobres de São Paulo. Ao contrário de modismos passageiros, ela mantém seu requinte e elegância ao longo de décadas, elevando o valor de liquidez do imóvel.',
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
        name: 'Design de Interiores Clássico e Neoclássico',
        item: canonical,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ClassicoClient />
    </>
  )
}
