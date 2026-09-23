import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjetosCachedForProjectsPage, getProjetoBySlug } from '@/lib/projetos-server'
import { ProjetoDetailContent } from '@/components/projetos/ProjetoDetailContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjetoBySlug(slug)
  if (!project) return { title: 'Projeto não encontrado' }
  const url = `${baseUrl}/projetos/${slug}`
  return {
    title: project.title,
    description: project.description || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      type: 'website' as const,
      url,
      ...(project.coverImage && {
        images: [
          {
            url: project.coverImage.startsWith('http') ? project.coverImage : `${baseUrl}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      }),
    },
  }
}

export async function generateStaticParams() {
  const projects = await getProjetosCachedForProjectsPage()
  return projects.map((p) => ({ slug: p.id }))
}

export default async function ProjetoPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjetoBySlug(slug)
  if (!project) notFound()

  const projectUrl = `${baseUrl}/projetos/${slug}`
  const coverImageUrl = project.coverImage
    ? (project.coverImage.startsWith('http')
        ? project.coverImage
        : `${baseUrl}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`)
    : `${baseUrl}/projetos/areasocial_residencia-ninhoverce/cover.png`

  const projectSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://www.araca.arq.br/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projetos',
            item: 'https://www.araca.arq.br/projetos',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
      {
        '@type': 'CreativeWork',
        name: `Projeto de Interiores ${project.title}`,
        description:
          project.description ||
          `Projeto autoral de design de interiores ${project.title} desenvolvido pelo estúdio Aracá Interiores.`,
        url: projectUrl,
        image: coverImageUrl,
        creator: {
          '@id': 'https://www.araca.arq.br/#organization',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ProjetoDetailContent project={project} />
    </>
  )
}
