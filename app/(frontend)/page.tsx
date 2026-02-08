'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Home,
  Store,
  Leaf,
  Quote,
  Mail,
  Phone,
  MapPin,
  X,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ScrollIndicator } from '@/components/layout/ScrollIndicator'
import { buttonVariants, GlassCard } from '@/components/ui'
import { ProjectsCarousel, type ProjectCard } from '@/components/home/ProjectsCarousel'
import { ScrollTextReveal } from '@/components/home/ScrollTextReveal'
import { ProjectCard as ProjectGalleryCard, ProjectGallery, type ProjectGalleryItem } from '@/components/home/ProjectGallery'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectGalleryItem | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  
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

  // Projetos da galeria principal com múltiplas imagens
  const galleryProjects: ProjectGalleryItem[] = [
    {
      id: '1',
      title: 'Casa Pinho',
      description: 'Um projeto residencial que harmoniza arquitetura contemporânea com elementos naturais, criando espaços acolhedores e funcionais para o dia a dia.',
      tag: 'Residencial',
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      ],
    },
    {
      id: '2',
      title: 'Apartamento Areia',
      description: 'Interiores sofisticados com paleta neutra e toques de madeira natural, transformando um espaço compacto em um refúgio urbano elegante.',
      tag: 'Interiores',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      ],
    },
    {
      id: '3',
      title: 'Loja Terra',
      description: 'Experiência comercial imersiva que conecta a identidade da marca com o público, através de um design espacial estratégico e acolhedor.',
      tag: 'Comercial',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=80',
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80',
      ],
    },
  ]

  const projects: ProjectCard[] = [
    { title: 'Apartamento Areia', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Casa Pinho', subtitle: 'Interiores completos', tag: 'Residencial' },
    { title: 'Loja Terra', subtitle: 'Experiência de marca', tag: 'Comercial' },
    { title: 'Cozinha Ocre', subtitle: 'Reforma', tag: 'Residencial' },
    { title: 'Varanda Mineral', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Studio Ameixa', subtitle: 'Layout + iluminação', tag: 'Comercial' },
    { title: 'Paisagismo Orvalho', subtitle: 'Jardim e deck', tag: 'Paisagismo' },
    { title: 'Sala Dourada', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Café do Centro', subtitle: 'Projeto executivo', tag: 'Comercial' },
    { title: 'Luz & Sombra', subtitle: 'Luminotécnico', tag: 'Iluminação' },
    { title: 'Quarto Creme', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Recepção Verde', subtitle: 'Interiores', tag: 'Comercial' },
    { title: 'Casa Rifle', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Jardim Pinho', subtitle: 'Paisagismo', tag: 'Paisagismo' },
    { title: 'Consultório Terra', subtitle: 'Interiores', tag: 'Comercial' },
    { title: 'Cozinha Mineral', subtitle: 'Detalhamentos', tag: 'Residencial' },
    { title: 'Varanda Ocre', subtitle: 'Interiores', tag: 'Residencial' },
    { title: 'Hall Ameixa', subtitle: 'Interiores', tag: 'Residencial' },
  ]

  // Navegação por teclado no carrossel de projetos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Só navega se não houver projeto selecionado (modal fechado)
      if (!selectedProject) {
        if (e.key === 'ArrowLeft') {
          setCurrentProjectIndex((prev) => (prev - 1 + galleryProjects.length) % galleryProjects.length)
        } else if (e.key === 'ArrowRight') {
          setCurrentProjectIndex((prev) => (prev + 1) % galleryProjects.length)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject, galleryProjects.length])

  return (
    <>
      {/* HERO COM MENU INTEGRADO */}
      <section className="relative flex min-h-screen flex-col overflow-hidden text-white">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://trghyjzhxfyjgoitzfzh.supabase.co'}/storage/v1/object/public/media/FJO__VIDEOFACHADA_01_R00.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-araca-mineral-green/20 via-transparent to-araca-ameixa/15" />
        
        {/* Menu Transparente - Liquid Glass */}
        <motion.div 
          className="relative z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Container>
            <nav className="flex h-20 items-center justify-center">
              {/* Menu Desktop - Liquid Glass Effect */}
              <div 
                className="hidden items-center justify-between gap-6 rounded-full px-6 py-3 md:flex"
                style={{
                  width: '80%',
                  maxWidth: '1024px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                  backdropFilter: 'blur(42px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                {/* Logo */}
                <Link 
                  href="/" 
                  className="relative flex items-center transition-all duration-300 hover:opacity-90"
                >
                  <Image 
                    src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                    alt="Aracá Interiores"
                    width={80}
                    height={60}
                    className="h-auto w-[70px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 hover:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:w-[80px]"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    priority
                  />
                </Link>

                {/* Menu items */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <span className="relative z-10">Home</span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
                  </Link>
                  <Link
                    href="/sobre"
                    className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <span className="relative z-10">Sobre nós</span>
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                      }}
                    />
                  </Link>
                  <Link
                    href="#projetos"
                    className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <span className="relative z-10">Projetos</span>
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                      }}
                    />
                  </Link>
                  <Link
                    href="#contato"
                    className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <span className="relative z-10">Contato</span>
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                      }}
                    />
                  </Link>
                </div>
              </div>

              {/* Menu Mobile - Logo + Toggle */}
              <div className="flex w-full items-center justify-between md:hidden">
                <Link 
                  href="/" 
                  className="relative flex items-center"
                >
                  <Image 
                    src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                    alt="Aracá Interiores"
                    width={60}
                    height={50}
                    className="h-auto w-[55px]"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    priority
                  />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
                  aria-label="Menu"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <div className="space-y-1.5">
                    <span className="block h-0.5 w-5 bg-white"></span>
                    <span className="block h-0.5 w-5 bg-white"></span>
                    <span className="block h-0.5 w-5 bg-white"></span>
                  </div>
                </button>
              </div>
            </nav>
          </Container>
        </motion.div>

        {/* Menu Mobile Fullscreen */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-araca-cafe-escuro/95 backdrop-blur-md md:hidden"
            >
              <div className="flex min-h-screen flex-col">
                <div className="flex items-center justify-between p-6">
                  <Link 
                    href="/" 
                    className="relative flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Image 
                      src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                      alt="Aracá Interiores"
                      width={70}
                      height={60}
                      className="h-auto w-[65px]"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                    aria-label="Fechar menu"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <nav className="flex flex-1 items-center justify-center">
                  <ul className="space-y-6 text-center">
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href="/"
                        className="block font-display text-3xl font-semibold text-white hover:text-araca-dourado-ocre transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        href="/sobre"
                        className="block font-display text-3xl font-semibold text-white hover:text-araca-dourado-ocre transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sobre nós
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="#projetos"
                        className="block font-display text-3xl font-semibold text-white hover:text-araca-dourado-ocre transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Projetos
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Link
                        href="#contato"
                        className="block font-display text-3xl font-semibold text-white hover:text-araca-dourado-ocre transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Contato
                      </Link>
                    </motion.li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Interiores com um modelo flexível: você escolhe o que quer contratar.
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Projeto criativo, executivo, detalhamentos e acompanhamento de obra — do
              conceito ao último acabamento.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sobre"
                className={buttonVariants({ size: 'lg', variant: 'secondary' })}
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
      <section id="projetos" className="relative bg-araca-cafe-escuro overflow-visible">
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
        />
        
        {/* Seção com scroll para o texto sticky */}
        <div className="relative bg-araca-cafe-escuro overflow-visible" style={{ minHeight: '150vh' }}>
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

      {/* GALERIA DE PROJETOS */}
      <section className="relative bg-araca-cafe-escuro -mt-32 sm:-mt-40 z-10 overflow-visible">
        <div className="relative pt-20 pb-20 sm:pb-32">
            {/* Carrossel - Cards lado a lado vazando */}
            <div className="relative w-screen -ml-[50vw] left-[50%] z-20">
            <div className="relative flex items-center gap-6 lg:gap-8">
              {/* Card Anterior (peek à esquerda) */}
              <div 
                className="hidden lg:block w-[35vw] xl:w-[32vw] 2xl:w-[30vw] flex-shrink-0 -ml-[8vw] xl:-ml-[10vw] 2xl:-ml-[12vw] opacity-50 transition-all duration-300 hover:opacity-70 cursor-pointer"
                onClick={() => setCurrentProjectIndex((prev) => (prev - 1 + galleryProjects.length) % galleryProjects.length)}
              >
                <div className="transform scale-95">
                  <ProjectGalleryCard 
                    project={galleryProjects[(currentProjectIndex - 1 + galleryProjects.length) % galleryProjects.length]} 
                    onClick={(e) => {
                      e?.stopPropagation()
                      setCurrentProjectIndex((currentProjectIndex - 1 + galleryProjects.length) % galleryProjects.length)
                    }}
                    reverse={false}
                    showContent={false}
                  />
                </div>
              </div>

              {/* Card Principal */}
              <div className="relative flex-1 lg:flex-none w-[90vw] lg:w-[60vw] xl:w-[58vw] 2xl:w-[55vw] z-20 mx-auto lg:mx-0">
                <div className="cursor-grab active:cursor-grabbing">
                  <ProjectGalleryCard 
                    project={galleryProjects[currentProjectIndex]} 
                    onClick={() => setSelectedProject(galleryProjects[currentProjectIndex])}
                    reverse={false}
                    showContent={true}
                  />
                </div>
              </div>

              {/* Card Próximo (peek à direita) */}
              <div 
                className="hidden lg:block w-[35vw] xl:w-[32vw] 2xl:w-[30vw] flex-shrink-0 opacity-50 transition-all duration-300 hover:opacity-70 cursor-pointer"
                onClick={() => setCurrentProjectIndex((prev) => (prev + 1) % galleryProjects.length)}
              >
                <div className="transform scale-95">
                  <ProjectGalleryCard 
                    project={galleryProjects[(currentProjectIndex + 1) % galleryProjects.length]} 
                    onClick={(e) => {
                      e?.stopPropagation()
                      setCurrentProjectIndex((currentProjectIndex + 1) % galleryProjects.length)
                    }}
                    reverse={false}
                    showContent={false}
                  />
                </div>
              </div>
            </div>
            </div>

            {/* Indicadores (Dots) + Botões de Navegação */}
            <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-6"
            >
              {/* Botão Anterior */}
              <button
                onClick={() => setCurrentProjectIndex((prev) => (prev - 1 + galleryProjects.length) % galleryProjects.length)}
                className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                  backdropFilter: 'blur(42px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                aria-label="Projeto anterior"
              >
                <span className="text-2xl">‹</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2.5">
                {galleryProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectIndex(index)}
                    className={`h-3.5 rounded-full transition-all duration-300 ${
                      index === currentProjectIndex
                        ? 'w-12 bg-araca-bege-claro shadow-lg shadow-araca-bege-claro/40'
                        : 'w-3.5 bg-araca-bege-medio hover:bg-araca-bege-claro'
                    }`}
                    aria-label={`Ir para projeto ${index + 1}`}
                  />
                ))}
              </div>

              {/* Botão Próximo */}
              <button
                onClick={() => setCurrentProjectIndex((prev) => (prev + 1) % galleryProjects.length)}
                className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                  backdropFilter: 'blur(42px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                aria-label="Próximo projeto"
              >
                <span className="text-2xl">›</span>
              </button>
            </motion.div>
            </Container>
          </div>
        
        {/* Gradiente de transição para o bege */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 229, 219, 0.3) 40%, rgba(236, 229, 219, 0.7) 70%, #ECE5DB 100%)'
          }}
        />
      </section>

      {/* Modal de Galeria */}
      {selectedProject && (
        <ProjectGallery 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* PROJETOS CARROSSEL (antigo - mantido) */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Projetos que contam histórias
              </h2>
              <p className="mt-3 text-muted-foreground">
                Um recorte do nosso portfólio. Aqui a estética vem junto com o
                detalhamento e a viabilidade de obra.
              </p>
            </div>
            <Link href="/blog" className={buttonVariants({ variant: 'outline' })}>
              Ver conteúdos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 cursor-grab active:cursor-grabbing">
            <ProjectsCarousel projects={projects} />
          </div>
        </Container>
      </section>

      {/* QUEM ATENDEMOS */}
      <section className="bg-araca-cafe-escuro py-20 text-araca-bege-claro sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Quem atendemos
            </h2>
            <p className="mt-3 text-araca-bege-claro/80">
              Soluções completas para diferentes escalas e necessidades.
            </p>
          </div>

          <GlassCard
            variant="subtle"
            className="mt-10 p-6 sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Home className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display text-xl font-semibold">
                  Residências
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Interiores e arquitetura pensados para rotina, conforto e
                  identidade.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Store className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display text-xl font-semibold">
                  Comércios
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Espaços de marca com fluxo inteligente, experiência e
                  performance.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Leaf className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display text-xl font-semibold">
                  Paisagismo & luminotécnico
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Ambientes externos e luz com intenção: clima, textura e
                  acolhimento.
                </p>
              </div>
            </div>
          </GlassCard>
        </Container>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              O que dizem sobre nós
            </h2>
            <p className="mt-3 text-muted-foreground">
              Três avaliações que resumem a experiência Aracá.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
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
            ].map((t) => (
              <GlassCard key={t.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-display text-lg font-semibold text-foreground">
                    {t.name}
                  </p>
                  <Quote className="h-5 w-5 text-muted-foreground" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTATO */}
      <section id="contato" className="bg-araca-bege-claro py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-araca-cafe-escuro sm:text-4xl">
              Vamos conversar?
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo">
              Entre em contato e descubra como podemos transformar seu espaço.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <GlassCard className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-araca-mineral-green text-white">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-araca-cafe-escuro">
                Email
              </h3>
              <p className="mt-2 text-sm text-araca-chocolate-amargo">
                contato@aracainteriores.com.br
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-araca-mineral-green text-white">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-araca-cafe-escuro">
                Telefone
              </h3>
              <p className="mt-2 text-sm text-araca-chocolate-amargo">
                (11) 99999-9999
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-araca-mineral-green text-white">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-araca-cafe-escuro">
                Localização
              </h3>
              <p className="mt-2 text-sm text-araca-chocolate-amargo">
                São Paulo, SP
              </p>
            </GlassCard>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/sobre"
              className={buttonVariants({ size: 'lg', variant: 'primary' })}
            >
              Agendar uma conversa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
