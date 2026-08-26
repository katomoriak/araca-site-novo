import { ContatoPageContent } from '@/components/contato/ContatoPageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: 'Contato',
  description:
    'Entre em contato com a Aracá Interiores. Envie sua mensagem ou fale por e-mail e WhatsApp. Projetos de interiores residenciais e comerciais.',
  alternates: {
    canonical: `${baseUrl}/contato`,
  },
}

export default function ContatoPage() {
  return <ContatoPageContent />
}
