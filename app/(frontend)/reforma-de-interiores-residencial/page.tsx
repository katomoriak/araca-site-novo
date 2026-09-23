import type { Metadata } from 'next'
import { ReformaClient } from './ReformaClient'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/reforma-de-interiores-residencial`

export const metadata: Metadata = {
  title: 'Reforma de Interiores Residencial de Alto Padrão | Aracá Interiores',
  description:
    'Reforma completa de apartamentos e casas com projeto executivo detalhado e acompanhamento de obra. Gestão total sem estresse ou atrasos em SP e ABC.',
  keywords: [
    'reforma de interiores',
    'projeto de interiores residencial',
    'escritorio de reformas de alto padrao',
    'reforma de apartamento sp',
    'gestao de obra residencial',
    'gerenciamento de obra apartamento',
    'projeto executivo de reforma',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Reforma de Interiores Residencial de Alto Padrão | Aracá Interiores',
    description:
      'Da concepção executiva à entrega das chaves. Reformas residenciais completas com gestão técnica, controle orçamentário e sem dor de cabeça.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-interiores.jpg',
        width: 1200,
        height: 630,
        alt: 'Reforma de Interiores Residencial — Aracá Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reforma de Interiores Residencial de Alto Padrão | Aracá Interiores',
    description:
      'Reformas residenciais completas com gestão técnica e controle orçamentário em SP e ABC.',
    images: ['/hero-interiores.jpg'],
  },
}

export default function ReformaPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Reforma de Interiores Residencial de Alto Padrão',
    serviceType: 'Reforma e Gestão de Obra Residencial',
    provider: {
      '@type': 'InteriorDesigner',
      name: 'Aracá Interiores',
      url: baseUrl,
      telephone: '+5511939155979',
      email: 'contato@araca.arq.br',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Santo André',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'City', name: 'Santo André' },
      { '@type': 'City', name: 'São Bernardo do Campo' },
      { '@type': 'City', name: 'São Caetano do Sul' },
      { '@type': 'AdministrativeArea', name: 'Grande ABC' },
    ],
    description:
      'Serviço integrado de projeto executivo e gestão de reformas de apartamentos e residências de alto padrão, incluindo demolição, alvenaria, elétrica, marcenaria sob medida e fiscalização de acabamentos.',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Qual a diferença entre contratar apenas um projeto e contratar a reforma com acompanhamento de obra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Com apenas o projeto em mãos, a responsabilidade de orçar, contratar pedreiros, fiscalizar prumos, conferir medidas de marcenaria e resolver imprevistos diários fica sob a responsabilidade do próprio morador. Com a reforma e gestão da Aracá, nossa equipe técnica assume a fiscalização contínua na obra, conferindo execução conforme as plantas executivas e garantindo o padrão contratado.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo dura uma reforma de apartamento de alto padrão?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Em média, a fase de obra dura de 3 a 6 meses após a entrega do projeto executivo e liberação do condomínio, variando conforme a metragem e a complexidade das alterações estruturais e de acabamento.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Aracá emite a documentação necessária para o condomínio (RRT / ART)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim. Todo o processo de emissão de Registro de Responsabilidade Técnica (RRT do CAU ou ART), laudos técnicos exigidos pela ABNT NBR 16.280 e memorial descritivo das intervenções é conduzido por nossa equipe antes do início das obras.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como é feito o controle de custos para evitar surpresas no orçamento?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Desenvolvemos uma planilha orçamentária detalhada com quantitativos exatos de revestimentos, pontos elétricos, marcenaria e louças/metais. Cotamos com fornecedores homologados antes da quebra-quebra, permitindo ao cliente prever o custo total e evitar gastos imprevistos.',
        },
      },
      {
        '@type': 'Question',
        name: 'É possível fazer reforma com apartamento na planta antes da entrega das chaves?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, e é o momento mais recomendado! Desenvolvemos o projeto executivo completo durante a construção do prédio. Assim que as chaves forem entregues e o condomínio liberar o acesso, a obra tem início imediato sem perder meses de espera para planejar.',
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
        name: 'Reforma de Interiores Residencial',
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
      <ReformaClient />
    </>
  )
}
