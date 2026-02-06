import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { Card, CardContent } from '@/components/ui/Card'

const categoryLabels: Record<string, string> = {
  design: 'Design',
  dev: 'Dev',
  tutorial: 'Tutorial',
  news: 'News',
}

export default function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = React.use(params)
  const post = MOCK_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link
        href="/blog"
        className="text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        ← Voltar ao Blog
      </Link>
      <Card className="mt-6 overflow-hidden border-neutral-200 shadow-sm">
        <CardContent className="p-0">
          <div className="border-b border-neutral-100 px-6 py-4">
            <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
              {categoryLabels[post.category] ?? post.category}
            </span>
            <h1 className="font-display mt-2 text-3xl font-bold text-neutral-900">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {new Date(post.publishedAt).toLocaleDateString('pt-BR')} · {post.author.name}
            </p>
          </div>
          <div
            className="prose prose-neutral px-6 py-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
