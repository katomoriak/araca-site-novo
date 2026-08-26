import { SobrePageContent } from '@/components/sobre/SobrePageContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: 'Sobre a Aracá Interiores | Arquitetos em Santo André',
  description:
    'Conheça a Aracá Interiores, seu escritório de arquitetura e designer de interiores em Santo André e São Paulo SP. Especialistas em projetos residenciais e comerciais sob medida.',
  alternates: {
    canonical: `${baseUrl}/sobre`,
  },
}

export default function SobrePage() {
  return <SobrePageContent />
}
