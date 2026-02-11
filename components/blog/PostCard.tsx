import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/blog-mock'

function toCategoryLabel(cat: unknown): string {
  if (typeof cat === 'object' && cat != null && 'name' in cat)
    return String((cat as { name?: string }).name ?? '')
  return String(cat ?? '')
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full overflow-hidden transition hover:opacity-95">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <CardContent className="p-6">
          <Badge variant="default" className="mb-2">
            {toCategoryLabel(post.category)}
          </Badge>
          <h2 className="font-display text-xl font-semibold text-neutral-900 line-clamp-2">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
            {post.excerpt}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between border-t border-neutral-100 p-6 pt-0">
        {post.author.id ? (
          <Link
            href={`/blog/autor/${post.author.id}`}
            className="text-sm text-neutral-500 hover:underline"
          >
            {post.author.name}
          </Link>
        ) : (
          <span className="text-sm text-neutral-500">{post.author.name}</span>
        )}
        <time className="text-sm text-neutral-500" dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
      </CardFooter>
    </Card>
  )
}
