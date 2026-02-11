'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Home,
  Store,
  Leaf,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'
import { SiteNav } from '@/components/layout/SiteNav'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ScrollTextReveal } from '@/components/home/ScrollTextReveal'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'
import { Parallax } from 'react-scroll-parallax'

const GalleryCarousel = dynamic(
  () => import('@/components/home/GalleryCarousel').then((m) => ({ default: m.GalleryCarousel })),
  { ssr: true }
)
const TestimonialsMarquee = dynamic(
  () => import('@/components/home/TestimonialsMarquee').then((m) => ({ default: m.TestimonialsMarquee })),
  { ssr: true }
)
const ProjectGallery = dynamic(
  () => import('@/components/home/ProjectGallery').then((m) => ({ default: m.ProjectGallery })),
  { ssr: false }
)

const HOME_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/#projetos', label: 'Projetos' },
  { href: '/#contato', label: 'Contato' },
]

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
}

export function HomePage({ initialProjects }: HomePageProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectGalleryItem | null>(null)
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
              links={HOME_NAV_LINKS}
              noEnterAnimation
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO COM MENU INTEGRADO */}
      <section className="relative flex min-h-screen flex-col overflow-hidden text-white">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src={
              process.env.NEXT_PUBLIC_SUPABASE_URL
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/FJO__VIDEOFACHADA_01_R00.mp4`
                : ''
            }
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/20 via-transparent to-araca-ameixa/15" />
        
        {/* Menu - Liquid Glass (design system: SiteNav) */}
        <SiteNav theme="dark-bg" noEnterAnimation />

        {/* Conteúdo do Hero */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4">
          <motion.div
            className="max-w-3xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm font-medium tracking-[0.25em] text-white/85">
              ARACÁ INTERIORES
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              Interiores com um modelo flexível: você escolhe o que quer contratar.
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Projeto criativo, executivo, detalhamentos e acompanhamento de obra — do
              conceito ao último acabamento.
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
          </motion.div>
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

      {/* SOBRE NÓS - Scroll Text Reveal */}
      <section className="relative bg-araca-bege-claro">
        <ScrollTextReveal 
          texts={[
            'Somos Aracá Interiores.',
            'Nosso modelo é totalmente inovador: você escolhe o que quer contratar.',
            'Projeto criativo + Projeto executivo',
            'Detalhamentos + Acompanhamento de obra',
            'Na Aracá, combinamos estética, funcionalidade e execução. Você contrata o processo completo ou apenas o que faz sentido para o seu momento.',
            'Cada espaço conta uma história.',
          ]}
          highlights={{
            0: ['Aracá', 'Interiores'],
            1: ['modelo', 'inovador', 'escolhe', 'leva'],
            2: ['criativo', 'executivo'],
            3: ['Detalhamentos', 'Acompanhamento'],
            4: ['estética', 'funcionalidade', 'execução', 'completo', 'sentido', 'momento'],
            5: ['história'],
          }}
          className="max-w-7xl text-center"
        />
        
        {/* Gradiente de transição para o marrom */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(48, 22, 12, 0.3) 40%, rgba(48, 22, 12, 0.7) 70%, #30160C 100%)'
          }}
        />
      </section>

      {/* NOSSOS PROJETOS - Com Scroll Text Reveal */}
      <section id="projetos" className="relative z-20 bg-araca-cafe-escuro overflow-visible">
        {/* Textos que rolam normalmente */}
        <ScrollTextReveal 
          texts={[
            'Da ideia ao acabamento final.',
          ]}
          highlights={{
            0: ['ideia', 'acabamento'],
          }}
          textColor="text-araca-bege-claro"
          highlightColors={{
            gradient1: '#1a0a05',
            gradient2: '#0f0502',
            gradient3: '#251208'
          }}
          className="max-w-7xl text-center"
          backgroundLogo="/logotipos/utilitaries/U_CAETE.svg"
        />
        
        {/* Seção com scroll para o texto sticky */}
        <div className="relative bg-araca-cafe-escuro overflow-visible" style={{ minHeight: '150vh' }}>
          {/* Logos decorativos (z-20 para ficarem acima da seção da galeria e não serem cortados) */}
          <div className="absolute inset-0 overflow-visible pointer-events-none z-20" aria-hidden>
            {/* Logo à esquerda — parallax lento */}
            <div
              className="absolute left-0 top-1/2"
              style={{ transform: 'translate(-40%, -50%)' }}
            >
              <Parallax speed={2}>
                <img
                  src="/logotipos/utilitaries/U_CAETE.svg"
                  alt=""
                  className="h-[min(140vh,840px)] w-auto opacity-30 object-contain object-left"
                />
              </Parallax>
            </div>
            {/* Logo à direita, mais acima — parallax lento */}
            <div
              className="absolute right-0 top-[15%]"
              style={{ transform: 'translate(40%, -50%)' }}
            >
              <Parallax speed={2}>
                <img
                  src="/logotipos/utilitaries/U_CAETE.svg"
                  alt=""
                  className="h-[min(140vh,840px)] w-auto opacity-30 object-contain object-right"
                />
              </Parallax>
            </div>
          </div>
          {/* Texto sticky que acompanha o scroll */}
          <div className="sticky top-1/2 py-20 pointer-events-none z-50 overflow-visible" style={{ marginTop: '-80px' }}>
            <Container className="relative w-full overflow-visible">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="text-center font-display text-4xl font-bold leading-tight text-araca-bege-claro px-[10%] sm:text-5xl md:text-6xl lg:text-7xl relative z-50"
              >
                Veja o que já <span className="relative inline-block mx-2">
                  <span className="relative z-10">criamos</span>
                  <motion.span
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      opacity: { duration: 0.1, delay: 0.3 },
                      scaleX: { duration: 0.5, delay: 0.3, ease: "easeOut" }
                    }}
                    style={{ transformOrigin: 'left' }}
                  >
                    <span
                      className="absolute bottom-[0.05em] left-[-0.2em] right-[-0.2em] h-[0.65em]"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, #1a0a05 15%, #0f0502 85%, transparent 100%)',
                        opacity: 0.6,
                        transform: 'skewY(-0.5deg)',
                        borderRadius: '40% 60% 45% 55%',
                      }}
                    />
                    <span
                      className="absolute bottom-[0.08em] left-[-0.15em] right-[-0.15em] h-[0.55em]"
                      style={{
                        background: 'linear-gradient(90deg, #251208 0%, #1a0a05 20%, #0f0502 40%, #1a0a05 60%, #251208 80%, #0f0502 100%)',
                        opacity: 0.7,
                        transform: 'skewY(0.3deg)',
                        borderRadius: '50% 40% 55% 45%',
                      }}
                    />
                  </motion.span>
                </span>.
              </motion.p>
            </Container>
          </div>
        </div>
      </section>

      {/* GALERIA DE PROJETOS - fundo atrás de "Veja o que já criamos", só o carrossel acima */}
      <section className="relative -mt-32 sm:-mt-40">
        {/* Fundo da seção em z-0 para não sobrepor o bloco acima (z-20) */}
        <div className="absolute inset-0 bg-araca-cafe-escuro z-0" aria-hidden />
        <div className="relative pt-20 pb-20 sm:pb-32">
          {/* Só o carrossel fica acima de tudo (z-30 > z-20 da section #projetos) */}
          <div className="relative w-full z-[30]">
            <GalleryCarousel
              projects={galleryProjects}
              onSelectProject={setSelectedProject}
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
          onClose={() => setSelectedProject(null)} 
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
                className="h-[min(90vh,540px)] w-auto opacity-[0.12] object-contain object-right"
              />
            </Parallax>
          </div>
        </div>
        <Container className="relative z-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold text-araca-chocolate-amargo sm:text-5xl">
              Quem atendemos
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/90">
              Soluções completas para diferentes escalas e necessidades.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3 p-6 sm:p-8">
            <div className="text-center">
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

            <div className="text-center">
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

            <div className="text-center">
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

        {/* Gradiente de transição para a próxima section (Depoimentos) — fica atrás dos logos (z-0) */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-40 sm:h-48 pointer-events-none overflow-visible"
          style={{
            background: 'linear-gradient(to bottom, #ECE5DB 0%, rgba(236, 229, 219, 0.85) 35%, rgba(236, 229, 219, 0.5) 65%, #F1EDE9 100%)'
          }}
        />
      </section>

      {/* DEPOIMENTOS — marquee vertical estilo "Loved by thousands" */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-araca-bege-claro/50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              O que dizem sobre nós
            </h2>
            <p className="mt-3 text-muted-foreground">
              Avaliações que resumem a experiência Aracá.
            </p>
          </div>

          <TestimonialsMarquee
            className="mt-10"
            items={[
              {
                name: 'Mariana S.',
                quote:
                  'Processo claro e leve. O resultado ficou acima do que imaginamos — e a obra fluiu sem sustos.',
              },
              {
                name: 'Rafael C.',
                quote:
                  'Detalhamento impecável. A equipe traduziu nossas referências em um espaço com personalidade.',
              },
              {
                name: 'Camila L.',
                quote:
                  'Flexível de verdade: escolhemos o que precisávamos e tivemos suporte no momento certo.',
              },
            ]}
          />
        </Container>
        {/* Gradiente de transição para a seção Contato */}
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 229, 219, 0.4) 50%, var(--araca-bege-claro) 100%)',
          }}
          aria-hidden
        />
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
                    <img
                      src="/logotipos/LOGOTIPO%20REDONDO@300x.png"
                      alt=""
                      className="max-h-full max-w-[45%] w-auto object-contain object-left-bottom"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
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
                        href="tel:+5511911632003"
                        className="mt-1 text-sm text-white/90 hover:text-white underline underline-offset-2"
                      >
                        (11) 91163-2003
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
                          }).catch(() => {})
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
                            className={`rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-araca-mineral-green focus:ring-offset-2 ${
                              tipoConsulta === op
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
        href="https://wa.me/5511911632003"
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
