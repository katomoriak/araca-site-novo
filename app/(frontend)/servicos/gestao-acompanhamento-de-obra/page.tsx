'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  HardHat,
  Eye,
  FileCheck,
  Ruler,
  ClipboardList,
  PiggyBank,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Home,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_GESTAO = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'
const IMG_DETALHE = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'

const ACOES_GESTAO = [
  {
    title: 'Visitas Técnicas Periódicas e Fiscalização de Acabamentos',
    desc: 'Vistoriamos o canteiro para auditar prumo, esquadro, alinhamento de bancadas, assentamento de revestimentos de grande formato e acabamentos finos de pintura e marcenaria.',
    icon: Eye,
  },
  {
    title: 'Alinhamento de Dúvidas Técnicas com Empreiteiros e Marceneiros',
    desc: 'Somos o canal direto de resolução técnica com a equipe da obra. Esclarecemos cotas, paginações, passagens de tubulações e detalhes construtivos antes que qualquer erro ocorra.',
    icon: FileCheck,
  },
  {
    title: 'Conferência de Medidas e Validação de Materiais Entregues',
    desc: 'Medição precisa dos vãos antes do corte de marcenaria e marmoraria, além da conferência de lotes de pisos, tintas, louças e metais no momento do descarregamento na obra.',
    icon: Ruler,
  },
  {
    title: 'Relatórios de Evolução e Controle de Cronograma',
    desc: 'Envio regular de boletins visuais com fotos, marcos cumpridos e status das próximas equipes a entrarem em campo, proporcionando previsibilidade e tranquilidade aos proprietários.',
    icon: ClipboardList,
  },
]

const VANTAGENS = [
  {
    title: 'Economia comprovada evitando desperdício de material',
    desc: 'Calculamos e conferimos os quantitativos de revestimentos, argamassas e insumos. Evitamos compras excedentes e perdas por armazenamento inadequado no canteiro.',
    icon: PiggyBank,
    stat: 'Até 30%',
    statDesc: 'de redução em custos extras',
  },
  {
    title: 'Prevenção de retrabalho',
    desc: 'Detectamos eventuais desvios de prumo ou posicionamento elétrico logo no início da alvenaria, eliminando demolições corretivas caras e desgastantes.',
    icon: RotateCcw,
    stat: 'Zero',
    statDesc: 'retrabalho em marcenaria e pisos',
  },
  {
    title: 'Entrega com acabamento de alto padrão',
    desc: 'A garantia de que cada detalhe previsto no projeto 3D e no caderno executivo seja rigorosamente respeitado, com acabamento refinado e durabilidade superior.',
    icon: Sparkles,
    stat: '100%',
    statDesc: 'fidelidade ao projeto executivo',
  },
]

