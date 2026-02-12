import { getProjetosCached } from '@/lib/projetos-server'
import { projetosContent } from '@/content/projetos'
import { ProjetosHero } from '@/components/projetos/ProjetosHero'
import { ProjetosGrid } from '@/components/projetos/ProjetosGrid'

export const revalidate = 60

export const metadata = {
  title: 'Projetos',
  description:
    'Projetos de interiores residenciais e comerciais da Aracá. Do conceito ao acabamento.',
}

export default async function ProjetosPage() {
  const projects = await getProjetosCached()
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
