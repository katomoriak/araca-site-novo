'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteNav } from '@/components/layout/SiteNav'
import { RenovationCalculator } from '@/components/calculadora/RenovationCalculator'
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building,
  Home,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Flame,
  Droplets,
  Zap,
  Phone,
  MessageCircle,
  Table,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COMPARISON_TABLE = [
  {
    standard: 'Essencial / Revitalização',
    rangeM2: 'R$ 1.250 a R$ 1.800 / m²',
    profile: 'Imóveis para locação rápida, primeira moradia ou retrofit econômico sem quebra-quebra pesado',
    finishes: 'Pintura látex acrílica de boa qualidade, pequenos reparos e preservação dos revestimentos existentes.',
    installations: 'Manutenção dos pontos existentes de hidráulica e disjuntores, com iluminação de sobrepor.',
    woodwork: 'Móveis modulados ou ajustes pontuais em marcenaria existente.',
  },
  {
    standard: 'Custo-Benefício Inteligente',
    rangeM2: 'R$ 2.050 a R$ 2.850 / m²',
    profile: 'Reforma completa funcional com materiais duráveis e marcenaria pontual planejada',
    finishes: 'Pisos vinílicos modernos ou porcelanatos até 84x84cm, pintura acrílica acetinada e bancadas em granitos nobres.',
    installations: 'Novos pontos de tomadas, revisão hidráulica, iluminação básica embutida em forro de gesso pontual.',
    woodwork: 'Marcenaria sob medida funcional para cozinha, área de serviço e gabinetes de banheiro.',
  },
  {
    standard: 'Médio / Conforto',
    rangeM2: 'R$ 3.100 a R$ 4.300 / m²',
    profile: 'Famílias que buscam estética elegante e durabilidade com excelente custo-benefício',
    finishes: 'Porcelanatos retificados grandes (80x80 a 90x90), bancadas em quartzo ou mármore nacional, gesso com LED.',
    installations: 'Revisão total de pontos elétricos, novas tomadas, infra de ar-condicionado e novos registros.',
    woodwork: 'Marcenaria 100% sob medida em MDF com corrediças amortecidas na cozinha, banheiros e suíte.',
  },
  {
    standard: 'Alto Padrão / Assinatura Aracá',
    rangeM2: 'R$ 5.200 a R$ 7.800+ / m²',
    profile: 'Residências e apartamentos de luxo que priorizam exclusividade, conforto acústico e acabamentos nobres',
    finishes: 'Grandes lastras (120x240cm) ou madeira natural, bancadas esculpidas em Dekton ou Mármores nobres.',
    installations: 'Forro monolítico com automação luminotécnica, ar-condicionado embutido dutado, cabeamento estruturado.',
    woodwork: 'Marcenaria autoral de alta marcenaria com serralheria fina, vidro reflecta, iluminação e ferragens Blum.',
  },
]

const INTERNAL_LINKS_HUB = [
  {
    title: 'Quanto Custa Reformar Apartamento?',
    description:
      'Custos específicos para apartamentos na planta e usados: prazos de condomínio, normas ABNT NBR 16.280, emissão de RRT e integração de varanda com living.',
    href: '/servicos/residencial/apartamentos',
    badge: 'Apartamentos',
    icon: Building,
  },
  {
    title: 'Quanto Custa Reformar Casa e Sobrado?',
    description:
      'Desafios de reformas residenciais térreas e sobrados: impermeabilização de lajes, telhados, retrofit de fachadas, ampliações e área gourmet com piscina.',
    href: '/servicos/residencial/casas',
    badge: 'Casas & Sobrados',
    icon: Home,
  },
  {
    title: 'Quanto Custa Reformar Escritório & Comercial?',
    description:
      'Investimento por m² para espaços corporativos, consultórios e clínicas: piso elevado, drywall acústico, dados e normas de acessibilidade.',
    href: '/servicos/comercial-corporativo/escritorios',
    badge: 'Corporativo',
    icon: Briefcase,
  },
  {
    title: 'Reforma Completa com Gestão e Projeto Executivo',
    description:
      'Conheça nosso serviço Turnkey completo: do projeto 3D milimétrico ao acompanhamento diário no canteiro de obras em SP e Santo André.',
    href: '/reforma-de-interiores-residencial',
    badge: 'Gestão Turnkey',
    icon: Layers,
  },
  {
    title: 'Tabelas Oficiais CUB e SINAPI de Reforma',
    description:
      'Consulte a metodologia oficial do SindusCon-SP (CUB/SP) e da Caixa/IBGE (SINAPI) aplicadas para compor custos por m² em reformas e projetos.',
    href: '/tabela-cub-sinapi',
    badge: 'Índices Oficiais',
    icon: Table,
  },
]

