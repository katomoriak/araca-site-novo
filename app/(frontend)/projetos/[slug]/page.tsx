import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjetosCached, getProjetoBySlug } from '@/lib/projetos-server'
import { ProjetoDetailContent } from '@/components/projetos/ProjetoDetailContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aracainteriores.com.br'

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
  const projects = await getProjetosCached()
  return projects.map((p) => ({ slug: p.id }))
}

export default async function ProjetoPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjetoBySlug(slug)
  if (!project) notFound()

  return <ProjetoDetailContent project={project} />
}
