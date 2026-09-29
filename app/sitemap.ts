import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/payload'
import { getProjetosCached } from '@/lib/projetos-server'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { LOCATIONS } from '@/lib/seo-locations'
import { PROJECTS_RICH_DATA } from '@/content/projetos-rich-data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

const BLOG_CATEGORIES = ['design', 'dev', 'tutorial', 'news'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projetos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/servicos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/servicos/residencial`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/servicos/comercial-corporativo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/servicos/gestao-acompanhamento-de-obra`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // Subpáginas Temáticas Residenciais
    { url: `${baseUrl}/servicos/residencial/casas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/servicos/residencial/apartamentos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/servicos/residencial/coberturas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/servicos/residencial/reformas-retrofit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    // Subpáginas Temáticas Comerciais & Corporativas
    { url: `${baseUrl}/servicos/comercial-corporativo/escritorios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/servicos/comercial-corporativo/clinicas-consultorios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/servicos/comercial-corporativo/lojas-varejo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    // Ferramentas & Páginas Estratégicas de Conversão
    { url: `${baseUrl}/design-de-interiores-sao-paulo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/design-de-interiores-santo-andre`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/reforma-de-interiores-residencial`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/quanto-custa-reformar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/calculadora-custo-projeto-design-interiores`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/design-de-interiores-classico-neoclassico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/tabela-cub-sinapi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.90 },
    { url: `${baseUrl}/politica-privacidade`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/termos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // SEO Local — cidades secundárias
    ...LOCATIONS.filter((loc) => !loc.customPath).map((loc) => ({
      url: `${baseUrl}/arquitetura-interiores-${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ]

  let blogUrls: MetadataRoute.Sitemap = []
  let authorUrls: MetadataRoute.Sitemap = []
  const categoryUrls: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((slug) => ({
    url: `${baseUrl}/blog/categoria/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const allProjectSlugs = new Set<string>(Object.keys(PROJECTS_RICH_DATA))

  try {
    const projetos = await getProjetosCached()
    projetos.forEach((p) => {
      if (p.id) allProjectSlugs.add(p.id)
    })
  } catch {
    // fallback
  }

  const projetoUrls: MetadataRoute.Sitemap = Array.from(allProjectSlugs).map((slug) => ({
    url: `${baseUrl}/projetos/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  try {
    const posts = await getPosts()
    blogUrls = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    if (posts.length > 0) {
      const authorIds = [...new Set(posts.map((p) => (p.author && typeof p.author === 'object' && 'id' in p.author ? String((p.author as { id: string }).id) : null)).filter(Boolean) as string[])]
      authorUrls = authorIds.map((id) => ({
        url: `${baseUrl}/blog/autor/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // fallback: build sem DB — incluir slugs do mock para não deixar sitemap sem posts
    blogUrls = MOCK_POSTS.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    const mockAuthorIds = [...new Set(MOCK_POSTS.map((p) => (p.author as { id?: string })?.id).filter(Boolean) as string[])]
    if (mockAuthorIds.length > 0) {
      authorUrls = mockAuthorIds.map((id) => ({
        url: `${baseUrl}/blog/autor/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  }

  return [...staticPages, ...projetoUrls, ...blogUrls, ...categoryUrls, ...authorUrls]
}
