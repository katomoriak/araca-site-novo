import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PostGrid } from '@/components/blog/PostGrid'
import { SiteNav } from '@/components/layout/SiteNav'
import {
  getPostsByCategory,
  getCategoryBySlug,
  getCategoryLabel,
  toBlogPostListItem,
  type PostCategory,
} from '@/lib/payload'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/blog-mock'
import { ChevronRight } from 'lucide-react'

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80'

interface BlogCategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogCategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: 'Categoria não encontrada' }
  const label = getCategoryLabel(category)
  return {
    title: `${label} | Blog`,
    description: `Posts da categoria ${label} no blog da Aracá Interiores.`,
  }
}

export async function generateStaticParams() {
  return [
    { slug: 'design' },
    { slug: 'dev' },
    { slug: 'tutorial' },
    { slug: 'news' },
  ]
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug) as PostCategory | null
  if (!category) notFound()

  const payloadPosts = await getPostsByCategory(category)
  const posts: Post[] =
    payloadPosts.length > 0
      ? payloadPosts.map(toBlogPostListItem)
      : MOCK_POSTS.filter((p) => p.category === category)

  const categoryLabel = getCategoryLabel(category)
  const heroPost = posts[0] ?? null
  const otherPosts = posts.slice(1)
  const rawHeroUrl = heroPost?.coverImage?.url
  const heroImageUrl =
    rawHeroUrl && rawHeroUrl !== '/placeholder-hero.jpg'
      ? rawHeroUrl
      : FALLBACK_HERO_IMAGE

  return (
    <>
      {/* Hero com imagem do post em destaque */}
      <section className="relative flex min-h-[70vh] flex-col overflow-hidden text-white">
        <div
          className="absolute inset-0 h-full w-full bg-neutral-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/20 via-transparent to-araca-ameixa/15" />

        <SiteNav theme="dark-bg" noEnterAnimation />

        {/* Breadcrumbs + Título + Card do post em destaque */}
        <div className="relative z-10 mt-auto">
          <Container className="pb-12 pt-8 md:pb-16 md:pt-12">
            {/* Breadcrumbs: Home > Blog > Categoria */}
            <nav
              className="mb-6 flex items-center gap-2 text-sm text-white/90"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/60" />
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/60" />
              <span className="text-white" aria-current="page">
                {categoryLabel}
              </span>
            </nav>

            <h1 className="mb-8 font-display text-3xl font-bold text-white md:text-4xl">
              {categoryLabel}
            </h1>

            {heroPost ? (
              <Link
                href={`/blog/${heroPost.slug}`}
                className="group block max-w-3xl rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm transition hover:bg-white md:p-8"
              >
                <span className="inline-block rounded-full bg-araca-mineral-green/90 px-4 py-1.5 text-xs font-medium text-white">
                  {categoryLabel}
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
                  {heroPost.title}
                </h2>
                <div className="mt-4 flex items-center gap-3 text-sm text-neutral-600">
                  {heroPost.author.id && heroPost.author.showAsPublicAuthor ? (
                    <Link href={`/blog/autor/${heroPost.author.id}`} className="hover:underline">
                      {heroPost.author.name}
                    </Link>
                  ) : (
                    <span>{heroPost.author.name}</span>
                  )}
                  <time dateTime={heroPost.publishedAt}>
                    {formatDate(heroPost.publishedAt)}
                  </time>
                </div>
              </Link>
            ) : (
              <div className="max-w-2xl rounded-2xl bg-white/95 p-6 backdrop-blur-sm md:p-8">
                <p className="font-display text-lg text-neutral-600">
                  Nenhum post nesta categoria ainda.
                </p>
              </div>
            )}
          </Container>
        </div>
      </section>

      {/* Grid dos demais posts */}
      <Container as="section" className="py-16">
        {otherPosts.length > 0 ? (
          <>
            <h2 className="sr-only">Mais posts em {categoryLabel}</h2>
            <PostGrid posts={otherPosts} />
          </>
        ) : (
          <p className="text-neutral-500">
            Não há outros posts nesta categoria no momento.
          </p>
        )}
      </Container>
    </>
  )
}
