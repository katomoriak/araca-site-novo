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
  // Tree-shaking de pacotes grandes — reduz bundle JS
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', '@radix-ui/react-select', '@radix-ui/react-dialog'],
  },
  compress: true, // gzip/brotli nivel servidor
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, '.'),
      '@payload-config': path.join(__dirname, 'payload.config.ts'),
    }
    return config
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
      { protocol: 'https', hostname: 'img.araca.arq.br', pathname: '/**' },
      { protocol: 'https', hostname: 'pub-9ca9f8ba8c9d47518d53ef4b3818ed26.r2.dev', pathname: '/**' },
    ],
  },
  /**
   * Redirects: Garante que a versão "interna" (/arquitetura-interiores/cidade)
   * sempre redirecione para a versão de ranqueamento (/arquitetura-interiores-cidade) com 301.
   * Isso evita conteúdo duplicado e consolida o "link juice".
   */
  async redirects() {
    return [
      {
        source: '/arquitetura-interiores/:city',
        destination: '/arquitetura-interiores-:city',
        permanent: true, // 301 Redirect
      },
    ]
  },
  /**
   * Rewrites: Expõe /arquitetura-interiores-{slug} publicamente,
   * mapeando internamente para a pasta /arquitetura-interiores/[city].
   * Como o redirecionamento acima acontece antes do rewrite, o Google
   * vê apenas a URL com hífen como a oficial.
   */
  async rewrites() {
    const locations = [
      'santo-andre', 'sao-caetano', 'sao-bernardo', 'sao-paulo',
      'moema', 'brooklyn', 'pinheiros', 'zona-sul-sao-paulo'
    ]
    return locations.map((slug) => ({
      source: `/arquitetura-interiores-${slug}`,
      destination: `/arquitetura-interiores/${slug}`,
    }))
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com",
              // Estilos: inline styles usados pelo Next.js e componentes
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Imagens: self + data URIs + Unsplash
              "img-src 'self' data: https: https://images.unsplash.com",
              // Fontes: self + data URIs + Google Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Conexões: self + Supabase Cloud + Google Analytics
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
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
      {
        // Cache imútavel para assets estáticos Next.js (CSS/JS com hash no nome)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache imútavel para fontes locais (Bellamora woff2 — 30 KiB no caminho crítico)
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache de 7 dias para o proxy de imagens (URLs têm parâmetros ?w=&q= únicos).
        source: '/api/image-proxy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        // Cache de 7 dias para o redirect do hero-video (308 + Cache-Control).
        source: '/api/hero-video',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
