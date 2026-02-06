/**
 * Mock de posts para o blog (quando Payload não estiver populado)
 */
export type PostCategory = 'design' | 'dev' | 'tutorial' | 'news'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: { url: string; alt: string }
  content: string
  author: { name: string }
  category: PostCategory
  tags: string[]
  publishedAt: string
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Introdução ao Design System',
    slug: 'introducao-design-system',
    excerpt:
      'Como criar e manter um design system escalável para produtos digitais. Boas práticas e ferramentas.',
    coverImage: { url: '/placeholder-hero.jpg', alt: 'Design system' },
    content: `
      <h2>O que é um Design System?</h2>
      <p>Um design system é uma coleção de componentes, padrões e guidelines reutilizáveis que garantem consistência visual e de experiência.</p>
      <h2>Benefícios</h2>
      <ul>
        <li>Consistência entre produtos</li>
        <li>Velocidade de desenvolvimento</li>
        <li>Manutenção centralizada</li>
      </ul>
    `,
    author: { name: 'Equipe Araça' },
    category: 'design',
    tags: ['design', 'ui', 'sistema'],
    publishedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Next.js 15 e React Server Components',
    slug: 'nextjs-15-react-server-components',
    excerpt:
      'Explore as novidades do Next.js 15 e como os React Server Components mudam a forma de construir aplicações.',
    coverImage: { url: '/placeholder-hero.jpg', alt: 'Next.js' },
    content: `
      <h2>React Server Components</h2>
      <p>RSC permitem renderizar componentes no servidor, reduzindo o JavaScript enviado ao cliente.</p>
      <h2>Práticas recomendadas</h2>
      <p>Use "use client" apenas onde for necessário interatividade.</p>
    `,
    author: { name: 'Equipe Araça' },
    category: 'dev',
    tags: ['nextjs', 'react', 'frontend'],
    publishedAt: '2025-02-02T14:00:00Z',
  },
  {
    id: '3',
    title: 'Tutorial: Configurando Tailwind com Design Tokens',
    slug: 'tutorial-tailwind-design-tokens',
    excerpt:
      'Passo a passo para configurar o Tailwind CSS com tokens de design (cores, tipografia, espaçamento).',
    coverImage: { url: '/placeholder-hero.jpg', alt: 'Tailwind' },
    content: `
      <h2>Design Tokens</h2>
      <p>Tokens são variáveis que definem cores, espaços e tipografia de forma centralizada.</p>
      <h2>Configuração no tailwind.config</h2>
      <p>Extenda o theme com suas paletas e fontes.</p>
    `,
    author: { name: 'Equipe Araça' },
    category: 'tutorial',
    tags: ['tailwind', 'css', 'tokens'],
    publishedAt: '2025-02-03T09:00:00Z',
  },
]
