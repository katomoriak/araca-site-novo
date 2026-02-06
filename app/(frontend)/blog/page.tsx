import { Container } from '@/components/layout/Container'
import { PostGrid } from '@/components/blog/PostGrid'
import { MOCK_POSTS } from '@/lib/blog-mock'

export const metadata = {
  title: 'Blog — Araça',
  description: 'Posts do blog. Design, dev, tutoriais e notícias.',
}

export default function BlogPage() {
  return (
    <Container as="section" className="py-16">
      <h1 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-neutral-600">
        Lista de posts (mock). Conecte ao Payload para dados reais.
      </p>
      <div className="mt-12">
        <PostGrid posts={MOCK_POSTS} />
      </div>
    </Container>
  )
}
