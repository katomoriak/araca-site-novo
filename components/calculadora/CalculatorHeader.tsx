'use client'

import { Sparkles, Home, Ruler } from 'lucide-react'

interface CalculatorHeaderProps {
  roomsCount: number
  totalArea: number
  mode?: string
  onModeChange?: (mode: any) => void
}

export function CalculatorHeader({
  roomsCount,
  totalArea,
}: CalculatorHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10">
      {/* Badge de Destaque */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)] border border-[var(--araca-mineral-green)]/20 mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Simulador Paramétrico 2025 / 2026 • SP & Grande ABC</span>
      </div>

      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--araca-cafe-escuro)] mb-4 tracking-tight leading-tight">
        Calculadora de Custo de Reforma
      </h2>

      <p className="text-sm sm:text-base text-[var(--araca-chocolate-amargo)]/80 leading-relaxed max-w-2xl mx-auto mb-6 font-light">
        Descubra o investimento estimado para transformar seu imóvel. Ajuste a área privativa, personalize a quantidade de cômodos e selecione os serviços desejados.
      </p>

      {/* Indicadores Rápidos da Simulação */}
      <div className="inline-flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl bg-white/70 backdrop-blur-md border border-[var(--araca-bege-medio)]/40 shadow-xs">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--araca-creme)] text-xs font-semibold text-[var(--araca-cafe-escuro)]">
          <Ruler className="w-3.5 h-3.5 text-[var(--araca-mineral-green)]" />
          <span>Área Total: {totalArea} m²</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--araca-creme)] text-xs font-semibold text-[var(--araca-cafe-escuro)]">
          <Home className="w-3.5 h-3.5 text-[var(--araca-mineral-green)]" />
          <span>{roomsCount} Ambientes Configurados</span>
        </div>
      </div>
    </div>
  )
}
