'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Home,
  Store,
  Leaf,
  Instagram,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'
import { SiteNav } from '@/components/layout/SiteNav'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ScrollTextReveal } from '@/components/home/ScrollTextReveal'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'
import { Parallax } from 'react-scroll-parallax'
import { useGalleryOpen } from '@/components/context/GalleryOpenContext'
import { getHeroVideoUrl } from '@/lib/hero-video'
import { avaliacoesGoogle } from '@/content/depoimentos'
import { LatestBlogSection } from '@/components/home/LatestBlogSection'
import { HomeCalculatorCtaSection } from '@/components/home/HomeCalculatorCtaSection'
import type { Post } from '@/lib/blog-mock'

const GalleryCarousel = dynamic(
  () => import('@/components/home/GalleryCarousel').then((m) => ({ default: m.GalleryCarousel })),
  { ssr: false }
)
const TestimonialsMarquee = dynamic(
  () => import('@/components/home/TestimonialsMarquee').then((m) => ({ default: m.TestimonialsMarquee })),
  { ssr: false }
)
const ProjectGallery = dynamic(
  () => import('@/components/home/ProjectGallery').then((m) => ({ default: m.ProjectGallery })),
  { ssr: false }
)

function HeroVideo() {
  const posterUrl = getHeroVideoUrl('poster') || '/api/hero-video?quality=poster'
  const videoUrl = getHeroVideoUrl('default') || '/api/hero-video'

  const [loadVideo, setLoadVideo] = useState(false)

  useEffect(() => {
    // Retarda o carregamento do vídeo para depois da renderização inicial
    const timer = setTimeout(() => {
      setLoadVideo(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 bg-neutral-900">
      {/* Imagem estática carrega primeiro (LCP) */}
      <Image
        src={posterUrl}
        alt="Aracá Interiores Hero"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* Vídeo carrega lazymente depois por cima */}
      {loadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-1000"
          src={videoUrl}
        />
      )}
    </div>
  )
}

const TIPOS_CONSULTA = ['Projeto residencial', 'Projeto comercial', 'Consultoria', 'Outros'] as const

// Fallback quando não há projetos em public/projetos (ex.: antes de preencher)
const GALLERY_FALLBACK: ProjectGalleryItem[] = [
  {
    id: '1',
    title: 'Casa Pinho',
    description: 'Um projeto residencial que harmoniza arquitetura contemporânea com elementos naturais, criando espaços acolhedores e funcionais para o dia a dia.',
    tag: 'Residencial',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80' },
    ],
  },
  {
    id: '2',
    title: 'Apartamento Areia',
    description: 'Interiores sofisticados com paleta neutra e toques de madeira natural, transformando um espaço compacto em um refúgio urbano elegante.',
    tag: 'Interiores',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80' },
    ],
  },
  {
    id: '3',
    title: 'Loja Terra',
    description: 'Experiência comercial imersiva que conecta a identidade da marca com o público, através de um design espacial estratégico e acolhedor.',
    tag: 'Comercial',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80' },
    ],
  },
]

export interface HomePageProps {
  /** Projetos carregados no servidor (evita waterfall no cliente). */
  initialProjects?: ProjectGalleryItem[] | null
  /** Posts do blog para exibição na seção da home (até 3). */
  latestPosts?: Post[] | null
}

