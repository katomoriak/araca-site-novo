'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Home,
  CheckCircle2,
  HardHat,
  MessageCircle,
  Sofa,
  UtensilsCrossed,
  BedDouble,
  Box,
  FileSpreadsheet,
  Palette,
  Building2,
  Waves,
  Hammer,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

// Imagens reais da galeria
const HERO_RESIDENCIAL = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'
const IMG_ALTO_PADRAO = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png'
const IMG_SALA = 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png'
const IMG_COZINHA = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'
const IMG_QUARTO = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png'

const TIPOLOGIAS_RESIDENCIAIS = [
  {
    title: 'Casas & Sobrados',
    tag: 'Grandes Metragens',
    desc: 'Livings com pé-direito duplo, integração com piscina e jardim, gourmet completo e suítes master privativas.',
    href: '/servicos/residencial/casas',
    icon: Home,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
  },
  {
    title: 'Apartamentos',
    tag: 'Novos & na Planta',
    desc: 'Varandas gourmet integradas ao living, marcenaria milimétrica sob medida e soluções para otimização de espaço.',
    href: '/servicos/residencial/apartamentos',
    icon: Building2,
    img: 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png',
  },
  {
    title: 'Coberturas & Penthouses',
    tag: 'Exclusividade nas Alturas',
    desc: 'Área externa privativa com deck e spa, salão gourmet panorâmico, escadas esculturais e automação total.',
    href: '/servicos/residencial/coberturas',
    icon: Waves,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(18).png',
  },
  {
    title: 'Reformas & Retrofit',
    tag: 'Modernização Total',
    desc: 'Renovação estrutural e estética de imóveis tradicionais, demolição com ART/RRT e gestão de obra sem estresse.',
    href: '/servicos/residencial/reformas-retrofit',
    icon: Hammer,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
]

const AMBIENTES = [
  {
    title: 'Salas e Áreas Sociais Integradas',
    desc: 'Integração harmônica entre estar, jantar e varanda. Ambientes amplos e acolhedores com iluminação cênica, mobiliário sob medida e circulação inteligente para receber amigos e celebrar a convivência.',
    icon: Sofa,
    img: IMG_SALA,
  },
  {
    title: 'Cozinhas Funcionais e Espaços Gourmet',
    desc: 'O coração da casa com ergonomia impecável. Bancadas em pedras nobres, ilhas integradas, marcenaria planejada milimétrica e eletrodomésticos embutidos para transformar o cozinhar em experiência.',
    icon: UtensilsCrossed,
    img: IMG_COZINHA,
  },
  {
    title: 'Suítes, Quartos e Banheiros Aconchegantes',
    desc: 'Verdadeiros refúgios de descanso. Cabeceiras estofadas, iluminação indireta relaxante, closets funcionais e banheiros com atmosfera de spa, equilibrando estética sofisticada e relaxamento profundo.',
    icon: BedDouble,
    img: IMG_QUARTO,
  },
]

const ETAPAS_MODULARES = [
  {
    step: 'Módulo 1',
    title: 'Módulo 1: Conceito e Visualização em 3D',
    shortTitle: 'Conceito e Visualização em 3D',
    icon: Box,
    desc: 'Estudo do espaço, layout funcional, moodboard de texturas e renderizações 3D fotorrealistas em 360° para você vivenciar sua nova casa antes mesmo da primeira demolição.',
    items: ['Planta de layout 2D com fluxos', 'Perspectivas 3D fotorrealistas', 'Curadoria de paleta de cores e acabamentos'],
  },
  {
    step: 'Módulo 2',
    title: 'Módulo 2: Detalhamento Técnico de Marcenaria e Instalações',
    shortTitle: 'Detalhamento Técnico de Marcenaria e Instalações',
    icon: FileSpreadsheet,
    desc: 'O caderno executivo que orienta a obra: plantas de demolição, hidráulica, elétrica, forro de gesso, paginação de pisos nobres e detalhamento milimétrico de armários e marcenaria.',
    items: ['Projeto luminotécnico completo', 'Detalhamento de marcenaria e marmoraria', 'Caderno executivo compatibilizado'],
  },
  {
    step: 'Módulo 3',
    title: 'Módulo 3: Produção Final e Ambientação',
    shortTitle: 'Produção Final e Ambientação',
    icon: Palette,
    desc: 'A etapa que dá alma ao lar: escolha de tapetes, cortinas, almofadas, obras de arte, objetos decorativos e vegetação natural, transformando o espaço em uma experiência sensorial única.',
    items: ['Seleção de cortinas e tapeçaria', 'Curadoria de quadros e esculturas', 'Styling e produção fotográfica final'],
  },
]

export default function ResidencialPage() {
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
            src={HERO_RESIDENCIAL}
            alt="Design de Interiores Residencial no Grande ABC e São Paulo"
            fill
            className="object-cover opacity-40"
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
                  { label: 'Projetos Residenciais' },
                ]}
                theme="dark"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-araca-creme/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-araca-creme">
                <Home className="h-3.5 w-3.5" />
                Casas, Apartamentos e Coberturas
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Design de Interiores Residencial no Grande ABC e São Paulo
              </h1>

              <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-body max-w-2xl mx-auto">
                Traduzimos a história e a rotina da sua família em ambientes acolhedores, funcionais e cheios de vida. Criamos projetos completos para apartamentos novos na planta, casas e coberturas.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20projeto%20de%20interiores%20residencial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-[#d4af37] text-neutral-950 hover:bg-[#c29d2b] font-semibold rounded-2xl shadow-lg'
                  )}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Solicitar Proposta Residencial
                </a>
                <Link
                  href="/projetos"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/30 text-white hover:bg-white/10 rounded-2xl'
                  )}
                >
                  Ver Projetos Executados
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          </Container>
        </div>

        <div className="relative z-10 h-10 bg-gradient-to-b from-transparent to-[#faf8f5]" />
      </section>

      {/* Seção Especial: Escolha a Tipologia do Seu Imóvel */}
      <section className="py-16 sm:py-20 bg-[#faf8f5] border-b border-neutral-200/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Especialidades Residenciais
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-araca-chocolate-amargo">
              Escolha a Tipologia do Seu Imóvel
            </h2>
            <p className="mt-3 text-sm sm:text-base text-araca-cafe-escuro/75 font-body">
              Projetos sob medida para cada tipo de arquitetura e momento de vida da sua família. Conheça nossas soluções especializadas:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIPOLOGIAS_RESIDENCIAIS.map((tipo, idx) => {
              const Icon = tipo.icon
              return (
                <Link
                  key={idx}
                  href={tipo.href}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={tipo.img}
                      alt={tipo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-araca-cafe-escuro/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-araca-dourado-ocre border border-white/10">
                      {tipo.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-araca-mineral-green" />
                        <h3 className="font-display font-semibold text-lg text-araca-chocolate-amargo group-hover:text-araca-mineral-green transition-colors">
                          {tipo.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                        {tipo.desc}
                      </p>
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-araca-mineral-green group-hover:translate-x-1 transition-transform">
                      Explorar página <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 1: Ambientes Planejados Para o Seu Dia a Dia */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Ambientes Sob Medida
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              Ambientes Planejados Para o Seu Dia a Dia
            </h2>
            <p className="mt-4 text-base sm:text-lg text-araca-cafe-escuro/75 font-body">
              Cada cômodo da sua casa pensado nos mínimos detalhes para unir conforto térmico, fluidez de circulação e beleza atemporal.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {AMBIENTES.map((amb, i) => {
              const Icon = amb.icon
              return (
                <motion.article
                  key={amb.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-neutral-200/70 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-neutral-200">
                    <Image
                      src={amb.img}
                      alt={amb.title}
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
                        {amb.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-araca-cafe-escuro/80 font-body">
                        {amb.desc}
                      </p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 2: Etapas do Projeto Residencial (Modelo Modular) */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200/60">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
              Metodologia Transparente
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl md:text-5xl">
              Etapas do Projeto Residencial (Modelo Modular)
            </h2>
            <p className="mt-4 text-base sm:text-lg text-araca-cafe-escuro/75 font-body">
              Você tem total clareza do investimento e liberdade para contratar o ciclo completo ou os módulos que seu momento exige.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {ETAPAS_MODULARES.map((etapa, idx) => {
              const Icon = etapa.icon
              return (
                <div
                  key={etapa.step}
                  className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-[#faf8f5] p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="rounded-full bg-araca-mineral-green/10 px-3.5 py-1 text-xs font-bold text-araca-mineral-green">
                        {etapa.step}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-araca-chocolate-amargo">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-bold text-araca-chocolate-amargo leading-snug">
                      {etapa.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-araca-cafe-escuro/80 font-body">
                      {etapa.desc}
                    </p>

                    <div className="mt-6 pt-6 border-t border-neutral-200/60 space-y-2.5">
                      {etapa.items.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-xs text-araca-cafe-escuro/90">
                          <CheckCircle2 className="h-4 w-4 text-araca-mineral-green shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Seção 3: Veja Nossos Projetos Residenciais Executados */}
      <section className="py-20 sm:py-28 bg-[#faf8f5]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-araca-mineral-green">
                Portfólio de Obras e Lares
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl">
                Veja Nossos Projetos Residenciais Executados
              </h2>
              <p className="mt-3 text-base text-araca-cafe-escuro/75 font-body max-w-xl">
                Inspire-se com apartamentos e casas transformados por nossos projetos em Santo André, São Bernardo, São Caetano e São Paulo.
              </p>
            </div>
            <Link
              href="/projetos"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'default' }),
                'rounded-xl border-neutral-300 text-araca-chocolate-amargo hover:bg-araca-chocolate-amargo hover:text-white transition-colors shrink-0'
              )}
            >
              Explorar Todos os Projetos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Link
              href="/projetos/areasocial_residencia-ninhoverce"
              className="group relative overflow-hidden rounded-3xl bg-neutral-900 shadow-md aspect-[16/10]"
            >
              <Image
                src="https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png"
                alt="Projeto Residência Ninho Verde - Área Social Integrada"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  Casa de Condomínio
                </span>
                <p className="mt-1 font-display text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  Residência Ninho Verde — Área Social
                </p>
                <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2 font-body">
                  Conexão biofílica, living com pé direito duplo e integração harmoniosa entre ambientes de lazer e estar.
                </p>
              </div>
            </Link>

            <Link
              href="/projetos/aintima_residencianinhoverde"
              className="group relative overflow-hidden rounded-3xl bg-neutral-900 shadow-md aspect-[16/10]"
            >
              <Image
                src={IMG_ALTO_PADRAO}
                alt="Projeto Residencial de Alto Padrão no ABC"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  Apartamento de Alto Padrão
                </span>
                <p className="mt-1 font-display text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                  Projeto Residencial Alto Padrão — ABC
                </p>
                <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2 font-body">
                  Marcenaria sob medida, iluminação arquitetural e paleta contemporânea para conforto familiar diário.
                </p>
              </div>
            </Link>
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
                  Serviço Complementar
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-araca-chocolate-amargo">
                  Vai reformar? Conheça também nossa Gestão e Acompanhamento de Obra
                </h3>
                <p className="mt-2 text-sm text-araca-cafe-escuro/80 font-body max-w-xl">
                  Evite retrabalho, desperdício de material e atrasos com visitas técnicas presenciais, compatibilização com empreiteiros e rigoroso controle de acabamentos.
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
