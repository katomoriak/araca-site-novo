import type { Metadata } from 'next'
import { QuantoCustaReformarClient } from './QuantoCustaReformarClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/quanto-custa-reformar`

export const metadata: Metadata = {
  title: {
    absolute: 'Quanto Custa Reformar? Simule Agora | Aracá Interiores',
  },
  description:
    'Descubra quanto custa fazer reforma em São Paulo e no ABC. Simule custos por m² ou cômodos com a Aracá Interiores online!',
  keywords: [
    'quanto custa fazer uma reforma',
    'quanto custa reformar',
    'quanto custa reformar apartamento',
    'quanto custa reformar casa',
    'calculadora de custo de reforma',
    'calculadora reforma apartamento',
    'estimativa custo reforma m2 sao paulo',
    'preco reforma apartamento sp',
    'orcamento de reforma residencial',
    'calculadora reforma interativa',
    'araca interiores',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Quanto Custa Reformar? Simule Agora | Aracá Interiores',
    description:
      'Descubra quanto custa fazer reforma em São Paulo e no ABC. Simule custos por m² ou cômodos com a Aracá Interiores online!',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculadora de Custo de Reforma — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quanto Custa Reformar? Simule Agora | Aracá Interiores',
    description:
      'Descubra quanto custa fazer reforma em São Paulo e no ABC. Simule custos por m² ou cômodos com a Aracá Interiores online!',
    images: ['/hero-interiores.jpg'],
  },
}

export default function QuantoCustaReformarPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Estimativa de Custo de Reforma Aracá Interiores',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    url: canonical,
    description:
      'Ferramenta interativa para estimativa e simulação paramétrica de custos de reforma residencial e comercial por m² e por ambientes em São Paulo e Grande ABC.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    author: {
      '@type': 'Organization',
      name: 'Aracá Interiores',
      url: baseUrl,
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quanto custa fazer uma reforma em São Paulo e no Grande ABC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O custo para fazer uma reforma varia conforme o padrão de acabamento por m²: 1) Padrão Essencial / Revitalização (R$ 1.250 a R$ 1.800/m² - pintura geral, reparos pontuais sem demolição pesada); 2) Custo-Benefício Inteligente (R$ 2.050 a R$ 2.850/m² - pisos funcionais, novos pontos elétricos/hidráulicos e marcenaria planejada essencial); 3) Médio Padrão (R$ 3.100 a R$ 4.300/m² - porcelanatos grandes, gesso com luz cênica, bancadas em quartzo e marcenaria completa); 4) Alto Padrão (R$ 5.200 a R$ 7.800+/m² - grandes lastras, climatização e marcenaria autoral). Em um imóvel de 70m², o investimento médio varia de R$ 90 mil a mais de R$ 400 mil.',
        },
      },
      {
        '@type': 'Question',
        name: 'Por que o custo por m² de banheiros e cozinhas é muito maior do que salas e quartos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Banheiros e cozinhas são denominados áreas molhadas. Nesses cômodos concentram-se a maior densidade de custos: impermeabilização obrigatória de contrapiso e paredes, revestimento de todas as faces verticais, bancadas maciças de pedra com cubas esculpidas, registros de pressão, encanamentos de água quente e fria, louças sanitárias, metais finos e marcenaria de alta resistência com ferragens especiais.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais etapas costumam encarecer o orçamento de uma reforma?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Os três itens de maior peso financeiro são: 1) Marcenaria sob medida (pode representar de 20% a 30% do orçamento total dependendo da quantidade de armários e painéis ripados); 2) Pisos e Revestimentos de grandes formatos com mão de obra qualificada de assentamento; 3) Marmoraria nobre (ilhas em quartzos, Dekton ou mármores exóticos). Alterações não planejadas no meio da obra também encarecem o custo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como funciona a estimativa da calculadora? Ela garante o preço final ou vincula a contratação?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. A calculadora fornece uma estimativa de custo preliminar e paramétrica meramente informativa para planejamento financeiro, sem constituir cotação comercial fechada ou proposta vinculante (Arts. 30 e 35 do CDC e Arts. 186/927 do Código Civil). O orçamento executivo formal exige a elaboração de Projeto de Design de Interiores Executivo e vistoria técnica presencial.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Aracá Interiores é formada por arquitetos ou designers de interiores e decoradores?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Aracá Interiores é um estúdio de Designers de Interiores e Decoradores. Focamos no bem-estar, estética, 3D, marcenaria sob medida e harmonização dos espaços. Quando a reforma em condomínio exige ART ou RRT (conforme a ABNT NBR 16.280), ela é emitida em parceria com engenheiros e arquitetos credenciados parceiros.',
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
        name: 'Serviços',
        item: `${baseUrl}/servicos`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Quanto Custa Reformar',
        item: canonical,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <QuantoCustaReformarClient />
    </>
  )
}
