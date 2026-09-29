'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Maximize2,
  Calendar,
  Home,
  Sparkles,
  Play,
  Share2,
  Check,
  Images,
  MessageCircle,
  Calculator,
  ChevronRight,
  Layers,
  Quote,
  Eye,
  Activity,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ProgressiveImage } from '@/components/ui'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
import { ProjectGallery } from '@/components/home/ProjectGallery'
import type { ProjectGalleryItem, GalleryMediaItem } from '@/components/home/ProjectGallery'
import { useGalleryOpen } from '@/components/context/GalleryOpenContext'
import { type ProjectRichData, getSeoImageAlt } from '@/content/projetos-rich-data'

export interface NavProjectItem {
  slug: string
  title: string
  coverImage: string
  tag?: string
}

export interface ProjetoDetailContentProps {
  project: ProjectGalleryItem
  richData: ProjectRichData
  prevProject?: NavProjectItem | null
  nextProject?: NavProjectItem | null
  otherProjects?: NavProjectItem[]
}

export function ProjetoDetailContent({
  project,
  richData,
  prevProject,
  nextProject,
  otherProjects = [],
}: ProjetoDetailContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copied, setCopied] = useState(false)
  const { setGalleryOpen } = useGalleryOpen()

  const openLightbox = useCallback(
    (index: number | null) => {
      setLightboxIndex(index)
      setGalleryOpen(index !== null)
    },
    [setGalleryOpen]
  )

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    setGalleryOpen(false)
  }, [setGalleryOpen])

  // Copiar link para área de transferência
  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${project.title} | Aracá Interiores`,
            text: richData.subtitle,
            url,
          })
          return
        } catch {
          // fallback para clipboard se share falhar ou for cancelado
        }
      }
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // fallback silencioso
      }
    }
  }

  // Mapeamento das mídias com índice original para manter sincronia com o modal lightbox
  const indexedMedia = useMemo(() => {
    return (project.media ?? []).map((item, originalIndex) => ({
      item,
      originalIndex,
    }))
  }, [project.media])

  // Contagem de fotos por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: indexedMedia.length }
    for (const cat of richData.ambienteCategorias) {
      const matches = indexedMedia.filter(({ item }) => {
        const textToSearch = `${item.name || ''} ${item.url || ''}`.toLowerCase()
        return cat.keywords.some((kw) => textToSearch.includes(kw.toLowerCase()))
      })
      counts[cat.id] = matches.length
    }
    return counts
  }, [indexedMedia, richData.ambienteCategorias])

  // Categorias que têm pelo menos 1 imagem encontrada
  const availableCategories = useMemo(() => {
    return richData.ambienteCategorias.filter((cat) => (categoryCounts[cat.id] ?? 0) > 0)
  }, [richData.ambienteCategorias, categoryCounts])

  // Mídias filtradas pela categoria ativa
  const filteredMedia = useMemo(() => {
    if (selectedCategory === 'all') return indexedMedia
    const targetCat = richData.ambienteCategorias.find((c) => c.id === selectedCategory)
    if (!targetCat) return indexedMedia
    return indexedMedia.filter(({ item }) => {
      const textToSearch = `${item.name || ''} ${item.url || ''}`.toLowerCase()
      return targetCat.keywords.some((kw) => textToSearch.includes(kw.toLowerCase()))
    })
  }, [indexedMedia, selectedCategory, richData.ambienteCategorias])

  const whatsappMessage = encodeURIComponent(
    `Olá! Estive vendo o projeto "${project.title}" no site da Aracá Interiores e gostaria de saber mais sobre um projeto de design de interiores nesse mesmo estilo para o meu imóvel.`
  )
  const whatsappUrl = `https://wa.me/5511939155979?text=${whatsappMessage}`

  return (
    <>
      <article className="overflow-hidden pb-20 pt-6 md:pb-28 md:pt-10">
        <Container>
          {/* Breadcrumb e Voltar */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium tracking-wide text-muted-foreground sm:text-sm"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="transition-colors hover:text-foreground">
                Início
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <Link href="/projetos" className="transition-colors hover:text-foreground">
                Projetos
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <span className="truncate max-w-[180px] font-semibold text-foreground sm:max-w-none">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
                title="Compartilhar projeto"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>

              <Link
                href="/projetos"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Todos os Projetos</span>
              </Link>
            </div>
          </nav>

          {/* Hero Editorial: Título & Metadados */}
          <header className="mt-8 md:mt-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-araca-laranja-queimado/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-araca-laranja-queimado">
                <Sparkles className="h-3.5 w-3.5" />
                {richData.tag || project.tag || 'Design de Interiores'}
              </span>
              {richData.specs.status && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  {richData.specs.status}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {richData.specs.tipo} • {richData.specs.ano}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {project.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                  {richData.subtitle || project.description}
                </p>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
                <a
                  href="#galeria-ambientes"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:scale-[1.02] sm:text-sm"
                >
                  <Images className="h-4 w-4 text-araca-laranja-queimado" />
                  <span>Ver Fotos ({project.media.length})</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-araca-laranja-queimado px-5 py-2.5 text-xs font-medium text-white shadow-md transition-all hover:bg-araca-laranja-queimado/90 hover:scale-[1.02] sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Solicitar Orçamento</span>
                </a>
              </div>
            </div>

            {/* Imagem de Capa Monumental com Alt Otimizado para SEO */}
            <div className="group relative mt-8 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] w-full overflow-hidden rounded-3xl bg-muted shadow-2xl transition-all">
              <ProgressiveImage
                src={project.coverImage}
                alt={getSeoImageAlt(
                  'Capa Principal do Projeto de Arquitetura e Interiores',
                  project.title,
                  richData.specs.localizacao,
                  richData.tag,
                  0
                )}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                blurPlaceholderUrl={getBlurPlaceholderUrl(project.coverImage)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Badge na Capa */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-white sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-black/40 px-4 py-2 backdrop-blur-md border border-white/10 text-xs sm:text-sm">
                  <span className="font-semibold">{richData.specs.localizacao}</span>
                  <span className="opacity-60">•</span>
                  <span>{richData.specs.area}</span>
                  {richData.specs.status && (
                    <>
                      <span className="opacity-60">•</span>
                      <span className="text-amber-300 font-medium">{richData.specs.status}</span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-xs font-medium text-araca-cafe-escuro shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-105 sm:text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ampliar Capa</span>
                </button>
              </div>
            </div>
          </header>

          {/* Ficha Técnica: 6 Colunas Editoriais */}
          <section
            aria-labelledby="ficha-tecnica-title"
            className="mt-8 rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8"
          >
            <h2 id="ficha-tecnica-title" className="sr-only">
              Ficha Técnica do Projeto
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Localização
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.localizacao}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Maximize2 className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Área
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.area}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Ano
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.ano}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Status
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.status?.includes('execução') && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {richData.specs.status || 'Concluído'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Home className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Tipologia
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.tipo}
                </span>
              </div>

              <div className="col-span-2 flex flex-col sm:col-span-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Layers className="h-3.5 w-3.5 text-araca-laranja-queimado" />
                  Escopo Aracá
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {richData.specs.escopo}
                </span>
              </div>
            </div>
          </section>

          {/* Narrativa Editorial: Conceito, Desafio e Solução */}
          <section className="mt-12 md:mt-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Coluna Principal: O Conceito e Destaques */}
              <div className="space-y-8 lg:col-span-7">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-araca-laranja-queimado">
                    Narrativa do Projeto
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    O Conceito Arquitetônico
                  </h2>
                  <div className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:font-bold first-letter:text-araca-laranja-queimado">
                      {richData.conceito}
                    </p>
                  </div>
                </div>

                {/* Destaques Arquitetônicos */}
                {richData.destaques && richData.destaques.length > 0 && (
                  <div className="rounded-2xl border border-araca-laranja-queimado/15 bg-araca-bege-claro/40 p-6 sm:p-7">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-araca-cafe-escuro">
                      <Sparkles className="h-4 w-4 text-araca-laranja-queimado" />
                      Destaques e Soluções Exclusivas
                    </h3>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {richData.destaques.map((destaque, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-araca-cafe-escuro/90">
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-araca-laranja-queimado text-[10px] font-bold text-white">
                            ✓
                          </span>
                          <span>{destaque}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Callout Temático de Interlinking SEO: Apto. Elysée */}
                {richData.slug === 'apto_elysee' && (
                  <div className="rounded-2xl border border-araca-laranja-queimado/30 bg-gradient-to-br from-araca-bege-claro/80 to-white/60 dark:from-araca-cafe-escuro/60 dark:to-card p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-araca-laranja-queimado">
                          Especialidade Autoral Aracá
                        </span>
                        <h4 className="mt-1 font-display text-lg font-bold text-foreground">
                          Design de Interiores Clássico & Neoclássico
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Conheça nossa abordagem para cálculo milimétrico de boiseries, sancas iluminadas e marcenaria clássica usinada em Santo André e São Paulo.
                        </p>
                      </div>
                      <Link
                        href="/design-de-interiores-classico-neoclassico"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-araca-cafe-escuro px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-araca-laranja-queimado hover:scale-105"
                      >
                        <span>Explorar Estilo Clássico</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Callout Temático de Interlinking SEO: Casa Alinho */}
                {richData.slug === 'casa-alinho' && (
                  <div className="rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-emerald-50/60 to-white/60 dark:from-emerald-950/40 dark:to-card p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Design Pet-Friendly com Gatificação
                        </span>
                        <h4 className="mt-1 font-display text-lg font-bold text-foreground">
                          Gatificação Integrada à Marcenaria sob Medida
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Veja como transformar o circuito felino em marcenaria autoral de alto padrão, aliando o bem-estar dos pets à estética contemporânea da casa.
                        </p>
                      </div>
                      <Link
                        href="/blog/projeto-alinho-interiores-pet-friendly-gatificacao"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:scale-105"
                      >
                        <span>Ler Artigo no Blog</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna Lateral: Desafio, Solução e Aspas dos Sócios */}
              <div className="space-y-6 lg:col-span-5">
                {/* Card Desafio */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    O Desafio do Espaço
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                    Premissas & Desafios
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {richData.desafio}
                  </p>
                </div>

                {/* Card Solução */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    A Resposta da Arquitetura
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                    Solução Autoral Aracá
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {richData.solucao}
                  </p>
                </div>

                {/* Aspas / Citação do Estúdio */}
                {richData.quote && (
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-araca-cafe-escuro to-araca-chocolate-amargo p-6 text-white shadow-lg">
                    <Quote className="absolute right-4 top-4 h-16 w-16 text-white/5" />
                    <p className="relative z-10 font-display text-base italic leading-relaxed text-white/95 sm:text-lg">
                      &ldquo;{richData.quote.text}&rdquo;
                    </p>
                    <div className="relative z-10 mt-4 border-t border-white/15 pt-3">
                      <p className="text-xs font-semibold text-white">{richData.quote.author}</p>
                      <p className="text-[11px] text-white/70">{richData.quote.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Galeria de Fotos Editorial com Filtro por Ambientes */}
          <section id="galeria-ambientes" className="mt-16 md:mt-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-araca-laranja-queimado">
                  Apresentação Visual
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Galeria de Ambientes
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                  Clique em qualquer foto para abrir o tour fotográfico em tela cheia com alta resolução.
                </p>
              </div>

              <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                Exibindo <span className="font-bold text-foreground">{filteredMedia.length}</span> de{' '}
                <span className="font-bold text-foreground">{project.media.length}</span> mídias
              </div>
            </div>

            {/* Abas de Filtro de Ambientes */}
            {availableCategories.length > 1 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-araca-cafe-escuro text-white shadow-sm dark:bg-white dark:text-araca-cafe-escuro'
                      : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  Todos ({project.media.length})
                </button>

                {availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                      selectedCategory === cat.id
                        ? 'bg-araca-cafe-escuro text-white shadow-sm dark:bg-white dark:text-araca-cafe-escuro'
                        : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {cat.label} ({categoryCounts[cat.id] ?? 0})
                  </button>
                ))}
              </div>
            )}

            {/* Grid de Imagens */}
            <div className="mt-8">
              {filteredMedia.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
                  Nenhuma imagem encontrada nesta categoria.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredMedia.map(({ item, originalIndex }, idx) => {
                    // Destaque para a primeira foto do filtro quando estamos vendo Todos ou categorias amplas
                    const isFeatured = idx === 0 && filteredMedia.length > 3
                    const displayName = item.name || `${project.title} — Ambiente ${originalIndex + 1}`
                    const seoAlt = getSeoImageAlt(
                      item.name,
                      project.title,
                      richData.specs.localizacao,
                      richData.tag,
                      originalIndex
                    )

                    return (
                      <button
                        key={`${item.url}-${originalIndex}`}
                        type="button"
                        onClick={() => openLightbox(originalIndex)}
                        className={`group relative overflow-hidden rounded-2xl bg-muted text-left transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-araca-laranja-queimado/50 ${
                          isFeatured
                            ? 'col-span-2 row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[420px]'
                            : 'aspect-[4/3]'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <>
                            <video
                              src={item.url}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-araca-cafe-escuro shadow-lg transition-transform group-hover:scale-110">
                                <Play className="h-5 w-5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <ProgressiveImage
                            src={item.url}
                            alt={seoAlt}
                            fill
                            sizes={
                              isFeatured
                                ? '(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw'
                                : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                            }
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            blurPlaceholderUrl={getBlurPlaceholderUrl(item.url)}
                          />
                        )}

                        {/* Overlay com gradiente e legenda */}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="line-clamp-1 text-xs font-medium text-white drop-shadow">
                              {displayName}
                            </span>
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                              <Eye className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Navegação Entre Projetos (Anterior e Próximo) */}
          {(prevProject || nextProject) && (
            <section
              aria-label="Navegação entre projetos"
              className="mt-16 border-t border-border pt-12 md:mt-24"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {prevProject ? (
                  <Link
                    href={`/projetos/${prevProject.slug}`}
                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-araca-laranja-queimado/50 hover:shadow-md"
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <ProgressiveImage
                        src={prevProject.coverImage}
                        alt={getSeoImageAlt('Capa do Projeto Anterior', prevProject.title, richData.specs.localizacao, prevProject.tag || '', 0)}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-araca-laranja-queimado">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Projeto Anterior
                      </span>
                      <span className="mt-1 truncate font-display text-base font-bold text-foreground">
                        {prevProject.title}
                      </span>
                      {prevProject.tag && (
                        <span className="text-xs text-muted-foreground">{prevProject.tag}</span>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextProject && (
                  <Link
                    href={`/projetos/${nextProject.slug}`}
                    className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 text-right transition-all hover:border-araca-laranja-queimado/50 hover:shadow-md sm:flex-row-reverse"
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <ProgressiveImage
                        src={nextProject.coverImage}
                        alt={getSeoImageAlt('Capa do Próximo Projeto', nextProject.title, richData.specs.localizacao, nextProject.tag || '', 0)}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col sm:items-end">
                      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-araca-laranja-queimado">
                        Próximo Projeto
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="mt-1 truncate font-display text-base font-bold text-foreground">
                        {nextProject.title}
                      </span>
                      {nextProject.tag && (
                        <span className="text-xs text-muted-foreground">{nextProject.tag}</span>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* Outros Projetos Aracá para Explorar */}
          {otherProjects && otherProjects.length > 0 && (
            <section className="mt-16 border-t border-border pt-12 md:mt-20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-araca-laranja-queimado">
                    Mais Inspirações
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Outros Projetos Aracá
                  </h3>
                </div>
                <Link
                  href="/projetos"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-araca-laranja-queimado hover:underline sm:text-sm"
                >
                  <span>Ver Todos</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherProjects.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/projetos/${item.slug}`}
                    className="group relative block overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <ProgressiveImage
                        src={item.coverImage}
                        alt={getSeoImageAlt('Capa do Projeto', item.title, richData.specs.localizacao, item.tag || '', 0)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="font-display text-lg font-bold text-foreground group-hover:text-araca-laranja-queimado">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <span>Explorar projeto completo</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA de Conversão de Alto Padrão */}
          <section className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-araca-cafe-escuro via-araca-chocolate-amargo to-black p-8 text-white shadow-2xl sm:p-12 md:mt-24 lg:p-16">
            {/* Brilho decorativo de fundo */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-araca-laranja-queimado/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-araca-dourado-ocre/20 blur-3xl"
              aria-hidden
            />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-araca-dourado-claro backdrop-blur">
                Transforme seu Imóvel
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Inspirado pelo projeto {project.title}?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                Seja para uma reforma residencial, casa de campo ou apartamento de alto padrão,
                desenhamos cada detalhe com rigor técnico, marcenaria sob medida e acolhimento real.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-araca-laranja-queimado px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-araca-laranja-queimado/90 hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Conversar com a Aracá no WhatsApp</span>
                </a>

                <Link
                  href="/calculadora-projeto"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Simular Custo do Meu Projeto</span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Atendimento em SP e Grande ABC
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Projetos Autorais de Alto Padrão
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Orçamento e Briefing Personalizados
                </span>
              </div>
            </div>
          </section>
        </Container>
      </article>

      {/* Lightbox em Tela Cheia */}
      {lightboxIndex !== null && (
        <ProjectGallery
          project={project}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
