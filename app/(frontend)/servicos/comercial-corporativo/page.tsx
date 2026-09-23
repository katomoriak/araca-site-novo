'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Stethoscope,
  Store,
  HardHat,
  MessageCircle,
  Lightbulb,
  ShieldCheck,
  Compass,
  Sparkles,
  Layers,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_COMERCIAL = 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png'
const IMG_SHOWROOM = 'https://img.araca.arq.br/midias/maximed_farmacia/aracainteriores_arquiteturacomercial_farmaciamaximed.png'

const SEGMENTOS = [
  {
    title: 'Escritórios e Espaços Corporativos',
    shortTitle: 'Escritórios',
    href: '/servicos/comercial-corporativo/escritorios',
    desc: 'Estações de trabalho ergonômicas, salas de reunião com tratamento acústico, áreas de descompressão e recepções impactantes. Criamos ambientes que retêm talentos e transmitem solidez institucional aos seus clientes.',
    icon: Briefcase,
    img: HERO_COMERCIAL,
  },
  {
    title: 'Clínicas, Consultórios Médicos e Estética',
    shortTitle: 'Clínicas',
    href: '/servicos/comercial-corporativo/clinicas-consultorios',
    desc: 'Espaços de saúde que combinam acolhimento humanizado, biossegurança rigorosa e requinte estético. Consultórios, salas de espera confortáveis e fluxos de atendimento adequados às exigências sanitárias.',
    icon: Stethoscope,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
  {
    title: 'Lojas, Boutiques e Showrooms',
    shortTitle: 'Lojas & Varejo',
    href: '/servicos/comercial-corporativo/lojas-varejo',
    desc: 'Arquitetura comercial estratégica orientada à experiência de compra. Vitrines atrativas, iluminação de destaque para produtos, circulação fluida e pontos focais calculados para impulsionar o ticket médio.',
    icon: Store,
    img: IMG_SHOWROOM,
  },
]

const ENTREGAS = [
  {
    title: 'Layout com foco em fluxo de clientes',
    desc: 'Estudo preciso da jornada de quem entra no seu espaço: facilidade de orientação, zonas de permanência, acessibilidade e ergonomia operacional.',
    icon: Users,
  },
  {
    title: 'Conformidade com normas técnicas',
    desc: 'Projetos em total aderência às normas ABNT (como a NBR 9050 de acessibilidade), requisitos de segurança contra incêndio e exigências específicas da Vigilância Sanitária (ANVISA).',
    icon: ShieldCheck,
  },
  {
    title: 'Iluminação estratégica',
    desc: 'Luminotécnica comercial calculada para destacar mercadorias, criar climas imersivos e garantir o nível correto de lux conforme a atividade corporativa desempenhada.',
    icon: Lightbulb,
  },
  {
    title: 'Identidade visual aplicada à arquitetura de interiores',
    desc: 'Materialização da alma da marca em cores, revestimentos, sinalização elegante e marcenaria exclusiva que fixam sua empresa na memória do consumidor.',
    icon: Sparkles,
  },
]

export default function ComercialCorporativoPage() {
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
            src={HERO_COMERCIAL}
            alt="Design de Interiores Comercial e Corporativo no ABC e SP"
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
                  { label: 'Projetos Comerciais & Corporativos' },
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
                <Briefcase className="h-3.5 w-3.5" />
                Estratégia, Produtividade e Autoridade
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Design de Interiores Comercial e Corporativo no ABC e SP
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-body max-w-2xl mx-auto">
                Espaços comerciais planejados para encantar clientes, fortalecer a presença da sua marca e garantir ergonomia e produtividade para a sua equipe.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20reuni%C3%A3o%20de%20briefing%20para%20meu%20espa%C3%A7o%20comercial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl shadow-lg'
                  )}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Agendar Reunião de Briefing
                </a>
                <Link
                  href="/projetos"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl'
                  )}
                >
                  Ver Cases do Portfólio
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          </Container>
        </div>

        <div className="relative z-10 h-10 bg-gradient-to-b from-transparent to-[#faf8f5]" />
      </section>

      {/* Seção 1: Segmentos que Transformamos */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Setores Atendidos
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              Segmentos que Transformamos
            </h2>
            <p className="mt-4 text-base sm:text-lg text-araca-cafe-escuro/75 font-body">
              Desenvolvemos projetos sob medida para negócios que buscam autoridade espacial, valorização patrimonial e aumento direto nas conversões.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {SEGMENTOS.map((seg, i) => {
              const Icon = seg.icon
              return (
                <motion.article
                  key={seg.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-neutral-200/70 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-neutral-200">
                    <Image
                      src={seg.img}
                      alt={seg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-araca-chocolate-amargo shadow-md backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-8">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-araca-chocolate-amargo">
                        {seg.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-araca-cafe-escuro/80 font-body">
                        {seg.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                      <Link
                        href={seg.href}
                        className="inline-flex items-center text-sm font-semibold text-araca-mineral-green hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        Ver Detalhes de {seg.shortTitle} <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 2: O Que Entregamos no Projeto Comercial? (com texto em <strong>) */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Pilares de Entrega
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              O Que Entregamos no Projeto Comercial?
            </h2>
            <p className="mt-6 text-base sm:text-lg text-araca-cafe-escuro leading-relaxed font-body">
              <strong>Layout com foco em fluxo de clientes</strong>, <strong>conformidade com normas técnicas</strong>, <strong>iluminação estratégica</strong> e <strong>identidade visual aplicada à arquitetura de interiores</strong>.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ENTREGAS.map((entrega, idx) => {
              const Icon = entrega.icon
              return (
                <div
                  key={entrega.title}
                  className="rounded-3xl border border-neutral-200/80 bg-[#faf8f5] p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-araca-mineral-green mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-araca-chocolate-amargo leading-snug">
                      {entrega.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-araca-cafe-escuro/75 leading-relaxed font-body">
                      {entrega.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 3: CTA Agende uma Reunião de Briefing para Seu Negócio */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2a22] to-[#2b3f33] p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-araca-mineral-green/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  Alinhamento Corporativo
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Agende uma Reunião de Briefing para Seu Negócio
                </h2>
                <p className="mt-4 text-white/80 text-base sm:text-lg font-body leading-relaxed">
                  Apresente os objetivos comerciais da sua empresa, a metragem do ponto ou conjunto corporativo e os prazos desejados. Montamos um cronograma executivo transparente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20reuni%C3%A3o%20de%20briefing%20para%20projeto%20comercial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl gap-2 shadow-lg px-8'
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Agendar pelo WhatsApp
                </a>
                <Link
                  href="/contato"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl px-8'
                  )}
                >
                  Preencher Formulário
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Link Cruzado (Serviço Irmão): Gestão e Acompanhamento de Obra */}
      <section className="py-16 sm:py-20 bg-araca-bege-claro">
        <Container>
          <div className="rounded-3xl border border-araca-chocolate-amargo/10 bg-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-araca-mineral-green/10 text-araca-mineral-green">
                <HardHat className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-araca-laranja-queimado">
                  Execução Sem Surpresas
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-araca-chocolate-amargo">
                  Vai reformar seu ponto ou escritório? Conheça nossa Gestão de Obra
                </h3>
                <p className="mt-2 text-sm text-araca-cafe-escuro/80 font-body max-w-xl">
                  Garantimos fidelidade absoluta ao projeto executivo, conformidade técnica e respeito rígido ao cronograma de inauguração da sua empresa.
                </p>
              </div>
            </div>

            <Link
              href="/servicos/gestao-acompanhamento-de-obra"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'bg-araca-mineral-green text-white hover:bg-araca-mineral-green/90 rounded-2xl shrink-0 gap-2 shadow-md'
              )}
            >
              <span>Ver Gestão de Obra</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
