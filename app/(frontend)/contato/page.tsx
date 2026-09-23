import { ContatoPageContent } from '@/components/contato/ContatoPageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: 'Contato e Orçamento | Aracá Interiores',
  description:
    'Entre em contato com a Aracá Interiores. Envie sua mensagem ou fale por e-mail e WhatsApp. Projetos de interiores residenciais e comerciais.',
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
