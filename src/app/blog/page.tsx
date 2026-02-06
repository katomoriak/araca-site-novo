import Link from 'next/link'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const categoryLabels: Record<string, string> = {
  design: 'Design',
  dev: 'Dev',
  tutorial: 'Tutorial',
  news: 'News',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-neutral-600">
        Artigos sobre design, desenvolvimento e tutoriais.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_POSTS.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <Card className="h-full border-neutral-200 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-primary-200">
              <CardHeader>
                <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                  {categoryLabels[post.category] ?? post.category}
                </span>
                <CardTitle className="mt-2 group-hover:text-primary-600">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {post.excerpt}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  {new Date(post.publishedAt).toLocaleDateString('pt-BR')} · {post.author.name}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
