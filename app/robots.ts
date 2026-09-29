import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/image-proxy', '/api/hero-video'],
      disallow: [
        '/admin',
        '/admin/',
        '/dashboard',
        '/dashboard/',
        '/login',
        '/login/',
        '/design-system',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