export default function GestaoAcompanhamentoPage() {
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
            src={HERO_GESTAO}
            alt="Gestão e Acompanhamento Técnico de Obra no ABC e São Paulo"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-neutral-950" />
        </div>

        {/* Site Nav */}
        <div className="relative z-20">
          <SiteNav theme="dark-bg" noEnterAnimation />
        </div>

        {/* Hero Content com Breadcrumb no Topo */}
        <div className="relative z-10 my-auto py-16">
          <Container className="max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Serviços de Interiores', href: '/servicos' },
                  { label: 'Gestão de Obras de Interiores' },
                ]}
                theme="dark"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e6ca65]">
                <HardHat className="h-3.5 w-3.5" />
                Fiscalização Presencial & Fidelidade Executiva
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Gestão e Acompanhamento Técnico de Obra no ABC e São Paulo
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-body max-w-2xl mx-auto">
                A segurança de ver o projeto sair do papel com fidelidade total e sem o estresse de lidar sozinho com fornecedores, medições e imprevistos de canteiro de obras.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20vou%20reformar%20e%20gostaria%20de%20um%20diagn%C3%B3stico%20de%20acompanhamento%20de%20obra."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl shadow-lg'
                  )}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Pedir Diagnóstico de Obra
                </a>
                <Link
                  href="/contato"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl'
                  )}
                >
                  Falar Conosco
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          </Container>
        </div>

        <div className="relative z-10 h-10 bg-gradient-to-b from-transparent to-[#faf8f5]" />
      </section>

      {/* Seção 1: O Que Fazemos no Acompanhamento de Obra? */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Atuação Presencial no Canteiro
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              O Que Fazemos no Acompanhamento de Obra?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-araca-cafe-escuro/75 font-body">
              Atuamos como os olhos técnicos do cliente em campo, blindando seu tempo e garantindo qualidade construtiva de alto padrão.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {ACOES_GESTAO.map((acao, i) => {
              const Icon = acao.icon
              return (
                <motion.div
                  key={acao.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-araca-mineral-green/10 text-araca-mineral-green shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-araca-chocolate-amargo leading-snug">
                      {acao.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-araca-cafe-escuro/80 font-body">
                    {acao.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 2: Vantagens de Contratar a Gestão Aracá (com texto em <strong>) */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Tranquilidade Comprovada
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              Vantagens de Contratar a Gestão Aracá
            </h2>
            <p className="mt-6 text-base sm:text-lg text-araca-cafe-escuro leading-relaxed font-body">
              <strong>Economia comprovada evitando desperdício de material</strong>, <strong>prevenção de retrabalho</strong> e <strong>entrega com acabamento de alto padrão</strong>.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {VANTAGENS.map((vantagem, idx) => {
              const Icon = vantagem.icon
              return (
                <div
                  key={vantagem.title}
                  className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-[#faf8f5] p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-araca-mineral-green">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-display text-2xl font-bold text-araca-chocolate-amargo">
                        {vantagem.stat}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-araca-chocolate-amargo leading-snug">
                      {vantagem.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-araca-cafe-escuro/80 font-body">
                      {vantagem.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-araca-laranja-queimado">
                      {vantagem.statDesc}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 3: CTA Vai Reformar? Peça Seu Diagnóstico de Obra */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2a22] to-[#2b3f33] p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-araca-mineral-green/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  Planejamento Seguro de Reforma
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Vai Reformar? Peça Seu Diagnóstico de Obra
                </h2>
                <p className="mt-4 text-white/80 text-base sm:text-lg font-body leading-relaxed">
                  Evite dores de cabeça com prazos estourados ou fornecedores descoordenados. Envie os dados da sua reforma para receber uma análise preliminar de acompanhamento presencial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20vou%20reformar%20e%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20de%20obra."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl gap-2 shadow-lg px-8'
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Pedir Diagnóstico no WhatsApp
                </a>
                <Link
                  href="/contato"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl px-8'
                  )}
                >
                  Contato por E-mail
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Link Cruzado (Serviços Irmãos): Projetos Residenciais e Comerciais */}
      <section className="py-16 sm:py-20 bg-araca-bege-claro">
        <Container>
          <div className="rounded-3xl border border-araca-chocolate-amargo/10 bg-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-araca-mineral-green/10 text-araca-mineral-green">
                <Home className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-araca-laranja-queimado">
                  Projetos de Interiores
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-araca-chocolate-amargo">
                  Precisa também da concepção criativa ou do projeto executivo?
                </h3>
                <p className="mt-2 text-sm text-araca-cafe-escuro/80 font-body max-w-xl">
                  Conheça nossos serviços de design de interiores residencial e corporativo, desenvolvidos sob medida para transformar seu espaço.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/servicos/residencial"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'default' }),
                  'bg-araca-mineral-green text-white hover:bg-araca-mineral-green/90 rounded-xl gap-2'
                )}
              >
                <span>Projeto Residencial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/servicos/comercial-corporativo"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'default' }),
                  'border-araca-mineral-green text-araca-mineral-green hover:bg-araca-mineral-green hover:text-white rounded-xl gap-2'
                )}
              >
                <span>Projeto Comercial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