const FAQ_ITEMS = [
  {
    q: 'Quanto custa fazer uma reforma em São Paulo e no ABC?',
    a: 'O investimento médio para reformar varia pelo padrão de acabamento por m²: 1) Padrão Essencial / Revitalização (R$ 1.250 a R$ 1.800/m² - pintura geral e pequenos reparos sem demolições pesadas); 2) Custo-Benefício Inteligente (R$ 2.050 a R$ 2.850/m² - pisos duráveis, nova iluminação e marcenaria planejada nos pontos-chave); 3) Médio Padrão (R$ 3.100 a R$ 4.300/m² - porcelanatos retificados, gesso com sancas e luz cênica, bancadas nobres em quartzo); 4) Alto Padrão (R$ 5.200 a R$ 7.800+/m² - grandes lastras, climatização e marcenaria autoral). Em um apartamento de 70m², o valor total transita entre R$ 90 mil e R$ 400 mil+.',
  },
  {
    q: 'Por que o custo por m² de banheiros e cozinhas é muito maior do que salas e quartos?',
    a: 'Banheiros e cozinhas são denominados "áreas molhadas". Nesses cômodos concentram-se a maior densidade de custos: impermeabilização obrigatória de contrapiso e paredes, revestimento de todas as faces verticais, bancadas maciças de pedra com cubas esculpidas, registros de pressão, encanamentos de água quente e fria, louças sanitárias, metais finos e marcenaria de alta resistência com ferragens especiais.',
  },
  {
    q: 'Quais etapas costumam encarecer o orçamento de uma reforma?',
    a: 'Os três itens de maior peso financeiro são: 1) Marcenaria sob medida (pode representar de 20% a 30% do orçamento total dependendo da quantidade de armários e painéis ripados); 2) Pisos e Revestimentos de grandes formatos com mão de obra qualificada de assentamento; 3) Marmoraria nobre (ilhas em quartzos, Dekton ou mármores exóticos). Alterações não planejadas no meio da obra também encarecem o custo em até 40%.',
  },
  {
    q: 'Como funciona a estimativa da calculadora? Ela garante o preço final ou vincula a contratação?',
    a: 'Não. Os valores gerados constituem uma estimativa paramétrica de custo e simulação preliminar para planejamento orçamentário, não representando cotação fechada ou proposta comercial vinculante (Arts. 30 e 35 do Código de Defesa do Consumidor e Arts. 186/927 do Código Civil). Um orçamento formal executivo definitivo exige a elaboração de Projeto de Design de Interiores Executivo e vistoria técnica presencial com emissão de ART/RRT de reforma em conjunto com nossos engenheiros ou arquitetos parceiros credenciados.',
  },
  {
    q: 'A Aracá Interiores é formada por arquitetos ou designers de interiores e decoradores?',
    a: 'Somos um estúdio de Designers de Interiores e Decoradores. Focamos no bem-estar, estética, ergonomia dos espaços, projetos 3D e marcenaria sob medida. Para condomínios e reformas que demandam responsabilidade técnica legal (norma ABNT NBR 16.280), viabilizamos a emissão de ART (CREA) ou RRT (CAU) através de engenheiros e arquitetos parceiros credenciados.',
  },
  {
    q: 'A Aracá atende reformas em quais regiões?',
    a: 'Atuamos fortemente em toda a cidade de São Paulo (Jardins, Moema, Perdizes, Pinheiros, Itaim Bibi, Vila Nova Conceição, Tatuapé, Santana) e no Grande ABC (Santo André, São Bernardo do Campo e São Caetano do Sul).',
  },
]

