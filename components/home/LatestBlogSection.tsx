import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/blog-mock'

interface LatestBlogSectionProps {
  posts?: Post[] | null
}

function toCategoryLabel(cat: unknown): string {
  if (typeof cat === 'object' && cat != null && 'name' in cat) {
    return String((cat as { name?: string }).name ?? '')
  }
  const str = String(cat ?? '')
  const map: Record<string, string> = {
    design: 'Design & Conceito',
    dev: 'Projetos',
    tutorial: 'Dicas de Reforma',
    news: 'Inspiração',
  }
  return map[str.toLowerCase()] || str
}

export function LatestBlogSection({ posts }: LatestBlogSectionProps) {
  const displayPosts = (posts || []).slice(0, 3)

  return (
    <section
      id="blog"
      className="relative py-20 sm:py-28 bg-araca-mineral-green text-araca-bege-claro overflow-hidden"
      aria-labelledby="blog-heading"
    >
      {/* Elementos sutis de fundo */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-araca-cafe-escuro/20 blur-3xl"
        aria-hidden
      />

      <Container className="relative z-10">
        {/* Cabeçalho da seção */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-araca-bege-claro/15">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-araca-bege-claro/20 bg-white/10 backdrop-blur-sm px-3.5 py-1 text-xs text-araca-bege-claro font-medium mb-3 shadow-sm">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Nosso Blog</span>
            </div>
            <h2
              id="blog-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-araca-bege-claro tracking-tight"
            >
              Inspiração & Conteúdo
            </h2>
            <p className="mt-3 text-base sm:text-lg text-araca-bege-claro/85 font-body leading-relaxed">
              Tendências em interiores, novos projetos, dicas de reformas e mais.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-araca-bege-claro/40 bg-transparent px-6 py-2.5 text-sm font-medium text-araca-bege-claro hover:bg-araca-bege-claro hover:text-araca-mineral-green transition-all duration-300 shadow-sm"
            >
              <span>Ver todos os artigos</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Grade de 3 cartões com as últimas postagens */}
        {displayPosts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayPosts.map((post, idx) => (
              <article
                key={post.id || post.slug || idx}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-araca-rifle-green/70 border border-araca-bege-claro/15 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-araca-bege-claro/40"
              >
                {/* Imagem do Card */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/20">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="absolute inset-0 block"
                    aria-label={`Ler artigo: ${post.title}`}
                  >
                    {post.coverImage?.url ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/60 to-araca-cafe-escuro/80" />
                    )}
                  </Link>

                  {/* Categoria sobreposta no topo esquerdo */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="inline-block rounded-full bg-araca-cafe-escuro/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-araca-bege-claro shadow-sm">
                      {toCategoryLabel(post.category)}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Data de publicação */}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1.5 text-xs text-araca-bege-claro/65 font-medium mb-3">
                        <Calendar className="h-3.5 w-3.5 text-araca-bege-claro/50" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>
                    )}

                    {/* Título */}
                    <h3 className="font-display text-xl font-bold text-araca-bege-claro tracking-tight line-clamp-2 group-hover:text-white transition-colors duration-200">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Resumo */}
                    {post.excerpt && (
                      <p className="mt-3 text-sm text-araca-bege-claro/80 font-body leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Rodapé do Card */}
                  <div className="mt-6 pt-5 border-t border-araca-bege-claro/15 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-araca-bege-claro/75 font-medium">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-araca-bege-claro">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate max-w-[120px]">{post.author?.name || 'Equipe Aracá'}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-araca-bege-claro hover:text-white transition-colors group-hover:translate-x-1 duration-200"
                    >
                      Ler artigo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Fallback caso não haja posts */
          <div className="mt-10 rounded-2xl border border-dashed border-araca-bege-claro/30 p-12 text-center bg-white/5 backdrop-blur-sm">
            <BookOpen className="mx-auto h-10 w-10 text-araca-bege-claro/60 mb-3" />
            <p className="font-display text-xl font-semibold text-araca-bege-claro">
              Novos artigos em breve
            </p>
            <p className="mt-2 text-sm text-araca-bege-claro/75 max-w-md mx-auto">
              Estamos preparando conteúdos exclusivos sobre interiores, reformas e novos projetos.
            </p>
            <div className="mt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-araca-bege-claro text-araca-mineral-green px-5 py-2 text-sm font-semibold hover:bg-white transition-colors"
              >
                Acessar o blog
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