export function HomePage({ initialProjects, latestPosts }: HomePageProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectGalleryItem | null>(null)
  const { setGalleryOpen } = useGalleryOpen()
  const openGallery = useCallback((project: ProjectGalleryItem | null) => {
    setSelectedProject(project)
    setGalleryOpen(!!project)
  }, [setGalleryOpen])
  const closeGallery = useCallback(() => {
    setSelectedProject(null)
    setGalleryOpen(false)
  }, [setGalleryOpen])
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const [tipoConsulta, setTipoConsulta] = useState<string>(TIPOS_CONSULTA[0])
  const [contactForm, setContactForm] = useState({
    nome: '',
    sobrenome: '',
    pais: '',
    telefone: '',
    email: '',
    mensagem: '',
    newsletter: false,
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [contactError, setContactError] = useState<string | null>(null)
  const [galleryProjects] = useState<ProjectGalleryItem[]>(
    Array.isArray(initialProjects) && initialProjects.length > 0 ? initialProjects : GALLERY_FALLBACK
  )
  const lastScrollY = useRef(0)

  // Menu flutuante: só aparece ao subir a página; some no hero e ao descer
  useEffect(() => {
    const heroHeight = () => typeof window !== 'undefined' ? window.innerHeight : 800
    const handleScroll = () => {
      const y = window.scrollY
      const scrollingUp = y < lastScrollY.current
      const pastHero = y > heroHeight() * 0.85
      lastScrollY.current = y
      setShowFloatingNav((prev) => {
        if (!pastHero) return false // no hero, nunca mostra
        if (scrollingUp) return true  // subindo e já passou o hero → mostra
        return false                  // descendo → esconde
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const aboutLines = [
    'Somos Aracá Interiores.',
    'Nosso modelo é totalmente inovador.',
    'Você escolhe o que quer contratar.',
  ]

  const services = [
    'Projeto criativo',
    'Projeto executivo',
    'Detalhamentos',
    'Acompanhamento de obra',
  ]

  return (
    <>
      {/* Menu flutuante: só aparece ao rolar até a seção Projetos */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2"
          >
            <SiteNav
              theme="light-bg"
              logoVariant="cafe"
              noEnterAnimation
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO COM MENU INTEGRADO */}
      <section className="relative flex min-h-screen flex-col overflow-hidden text-white">
        {/* Background Video — servido preferencialmente pelo R2 para não consumir cache/bandwidth da Vercel */}
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/20 via-transparent to-araca-ameixa/15" />

        {/* Menu - Liquid Glass (design system: SiteNav) */}
        <SiteNav theme="dark-bg" noEnterAnimation />

        {/* Conteúdo do Hero */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4">
          <div className="max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.25em] text-white/85">
              ARACÁ INTERIORES
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              {"Aracá Interiores | Escritório de Decoração e Design de Interiores em Santo André e SP"}
            </h1>
            <p className="mt-6 text-lg text-white/95 sm:text-xl font-body leading-relaxed max-w-2xl mx-auto">
              {"Design de interiores para espaços com vida. Criamos ambientes envolventes que combinam a imponência do estilo neoclássico à rica personalidade do maximalismo contemporâneo."}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sobre"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-laranja-queimado text-white shadow hover:bg-araca-laranja-queimado/90 focus-visible:ring-araca-laranja-queimado'
                )}
              >
                Conhecer a Aracá
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#projetos"
                className={buttonVariants({ size: 'lg', variant: 'glass' })}
              >
                Ver projetos
              </Link>
            </div>
          </div>
        </div>

        <ScrollIndicator />

        {/* Gradiente de transição para o bege */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 229, 219, 0.3) 40%, rgba(236, 229, 219, 0.7) 70%, #ECE5DB 100%)'
          }}
        />
      </section>

      {/* SOBRE NÓS - Apresentação Aracá & Fundadores */}
      <section className="relative bg-araca-bege-claro py-20 md:py-28 overflow-hidden">
        <Container className="relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
              {/* Coluna da Imagem */}
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
                <div className="relative group w-full max-w-md">
                  {/* Borda decorativa atrás */}
                  <div
                    className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-gradient-to-tr from-primary/20 via-araca-laranja-queimado/20 to-transparent blur-sm -z-10 group-hover:blur-md transition-all duration-300"
                    aria-hidden
                  />
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-border/60 bg-muted shadow-2xl">
                    <Image
                      src="/equipe/marco-e-rafa-color.jpg"
                      alt="Marcos e Rafa — Fundadores da Aracá Interiores"
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Coluna de Texto */}
              <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
                <span className="inline-block text-xs uppercase tracking-[0.25em] font-semibold text-primary/80 mb-3">
                  Marcos & Rafaela · Fundadores
                </span>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-araca-cafe-escuro tracking-tight leading-[1.1]">
                  Somos a Aracá.
                </h2>
                <div className="mt-6 space-y-4 font-body text-araca-cafe-escuro/80 text-lg sm:text-xl leading-relaxed">
                  <p>
                    Acreditamos que uma casa precisa ter história, camadas e presença. Amamos criar <strong>espaços com vida</strong> — onde cada detalhe desperta sentimentos e convida a ficar.
                  </p>
                  <p className="text-base sm:text-lg">
                    Nossa essência transita pela sofisticação atemporal dos <strong>projetos neoclássicos</strong> e pela rica expressividade do <strong>design maximalista</strong>: ambientes envolventes, repletos de arte, texturas nobres, iluminação cênica e personalidade autêntica.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/sobre"
                    className={cn(
                      buttonVariants({ size: 'default' }),
                      'bg-araca-cafe-escuro text-araca-bege-claro hover:bg-araca-cafe-escuro/90 shadow-md font-medium'
                    )}
                  >
                    Conheça nossa trajetória
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#projetos"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Explorar nossos projetos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Gradiente sutil de transição para a próxima seção */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(48, 22, 12, 0.3) 40%, rgba(48, 22, 12, 0.7) 70%, #30160C 100%)'
          }}
        />
      </section>

      {/* NOSSOS PROJETOS - Transição mais ágil e compacta */}
      <section id="projetos" className="relative z-20 bg-araca-cafe-escuro overflow-hidden pt-16 pb-6 md:pt-20 md:pb-8">
        {/* Logos decorativos sutis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden>
          <div
            className="absolute left-0 top-1/2"
            style={{ transform: 'translate(-35%, -50%)' }}
          >
            <Parallax speed={1}>
              <img
                src="/logotipos/utilitaries/U_CAETE.svg"
                alt=""
                width={700}
                height={700}
                className="h-[min(80vh,600px)] w-auto opacity-20 object-contain object-left"
              />
            </Parallax>
          </div>
          <div
            className="absolute right-0 top-1/3"
            style={{ transform: 'translate(35%, -50%)' }}
          >
            <Parallax speed={1}>
              <img
                src="/logotipos/utilitaries/U_CAETE.svg"
                alt=""
                width={700}
                height={700}
                className="h-[min(80vh,600px)] w-auto opacity-20 object-contain object-right"
              />
            </Parallax>
          </div>
        </div>

        <Container className="relative z-20 text-center">
          {/* Frase 1: Da ideia ao acabamento final */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl sm:text-3xl md:text-4xl text-araca-bege-claro/70 tracking-wide font-normal"
          >
            Da ideia ao acabamento final.
          </motion.p>

          {/* Frase 2: Veja o que já criamos (logo abaixo com destaque) */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 sm:mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-araca-bege-claro tracking-tight"
          >
            Veja o que já <span className="relative inline-block mx-1 sm:mx-2">
              <span className="relative z-10 text-white">criamos</span>
              <motion.span
                className="absolute inset-x-[-0.2em] bottom-[0.05em] h-[0.65em] -z-10"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                  ease: "easeOut"
                }}
                style={{ transformOrigin: 'left' }}
              >
                <span
                  className="absolute inset-0 opacity-60 rounded-[40%_60%_45%_55%]"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, #1a0a05 15%, #0f0502 85%, transparent 100%)',
                  }}
                />
                <span
                  className="absolute inset-[-0.1em] opacity-70 rounded-[50%_40%_55%_45%]"
                  style={{
                    background: 'linear-gradient(90deg, #251208 0%, #1a0a05 20%, #0f0502 40%, #1a0a05 60%, #251208 80%, #0f0502 100%)',
                  }}
                />
              </motion.span>
            </span>.
          </motion.h2>
        </Container>
      </section>

      {/* GALERIA DE PROJETOS - carrossel logo na sequência sem espaço vazio */}
      <section className="relative">
        {/* Fundo da seção */}
        <div className="absolute inset-0 bg-araca-cafe-escuro z-0" aria-hidden />
        <div className="relative pt-6 pb-20 sm:pb-32">
          {/* Só o carrossel fica acima de tudo (z-30 > z-20 da section #projetos) */}
          <div className="relative w-full z-[30]">
            <GalleryCarousel
              projects={galleryProjects}
              onSelectProject={openGallery}
            />
          </div>

          {/* Gradiente de transição para o bege */}
          <div
            className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 229, 219, 0.3) 40%, rgba(236, 229, 219, 0.7) 70%, #ECE5DB 100%)'
            }}
          />
        </div>
      </section>

      {/* Modal de Galeria */}
      {selectedProject && (
        <ProjectGallery
          project={selectedProject}
          onClose={closeGallery}
        />
      )}

      {/* QUEM ATENDEMOS - logos menores, à frente do gradiente, atrás do carrossel e botões */}
      <section className="relative bg-araca-bege-claro py-20 sm:py-24 overflow-visible">
        {/* Logos: z-10 (à frente do gradiente z-0); section sem z-index fica atrás da galeria z-10 */}
        <div className="absolute inset-0 overflow-visible pointer-events-none z-10" aria-hidden>
          <div
            className="absolute left-0 top-[65%]"
            style={{ transform: 'translate(-40%, -50%)' }}
          >
            <Parallax speed={2}>
              <img
                src="/logotipos/utilitaries/U_CAETE.svg"
                alt=""
                width={540}
                height={540}
                className="h-[min(90vh,540px)] w-auto opacity-[0.12] object-contain object-left"
              />
            </Parallax>
          </div>
          <div
            className="absolute right-0 top-1/2"
            style={{ transform: 'translate(40%, -50%)' }}
          >
            <Parallax speed={2}>
              <img
                src="/logotipos/utilitaries/U_CAETE.svg"
                alt=""
                width={540}
                height={540}
                className="h-[min(90vh,540px)] w-auto opacity-[0.12] object-contain object-right"
              />
            </Parallax>
          </div>
        </div>
        <Container className="relative z-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-araca-chocolate-amargo leading-tight">
              Decoradores e Designers de Interiores no Grande ABC e em São Paulo
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/90 text-base sm:text-lg">
              Soluções completas para diferentes escalas e necessidades.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3 p-6 sm:p-8">
            <div className="text-center transition-transform duration-200 ease-out hover:scale-[1.06] origin-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <Home className="h-7 w-7 text-araca-chocolate-amargo" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-araca-chocolate-amargo">
                Residências
              </p>
              <p className="mt-2 text-sm text-araca-cafe-escuro/80">
                Interiores e arquitetura pensados para rotina, conforto e
                identidade.
              </p>
            </div>

            <div className="text-center transition-transform duration-200 ease-out hover:scale-[1.06] origin-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <Store className="h-7 w-7 text-araca-chocolate-amargo" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-araca-chocolate-amargo">
                Comércios
              </p>
              <p className="mt-2 text-sm text-araca-cafe-escuro/80">
                Espaços de marca com fluxo inteligente, experiência e
                performance.
              </p>
            </div>

            <div className="text-center transition-transform duration-200 ease-out hover:scale-[1.06] origin-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <Leaf className="h-7 w-7 text-araca-chocolate-amargo" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-araca-chocolate-amargo">
                Paisagismo & luminotécnico
              </p>
              <p className="mt-2 text-sm text-araca-cafe-escuro/80">
                Ambientes externos e luz com intenção: clima, textura e
                acolhimento.
              </p>
            </div>
          </div>
        </Container>

        {/* Gradiente de transição suave */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-40 sm:h-48 pointer-events-none overflow-visible"
          style={{
            background: 'linear-gradient(to bottom, #ECE5DB 0%, rgba(236, 229, 219, 0.85) 35%, rgba(236, 229, 219, 0.5) 65%, #ECE5DB 100%)'
          }}
        />
      </section>

      {/* CHAMADA DESTACADA: ESTIMATIVA DE CUSTO E CALCULADORA DE PROJETOS */}
      <HomeCalculatorCtaSection />

      {/* DEPOIMENTOS — marquee vertical estilo "Loved by thousands" */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-araca-bege-claro/50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 backdrop-blur-md px-3.5 py-1 text-xs text-foreground mb-4 shadow-sm">
              <span className="flex items-center gap-1 text-[#d4a853] font-semibold">
                ★ 5.0
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">Avaliações 5 estrelas no Google</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              O que dizem sobre nós
            </h2>
            <p className="mt-3 text-muted-foreground">
              Avaliações reais que resumem a experiência Aracá Interiores.
            </p>
          </div>

          <TestimonialsMarquee
            className="mt-10"
            items={avaliacoesGoogle}
          />
        </Container>
        {/* Gradiente de transição para a próxima seção */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 229, 219, 0.4) 50%, var(--araca-mineral-green) 100%)',
          }}
          aria-hidden
        />
      </section>

      {/* SEÇÃO BLOG / ÚLTIMAS POSTAGENS */}
      <LatestBlogSection posts={latestPosts} />

      {/* SEÇÃO INSTAGRAM */}
      <section
        className="relative py-20 sm:py-24 bg-araca-creme overflow-hidden border-t border-b border-border/40"
        aria-labelledby="instagram-heading"
      >
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Texto & Chamada */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-araca-laranja-queimado/30 bg-araca-laranja-queimado/10 px-3.5 py-1 text-xs text-araca-laranja-queimado font-medium mb-4 shadow-sm">
                <Instagram className="h-4 w-4" />
                <span>@aracainteriores</span>
              </div>
              <h2
                id="instagram-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-araca-cafe-escuro tracking-tight"
              >
                Acompanhe Nossos Bastidores no Instagram
              </h2>
              <p className="mt-4 text-base sm:text-lg text-araca-chocolate-amargo/85 font-body leading-relaxed">
                Compartilhamos transformações de ambientes, visitas de obra, escolhas de materiais, detalhes de marcenaria e o dia a dia do nosso estúdio de interiores.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.instagram.com/aracainteriores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-araca-cafe-escuro text-white font-medium text-base shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:shadow-xl hover:scale-105 group"
                >
                  <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6 text-[#E8B56F] group-hover:text-white" />
                  <span>Seguir @aracainteriores</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Grid Visual de Posts Reais */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg lg:max-w-md shrink-0">
              {[
                {
                  src: '/instagram/post-1.png',
                  alt: 'Luminária pendente helicoidal e painel ripado - Aracá Interiores',
                  tag: 'Iluminação & Painel',
                },
                {
                  src: '/instagram/post-2.png',
                  alt: 'Quarto aconchegante com poltrona e manta terracota - Aracá Interiores',
                  tag: 'Suíte & Texturas',
                },
                {
                  src: '/instagram/post-3.png',
                  alt: 'Equipe fundadora Aracá Interiores - Marcos Paulo e Rafaela Garbuio',
                  tag: 'Quem Cria',
                },
                {
                  src: '/instagram/post-4.png',
                  alt: 'Antes e Depois / Cozinha e Sala Integradas - Aracá Interiores',
                  tag: 'Antes & Depois',
                },
                {
                  src: '/instagram/post-5.png',
                  alt: '10 coisas que você deveria fazer antes de começar sua obra - Dicas Aracá',
                  tag: 'Dicas de Obra',
                },
                {
                  src: '/instagram/post-1.png',
                  alt: 'Conceito e Composição de Interiores - Aracá',
                  tag: 'Composição & Arte',
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="https://www.instagram.com/aracainteriores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, 150px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2.5">
                    <span className="text-[10px] sm:text-xs text-white/90 font-medium">
                      {item.tag}
                    </span>
                    <span className="text-white text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <Instagram className="h-3 w-3" />
                      Ver post
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CONTATO - fundo da section (placeholder) + bloco com cantos arredondados e glass contendo a imagem */}
      <section
        id="contato"
        className="relative min-h-[640px] py-20 sm:py-24 bg-[var(--araca-bege-claro)]"
      >
        {/* Card em verde da marca, bordas arredondadas */}
        <div className="px-4 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-araca-mineral-green shadow-2xl p-8 sm:p-10">
            <div>
              <Container className="grid gap-12 lg:grid-cols-[1fr,minmax(380px,440px)] lg:gap-16 items-start lg:items-stretch !px-0">
                {/* Coluna esquerda: título, descrição e informações de contato */}
                <div className="relative text-white space-y-8 overflow-hidden">
                  {/* Logo Aracá redondo no canto inferior esquerdo, enquadrado no espaço */}
                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-start pointer-events-none opacity-10"
                    aria-hidden
                  >
                    <div className="relative h-full max-h-[280px] w-[45%] max-w-[200px]">
                      <Image
                        src="/logotipos/LOGOTIPO%20REDONDO@300x.png"
                        alt=""
                        fill
                        sizes="200px"
                        className="object-contain object-left-bottom"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold sm:text-4xl">
                      Tem dúvidas? Nós temos respostas.
                    </h2>
                    <p className="mt-4 text-white/90 text-base sm:text-lg max-w-lg">
                      Descubra experiências que você não encontra em outro lugar – pensadas para imergir você no coração do seu espaço. Histórias à espera de serem vividas.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 text-white/95">
                    <div>
                      <h3 className="font-display font-semibold text-white">Localização</h3>
                      <p className="mt-1 text-sm text-white/90">
                        Santo André, SP
                      </p>
                      <p className="mt-0.5 text-sm text-white/80">
                        Segunda a Sexta | 09:00–18:00
                      </p>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">Redes sociais</h3>
                      <p className="mt-1 flex flex-wrap gap-3">
                        <a
                          href="https://www.instagram.com/aracainteriores/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/90 hover:text-white underline underline-offset-2"
                          aria-label="Instagram"
                        >
                          Instagram
                        </a>
                        <a
                          href="https://www.linkedin.com/company/araca-arq"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/90 hover:text-white underline underline-offset-2"
                          aria-label="LinkedIn"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://br.pinterest.com/aracainteriores/_created/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/90 hover:text-white underline underline-offset-2"
                          aria-label="Pinterest"
                        >
                          Pinterest
                        </a>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">Email</h3>
                      <a
                        href="mailto:contato@araca.arq.br"
                        className="mt-1 text-sm text-white/90 hover:text-white underline underline-offset-2"
                      >
                        contato@araca.arq.br
                      </a>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">Contato</h3>
                      <a
                        href="tel:+5511939155979"
                        className="text-stone-300 hover:text-amber-500 transition-colors"
                      >
                        (11) 93915-5979
                      </a>
                    </div>
                  </div>
                </div>

                {/* Coluna direita: card branco com formulário */}
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
                  <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                    Conte-nos o que você precisa
                  </h3>
                  <p className="mt-2 text-sm text-araca-chocolate-amargo">
                    Nossa equipe está pronta para ajudar em cada detalhe, grande ou pequeno.
                  </p>
                  <form
                    className="mt-6 space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setContactError(null)
                      setContactStatus('loading')
                      try {
                        const res = await fetch('/api/contact', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            nome: contactForm.nome.trim(),
                            sobrenome: contactForm.sobrenome.trim() || undefined,
                            pais: contactForm.pais.trim() || undefined,
                            telefone: contactForm.telefone.trim() || undefined,
                            email: contactForm.email.trim().toLowerCase(),
                            tipoConsulta: tipoConsulta || undefined,
                            mensagem: contactForm.mensagem.trim() || undefined,
                            newsletter: contactForm.newsletter,
                          }),
                        })
                        const data = await res.json().catch(() => ({}))
                        if (!res.ok) {
                          setContactError(data.error || data.errors?.[0] || 'Não foi possível enviar. Tente novamente.')
                          setContactStatus('error')
                          return
                        }
                        const hadNewsletter = contactForm.newsletter
                        const subscribeEmail = contactForm.email.trim().toLowerCase()
                        setContactStatus('success')
                        setContactForm({ nome: '', sobrenome: '', pais: '', telefone: '', email: '', mensagem: '', newsletter: false })
                        setTipoConsulta(TIPOS_CONSULTA[0])
                        if (hadNewsletter && subscribeEmail) {
                          fetch('/api/subscribers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: subscribeEmail, status: 'subscribed' }),
                          }).catch(() => { })
                        }
                      } catch {
                        setContactError('Erro de conexão. Tente novamente.')
                        setContactStatus('error')
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="sr-only">Nome</span>
                        <input
                          type="text"
                          placeholder="Nome"
                          required
                          value={contactForm.nome}
                          onChange={(e) => setContactForm((p) => ({ ...p, nome: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                        />
                      </label>
                      <label className="block">
                        <span className="sr-only">Sobrenome</span>
                        <input
                          type="text"
                          placeholder="Sobrenome"
                          value={contactForm.sobrenome}
                          onChange={(e) => setContactForm((p) => ({ ...p, sobrenome: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="sr-only">País</span>
                        <input
                          type="text"
                          placeholder="País"
                          value={contactForm.pais}
                          onChange={(e) => setContactForm((p) => ({ ...p, pais: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                        />
                      </label>
                      <label className="block">
                        <span className="sr-only">Telefone</span>
                        <input
                          type="tel"
                          placeholder="Telefone"
                          value={contactForm.telefone}
                          onChange={(e) => setContactForm((p) => ({ ...p, telefone: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="sr-only">Email</span>
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                      />
                    </label>
                    <div>
                      <span className="block text-sm font-medium text-araca-cafe-escuro mb-2">
                        Tipo de consulta
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {TIPOS_CONSULTA.map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setTipoConsulta(op)}
                            className={`rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-araca-mineral-green focus:ring-offset-2 ${tipoConsulta === op
                              ? 'border-araca-mineral-green bg-araca-mineral-green/10 text-araca-cafe-escuro'
                              : 'border-gray-200 text-araca-chocolate-amargo hover:border-araca-mineral-green hover:bg-araca-mineral-green/5'
                              }`}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="block">
                      <span className="sr-only">Mensagem</span>
                      <textarea
                        placeholder="Mensagem"
                        rows={4}
                        value={contactForm.mensagem}
                        onChange={(e) => setContactForm((p) => ({ ...p, mensagem: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green resize-y min-h-[100px]"
                      />
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactForm.newsletter}
                        onChange={(e) => setContactForm((p) => ({ ...p, newsletter: e.target.checked }))}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-araca-mineral-green focus:ring-araca-mineral-green"
                      />
                      <span className="text-sm text-araca-chocolate-amargo">
                        Gostaria de receber ofertas exclusivas e novidades.
                      </span>
                    </label>
                    {contactStatus === 'success' && (
                      <p className="text-sm text-araca-mineral-green font-medium">
                        Mensagem enviada com sucesso! Entraremos em contato em breve.
                      </p>
                    )}
                    {contactStatus === 'error' && contactError && (
                      <p className="text-sm text-red-600">{contactError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={contactStatus === 'loading'}
                      className="w-full rounded-lg bg-araca-mineral-green px-4 py-3 font-medium text-white hover:bg-araca-rifle-green focus:outline-none focus:ring-2 focus:ring-araca-mineral-green focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {contactStatus === 'loading' ? 'Enviando…' : 'Enviar'}
                    </button>
                  </form>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </section>

      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/5511939155979"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  )
}
