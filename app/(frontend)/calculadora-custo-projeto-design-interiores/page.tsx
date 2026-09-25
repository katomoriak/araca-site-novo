import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Compass,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Layers,
  FileCheck2,
  Palette,
  Shield,
  Clock,
  Building2,
  HelpCircle,
  PhoneCall,
  BadgeCheck,
  AlertCircle,
  Hammer,
  HeartHandshake,
  Lightbulb,
  ChevronDown,
  Table,
  ArrowRight,
} from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { CotacaoProjetoReformaForm } from '@/components/calculadora'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/calculadora-custo-projeto-design-interiores`

export const metadata: Metadata = {
  title: {
    absolute: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
  },
  description:
    'Descubra quanto custa o projeto de interiores e reforma em São Paulo e no ABC. Simule estimativas com a Aracá Interiores!',
  keywords: [
    'quanto custa um projeto de interiores',
    'quanto custa uma obra de interiores',
    'estimativa custo projeto design interiores',
    'calculadora de projeto de interiores',
    'simulador obra de interiores sao paulo',
    'valor m2 projeto design interiores sp',
    'designers de interiores e decoradores sp abc',
    'araca interiores',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
    description:
      'Descubra quanto custa o projeto de interiores e reforma em São Paulo e no ABC. Simule estimativas com a Aracá Interiores!',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
    description:
      'Descubra quanto custa o projeto de interiores e reforma em São Paulo e no ABC. Simule estimativas com a Aracá Interiores!',
  },
}

export default function CalculadoraCustoProjetoInterioresPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de Estimativa de Custo de Projeto e Obra de Interiores Aracá',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    url: canonical,
    description:
      'Ferramenta interativa de estimativa paramétrica para Projeto de Design de Interiores e Obra de Reforma em São Paulo e Grande ABC.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    author: {
      '@type': 'Organization',
      name: 'Aracá Interiores',
      url: baseUrl,
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quanto custa um projeto de interiores em São Paulo e no ABC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O valor de um projeto completo de design de interiores varia tipicamente entre R$ 40 e R$ 80 por m² em São Paulo e Grande ABC. O preço depende da área total, complexidade dos ambientes, volume de detalhamento de marcenaria sob medida e especificações executivas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto custa uma obra de interiores?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Uma obra de interiores varia expressivamente conforme o padrão de acabamento escolhido: Padrão Essencial (R$ 1.250 a R$ 1.800/m²), Custo-Benefício Inteligente (R$ 2.050 a R$ 2.850/m²), Médio Padrão (R$ 3.100 a R$ 4.300/m²) e Alto Padrão (R$ 5.200 a R$ 7.800+/m²). Esses valores contemplam mão de obra especializada, materiais e marcenaria.',
        },
      },
      {
        '@type': 'Question',
        name: 'A Aracá Interiores é formada por arquitetos ou designers de interiores e decoradores?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Somos um estúdio especializado de Designers de Interiores e Decoradores — não somos escritório de arquitetura pura. Nosso foco é a experiência humana, layout 3D, ergonomia, iluminação decorativa cênica, marcenaria sob medida, seleção de mobiliário, tecidos e paleta de cores. Para condomínios e reformas com alterações em paredes ou instalações (ABNT NBR 16.280), viabilizamos a emissão de ART/RRT através de engenheiros e arquitetos parceiros credenciados.',
        },
      },
      {
        '@type': 'Question',
        name: 'A ferramenta gera uma cotação vinculante ou uma estimativa de custo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A ferramenta gera uma estimativa de custo paramétrica não vinculante, ideal para planejamento orçamentário. Não constitui cotação comercial fechada ou proposta vinculante. O orçamento executivo formal é validado por nossos designers após alinhamento do briefing e levantamento das plantas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como funciona a emissão de ART ou RRT para reformas em condomínio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Anotação de Responsabilidade Técnica (ART via CREA) ou Registro de Responsabilidade Técnica (RRT via CAU) exigida pelos condomínios conforme a NBR 16.280 é emitida por engenheiros ou arquitetos parceiros habilitados da Aracá Interiores, garantindo aprovação rápida e segurança técnica.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION COM FOTO DE FUNDO, MENU INTEGRADO E TRANSIÇÃO EM DEGRADÊ */}
      <section className="relative -mt-6 sm:-mt-8 mb-8 sm:mb-14 min-h-[620px] sm:min-h-[700px] lg:min-h-[750px] flex flex-col justify-between overflow-hidden text-white">
        {/* Imagem de Fundo (Projeto Aracá Interiores) */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Image
            src="https://img.araca.arq.br/_thumbs/midias/apto_elysee/Sala%20de%20Jantar%20-%2002.jpg_w1200_q80.webp"
            alt="Projeto e Obra de Design de Interiores — Aracá Interiores"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Overlay Escuro com gradiente elegante */}
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

        {/* Menu integrado transparente (dark-bg) sobre a foto */}
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
                Calculadora de Projetos
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-[var(--araca-bege-claro)] border border-white/25 backdrop-blur-md mb-6 self-center">
            <Compass className="w-3.5 h-3.5 text-[var(--araca-dourado-claro)]" />
            <span>Estimativa de Custo • Projeto & Obra de Interiores</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white max-w-4xl mx-auto mb-6 leading-[1.1] drop-shadow-md">
            Quanto Custa um Projeto e Obra de Interiores?
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-8 drop-shadow-sm">
            Descubra a <strong>estimativa preliminar de investimento</strong> para transformar seu espaço com design inteligente, layout 3D e acompanhamento de reforma em São Paulo e Grande ABC.
          </p>

          {/* Micro-benefícios de Confiança & Clareza */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-white/80 mb-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
              <span>Estimativa paramétrica não vinculante</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
              <span>Designers de Interiores & Decoradores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
              <span>ART/RRT com parceiros credenciados</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#formulario-cotacao"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-sm sm:text-base transition-all duration-300 shadow-xl shadow-[var(--araca-mineral-green)]/30 hover:scale-[1.02] border border-white/20"
            >
              <Compass className="w-5 h-5 text-[var(--araca-dourado-claro)]" />
              <span>Simular Estimativa de Projeto</span>
            </a>

            <a
              href="#valores-referencia"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm sm:text-base border border-white/30 backdrop-blur-md transition-all shadow-md"
            >
              <span>Ver Valores Médios por m²</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Degrade do hero sumindo suavemente para o tom bege da página (igual na calculadora de reforma) */}
        <div
          className="relative z-10 w-full h-24 sm:h-36 bg-gradient-to-b from-transparent via-[var(--araca-creme)]/60 to-[var(--araca-creme)] pointer-events-none -mb-px"
          aria-hidden
        />
      </section>

      <main className="min-h-screen bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] pt-2 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* BANNER DE IDENTIDADE & ESCLARECIMENTO TÉCNICO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/80 text-left text-xs text-[var(--araca-chocolate-amargo)]/80 space-y-1.5 shadow-xs max-w-3xl mx-auto">
            <div className="flex items-center gap-2 font-bold text-[var(--araca-cafe-escuro)] text-xs uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
              <span>Nossa Atuação: Designers de Interiores & Decoradores</span>
            </div>
            <p className="leading-relaxed">
              Somos <strong>designers de interiores e decoradores</strong> especialistas em transformar a convivência, ergonomia e beleza dos ambientes. Focamos no que você mais vivencia: layout personalizado, marcenaria sob medida, iluminação decorativa e paleta sensorial. Para condomínios e intervenções civis (ABNT NBR 16.280), viabilizamos toda a responsabilidade técnica (ART/RRT) junto a engenheiros e arquitetos parceiros credenciados.
            </p>
          </div>

          {/* COMPONENTE DO FORMULÁRIO MULTI-STEP */}
          <section id="formulario-cotacao">
            <CotacaoProjetoReformaForm />
          </section>

          {/* SEÇÃO INFORMATIVA: QUANTO CUSTA UM PROJETO E UMA OBRA DE INTERIORES */}
          <div id="valores-referencia" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                Quanto custa um projeto de interiores?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed">
                Em São Paulo e no Grande ABC, o investimento médio em um <strong>Projeto de Design de Interiores</strong> situa-se entre <strong>R$ 40 e R$ 80 por m²</strong>. Esse valor contempla:
              </p>
              <ul className="text-xs space-y-2 text-[var(--araca-chocolate-amargo)]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                  <span>Estudo de layout 2D com distribuição ergonômica ideal de móveis e circulação.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                  <span>Modelagem e renderização 3D realista para você enxergar seu imóvel pronto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                  <span>Plantas executivas de forro de gesso, luminotécnica decorativa e pontos elétricos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                  <span>Detalhamento milimétrico de marcenaria e marmoraria sob medida para orçamentos.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--araca-dourado-ocre)]/15 text-[var(--araca-laranja-queimado)] flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                Quanto custa uma obra de interiores?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed">
                O custo de execução de uma <strong>obra de reforma de interiores</strong> depende principalmente do padrão de especificação dos acabamentos por m²:
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                  <span className="font-bold block text-[var(--araca-cafe-escuro)]">Essencial / Revitalização</span>
                  <span className="text-[11px] text-[var(--araca-mineral-green)] font-semibold">R$ 1.250 a R$ 1.800/m²</span>
                  <p className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 mt-1">Pintura geral e pequenos reparos pontuais.</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                  <span className="font-bold block text-[var(--araca-cafe-escuro)]">Custo-Benefício Inteligente</span>
                  <span className="text-[11px] text-[var(--araca-mineral-green)] font-semibold">R$ 2.050 a R$ 2.850/m²</span>
                  <p className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 mt-1">Pisos resistentes e marcenaria pontual planejada.</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                  <span className="font-bold block text-[var(--araca-cafe-escuro)]">Médio Padrão</span>
                  <span className="text-[11px] text-[var(--araca-mineral-green)] font-semibold">R$ 3.100 a R$ 4.300/m²</span>
                  <p className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 mt-1">Porcelanatos grandes, gesso com luz cênica e quartzo.</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                  <span className="font-bold block text-[var(--araca-cafe-escuro)]">Alto Padrão</span>
                  <span className="text-[11px] text-[var(--araca-laranja-queimado)] font-semibold">R$ 5.200 a R$ 7.800+/m²</span>
                  <p className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 mt-1">Grandes lastras, automação e marcenaria autoral.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD DE VINCULAÇÃO COM A METODOLOGIA CUB / SINAPI */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 border border-[var(--araca-bege-medio)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center shrink-0">
                <Table className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                  Quer entender a base dos cálculos? Consulte as Tabelas CUB e SINAPI
                </h3>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
                  Veja como os índices oficiais do SindusCon-SP e Caixa/IBGE são aplicados e baixe os cadernos técnicos oficiais em PDF.
                </p>
              </div>
            </div>
            <Link
              href="/tabela-cub-sinapi"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] text-xs font-semibold border border-[var(--araca-bege-medio)] shadow-2xs transition-all shrink-0 ml-auto sm:ml-0"
            >
              <span>Ver Metodologia CUB / SINAPI</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--araca-mineral-green)]" />
            </Link>
          </div>

          {/* PERGUNTAS FREQUENTES (FAQ) */}
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[var(--araca-cafe-escuro)]">
                Perguntas Frequentes sobre a Estimativa de Custo
              </h3>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/70">
                Respostas transparentes para guiar o planejamento do seu projeto e reforma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/60 space-y-2 shadow-sm">
                <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
                  <span>Esta ferramenta é uma cotação fechada ou estimativa de custo?</span>
                </h4>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                  Trata-se de uma <strong>estimativa paramétrica de custo</strong> elaborada para planejamento orçamentário e tomada de decisão. Não é uma cotação comercial vinculante. O orçamento executivo formal e detalhado é validado por nossos designers de interiores após a análise das plantas do seu imóvel.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/60 space-y-2 shadow-sm">
                <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
                  <span>Vocês são arquitetos ou designers de interiores e decoradores?</span>
                </h4>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                  Somos <strong>designers de interiores e decoradores</strong>. Nosso foco é total na estética, conforto diário, 3D, marcenaria sob medida e layout dos espaços. Quando a reforma em condomínio exige ART ou RRT (NBR 16.280), ela é emitida em conjunto com engenheiros e arquitetos parceiros credenciados.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/60 space-y-2 shadow-sm">
                <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
                  <span>Posso contratar apenas o Projeto de Interiores?</span>
                </h4>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                  Sim! Você pode contratar o Projeto de Design de Interiores completo e executar a obra com seus próprios profissionais, ou contar com o acompanhamento integrado da Aracá para garantir que o resultado final seja idêntico ao 3D aprovado.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/60 space-y-2 shadow-sm">
                <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
                  <span>Como funciona o contato após gerar a estimativa?</span>
                </h4>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                  Ao concluir os passos, um resumo detalhado é encaminhado pelo WhatsApp. Nossos designers de interiores analisam o seu perfil e agendam uma conversa para apresentar referências personalizadas e esclarecer todas as suas dúvidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
