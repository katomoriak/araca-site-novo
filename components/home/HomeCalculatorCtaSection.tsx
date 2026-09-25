'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Compass,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  Hammer,
} from 'lucide-react'

const PADROES_PREVIEW = [
  {
    id: 'essencial',
    nome: 'Essencial',
    sub: 'Revitalização ágil',
    obra: 'R$ 1.250/m²',
    cor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  {
    id: 'inteligente',
    nome: 'Custo-Benefício',
    sub: 'Funcional e durável',
    obra: 'R$ 2.050/m²',
    cor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  {
    id: 'medio',
    nome: 'Médio Conforto',
    sub: 'Acabamentos nobres',
    obra: 'R$ 3.100/m²',
    cor: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
  },
  {
    id: 'alto',
    nome: 'Alto Padrão',
    sub: 'Exclusivo Aracá',
    obra: 'R$ 5.200/m²',
    cor: 'border-[var(--araca-dourado-claro)]/40 bg-[var(--araca-dourado-claro)]/10 text-[var(--araca-dourado-claro)]',
  },
]

export function HomeCalculatorCtaSection() {
  const [padraoAtivo, setPadraoAtivo] = useState(1) // Custo-benefício default

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#181310] text-white">
      {/* Luzes difusas de fundo para atmosfera luxuosa */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[var(--araca-mineral-green)]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[var(--araca-dourado-claro)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* COLUNA ESQUERDA: CHAMADA E PROPOSTA DE VALOR */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-[var(--araca-bege-claro)] border border-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[var(--araca-dourado-claro)] animate-pulse" />
              <span>Simuladores Online • Aracá Interiores</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.12]">
              Quer saber quanto custa transformar seu espaço?
            </h2>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed font-light">
              Descubra em menos de 2 minutos uma <strong>estimativa inteligente e transparente</strong> de investimento para seu projeto de design de interiores e obra de reforma em São Paulo e Grande ABC.
            </p>

            {/* Destaques em pílulas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--araca-dourado-claro)]">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Projeto 3D & Layout</span>
                </div>
                <p className="text-[11px] text-white/70 leading-snug">
                  R$ 40 a R$ 80/m² com estudo de ergonomia e marcenaria.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Hammer className="w-4 h-4 shrink-0" />
                  <span>Reforma & Obra Civil</span>
                </div>
                <p className="text-[11px] text-white/70 leading-snug">
                  4 padrões calibrados conforme referências do mercado CUB/SP.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Sem Surpresas</span>
                </div>
                <p className="text-[11px] text-white/70 leading-snug">
                  Estimativa rápida por m² ou detalhada ambiente por ambiente.
                </p>
              </div>
            </div>

            {/* AÇÕES CTA PRINCIPAIS */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/calculadora-custo-projeto-design-interiores"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-base transition-all duration-300 shadow-xl shadow-[var(--araca-mineral-green)]/35 hover:scale-[1.02] border border-white/20 group text-center"
              >
                <Compass className="w-5 h-5 text-[var(--araca-dourado-claro)]" />
                <span>Cotar na Calculadora de Projetos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/quanto-custa-reformar"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all text-center"
              >
                <Calculator className="w-4 h-4 text-white/70" />
                <span>Calculadora de Obra</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulação paramétrica 100% gratuita • Sem compromisso • Atendimento via WhatsApp</span>
            </div>
          </div>

          {/* COLUNA DIREITA: CARD INTERATIVO DE PREVIEW / MOCKUP */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
              {/* Header do Mockup */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--araca-mineral-green)]/40 border border-white/20 flex items-center justify-center text-white">
                    <Compass className="w-4 h-4 text-[var(--araca-dourado-claro)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Calculadora Aracá</h3>
                    <p className="text-[11px] text-white/60">Simulador Paramétrico Interativo</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>

              {/* Seletor de padrão interativo */}
              <div className="space-y-2">
                <span className="text-xs text-white/80 font-medium flex items-center justify-between">
                  <span>Escolha o padrão de acabamento:</span>
                  <span className="text-[11px] text-[var(--araca-dourado-claro)] font-semibold">
                    {PADROES_PREVIEW[padraoAtivo].nome}
                  </span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {PADROES_PREVIEW.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPadraoAtivo(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        padraoAtivo === idx
                          ? `${item.cor} ring-1 ring-white/30 scale-[1.02]`
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.nome}</span>
                      <span className="text-[10px] text-white/60 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prévia dinâmica dos valores */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Projeto de Interiores 3D:</span>
                  <span className="font-semibold text-white">R$ 40 a R$ 80 / m²</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Execução de Obra ({PADROES_PREVIEW[padraoAtivo].nome}):</span>
                  <span className="font-semibold text-emerald-400">
                    A partir de {PADROES_PREVIEW[padraoAtivo].obra}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/60">Responsabilidade Técnica:</span>
                  <span className="text-[11px] text-white/80">ART/RRT via parceiros credenciados</span>
                </div>
              </div>

              {/* Botão de ação direto */}
              <Link
                href="/calculadora-custo-projeto-design-interiores"
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-white hover:bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] text-xs sm:text-sm font-bold transition-all shadow-md group"
              >
                <span>Calcular Meu Projeto Agora</span>
                <ChevronRight className="w-4 h-4 text-[var(--araca-mineral-green)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
