'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  CALCULATOR_CONFIG,
  SimulationResult,
  SimulationState,
  formatCurrencyBRL,
  getWhatsAppSimulationUrl,
} from '@/lib/calculator-config'
import {
  MessageCircle,
  Compass,
  FileDown,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Loader2,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react'

interface ResultCostCardProps {
  simulationState: SimulationState
  result: SimulationResult
  onRequestPdf: () => void
  onRequestProposal?: () => void
  isRevealed?: boolean
  onReveal?: (leadInfo: { nome: string; telefone: string; email: string }) => void
}

export function ResultCostCard({
  simulationState,
  result,
  onRequestPdf,
  onRequestProposal,
  isRevealed: externalIsRevealed,
  onReveal,
}: ResultCostCardProps) {
  const [internalRevealed, setInternalRevealed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('araca_obra_unlocked') === 'true'
    }
    return false
  })

  const isUnlocked = externalIsRevealed !== undefined ? externalIsRevealed : internalRevealed

  const [nome, setNome] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('araca_obra_lead_info')
      if (saved) {
        try {
          return JSON.parse(saved).nome || ''
        } catch {
          return ''
        }
      }
    }
    return ''
  })
  const [telefone, setTelefone] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('araca_obra_lead_info')
      if (saved) {
        try {
          return JSON.parse(saved).telefone || ''
        } catch {
          return ''
        }
      }
    }
    return ''
  })
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('araca_obra_lead_info')
      if (saved) {
        try {
          return JSON.parse(saved).email || ''
        } catch {
          return ''
        }
      }
    }
    return ''
  })

  const [errors, setErrors] = useState<{ nome?: string; telefone?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    let formatted = raw
    if (raw.length > 2) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`
    if (raw.length > 7) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
    setTelefone(formatted)
    if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: undefined }))
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { nome?: string; telefone?: string; email?: string } = {}

    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Por favor, informe seu nome completo.'
    }
    const cleanPhone = telefone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.telefone = 'Informe um WhatsApp válido com DDD.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Informe um e-mail válido.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await fetch('/api/calculadora-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone.trim(),
          origem: 'Desbloqueio de Estimativa - Calculadora Obra',
          simulationData: {
            totalArea: result.totalArea,
            standard: result.standard,
            averageCost: result.averageCost,
            averageCostFormatted: formatCurrencyBRL(result.averageCost),
            minCostFormatted: formatCurrencyBRL(result.minCost),
            maxCostFormatted: formatCurrencyBRL(result.maxCost),
            services: result.activeServices.map((s) => s.label),
            breakdown: result.breakdown,
          },
        }),
      }).catch((err) => console.warn('Aviso no envio do lead da obra:', err))

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('araca_obra_unlocked', 'true')
        sessionStorage.setItem('araca_obra_lead_info', JSON.stringify({ nome, telefone, email }))
      }

      setInternalRevealed(true)
      if (onReveal) {
        onReveal({ nome, telefone, email })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappUrl = getWhatsAppSimulationUrl(simulationState, result)

  // Percentuais dinâmicos para a barra visual de distribuição
  const totalCost = result.averageCost
  const hasLabor = result.breakdown.labor > 0
  const hasMaterials = result.breakdown.materials > 0
  const hasWoodwork = result.breakdown.woodwork > 0
  const hasStones = result.breakdown.stones > 0

  const pctLabor = totalCost > 0 && hasLabor ? Math.round((result.breakdown.labor / totalCost) * 100) : 0
  const pctMaterials = totalCost > 0 && hasMaterials ? Math.round((result.breakdown.materials / totalCost) * 100) : 0
  const pctWoodwork = totalCost > 0 && hasWoodwork ? Math.round((result.breakdown.woodwork / totalCost) * 100) : 0
  const pctStones = totalCost > 0 && hasStones ? Math.round((result.breakdown.stones / totalCost) * 100) : 0

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[var(--araca-bege-medio)]/60 shadow-[0_16px_40px_rgba(48,22,12,0.08)] overflow-hidden">
      {/* Faixa Superior com Resumo da Simulação */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[var(--araca-creme)] via-white to-[var(--araca-bege-claro)]/40 border-b border-[var(--araca-bege-medio)]/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] border border-[var(--araca-mineral-green)]/20">
            <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">✓</span>
            <span>Etapa 3 • Resultado da Simulação</span>
          </div>

          <div className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">
            Área total considerada: <strong className="text-[var(--araca-cafe-escuro)]">{result.totalArea} m²</strong>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Valor Principal em Destaque (Borrado se não desbloqueado) */}
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[var(--araca-chocolate-amargo)]/70 mb-1 flex items-center justify-between">
              <span>Investimento Médio Previsto</span>
              {!isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3" />
                  <span>Valores Protegidos</span>
                </span>
              )}
            </div>

            <div className="relative">
              <div
                className={cn(
                  'font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--araca-cafe-escuro)] tracking-tight transition-all duration-300',
                  !isUnlocked && 'filter blur-[8px] select-none pointer-events-none'
                )}
              >
                {formatCurrencyBRL(result.averageCost)}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 mt-1 font-medium">
              Aproximadamente{' '}
              <strong
                className={cn(
                  'text-[var(--araca-mineral-green)] transition-all',
                  !isUnlocked && 'filter blur-[5px] select-none pointer-events-none'
                )}
              >
                {formatCurrencyBRL(result.costPerM2)}/m²
              </strong>{' '}
              para o padrão {result.standard.name}.
            </div>
          </div>

          {/* Faixa Mínima e Máxima Estimada em Linha Própria Ampla */}
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-white/90 border border-[var(--araca-bege-medio)]/60 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--araca-chocolate-amargo)]/70 mb-3">
              Faixa de Variação Estimada
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/30">
                <span className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 block mb-0.5 font-medium">
                  Cenário Mínimo
                </span>
                <span
                  className={cn(
                    'text-base sm:text-lg font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.minCost)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/30">
                <span className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 block mb-0.5 font-medium">
                  Cenário Máximo
                </span>
                <span
                  className={cn(
                    'text-base sm:text-lg font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.maxCost)}
                </span>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO DE DESBLOQUEIO DE VALORES (CRO GATING) */}
          {!isUnlocked ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-[var(--araca-creme)]/70 to-[var(--araca-creme)] border border-[var(--araca-mineral-green)]/30 shadow-md space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[var(--araca-cafe-escuro)] leading-tight">
                    Desbloqueie os Valores da Simulação
                  </h4>
                  <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Informe seu contato para liberar a estimativa completa de obra e materiais.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <input
                    type="text"
                    placeholder="Nome Completo *"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }))
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--araca-bege-medio)] bg-white text-xs text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none focus:border-[var(--araca-mineral-green)] focus:ring-1 focus:ring-[var(--araca-mineral-green)]/30 transition-all"
                  />
                  {errors.nome && (
                    <span className="text-[10px] text-red-600 font-medium pl-1 block mt-0.5">{errors.nome}</span>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="WhatsApp com DDD *"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--araca-bege-medio)] bg-white text-xs text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none focus:border-[var(--araca-mineral-green)] focus:ring-1 focus:ring-[var(--araca-mineral-green)]/30 transition-all"
                  />
                  {errors.telefone && (
                    <span className="text-[10px] text-red-600 font-medium pl-1 block mt-0.5">{errors.telefone}</span>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="E-mail *"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--araca-bege-medio)] bg-white text-xs text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none focus:border-[var(--araca-mineral-green)] focus:ring-1 focus:ring-[var(--araca-mineral-green)]/30 transition-all"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-600 font-medium pl-1 block mt-0.5">{errors.email}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Liberando valores...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Liberar Valores da Estimativa</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[var(--araca-chocolate-amargo)]/60 pt-0.5">
                  🔒 Seus dados estão protegidos pela LGPD. Sem spam.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Valores liberados para {nome || 'você'}!</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md font-semibold">
                Estimativa Ativa
              </span>
            </div>
          )}
        </div>
      </div>

      {/* DETALHAMENTO (BREAKDOWN) DE CUSTOS */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 className="font-display text-xl text-[var(--araca-cafe-escuro)] font-medium">
              Detalhamento da Distribuição de Custos
            </h4>
            <span className="text-xs text-[var(--araca-chocolate-amargo)]/60 font-medium">Estimativa aproximada</span>
          </div>

          {/* Barra Multissegmentada Visual */}
          <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-gray-100 shadow-inner mb-4">
            {totalCost === 0 ? (
              <div className="w-full h-full bg-amber-100/60 flex items-center justify-center text-[10px] text-amber-800 font-medium">
                Nenhum serviço ativo selecionado
              </div>
            ) : (
              <>
                {pctLabor > 0 && (
                  <div
                    style={{ width: `${pctLabor}%` }}
                    className="bg-[var(--araca-mineral-green)] transition-all duration-500"
                    title={`Mão de Obra Técnica: ${pctLabor}%`}
                  />
                )}
                {pctMaterials > 0 && (
                  <div
                    style={{ width: `${pctMaterials}%` }}
                    className="bg-[var(--araca-dourado-ocre)] transition-all duration-500"
                    title={`Materiais & Revestimentos: ${pctMaterials}%`}
                  />
                )}
                {pctWoodwork > 0 && (
                  <div
                    style={{ width: `${pctWoodwork}%` }}
                    className="bg-[var(--araca-laranja-queimado)] transition-all duration-500"
                    title={`Marcenaria Sob Medida: ${pctWoodwork}%`}
                  />
                )}
                {pctStones > 0 && (
                  <div
                    style={{ width: `${pctStones}%` }}
                    className="bg-[var(--araca-ameixa)] transition-all duration-500"
                    title={`Marmoraria & Metais: ${pctStones}%`}
                  />
                )}
              </>
            )}
          </div>

          {/* Legenda do Gráfico / Cards do Breakdown sem extrapolamento */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', pctLabor > 0 ? 'bg-[var(--araca-mineral-green)]' : 'bg-gray-300')} />
                <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] truncate">Mão de Obra</span>
              </div>
              <div>
                <div
                  className={cn(
                    'text-sm sm:text-base font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.breakdown.labor)}
                </div>
                <div className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                  {pctLabor > 0 ? `~${pctLabor}% do total` : 'Não inclusa'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', pctMaterials > 0 ? 'bg-[var(--araca-dourado-ocre)]' : 'bg-gray-300')} />
                <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] truncate">Materiais</span>
              </div>
              <div>
                <div
                  className={cn(
                    'text-sm sm:text-base font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.breakdown.materials)}
                </div>
                <div className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                  {pctMaterials > 0 ? `~${pctMaterials}% do total` : 'Não inclusa'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', pctWoodwork > 0 ? 'bg-[var(--araca-laranja-queimado)]' : 'bg-gray-300')} />
                <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] truncate">Marcenaria</span>
              </div>
              <div>
                <div
                  className={cn(
                    'text-sm sm:text-base font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.breakdown.woodwork)}
                </div>
                <div className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                  {pctWoodwork > 0 ? `~${pctWoodwork}% do total` : 'Não inclusa'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', pctStones > 0 ? 'bg-[var(--araca-ameixa)]' : 'bg-gray-300')} />
                <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] truncate">Marmoraria</span>
              </div>
              <div>
                <div
                  className={cn(
                    'text-sm sm:text-base font-bold text-[var(--araca-cafe-escuro)] transition-all',
                    !isUnlocked && 'filter blur-[6px] select-none pointer-events-none'
                  )}
                >
                  {formatCurrencyBRL(result.breakdown.stones)}
                </div>
                <div className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                  {pctStones > 0 ? `~${pctStones}% do total` : 'Não inclusa'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo do Escopo Marcado */}
        <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-[var(--araca-chocolate-amargo)]">
              <strong>Escopo Ativo:</strong> {result.activeServices.length} de {CALCULATOR_CONFIG.services.length} serviços selecionados (
              {result.activeServices.map((s) => s.shortLabel).join(', ') || 'Nenhum'}
              ).
            </div>
            <div className="text-[var(--araca-mineral-green)] font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Padrão {result.standard.name}
            </div>
          </div>

          {/* Se houver serviços customizados por ambiente */}
          {result.serviceDetails &&
            Object.values(result.serviceDetails).some((d) => !d.isAllRooms) && (
              <div className="pt-2 border-t border-[var(--araca-bege-medio)]/40 text-[11px] text-[var(--araca-chocolate-amargo)]/80 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[var(--araca-mineral-green)]">Ambientes personalizados:</span>
                {Object.values(result.serviceDetails)
                  .filter((d) => !d.isAllRooms)
                  .map((d) => (
                    <span
                      key={d.id}
                      className="px-2 py-0.5 rounded-md bg-white border border-[var(--araca-bege-medio)]/40 text-[10.5px]"
                    >
                      {d.shortLabel}: {d.roomsCount} amb. ({d.serviceArea} m²)
                    </span>
                  ))}
              </div>
            )}
        </div>

        {/* SEÇÃO: AGORA VOCÊ PODE: 3 BOTÕES DE AÇÃO */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--araca-laranja-queimado)]" />
            <span>Agora você pode:</span>
          </div>

          {/* Botão 1: Orçar Projeto com a Aracá (WhatsApp com resumo da obra e projeto) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-base transition-all duration-200 shadow-md shadow-[#25D366]/20 active:scale-[0.99] text-center group"
          >
            <MessageCircle className="w-5 h-5 shrink-0 fill-current" />
            <span>Orçar Projeto com a Aracá</span>
            <ExternalLink className="w-4 h-4 shrink-0 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Botão 2: Fazer orçamento de projeto (encaminha para a calculadora de custo de projeto) */}
          <Link
            href="/calculadora-custo-projeto-design-interiores"
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-base transition-all duration-200 shadow-md shadow-[var(--araca-mineral-green)]/20 active:scale-[0.99] text-center"
          >
            <Compass className="w-5 h-5 shrink-0" />
            <span>Fazer orçamento de projeto</span>
          </Link>

          {/* Botão 3: Gerar PDF */}
          <button
            type="button"
            onClick={onRequestPdf}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-white hover:bg-[var(--araca-creme)] text-[var(--araca-cafe-escuro)] border border-[var(--araca-bege-medio)] hover:border-[var(--araca-chocolate-amargo)]/40 font-medium text-base transition-all duration-200 shadow-sm active:scale-[0.99] text-center"
          >
            <FileDown className="w-5 h-5 text-[var(--araca-laranja-queimado)] shrink-0" />
            <span>Gerar PDF com Estimativa</span>
          </button>

          <div className="text-center text-xs text-[var(--araca-chocolate-amargo)]/70 pt-1">
            Atendimento especializado com designers de interiores e decoradores em São Paulo e Santo André.
          </div>
        </div>

        {/* DISCLAIMER OBRIGATÓRIO & AVISO LEGAL NÃO VINCULANTE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Aviso Legal & Isenção de Responsabilidade (Não Vinculante)</span>
          </div>
          <p className="text-[11.5px] leading-relaxed">
            Os valores apresentados constituem uma <strong>simulação preliminar meramente informativa</strong>, baseada em médias genéricas de mercado (CUB/SINAPI e histórico de fornecedores), não representando proposta comercial vinculante, orçamento executivo ou garantia de preço para execução (Arts. 30 e 35 do CDC e Arts. 186/927 do Código Civil).
          </p>
          <p className="text-[11px] text-amber-950/80 leading-relaxed">
            A Aracá Interiores atua com excelência em design de interiores e decoração. Para reformas com intervenções estruturais ou exigências condominiais (ABNT NBR 16.280), a emissão de ART (CREA) ou RRT (CAU) é viabilizada em conjunto com engenheiros e arquitetos parceiros credenciados.
          </p>
          <div className="pt-1 border-t border-amber-200/60 text-[10.5px] text-amber-900/70 font-medium">
            Custos médios estimados com base na praça de São Paulo/SP e Grande ABC — referência atualizada 2025/2026.
          </div>
        </div>
      </div>
    </div>
  )
}
