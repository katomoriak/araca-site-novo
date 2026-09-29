import { ContatoPageContent } from '@/components/contato/ContatoPageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: { absolute: 'Contato e Orçamento de Projetos | Aracá Interiores' },
  description:
    'Fale com a Aracá Interiores e solicite uma proposta personalizada de projeto de interiores residencial ou comercial em São Paulo e no ABC.',
  alternates: {
    canonical: `${baseUrl}/contato`,
  },
}

const contatoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://www.araca.arq.br/contato#webpage',
      url: 'https://www.araca.arq.br/contato',
      name: 'Contato e Orçamento | Aracá Interiores',
      mainEntity: {
        '@type': 'ContactPoint',
        telephone: '+5511939155979',
        contactType: 'customer service',
        email: 'contato@araca.arq.br',
        availableLanguage: 'Portuguese',
      },
    },
  ],
}

export default function ContatoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contatoSchema) }}
      />
      <ContatoPageContent />
    </>
  )
}
