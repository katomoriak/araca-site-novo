import { getProjetosCachedForProjectsPage } from '@/lib/projetos-server'
import { projetosContent } from '@/content/projetos'
import { ProjetosHero } from '@/components/projetos/ProjetosHero'
import { ProjetosGrid } from '@/components/projetos/ProjetosGrid'

export const dynamic = 'force-static'
export const revalidate = 60

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata = {
  title: { absolute: 'Projetos de Interiores e Portfólio | Aracá Interiores' },
  description:
    'Conheça nosso portfólio autoral de projetos de interiores residenciais e comerciais em SP e ABC. Projetos exclusivos do conceito à obra.',
  alternates: {
    canonical: `${baseUrl}/projetos`,
  },
}

const projetosSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}/projetos#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: `${baseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projetos',
          item: `${baseUrl}/projetos`,
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${baseUrl}/projetos#webpage`,
      url: `${baseUrl}/projetos`,
      name: 'Projetos de Interiores e Portfólio | Aracá Interiores',
      description:
        'Conheça nosso portfólio autoral de projetos de interiores residenciais e comerciais em SP e ABC. Projetos exclusivos do conceito à obra.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Aracá Interiores',
        url: baseUrl,
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${baseUrl}/projetos#itemlist`,
      name: 'Portfólio de Projetos Aracá Interiores',
      description: 'Projetos autorais de interiores residenciais e de alto padrão.',
      numberOfItems: 6,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Apto. Elysée',
          url: `${baseUrl}/projetos/apto_elysee`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Cozinha Oxalá',
          url: `${baseUrl}/projetos/cozinha_oxala`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Casa Alinho',
          url: `${baseUrl}/projetos/casa-alinho`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Residência Feijó',
          url: `${baseUrl}/projetos/resindencia_feijo`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Veraneio Ninho Verde',
          url: `${baseUrl}/projetos/veraneio-ninho-verde`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Projeto Apto. Black',
          url: `${baseUrl}/projetos/projetoaptoblack`,
        },
      ],
    },
  ],
}

export default async function ProjetosPage() {
  const projects = await getProjetosCachedForProjectsPage()
  const { hero } = projetosContent

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projetosSchema) }}
      />
      <ProjetosHero
        title={hero.title}
        subtitle={hero.subtitle}
        heroImage={hero.heroImage}
      />
      <ProjetosGrid projects={projects} />
    </>
  )
}
