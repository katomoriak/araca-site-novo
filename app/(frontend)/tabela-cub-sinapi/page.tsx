import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Table,
  Building2,
  Calculator,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  TrendingUp,
  Info,
  Shield,
  Layers,
  HeartHandshake,
  AlertCircle,
  ExternalLink,
  Download,
} from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/tabela-cub-sinapi`

export const metadata: Metadata = {
  title: {
    absolute: 'Tabelas CUB e SINAPI de Reformas SP | Aracá Interiores',
  },
  description:
    'Tabela CUB e SINAPI da construção civil e reforma em SP. Compare custos de materiais e mão de obra com Aracá Interiores!',
  keywords: [
    'tabela cub sp',
    'tabela sinapi sao paulo',
    'cub sinduscon sp',
    'custo m2 reforma sp',
    'valor metro quadrado reforma apartamento',
    'calculadora cub reforma',
    'sinapi construcao civil reforma',
    'araca interiores',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Tabelas CUB e SINAPI de Reformas SP | Aracá Interiores',
    description:
      'Tabela CUB e SINAPI da construção civil e reforma em SP. Compare custos de materiais e mão de obra com Aracá Interiores!',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tabelas CUB e SINAPI de Reformas SP | Aracá Interiores',
    description:
      'Tabela CUB e SINAPI da construção civil e reforma em SP. Compare custos de materiais e mão de obra com Aracá Interiores!',
  },
}

const PADROES_CUB = [
  {
    nome: 'Essencial / Revitalização',
    faixaM2: 'R$ 1.250 a R$ 1.800 / m²',
    refCUB: 'CUB R1-B (Baixo) ajustado para reforma',
    escopo: 'Pintura látex geral, pequenos reparos de alvenaria e manutenção de revestimentos existentes sem demolição pesada.',
    indicado: 'Imóveis para locação rápida, primeira moradia ou retrofit econômico.',
  },
  {
    nome: 'Custo-Benefício Inteligente',
    faixaM2: 'R$ 2.050 a R$ 2.850 / m²',
    refCUB: 'CUB R8-N (Normal) residencial',
    escopo: 'Pisos vinílicos modernos ou porcelanatos até 84x84cm, novos pontos elétricos/hidráulicos e marcenaria pontual planejada.',
    indicado: 'Reformas residenciais completas funcionais com excelente durabilidade.',
  },
  {
    nome: 'Médio Padrão / Conforto',
    faixaM2: 'R$ 3.100 a R$ 4.300 / m²',
    refCUB: 'CUB R1-A / R8-A (Alto) habitacional',
    escopo: 'Porcelanatos retificados grandes (80x80 a 90x90), bancadas em quartzo, forro de gesso com iluminação cênica e marcenaria completa.',
    indicado: 'Famílias que valorizam estética refinada, climatização e conforto acústico.',
  },
  {
    nome: 'Alto Padrão / Assinatura Aracá',
    faixaM2: 'R$ 5.200 a R$ 7.800+ / m²',
    refCUB: 'CUB R16-A / Especial de Luxo',
    escopo: 'Grandes lastras (120x240cm), bancadas em Dekton/mármores nobres, marcenaria autoral com ferragens alemãs e automação.',
    indicado: 'Apartamentos e residências exclusivas de luxo com projeto autoral.',
  },
]

const ETAPAS_PESO = [
  {
    etapa: 'Marcenaria Sob Medida',
    pesoMedio: '22% a 32%',
    descricao: 'Armários planejados, painéis ripados, cabeceiras, gabinetes e portas de passagem em MDF com ferragens amortecidas.',
  },
  {
    etapa: 'Pisos e Revestimentos',
    pesoMedio: '16% a 22%',
    descricao: 'Porcelanatos, vinílicos, argamassas especiais (AC-III) e mão de obra de corte e assentamento especializado.',
  },
  {
    etapa: 'Áreas Molhadas & Marmoraria',
    pesoMedio: '14% a 18%',
    descricao: 'Bancadas de cozinha e banheiros em quartzo ou mármore, cubas esculpidas, registros, louças e metais finos.',
  },
  {
    etapa: 'Forro de Gesso & Drywall',
    pesoMedio: '8% a 12%',
    descricao: 'Forro rebaixado em drywall aramado, sancas iluminadas, cortineiros embutidos e nichos decorativos.',
  },
  {
    etapa: 'Elétrica, Automação & Luz',
    pesoMedio: '10% a 14%',
    descricao: 'Infraestrutura de circuitos individuais, novos pontos de tomadas, disjuntores DR, fitas LED e luminárias.',
  },
  {
    etapa: 'Pintura & Acabamento Fino',
    pesoMedio: '8% a 12%',
    descricao: 'Emassamento de paredes, lixamento, primer e pintura acrílica acetinada de alta lavabilidade.',
  },
]

export default function TabelaCubSinapiPage() {
  return (
    <>
      {/* 1. HERO SECTION COM FOTO DE FUNDO, MENU INTEGRADO E TRANSIÇÃO EM DEGRADÊ */}
      <section className="relative -mt-6 sm:-mt-8 mb-8 sm:mb-14 min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between overflow-hidden text-white">
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Image
            src="https://img.araca.arq.br/_thumbs/midias/resindencia_feijo/araca_interiores_%20(5).png_w1200_q80.webp"
            alt="Tabela CUB e SINAPI Construção Civil — Aracá Interiores"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
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
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center">
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
                Tabelas CUB & SINAPI
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-[var(--araca-bege-claro)] border border-white/25 backdrop-blur-md mb-6 self-center">
            <Table className="w-3.5 h-3.5 text-[var(--araca-dourado-claro)]" />
            <span>Índices Oficiais e Médias Paramétricas de Construção e Reforma</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white max-w-4xl mx-auto mb-6 leading-[1.12] drop-shadow-md">
            Tabelas CUB e SINAPI: Custos por m² de Obra e Reforma
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-8 drop-shadow-sm">
            Entenda como os indicadores oficiais do SindusCon-SP (CUB-SP) e da Caixa Econômica/IBGE (SINAPI) são aplicados para precificar reformas residenciais e comerciais em São Paulo e no Grande ABC.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#documentos-oficiais"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-sm transition-all duration-300 shadow-xl shadow-[var(--araca-mineral-green)]/30 hover:scale-[1.02] border border-white/20"
            >
              <Download className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
              <span>Baixar PDFs Oficiais SINAPI 2026</span>
            </a>

            <Link
              href="/quanto-custa-reformar"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm border border-white/30 backdrop-blur-md transition-all shadow-md"
            >
              <Calculator className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
              <span>Simular na Calculadora</span>
            </Link>
          </div>
        </div>

        {/* Degrade de saída suave para a cor creme */}
        <div
          className="relative z-10 w-full h-24 sm:h-32 bg-gradient-to-b from-transparent via-[var(--araca-creme)]/60 to-[var(--araca-creme)] pointer-events-none -mb-px"
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
              Somos <strong>designers de interiores e decoradores</strong> focados na experiência do morador, ergonomia, layout 3D e marcenaria sob medida. Os índices CUB e SINAPI são utilizados como <strong>referência paramétrica comparativa</strong>. Para obras civis em condomínios sujeitas à norma ABNT NBR 16.280, viabilizamos a emissão de ART/RRT através de engenheiros e arquitetos parceiros credenciados.
            </p>
          </div>

          {/* O QUE É CUB E O QUE É SINAPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                O que é o CUB (SindusCon-SP)?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed">
                O <strong>Custo Unitário Básico (CUB)</strong> é o indicador oficial da construção habitacional no Brasil, calculado mensalmente pelos Sindicatos da Indústria da Construção Civil (como o <strong>SindusCon-SP</strong>), conforme a <strong>Lei Federal nº 4.591/64</strong> e a norma <strong>ABNT NBR 12.721</strong>.
              </p>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 leading-relaxed">
                Ele mede o custo por metro quadrado (R$/m²) de uma cesta padrão de materiais e mão de obra civil básica. Em reformas de interiores, o CUB é ajustado para considerar despesas específicas como quebra-quebra, retirada de entulho, logística de condomínio e proteção de áreas comuns.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--araca-dourado-ocre)]/15 text-[var(--araca-laranja-queimado)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                O que é o SINAPI (Caixa / IBGE)?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed">
                O <strong>Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil (SINAPI)</strong> é mantido pela <strong>Caixa Econômica Federal</strong> em conjunto com o <strong>IBGE</strong>. Trata-se da maior base pública de custos e composições unitárias do setor da construção.
              </p>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 leading-relaxed">
                O SINAPI detalha o preço unitário de cada serviço individual: metro quadrado de reboco, metro linear de tubulação de esgoto, ponto de tomada 10A e forro de placas de gesso. Usamos essa referência para validar a proporcionalidade dos serviços parciais em nossos simuladores.
              </p>
            </div>
          </div>

          {/* SEÇÃO DESTACADA: DOWNLOAD DOS DOCUMENTOS OFICIAIS SINAPI 2026 (CAIXA / IBGE) */}
          <section id="documentos-oficiais" className="scroll-mt-24 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] border border-[var(--araca-mineral-green)]/20">
                <FileText className="w-3.5 h-3.5" />
                <span>Documentação Oficial CAIXA • Vigência 2026</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--araca-cafe-escuro)]">
                Baixar Cadernos Técnicos Oficiais do SINAPI
              </h2>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/75 max-w-2xl mx-auto leading-relaxed">
                Consulte as publicações oficiais completas emitidas pela Caixa Econômica Federal com todas as memórias de cálculo, metodologias e parâmetros vigentes no Brasil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documento 1: Cálculos e Parâmetros */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[var(--araca-bege-medio)]/80 shadow-md flex flex-col justify-between space-y-4 hover:border-[var(--araca-mineral-green)]/60 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      8ª Edição • Fevereiro/2026
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      145 páginas • 3.1 MB
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-[var(--araca-cafe-escuro)] leading-snug">
                        SINAPI: Cálculos e Parâmetros
                      </h3>
                      <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                        Memória de cálculo detalhada de Encargos Sociais e Encargos Complementares (Alimentação, Transporte, EPIs, Ferramentas, Exames Médicos, Seguros de Vida e Cursos de Capacitação).
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-[var(--araca-chocolate-amargo)]/80 space-y-1.5 bg-[var(--araca-creme)]/50 p-3 rounded-xl border border-[var(--araca-bege-medio)]/40">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--araca-mineral-green)] shrink-0" />
                      <span>Desoneração da folha de pagamento (Lei nº 14.973/2024)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--araca-mineral-green)] shrink-0" />
                      <span>Apêndice completo com dados de São Paulo e de todos os estados</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--araca-bege-medio)]/40">
                  <a
                    href="/documentos/sinapi-calculos-e-parametros-2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white text-xs font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                  >
                    <Download className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
                    <span>Baixar Caderno de Cálculos e Parâmetros (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Documento 2: Metodologias e Conceitos */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[var(--araca-bege-medio)]/80 shadow-md flex flex-col justify-between space-y-4 hover:border-[var(--araca-mineral-green)]/60 transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      11ª Edição • Março/2026
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      111 páginas • 4.2 MB
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-[var(--araca-cafe-escuro)] leading-snug">
                        SINAPI: Metodologias e Conceitos
                      </h3>
                      <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                        Diretrizes de engenharia de custos e orçamentação segundo o Decreto nº 7.983/2013, critérios de aferição em campo, custos horários de equipamentos (CHP/CHI) e pesquisa pelo IBGE.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-[var(--araca-chocolate-amargo)]/80 space-y-1.5 bg-[var(--araca-creme)]/50 p-3 rounded-xl border border-[var(--araca-bege-medio)]/40">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--araca-mineral-green)] shrink-0" />
                      <span>Formação do preço, custos diretos/indiretos e BDI</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--araca-mineral-green)] shrink-0" />
                      <span>Composições analíticas e famílias homogêneas de insumos</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--araca-bege-medio)]/40">
                  <a
                    href="/documentos/sinapi-metodologias-e-conceitos-2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white text-xs font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                  >
                    <Download className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
                    <span>Baixar Livro de Metodologias e Conceitos (PDF)</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* TABELA COMPARATIVA DE PADRÕES */}
          <div className="rounded-3xl bg-white/90 border border-[var(--araca-bege-medio)]/80 shadow-md p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--araca-mineral-green)]">
                Referência Prática São Paulo & Grande ABC
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
                Tabela de Valores Médios por Padrão de Reforma
              </h3>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/70">
                Comparativo consolidado entre referências oficiais (CUB/SP) e valores de execução em projetos de interiores residenciais.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--araca-bege-medio)]/60 text-[var(--araca-cafe-escuro)] font-bold">
                    <th className="py-3 px-3">Padrão de Acabamento</th>
                    <th className="py-3 px-3">Faixa Estimada (R$/m²)</th>
                    <th className="py-3 px-3">Referência CUB</th>
                    <th className="py-3 px-3">Escopo Típico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--araca-bege-medio)]/40 text-[var(--araca-chocolate-amargo)]/80">
                  {PADROES_CUB.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--araca-creme)]/50 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[var(--araca-cafe-escuro)]">
                        {item.nome}
                        <span className="block text-[10.5px] font-normal text-[var(--araca-chocolate-amargo)]/60">
                          {item.indicado}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[var(--araca-mineral-green)] whitespace-nowrap">
                        {item.faixaM2}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                        {item.refCUB}
                      </td>
                      <td className="py-3.5 px-3 text-[11.5px] leading-relaxed max-w-sm">
                        {item.escopo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Atenção:</strong> Áreas molhadas (cozinhas e banheiros) concentram uma densidade de custo por m² de 2 a 3 vezes superior a dormitórios e salas, devido à exigência de impermeabilização, marmoraria maciça, registros hidráulicos e instalações sanitárias.
              </span>
            </div>
          </div>

          {/* DISTRIBUIÇÃO PERCENTUAL POR ETAPA DE REFORMA */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
                Para Onde Vai o Orçamento de uma Reforma?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/70 max-w-2xl mx-auto">
                Média percentual observada em reformas residenciais em São Paulo e Santo André:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ETAPAS_PESO.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/60 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide text-[var(--araca-cafe-escuro)]">
                      {item.etapa}
                    </span>
                    <span className="text-xs font-extrabold text-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)]/10 px-2 py-0.5 rounded-md">
                      {item.pesoMedio}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* BOX DE CONVITE PARA SIMULAÇÃO */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[var(--araca-mineral-green)] to-[var(--araca-verde-pinho-escuro)] text-white shadow-xl space-y-6 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-wider font-bold text-white/80">
                Planejamento Sem Complicação
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-normal tracking-tight text-white">
                Simule o Custo da Sua Reforma ou Projeto em Minutos
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
                Utilize nossas ferramentas gratuitas calibradas com as tabelas CUB e SINAPI para planejar seu investimento com total segurança e previsibilidade.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/calculadora-custo-projeto-design-interiores"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] text-xs sm:text-sm font-bold transition-all shadow-md group"
              >
                <Compass className="w-4 h-4 text-[var(--araca-mineral-green)]" />
                <span>Simular Projeto de Interiores</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/quanto-custa-reformar"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/30 backdrop-blur-md transition-all shadow-md"
              >
                <Calculator className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
                <span>Simular Reforma por Ambiente</span>
              </Link>
            </div>
          </div>

          {/* DISCLAIMER JURÍDICO E TRANSPARÊNCIA */}
          <div className="p-5 rounded-2xl bg-white/60 border border-[var(--araca-bege-medio)]/60 text-[11px] text-[var(--araca-chocolate-amargo)]/70 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-[var(--araca-cafe-escuro)] text-xs">
              <Shield className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0" />
              <span>Aviso Legal de Estimativa Paramétrica (Código de Defesa do Consumidor & Código Civil)</span>
            </div>
            <p>
              Os dados e tabelas apresentados possuem caráter exclusivamente informativo, pedagógico e paramétrico para planejamento preliminar de custos. Os valores não constituem oferta vinculante ou garantia contratual de preço (Arts. 30 e 35 do Código de Defesa do Consumidor e Arts. 186/927 do Código Civil). O orçamento definitivo requer elaboração de Projeto de Design de Interiores Executivo e vistoria técnica presencial com emissão de ART/RRT de reforma em conjunto com nossos engenheiros ou arquitetos parceiros credenciados.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
