import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/payload'
import { getProjetosCached } from '@/lib/projetos-server'
import { MOCK_POSTS } from '@/lib/blog-mock'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aracainteriores.com.br'

const BLOG_CATEGORIES = ['design', 'dev', 'tutorial', 'news'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projetos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  let blogUrls: MetadataRoute.Sitemap = []
  let authorUrls: MetadataRoute.Sitemap = []
  const categoryUrls: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((slug) => ({
    url: `${baseUrl}/blog/categoria/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  let projetoUrls: MetadataRoute.Sitemap = []
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
  try {
    const projetos = await getProjetosCached()
    projetoUrls = projetos.map((p) => ({
      url: `${baseUrl}/projetos/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // fallback
  }

  return [...staticPages, ...projetoUrls, ...blogUrls, ...categoryUrls, ...authorUrls]
}
