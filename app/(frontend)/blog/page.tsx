import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PostGrid } from '@/components/blog/PostGrid'
import { SiteNav } from '@/components/layout/SiteNav'
import { ProgressiveImage } from '@/components/ui'
import { getPosts, toBlogPostListItem } from '@/lib/payload'
import { MOCK_POSTS } from '@/lib/blog-mock'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/blog-mock'

export const revalidate = 60

/** Exibe categoria como string (payload pode vir como objeto relation ou string). */
function toCategoryLabel(cat: unknown): string {
  if (typeof cat === 'object' && cat != null && 'name' in cat)
    return String((cat as { name?: string }).name ?? '')
  return String(cat ?? '')
}

export const metadata = {
  title: 'Blog',
  description:
    'Blog da Aracá Interiores: design de interiores, projetos residenciais e comerciais, dicas e inspirações.',
}

// Placeholder quando não há imagem (gradiente neutro)
const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80'

export default async function BlogPage() {
  const payloadPosts = await getPosts()
  const posts: Post[] =
    payloadPosts.length > 0
      ? payloadPosts.map(toBlogPostListItem)
      : MOCK_POSTS

  const heroPost = posts[0] ?? null
  const otherPosts = posts.slice(1)
  const rawHeroUrl = heroPost?.coverImage?.url
  const heroImageUrl =
    rawHeroUrl && rawHeroUrl !== '/placeholder-hero.jpg'
      ? rawHeroUrl
      : FALLBACK_HERO_IMAGE

  return (
    <>
      {/* Hero full-screen com imagem de capa do último post */}
      <section className="relative flex min-h-screen flex-col overflow-hidden text-white">
        <div className="absolute inset-0 h-full w-full bg-neutral-800" aria-hidden>
          <ProgressiveImage
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            blurPlaceholderUrl={getBlurPlaceholderUrl(heroImageUrl)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/20 via-transparent to-araca-ameixa/15" />

        {/* Menu - igual ao da home */}
        <SiteNav theme="dark-bg" noEnterAnimation />

        {/* Card do último post sobreposto no canto inferior esquerdo */}
        <div className="relative z-10 mt-auto">
          <Container className="pb-12 pt-8 md:pb-16 md:pt-12">
            {heroPost ? (
              <div className="group block max-w-2xl rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm transition hover:bg-white md:p-8">
                <Link href={`/blog/${heroPost.slug}`} className="block">
                  <span className="inline-block rounded-full bg-araca-mineral-green/90 px-4 py-1.5 text-xs font-medium text-white">
                    {toCategoryLabel(heroPost.category)}
                  </span>
                  <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
                    {heroPost.title}
                  </h1>
                </Link>
                <div className="mt-4 flex items-center gap-3 text-sm text-neutral-600">
                  {heroPost.author.id ? (
                    <Link
                      href={`/blog/autor/${heroPost.author.id}`}
                      className="hover:underline"
                    >
                      {heroPost.author.name}
                    </Link>
                  ) : (
                    <span>{heroPost.author.name}</span>
                  )}
                  <time dateTime={heroPost.publishedAt}>
                    {formatDate(heroPost.publishedAt)}
                  </time>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl rounded-2xl bg-white/95 p-6 backdrop-blur-sm md:p-8">
                <h1 className="font-display text-2xl font-bold text-neutral-900 md:text-3xl">
                  Blog
                </h1>
                <p className="mt-2 text-neutral-600">
                  Design, dev, tutoriais e notícias.
                </p>
              </div>
            )}
          </Container>
        </div>
      </section>

      {/* Seção Latest Post - grid dos demais posts */}
      <Container as="section" className="py-16">
        <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
          Últimos posts
        </h2>
        <p className="mt-2 text-neutral-600">
          Design, dev, tutoriais e notícias.
        </p>
        <div className="mt-12">
          {otherPosts.length > 0 ? (
            <PostGrid posts={otherPosts} />
          ) : (
            <p className="text-neutral-500">
              Nenhum outro post disponível no momento.
            </p>
          )}
        </div>
      </Container>
    </>
  )
}
