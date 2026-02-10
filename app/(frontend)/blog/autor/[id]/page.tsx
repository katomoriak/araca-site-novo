import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { PostGrid } from '@/components/blog/PostGrid'
import {
  getAuthorById,
  getPostsByAuthorId,
  toBlogPostListItem,
} from '@/lib/payload'
import type { Post } from '@/lib/blog-mock'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  type LucideIcon,
} from 'lucide-react'

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

interface AuthorPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { id } = await params
  const author = await getAuthorById(id)
  if (!author) return { title: 'Autor não encontrado' }
  return {
    title: `${author.name} | Blog`,
    description: author.bio ?? `Posts de ${author.name} no blog.`,
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params
  const author = await getAuthorById(id)
  if (!author) notFound()

  const payloadPosts = await getPostsByAuthorId(id)
  const posts: Post[] =
    payloadPosts.length > 0
      ? payloadPosts.map(toBlogPostListItem)
      : [] // Sem fallback de mock por autor; só posts reais

  return (
    <>
      <SiteNav theme="light-bg" />

      <main className="min-h-screen bg-[var(--background)]">
        {/* Seção de biografia do autor */}
        <Container as="section" className="py-12 md:py-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-neutral-100/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
            <div className="flex flex-col items-center text-center">
              {author.avatar?.url ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-neutral-200 md:h-28 md:w-28">
                  <Image
                    src={author.avatar.url}
                    alt={author.avatar.alt ?? author.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--araca-mineral-green)] text-2xl font-semibold text-white md:h-28 md:w-28"
                  aria-hidden
                >
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h1 className="mt-6 font-display text-2xl font-bold text-neutral-900 md:text-3xl">
                {author.name}
              </h1>
              {author.title && (
                <p className="mt-1 text-sm text-neutral-600">{author.title}</p>
              )}
              {author.bio && (
                <p className="mt-4 max-w-prose text-left text-neutral-700 leading-relaxed">
                  {author.bio}
                </p>
              )}
              {author.socialLinks && author.socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {author.socialLinks.map((item) => {
                    const Icon = SOCIAL_ICONS[item.network]
                    if (!Icon) return null
                    return (
                      <a
                        key={item.network + item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-700 text-white transition hover:bg-[var(--araca-mineral-green)]"
                        aria-label={item.network}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Últimos posts do autor */}
        <Container as="section" className="pb-16">
          <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
            Últimos posts
          </h2>
          <p className="mt-2 text-neutral-600">
            Publicações de {author.name}.
          </p>
          <div className="mt-12">
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <p className="text-neutral-500">
                Nenhum post publicado por este autor ainda.
              </p>
            )}
          </div>
        </Container>
      </main>
    </>
  )
}
