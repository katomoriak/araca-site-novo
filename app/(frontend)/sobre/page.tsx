import { SobrePageContent } from '@/components/sobre/SobrePageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: 'Sobre a Aracá Interiores | Decoradores e Designers de Interiores no Grande ABC e em São Paulo',
  description:
    'Conheça a Aracá Interiores, seu escritório de Decoração e Design de Interiores no Grande ABC e em São Paulo. Especialistas em projetos residenciais e comerciais sob medida.',
  alternates: {
    canonical: `${baseUrl}/sobre`,
  },
}

export default function SobrePage() {
  return <SobrePageContent />
}
