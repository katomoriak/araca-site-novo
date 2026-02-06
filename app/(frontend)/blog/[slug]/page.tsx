import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PostContent } from '@/components/blog/PostContent'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = MOCK_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <article className="py-16">
      <Container>
        <Link
          href="/blog"
          className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao blog
        </Link>

        <header className="mt-8">
          <Badge variant="primary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-lg text-neutral-600">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span>{post.author.name}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        <div className="mt-10">
          <PostContent content={post.content} />
        </div>
      </Container>
    </article>
  )
}
