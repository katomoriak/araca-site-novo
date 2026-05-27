import type { Metadata } from 'next'
import { ArquitetoSantoAndreClient } from './ArquitetoSantoAndreClient'

/* ─────────────────────────────────────────────
   Metadata & SEO (Server-side)
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Arquiteto em Santo André | Aracá Interiores — Design Biofílico',
  description: 'Aracá Interiores atua em Santo André com projetos de design de interiores, arquitetura biofílica e sustentável. Residencial, comercial, reforma e construção. Solicite seu orçamento.',
  alternates: {
    canonical: 'https://araca.arq.br/arquiteto-em-santo-andre/',
  },
  openGraph: {
    title: 'Arquiteto em Santo André | Aracá Interiores',
    description: 'Design de Interiores Biofílico e Sustentável em Santo André. Projetos que conectam pessoas e natureza.',
    url: 'https://araca.arq.br/arquiteto-em-santo-andre/',
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  }
}

/* ─────────────────────────────────────────────
   Page Component (Server Component)
───────────────────────────────────────────── */
export default function ArquitetoSantoAndrePage() {
  
  // Schema Markups
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    "name": "Aracá Interiores",
    "url": "https://araca.arq.br/arquiteto-em-santo-andre/",
    "telephone": "+5511997458464",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santo André",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "areaServed": ["Santo André", "São Bernardo do Campo", "São Caetano do Sul", "Grande ABC"],
    "description": "Estúdio de design de interiores em Santo André especializado em projetos biofílicos e sustentáveis.",
    "priceRange": "$$"
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa contratar um arquiteto ou designer de interiores em Santo André?",
        "acceptedAnswer": { 
          "@type": "Answer", 
          "text": "O valor de um projeto de design de interiores ou arquitetura em Santo André varia de acordo com o tipo de projeto (residencial ou comercial), a metragem do espaço e o nível de detalhamento necessário. Na Aracá Interiores trabalhamos com orçamentos personalizados — entre em contato para uma avaliação sem compromisso." 
        }
      },
      {
        "@type": "Question",
        "name": "O que é design biofílico e como ele se aplica a projetos em Santo André?",
        "acceptedAnswer": { 
          "@type": "Answer", 
          "text": "O design biofílico é uma abordagem que integra elementos naturais — luz, vegetação, materiais orgânicos, água e ventilação natural — ao projeto de interiores ou arquitetônico. Aplicado a projetos em Santo André, ele transforma apartamentos, casas e escritórios em ambientes mais saudáveis, confortáveis e visualmente únicos, sem abrir mão da funcionalidade do dia a dia." 
        }
      },
      {
        "@type": "Question",
        "name": "A Aracá acompanha a obra em Santo André?",
        "acceptedAnswer": { 
          "@type": "Answer", 
          "text": "Sim. Além do projeto completo, oferecemos serviço de gestão e acompanhamento de obra em Santo André e na região do ABC. Nossa equipe supervisiona a execução para garantir fidelidade ao projeto e qualidade na entrega — do início ao acabamento final." 
        }
      },
      {
        "@type": "Question",
        "name": "Vocês atendem além de Santo André?",
        "acceptedAnswer": { 
          "@type": "Answer", 
          "text": "Sim, atendemos toda a região do Grande ABC — Santo André, São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão Pires e Rio Grande da Serra — além de outras regiões da Grande São Paulo. Consulte nossa disponibilidade para o seu projeto." 
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona um projeto de design de interiores sustentável?",
        "acceptedAnswer": { 
          "@type": "Answer", 
          "text": "Começamos com uma conversa para entender o espaço, o estilo de vida e os objetivos do cliente. Em seguida, desenvolvemos o projeto com foco em materiais sustentáveis, aproveitamento de luz natural e integração com elementos naturais. O cliente aprova cada etapa antes da execução, garantindo total controle sobre o resultado final." 
        }
      }
    ]
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
      <ArquitetoSantoAndreClient />
    </>
  )
}
