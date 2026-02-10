import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // necessário para o Dockerfile de produção (Coolify/VPS)
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
