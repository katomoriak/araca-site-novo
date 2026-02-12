import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/payload'
import { getProjetosCached } from '@/lib/projetos-server'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aracainteriores.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projetos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  let blogUrls: MetadataRoute.Sitemap = []
  let projetoUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await getPosts()
    blogUrls = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // fallback se o banco não estiver disponível (build sem DB)
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

  return [...staticPages, ...projetoUrls, ...blogUrls]
}
