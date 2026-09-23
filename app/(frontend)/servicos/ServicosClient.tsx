'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Home,
  Building2,
  HardHat,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Layers,
  FileCheck2,
  ShieldCheck,
  Compass,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_IMG = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'

const AREAS_ATUACAO = [
  {
    number: '1',
    title: '1. Projetos Residenciais (Casas, Apartamentos e Coberturas)',
    shortTitle: 'Projetos Residenciais',
    subtitle: 'Casas, Apartamentos e Coberturas',
    description:
      'Projetos autorais que unem afeto, funcionalidade e sofisticação atemporal. Criamos ambientes acolhedores e funcionais sob medida para a história e rotina da sua família.',
    href: '/servicos/residencial',
    icon: Home,
    tag: 'Mais Procurado',
    items: [
      'Estudo de layout ergonômico e volumetria 3D realista',
      'Paleta de materiais nobres, cores e curadoria de mobiliário',
      'Plantas técnicas de elétrica, iluminação e detalhamento executivo',
    ],
    cover: 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png',
  },
  {
    number: '2',
    title: '2. Projetos Comerciais & Corporativos (Escritórios, Lojas e Clínicas)',
    shortTitle: 'Projetos Comerciais & Corporativos',
    subtitle: 'Escritórios, Lojas e Clínicas',
    description:
      'Espaços comerciais planejados para encantar clientes, fortalecer a presença da sua marca e garantir ergonomia e alta produtividade para sua equipe.',
    href: '/servicos/comercial-corporativo',
    icon: Building2,
    tag: 'Corporativo',
    items: [
      'Identidade visual aplicada ao espaço e branding sensorial',
      'Fluxo otimizado de clientes, conformidade com normas e acessibilidade',
      'Iluminação cênica e layout estratégico para conversão e autoridade',
    ],
    cover: 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png',
  },
  {
    number: '3',
    title: '3. Gestão e Acompanhamento de Obra Presencial',
    shortTitle: 'Gestão e Acompanhamento de Obra',
    subtitle: 'Fiscalização Presencial & Rigor Técnico',
    description:
      'A segurança de ver o projeto sair do papel com fidelidade total e sem o estresse de lidar sozinho com fornecedores, cronogramas, medições e canteiro de obras.',
    href: '/servicos/gestao-acompanhamento-de-obra',
    icon: HardHat,
    tag: 'Fidelidade Total',
    items: [
      'Visitas técnicas periódicas e fiscalização minuciosa de acabamentos',
      'Alinhamento direto de dúvidas com empreiteiros e marceneiros',
      'Conferência de medidas, validação de materiais e relatórios de evolução',
    ],
    cover: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
]

const MODULOS_ARACA = [
  {
    step: 'Módulo 01',
    title: 'Concepção Criativa 3D',
    icon: Compass,
    description:
      'Estudo aprofundado de layout, paleta de materiais, iluminação e imagens 3D fotorrealistas para que você visualize cada detalhe do espaço antes do início das obras.',
    highlights: ['Briefing Imersivo', 'Imagens 3D em Alta Resolução', 'Curadoria de Mobiliário e Cores'],
  },
  {
    step: 'Módulo 02',
    title: 'Caderno Executivo Completo',
    icon: FileCheck2,
    description:
      'Todas as plantas técnicas detalhadas para obra: demolição/construção, pontos elétricos e hidráulicos, paginação de revestimentos e detalhamento milimétrico de marcenaria e marmoraria.',
    highlights: ['Projetos Elétrico e Hidráulico', 'Detalhamento de Marcenaria', 'Paginações e Especificações'],
  },
  {
    step: 'Módulo 03',
    title: 'Gerenciamento de Reforma',
    icon: ShieldCheck,
    description:
      'Fiscalização técnica presencial periódica na obra, compatibilização com empreiteiros, conferência de entregas e garantia de que tudo seja executado fielmente ao projeto.',
    highlights: ['Visitas Técnicas Presenciais', 'Gestão de Fornecedores', 'Controle Físico de Prazos'],
  },
]

export function ServicosClient() {
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const heroHeight = () => (typeof window !== 'undefined' ? window.innerHeight : 800)
    const handleScroll = () => {
      const y = window.scrollY
      const scrollingUp = y < lastScrollY.current
      const pastHero = y > heroHeight() * 0.8
      lastScrollY.current = y
      setShowFloatingNav(pastHero && scrollingUp)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-araca-bege-claro">
      {/* Floating Nav */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2"
          >
            <SiteNav theme="light-bg" logoVariant="cafe" noEnterAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] flex-col justify-between overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMG}
            alt="Serviços de Interiores no ABC e SP - Aracá Interiores"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-neutral-950" />
        </div>

        {/* Site Nav integrado no Hero */}
        <div className="relative z-20">
          <SiteNav theme="dark-bg" noEnterAnimation />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto py-16">
          <Container className="max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Serviços de Interiores' },
                ]}
                theme="dark"
                includeJsonLd={false}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e6ca65]">
                <Sparkles className="h-3.5 w-3.5" />
                Soluções Sob Medida no ABC e SP
              </span>
              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Serviços de Design de Interiores e Gestão de Obra no ABC e SP
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg md:text-xl font-body max-w-2xl mx-auto">
                Projetos autorais residenciais e corporativos executados com rigor técnico, estética atemporal e modelo modular flexível. Conheça nossas áreas de atuação e escolha a solução ideal para o seu momento.
              </p>
            </motion.div>
          </Container>
        </div>

        {/* Bottom subtle divider */}
        <div className="relative z-10 h-10 bg-gradient-to-b from-transparent to-[#faf8f5]" />
      </section>

      {/* Áreas de Atuação Grid */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Especialidades Aracá
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              Nossas Áreas de Atuação
            </h2>
            <p className="mt-4 text-base sm:text-lg text-araca-cafe-escuro/75 font-body">
              Atuamos em Santo André, São Bernardo, São Caetano e em toda a capital paulista com metodologia transparente e foco absoluto no seu bem-estar.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {AREAS_ATUACAO.map((servico, index) => {
              const Icon = servico.icon
              return (
                <motion.article
                  key={servico.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div>
                    {/* Imagem de Capa do Card */}
                    <div className="relative h-56 w-full overflow-hidden bg-neutral-200">
                      <Image
                        src={servico.cover}
                        alt={servico.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-araca-chocolate-amargo shadow-md backdrop-blur-sm transition-colors group-hover:bg-araca-mineral-green group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-araca-chocolate-amargo shadow-sm backdrop-blur-sm">
                          {servico.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs uppercase tracking-wider text-white/80 font-medium">
                          {servico.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo textual com H3 estrito conforme SEO */}
                    <div className="p-8">
                      <h3 className="font-display text-xl font-bold text-araca-chocolate-amargo sm:text-2xl leading-snug">
                        {servico.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-araca-cafe-escuro/80 font-body">
                        {servico.description}
                      </p>

                      <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                        {servico.items.map((item) => (
                          <div key={item} className="flex items-start gap-2.5 text-xs text-neutral-700">
                            <CheckCircle2 className="h-4 w-4 text-araca-mineral-green shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <Link
                      href={servico.href}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'default' }),
                        'w-full justify-between rounded-xl border-neutral-300 group-hover:border-araca-mineral-green group-hover:bg-araca-mineral-green group-hover:text-white transition-colors duration-200 shadow-sm'
                      )}
                    >
                      <span className="font-medium text-sm">Conhecer detalhes do serviço</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Diferencial do Modelo Modular Aracá */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200/60">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-araca-mineral-green/10 px-4 py-1.5 text-xs font-semibold text-araca-mineral-green uppercase tracking-wider mb-4">
              <Layers className="h-4 w-4" />
              Flexibilidade e Controle
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              O Diferencial do Modelo Modular Aracá
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-araca-cafe-escuro leading-relaxed font-body">
              Você contrata apenas o que seu momento exige: <strong>Concepção Criativa 3D</strong>, <strong>Caderno Executivo Completo</strong> ou <strong>Gerenciamento de Reforma</strong>.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {MODULOS_ARACA.map((modulo, idx) => {
              const Icon = modulo.icon
              return (
                <motion.div
                  key={modulo.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative rounded-3xl border border-neutral-200/80 bg-[#fbf9f6] p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-araca-laranja-queimado">
                      {modulo.step}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-araca-mineral-green">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-araca-chocolate-amargo">
                    {modulo.title}
                  </h3>
                  <p className="mt-4 text-sm text-araca-cafe-escuro/80 leading-relaxed font-body">
                    {modulo.description}
                  </p>

                  <ul className="mt-6 pt-6 border-t border-neutral-200/60 space-y-2">
                    {modulo.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 text-xs font-medium text-araca-cafe-escuro">
                        <span className="h-1.5 w-1.5 rounded-full bg-araca-mineral-green" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção CTA para Contato com H2 estrito */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2a22] to-[#2b3f33] p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-araca-mineral-green/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  Atendimento Consultivo e Personalizado
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Vamos Conversar Sobre o Seu Espaço?
                </h2>
                <p className="mt-4 text-white/80 text-base sm:text-lg font-body leading-relaxed">
                  Conte-nos sobre o seu imóvel, seu momento e seus planos. Avaliamos suas necessidades e indicamos o escopo ideal para o seu projeto no ABC ou na capital.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20meu%20espa%C3%A7o%20e%20solicitar%20uma%20proposta%20de%20servi%C3%A7o."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl gap-2 shadow-lg px-8'
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar pelo WhatsApp
                </a>
                <Link
                  href="/contato"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl px-8'
                  )}
                >
                  Enviar Mensagem
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
