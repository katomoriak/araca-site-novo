import { getProjetosCachedForProjectsPage } from '@/lib/projetos-server'
import { projetosContent } from '@/content/projetos'
import { ProjetosHero } from '@/components/projetos/ProjetosHero'
import { ProjetosGrid } from '@/components/projetos/ProjetosGrid'

export const revalidate = 60

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://araca.arq.br'

export const metadata = {
  title: 'Projetos',
  description:
    'Projetos de interiores residenciais e comerciais da Aracá. Do conceito ao acabamento.',
  alternates: {
    canonical: `${baseUrl}/projetos`,
  },
}

export default async function ProjetosPage() {
  const projects = await getProjetosCachedForProjectsPage()
  const { hero } = projetosContent

  return (
    <>
      <ProjetosHero
        title={hero.title}
        subtitle={hero.subtitle}
        heroImage={hero.heroImage}
      />
      <ProjetosGrid projects={projects} />
    </>
  )
}
