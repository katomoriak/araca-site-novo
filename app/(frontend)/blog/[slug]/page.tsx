import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { PostContent } from '@/components/blog/PostContent'
import { ProgressiveImage } from '@/components/ui'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
import { formatDate } from '@/lib/utils'
import { getPosts, getPostBySlug, stringFromLocale } from '@/lib/payload'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { ArrowLeft, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

const getPost = cache(async (slug: string) => {
  const payloadPost = await getPostBySlug(slug)
  if (payloadPost) {
    const name =
      payloadPost.author?.name ??
      (payloadPost.author as { email?: string })?.email ??
      'Autor'
    const titleStr = stringFromLocale(payloadPost.title)
    const excerptStr = stringFromLocale(payloadPost.excerpt)
    const authorId =
      typeof payloadPost.author === 'object' &&
      payloadPost.author != null &&
      'id' in payloadPost.author
        ? String((payloadPost.author as { id: string }).id)
        : undefined
    const categoryValue = payloadPost.category
    const categoryLabel =
      typeof categoryValue === 'object' && categoryValue != null && 'name' in categoryValue
        ? String((categoryValue as { name?: string }).name ?? '')
        : String(categoryValue ?? 'news')
    return {
      title: titleStr,
      excerpt: excerptStr,
      category: categoryLabel,
      author: { name: String(name), id: authorId },
      publishedAt: payloadPost.publishedAt ?? payloadPost.createdAt,
      coverImage:
        payloadPost.coverImage?.url
          ? {
              url: payloadPost.coverImage.url,
              alt: stringFromLocale(payloadPost.coverImage?.alt ?? payloadPost.title),
            }
          : payloadPost.coverImageUrl
            ? {
                url: payloadPost.coverImageUrl,
                alt: stringFromLocale(payloadPost.title),
              }
            : null,
      content: payloadPost.content,
    }
  }
  const mock = MOCK_POSTS.find((p) => p.slug === slug)
  if (mock) {
    return {
      title: mock.title,
      excerpt: mock.excerpt,
      category: mock.category,
      author: mock.author,
      publishedAt: mock.publishedAt,
      coverImage: mock.coverImage ?? null,
      content: mock.content,
    }
  }
  return null
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aracainteriores.com.br'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post não encontrado' }
  const postUrl = `${baseUrl}/blog/${slug}`
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article' as const,
      url: postUrl,
      ...(post.coverImage && {
        images: [
          {
            url: post.coverImage.url.startsWith('http') ? post.coverImage.url : `${baseUrl}${post.coverImage.url.startsWith('/') ? '' : '/'}${post.coverImage.url}`,
            width: 1200,
            height: 630,
            alt: post.coverImage.alt || post.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      ...(post.coverImage && { images: [post.coverImage.url.startsWith('http') ? post.coverImage.url : `${baseUrl}${post.coverImage.url.startsWith('/') ? '' : '/'}${post.coverImage.url}`] }),
    },
  }
}

export async function generateStaticParams() {
  const payloadPosts = await getPosts()
  const slugs =
    payloadPosts.length > 0
      ? payloadPosts.map((p) => p.slug)
      : MOCK_POSTS.map((p) => p.slug)
  return slugs.map((slug) => ({ slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const postUrl = `${baseUrl}/blog/${slug}`
  const coverAbsoluteUrl = post.coverImage?.url
    ? (post.coverImage.url.startsWith('http') ? post.coverImage.url : `${baseUrl}${post.coverImage.url.startsWith('/') ? '' : '/'}${post.coverImage.url}`)
    : undefined

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.id && { url: `${baseUrl}/blog/autor/${post.author.id}` }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aracá Interiores',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logotipos/LOGOTIPO%20REDONDO@300x.png` },
    },
    ...(coverAbsoluteUrl && { image: coverAbsoluteUrl }),
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 2, name: post.title, item: postUrl },
    ],
  }

  return (
    <article className="py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Container>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao blog
        </Link>

        <header className="mt-6 max-w-3xl">
          <span className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem]">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" aria-hidden />
              {post.author.id ? (
                <Link
                  href={`/blog/autor/${post.author.id}`}
                  className="hover:underline"
                >
                  {post.author.name}
                </Link>
              ) : (
                post.author.name
              )}
            </span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mt-8 w-full overflow-hidden rounded-xl bg-muted">
            <div className="relative aspect-video w-full">
              <ProgressiveImage
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                blurPlaceholderUrl={getBlurPlaceholderUrl(post.coverImage.url)}
              />
            </div>
          </div>
        )}

        <div className="mt-10 max-w-3xl">
          <PostContent content={post.content} />
        </div>
      </Container>
    </article>
  )
}
