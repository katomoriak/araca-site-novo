import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Compass,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  FileCheck2,
  Layers,
  Palette,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react'
import { CotacaoProjetoReformaForm } from '@/components/calculadora'
import { SiteNav } from '@/components/layout/SiteNav'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
const canonical = `${baseUrl}/calculadora-projeto`

export const metadata: Metadata = {
  title: {
    absolute: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
  },
  description:
    'Simule o valor do seu projeto de design de interiores em SP e ABC. Faça a cotação de projeto e obra na Aracá Interiores.',
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
    description:
      'Simule o valor do seu projeto de design de interiores em SP e ABC. Faça a cotação de projeto e obra na Aracá Interiores.',
    url: canonical,
    siteName: 'Aracá Interiores',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quanto Custa Projeto de Interiores? | Aracá Interiores',
    description:
      'Simule o valor do seu projeto de design de interiores em SP e ABC. Faça a cotação de projeto e obra na Aracá Interiores.',
  },
}

export default function CalculadoraProjetoPage() {
  const whatsappUrl = `https://wa.me/5511914659204?text=${encodeURIComponent(
    'Olá! Estava na calculadora do site da Aracá e gostaria de solicitar um orçamento específico para o meu Projeto de Interiores.'
  )}`

  return (
    <>
      <div className="pt-4 pb-2">
        <SiteNav theme="light-bg" logoVariant="cafe" noEnterAnimation />
      </div>

      <main className="min-h-screen bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Link de Retorno */}
        <div>
          <Link
            href="/quanto-custa-reformar"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--araca-chocolate-amargo)]/70 hover:text-[var(--araca-cafe-escuro)] py-2 px-3 rounded-xl bg-white/60 border border-[var(--araca-bege-medio)]/60 transition-all hover:bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Calculadora de Obra</span>
          </Link>
        </div>

        {/* Hero do Projeto */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] border border-[var(--araca-mineral-green)]/20">
            <Compass className="w-4 h-4" />
            <span>Orçamento de Projeto de Interiores</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-[var(--araca-cafe-escuro)] tracking-tight">
            Quanto custa o Projeto de Interiores?
          </h1>

          <p className="text-base sm:text-lg text-[var(--araca-chocolate-amargo)]/80 max-w-2xl mx-auto leading-relaxed">
            Calcule uma estimativa de Projeto e Obra Civil em poucos passos com o nosso simulador interativo.
          </p>
        </div>

        {/* Simulador Interativo Multi-Step */}
        <section id="simulador-projeto">
          <CotacaoProjetoReformaForm />
        </section>

        {/* Card Informativo com o que contempla um Projeto Completo */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[var(--araca-bege-medio)]/70 shadow-xl p-8 sm:p-12 space-y-8 text-center">

          {/* O que está incluído no projeto */}
          <div className="text-left pt-4 border-t border-[var(--araca-bege-medio)]/40">
            <h3 className="font-display text-lg text-[var(--araca-cafe-escuro)] font-medium mb-4 text-center">
              O que contempla um Projeto Completo da Aracá:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">Estudo Preliminar & Layout 3D</h4>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Plantas de layout humanizadas e imagens 3D realistas dos ambientes antes de iniciar a obra.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 flex items-start gap-3">
                <Layers className="w-5 h-5 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">Detalhamento Executivo</h4>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Projetos técnicos de iluminação, pontos elétricos, hidráulica, forro de gesso e paginação de pisos.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 flex items-start gap-3">
                <Palette className="w-5 h-5 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">Marcenaria & Marmoraria</h4>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Desenhos milimétricos dos armários e bancadas para cotação precisa com os melhores marceneiros.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">Caderno de Especificações</h4>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Lista completa de tintas, revestimentos, louças, metais e iluminação com quantitativos e marcas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações / CTA */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-base transition-all shadow-md active:scale-95 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Orçar Projeto pelo WhatsApp</span>
            </a>

            <Link
              href="/contato"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-base transition-all shadow-md active:scale-95 text-center"
            >
              <span>Enviar Briefing por Formulário</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  </>
  )
}