export function QuantoCustaReformarClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const heroHeight = () => (typeof window !== 'undefined' ? window.innerHeight : 700)
    const handleScroll = () => {
      const y = window.scrollY
      const scrollingUp = y < lastScrollY.current
      const pastHero = y > heroHeight() * 0.6
      lastScrollY.current = y
      setShowFloatingNav(pastHero && scrollingUp)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="relative overflow-visible pb-24 text-[var(--araca-cafe-escuro)]">
      {/* ── Menu Flutuante ao Rolar para Cima ── */}
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

      {/* 1. HERO SECTION COM FOTO DE FUNDO (PROJETO ELYSÉE), MENU INTEGRADO E TRANSIÇÃO EM DEGRADÊ */}
      <section className="relative -mt-6 sm:-mt-8 mb-8 sm:mb-14 min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between overflow-hidden text-white">
        {/* Imagem de Fundo (Projeto Elysée) */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Image
            src="https://img.araca.arq.br/_thumbs/midias/apto_elysee/Sala%204.jpg_w1200_q80.webp"
            alt="Projeto Elysée — Aracá Interiores"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Overlay Nobre escuro para contraste impecável e legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden
          />
        </div>

        {/* Menu integrado transparente (dark-bg) sobre a foto do topo — sem faixa bege */}
        <div className="relative z-20 pt-6 pb-2">
          <SiteNav theme="dark-bg" noEnterAnimation />
        </div>

        {/* Conteúdo Central do Hero */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center">
          {/* Breadcrumb Visual */}
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className="inline-flex items-center space-x-2 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-[var(--araca-dourado-claro)] transition-colors">
                  Home
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link href="/servicos" className="hover:text-[var(--araca-dourado-claro)] transition-colors">
                  Serviços
                </Link>
              </li>
              <li>•</li>
              <li className="font-semibold text-[var(--araca-dourado-claro)]">
                Quanto Custa Reformar
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-[var(--araca-bege-claro)] border border-white/25 backdrop-blur-md mb-6 self-center">
            <Calculator className="w-3.5 h-3.5 text-[var(--araca-dourado-claro)]" />
            <span>Ferramenta Interativa de Planejamento • Aracá Interiores</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white max-w-4xl mx-auto mb-6 leading-[1.1] drop-shadow-md">
            Quanto Custa Reformar? Descubra o Custo por m²
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-10 drop-shadow-sm">
            Planejando transformar seu apartamento ou casa? Utilize nosso simulador paramétrico com
            base nos valores consolidados do mercado de alto padrão de São Paulo e Grande ABC.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#calculadora-card"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-sm sm:text-base transition-all duration-300 shadow-xl shadow-[var(--araca-mineral-green)]/30 hover:scale-[1.02] border border-white/20"
            >
              <Calculator className="w-5 h-5 text-[var(--araca-dourado-claro)]" />
              <span>Iniciar Simulação na Calculadora</span>
            </a>

            <a
              href="#tabela-precos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm sm:text-base border border-white/30 backdrop-blur-md transition-all shadow-md"
            >
              <span>Ver Tabela Média por m²</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Degrade do hero sumindo suavemente para o tom bege da página (igual na home) */}
        <div
          className="relative z-10 w-full h-24 sm:h-36 bg-gradient-to-b from-transparent via-[var(--araca-creme)]/60 to-[var(--araca-creme)] pointer-events-none -mb-px"
          aria-hidden
        />
      </section>

      {/* 2. O COMPONENTE INTERATIVO DA CALCULADORA (EMOLDURADO EM CARD DE DESTAQUE) */}
      <section id="calculadora-card" className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-14 max-w-7xl mx-auto scroll-mt-24">
        {/* Card Contêiner com Fundo e Sombra Distintos - overflow-visible para permitir sticky do card de resultado */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#FAF7F2] to-[#F2EDE4] border border-[var(--araca-bege-medio)]/60 p-6 sm:p-10 lg:p-12 shadow-[0_24px_70px_rgba(48,22,12,0.09)]">
          {/* Luz de fundo decorativa com rounded clip */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
            <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-[var(--araca-dourado-ocre)]/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--araca-mineral-green)]/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <RenovationCalculator />

            {/* Aviso de Transparência & Isenção Técnica na Base da Calculadora */}
            <div className="mt-8 pt-6 border-t border-[var(--araca-bege-medio)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--araca-chocolate-amargo)]/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
                <span>
                  <strong>Estimativa de Custo Não Vinculante:</strong> Valores de referência paramétrica para SP e ABC. Não constitui cotação fechada ou proposta comercial vinculante (CDC / CC). ART/RRT de condomínio emitida em parceria com engenheiros e arquitetos credenciados.
                </span>
              </div>
              <div className="text-[11px] text-[var(--araca-chocolate-amargo)]/50 shrink-0">
                Data-base: Atualizado 2025/2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABELA COMPARATIVA DE CUSTOS POR M² (SEO & VALOR PERCEBIDO) */}
      <section id="tabela-precos" className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold text-[var(--araca-mineral-green)] mb-1">
            Transparência & Mercado
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--araca-cafe-escuro)] font-normal mb-4">
            Quanto Custa Reformar por m²? Comparativo por Padrão
          </h2>
          <p className="text-sm sm:text-base text-[var(--araca-chocolate-amargo)]/80 leading-relaxed font-light">
            O valor de uma reforma depende fundamentalmente do padrão de especificações dos
            revestimentos e do volume de marcenaria sob medida. Confira o comparativo detalhado:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPARISON_TABLE.map((row) => (
            <div
              key={row.standard}
              className={cn(
                'rounded-3xl p-6 sm:p-7 backdrop-blur-md border flex flex-col justify-between transition-all duration-300',
                row.standard.includes('Alto Padrão')
                  ? 'bg-white/95 border-[var(--araca-mineral-green)] shadow-xl ring-2 ring-[var(--araca-mineral-green)]/20'
                  : 'bg-white/70 border-[var(--araca-bege-medio)]/50 shadow-sm'
              )}
            >
              <div>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)] mb-3">
                  {row.standard}
                </div>

                <div className="font-display text-2xl font-normal text-[var(--araca-cafe-escuro)] mb-2">
                  {row.rangeM2}
                </div>

                <div className="text-xs text-[var(--araca-chocolate-amargo)]/70 mb-4 pb-4 border-b border-[var(--araca-bege-medio)]/30 font-medium">
                  Perfil típico: {row.profile}
                </div>

                <div className="space-y-3 text-xs text-[var(--araca-chocolate-amargo)]/85">
                  <div>
                    <strong className="text-[var(--araca-cafe-escuro)] block mb-0.5">Acabamentos:</strong>
                    <span>{row.finishes}</span>
                  </div>

                  <div>
                    <strong className="text-[var(--araca-cafe-escuro)] block mb-0.5">Instalações & Elétrica:</strong>
                    <span>{row.installations}</span>
                  </div>

                  <div>
                    <strong className="text-[var(--araca-cafe-escuro)] block mb-0.5">Marcenaria:</strong>
                    <span>{row.woodwork}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--araca-bege-medio)]/30">
                <a
                  href="#calculadora"
                  className="text-xs font-semibold text-[var(--araca-mineral-green)] hover:text-[var(--araca-mineral-green-hover)] flex items-center gap-1"
                >
                  <span>Simular este padrão na ferramenta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Card informativo de vinculação com CUB / SINAPI */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white/70 border border-[var(--araca-bege-medio)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center shrink-0">
              <Table className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                Metodologia Baseada em Tabelas Oficiais CUB e SINAPI
              </h4>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
                Consulte os indicadores paramétricos do SindusCon-SP e baixe os cadernos técnicos oficiais do SINAPI 2026 em PDF.
              </p>
            </div>
          </div>
          <Link
            href="/tabela-cub-sinapi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] text-xs font-semibold border border-[var(--araca-bege-medio)] shadow-2xs transition-all shrink-0 ml-auto sm:ml-0"
          >
            <span>Ver Tabelas CUB & SINAPI</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--araca-mineral-green)]" />
          </Link>
        </div>
      </section>

      {/* 4. HUB DE PÁGINAS DE BACKLINK INTERNO (PREPARADO PARA EXPANSÃO) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent via-[var(--araca-creme)]/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-wider font-semibold text-[var(--araca-mineral-green)] mb-1">
              Guias por Tipologia de Imóvel
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--araca-cafe-escuro)] font-normal mb-4">
              Explore Custos por Tipo de Projeto
            </h2>
            <p className="text-sm sm:text-base text-[var(--araca-chocolate-amargo)]/80 leading-relaxed font-light">
              Cada categoria de imóvel apresenta peculiaridades estruturais, logísticas e normativas
              que impactam diretamente o cronograma e o custo final da obra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INTERNAL_LINKS_HUB.map((hub) => {
              const Icon = hub.icon
              return (
                <Link
                  key={hub.title}
                  href={hub.href}
                  className="group p-6 sm:p-7 rounded-3xl bg-white/80 hover:bg-white border border-[var(--araca-bege-medio)]/40 hover:border-[var(--araca-mineral-green)] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--araca-bege-claro)] text-[var(--araca-chocolate-amargo)]">
                        {hub.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-[var(--araca-cafe-escuro)] group-hover:text-[var(--araca-mineral-green)] transition-colors mb-2 font-medium">
                      {hub.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                      {hub.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--araca-bege-medio)]/30 flex items-center justify-between text-xs font-semibold text-[var(--araca-mineral-green)] group-hover:translate-x-1 transition-transform">
                    <span>Acessar guia e detalhes</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO EDUCATIVA: POR QUE ÁREAS MOLHADAS CUSTAM MAIS? */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-[var(--araca-bege-medio)]/50 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)]">
              <Droplets className="w-3.5 h-3.5" />
              <span>Engenharia & Arquitetura</span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl text-[var(--araca-cafe-escuro)] leading-tight">
              Por que banheiros e cozinhas concentram a maior parte do orçamento?
            </h3>

            <p className="text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed font-light">
              Em uma reforma de interiores, as áreas molhadas ocupam tipicamente apenas 20% a 25% da
              metragem quadrada total do imóvel, mas chegam a representar <strong>45% a 55% de todo o custo de materiais e mão de obra</strong>.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/90 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <span>
                  <strong>Impermeabilização profissional:</strong> Obrigatória para evitar infiltrações no vizinho inferior e custos judiciais futuros.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <span>
                  <strong>Revestimento 360° e recortes:</strong> Azulejos ou porcelanatos sobem até o teto em todas as 4 paredes, exigindo assentamento especializado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <span>
                  <strong>Bancadas maciças & cubas esculpidas:</strong> Pedras nobres (quartzos, mármores ou granitos escovados) com acabamento meia-esquadria.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <span>
                  <strong>Rede hidráulica e gás:</strong> Ramais de água quente/fria, novos ralos ocultos, registros e desvios de prumadas.
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--araca-creme)] border border-[var(--araca-bege-medio)]/60 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center mx-auto">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="font-display text-2xl text-[var(--araca-cafe-escuro)]">
              Multiplicador de 1.7x a 2.4x
            </div>
            <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
              É por essa razão técnica que a nossa calculadora conta com o <strong>Modo por Ambientes</strong>: ele pondera matematicamente o peso de cada banheiro e cozinha para garantir uma estimativa muito mais realista do que simples multiplicações lineares.
            </p>
            <a
              href="#calculadora"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--araca-mineral-green)] hover:underline pt-1"
            >
              <span>Testar simulação por cômodos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. FAQ - PERGUNTAS FREQUENTES (SEO SNIPPETS) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tira-Dúvidas Técnico</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--araca-cafe-escuro)] font-normal">
            Perguntas Frequentes sobre Custo de Reforma
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/40 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-medium text-[var(--araca-cafe-escuro)] hover:text-[var(--araca-mineral-green)] transition-colors"
                >
                  <span className="font-display text-lg sm:text-xl text-[var(--araca-cafe-escuro)]">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-200 text-[var(--araca-mineral-green)]',
                      isOpen ? 'rotate-180' : ''
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed border-t border-[var(--araca-bege-medio)]/20 animate-in fade-in duration-200 font-light">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 7. CTA FINAL COM OS ARQUITETOS DA ARACÁ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--araca-mineral-green)] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atendimento Técnico Exclusivo</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              Deseja um Orçamento Executivo com Plantas e Visita Técnica?
            </h3>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              Converse diretamente com os arquitetos titulares da Aracá Interiores. Avaliaremos a
              planta do seu imóvel e apresentaremos uma proposta sob medida com previsão de prazos e
              custos garantidos por contrato.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20o%20or%C3%A7amento%20e%20projeto%20da%20minha%20reforma%20com%20a%20Arac%C3%A1%20Interiores."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-medium text-sm hover:bg-[#20bd5a] transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Conversar no WhatsApp</span>
              </a>

              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[var(--araca-cafe-escuro)] font-medium text-sm hover:bg-white/90 transition-all shadow-md active:scale-95"
              >
                <span>Enviar Dados no Formulário</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
