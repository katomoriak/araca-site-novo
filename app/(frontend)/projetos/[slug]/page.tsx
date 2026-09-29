import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjetosCachedForProjectsPage, getProjetoBySlug } from '@/lib/projetos-server'
import { ProjetoDetailContent, type NavProjectItem } from '@/components/projetos/ProjetoDetailContent'
import { getProjectRichData, getSeoImageAlt } from '@/content/projetos-rich-data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjetoBySlug(slug)
  if (!project) return { title: 'Projeto não encontrado | Aracá Interiores' }

  const richData = getProjectRichData(slug, {
    title: project.title,
    description: project.description,
    tag: project.tag,
  })

  const url = `${baseUrl}/projetos/${slug}`
  const pageTitle =
    slug === 'apto_elysee'
      ? 'Apto. Elysée: Interiores Clássico & Neoclássico | Aracá'
      : slug === 'cozinha_oxala'
      ? 'Cozinha Oxalá | Rústico e Ladrilho Português | Aracá'
      : slug === 'casa-alinho'
      ? 'Casa Alinho: Gatificação e Design Pet-Friendly | Aracá'
      : slug === 'resindencia_feijo'
      ? 'Residência Feijó: Interiores em Jardim São Caetano | Aracá'
      : slug === 'veraneio-ninho-verde'
      ? 'Veraneio Ninho Verde: Casa de Campo e Lazer | Aracá'
      : slug === 'projetoaptoblack'
      ? 'Projeto Apto. Black: Interiores no Brooklin | Aracá'
      : `${project.title} | Projeto de Interiores | Aracá`

  const metaDescription =
    richData.subtitle ||
    `Conheça o projeto autoral ${project.title} (${richData.specs.localizacao}), desenvolvido com exclusividade pelo estúdio Aracá Interiores.`

  const imageUrl = project.coverImage
    ? project.coverImage.startsWith('http')
      ? project.coverImage
      : `${baseUrl}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`
    : `${baseUrl}/projetos/areasocial_residencia-ninhoverce/cover.png`

  return {
    title: { absolute: pageTitle },
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    keywords: [
      ...richData.seoKeywords,
      project.title,
      `projeto ${project.title}`,
      richData.specs.tipo,
      richData.specs.localizacao,
      richData.tag,
      'design de interiores',
      'arquiteto de interiores',
      'aracá interiores',
      'reforma de interiores residencial',
      'decoração e marcenaria de alto padrão',
    ],
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      type: 'article',
      url,
      siteName: 'Aracá Interiores',
      publishedTime: `${richData.specs.ano}-01-15T09:00:00-03:00`,
      modifiedTime: '2026-09-29T16:00:00-03:00',
      authors: ['Marcos & Rafaela — Aracá Interiores'],
      tags: [richData.tag, richData.specs.tipo, 'Design de Interiores'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: getSeoImageAlt('Capa do Projeto', project.title, richData.specs.localizacao, richData.tag, 0),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: metaDescription,
      images: [imageUrl],
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

  const allProjects = await getProjetosCachedForProjectsPage()
  const currentIndex = allProjects.findIndex((p) => p.id === slug)

  let prevProject: NavProjectItem | null = null
  let nextProject: NavProjectItem | null = null

  if (allProjects.length > 1 && currentIndex !== -1) {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : allProjects.length - 1
    const nextIdx = (currentIndex + 1) % allProjects.length

    if (prevIdx !== currentIndex) {
      prevProject = {
        slug: allProjects[prevIdx].id,
        title: allProjects[prevIdx].title,
        coverImage: allProjects[prevIdx].coverImage,
        tag: allProjects[prevIdx].tag,
      }
    }

    if (nextIdx !== currentIndex) {
      nextProject = {
        slug: allProjects[nextIdx].id,
        title: allProjects[nextIdx].title,
        coverImage: allProjects[nextIdx].coverImage,
        tag: allProjects[nextIdx].tag,
      }
    }
  }

  const otherProjects: NavProjectItem[] = allProjects
    .filter((p) => p.id !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.id,
      title: p.title,
      coverImage: p.coverImage,
      tag: p.tag,
    }))

  const richData = getProjectRichData(slug, {
    title: project.title,
    description: project.description,
    tag: project.tag,
  })

  const projectUrl = `${baseUrl}/projetos/${slug}`
  const coverImageUrl = project.coverImage
    ? project.coverImage.startsWith('http')
      ? project.coverImage
      : `${baseUrl}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`
    : `${baseUrl}/projetos/areasocial_residencia-ninhoverce/cover.png`

  // Mapeamento das imagens com ImageObject otimizado para o Google Imagens
  const galleryImageObjects = (project.media ?? []).slice(0, 30).map((m, idx) => {
    const imageSeoTitle = getSeoImageAlt(
      m.name,
      project.title,
      richData.specs.localizacao,
      richData.tag,
      idx
    )
    return {
      '@type': 'ImageObject',
      contentUrl: m.url,
      url: m.url,
      caption: imageSeoTitle,
      name: imageSeoTitle,
      description: `${m.name || project.title} no projeto de design de interiores ${project.title} (${richData.specs.localizacao}) realizado pelo estúdio Aracá Interiores.`,
      representativeOfPage: idx === 0,
      encodingFormat: m.type === 'video' ? 'video/mp4' : 'image/jpeg',
    }
  })

  const projectSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Breadcrumbs
      {
        '@type': 'BreadcrumbList',
        '@id': `${projectUrl}#breadcrumb`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },

      // 2. Artigo Editorial / Estudo de Caso (formato Blog/Article para Google Search e Discover)
      {
        '@type': ['Article', 'BlogPosting'],
        '@id': `${projectUrl}#editorial`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'Aracá Interiores',
          url: baseUrl,
        },
        headline: `${project.title} — ${richData.subtitle}`,
        description: richData.conceito,
        articleBody: `${richData.conceito}\n\nO Desafio do Espaço: ${richData.desafio}\n\nA Resposta da Arquitetura: ${richData.solucao}\n\nDestaques: ${richData.destaques.join(', ')}`,
        url: projectUrl,
        mainEntityOfPage: projectUrl,
        inLanguage: 'pt-BR',
        datePublished: `${richData.specs.ano}-01-15T09:00:00-03:00`,
        dateModified: '2026-09-29T16:00:00-03:00',
        author: {
          '@type': 'Person',
          name: 'Marcos & Rafaela',
          jobTitle: 'Designers de Interiores e Sócios-Fundadores',
          url: `${baseUrl}/sobre`,
          worksFor: {
            '@type': 'Organization',
            name: 'Aracá Interiores',
            url: baseUrl,
          },
        },
        publisher: {
          '@type': 'Organization',
          name: 'Aracá Interiores',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logotipos/LOGOTIPO%20REDONDO@300x.png`,
          },
        },
        image: galleryImageObjects,
        keywords: [
          ...richData.seoKeywords,
          project.title,
          richData.specs.tipo,
          richData.specs.localizacao,
          richData.tag,
          'Aracá Interiores',
          'Design de Interiores',
          'Arquitetura de Interiores',
          'Reforma Residencial',
          'Marcenaria sob Medida',
        ],
        about: {
          '@type': 'Place',
          name: richData.specs.localizacao,
          address: {
            '@type': 'PostalAddress',
            addressLocality: richData.specs.localizacao,
            addressCountry: 'BR',
          },
        },
      },

      // 3. Obra Arquitetônica / Trabalho Criativo
      {
        '@type': 'CreativeWork',
        '@id': `${projectUrl}#creativework`,
        name: `Projeto ${project.title}`,
        headline: richData.subtitle,
        description: richData.conceito,
        url: projectUrl,
        image: coverImageUrl,
        genre: richData.specs.tipo,
        spatialCoverage: richData.specs.localizacao,
        dateCreated: richData.specs.ano,
        creator: {
          '@type': 'Organization',
          name: 'Aracá Interiores',
          url: baseUrl,
          '@id': `${baseUrl}/#organization`,
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
      <ProjetoDetailContent
        project={project}
        richData={richData}
        prevProject={prevProject}
        nextProject={nextProject}
        otherProjects={otherProjects}
      />
    </>
  )
}
