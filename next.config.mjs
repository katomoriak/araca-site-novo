import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone' removido — deploy é apenas Vercel (serverless). Se usar Docker depois, reative.
  outputFileTracingRoot: __dirname,
  reactCompiler: false, // Payload: desativado para compatibilidade (Next 16: chave no nível raiz)
  transpilePackages: ['swiper'],
  experimental: {
    proxyClientMaxBodySize: '4mb',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, '.'),
      '@payload-config': path.join(__dirname, 'payload.config.ts'),
    }
    return config
  },
  images: {
    localPatterns: [
      { pathname: '/api/image-proxy' },
      { pathname: '/logotipos/**' },
      { pathname: '/projetos/**' },
      { pathname: '/assets/**' },
      { pathname: '/**', search: '' },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: '**.blob.vercel-storage.com', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        // Aplicar headers de segurança a todas as rotas
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              // Scripts: Next.js requer 'unsafe-eval' e 'unsafe-inline' para dev/HMR
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // Estilos: inline styles usados pelo Next.js e componentes
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Imagens: self + data URIs + Unsplash
              "img-src 'self' data: https: https://images.unsplash.com",
              // Fontes: self + data URIs + Google Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Conexões: self + Supabase Cloud (deploy apenas Vercel + Supabase Cloud)
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              // Media: self
              "media-src 'self'",
              // Frames: nenhum (DENY)
              "frame-src 'none'",
              "frame-ancestors 'none'",
              // Object/embed: nenhum
              "object-src 'none'",
              // Base URI: self
              "base-uri 'self'",
              // Form action: self
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // HSTS apenas em produção com HTTPS
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
        // Apenas se x-forwarded-proto for https (produção)
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
