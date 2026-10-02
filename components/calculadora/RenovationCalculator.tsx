'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  CALCULATOR_CONFIG,
  FinishStandardId,
  ServiceId,
  AddedRoom,
  SimulationState,
  calculateRenovationEstimate,
  formatCurrencyBRL,
  getWhatsAppSimulationUrl,
  scaleRoomsToTotalArea,
} from '@/lib/calculator-config'
import { CalculatorHeader } from './CalculatorHeader'
import { StepModeTotalArea } from './StepModeTotalArea'
import { StepServicesScope } from './StepServicesScope'
import { ResultCostCard } from './ResultCostCard'
import { LeadCaptureModal } from './LeadCaptureModal'
import { PdfLeadModal } from './PdfLeadModal'
import {
  MessageCircle,
  FileDown,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Sparkles,
  Sliders,
  Layers,
} from 'lucide-react'

const DEFAULT_ROOMS: AddedRoom[] = [
  { id: 'sala-1', typeId: 'sala', name: 'Living Integrado', sizePreset: 'Médio', area: 24, isWetArea: false },
  { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha', sizePreset: 'Médio', area: 9, isWetArea: true },
  { id: 'lavand-1', typeId: 'lavanderia', name: 'Lavanderia', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
  { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Principal', sizePreset: 'Médio', area: 15, isWetArea: false },
  { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro da Suíte', sizePreset: 'Médio', area: 4, isWetArea: true },
  { id: 'quarto-2', typeId: 'quarto', name: 'Dormitório 2', sizePreset: 'Pequeno', area: 11, isWetArea: false },
  { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Social', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
  { id: 'var-1', typeId: 'varanda', name: 'Varanda', sizePreset: 'Pequeno', area: 5, isWetArea: true },
]

export function RenovationCalculator() {
  const formTopRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [totalArea, setTotalArea] = useState<number>(75)
  const [standardId, setStandardId] = useState<FinishStandardId>('medio')
  const [rooms, setRooms] = useState<AddedRoom[]>(DEFAULT_ROOMS)
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([
    'demolicao',
    'eletrica',
    'hidraulica',
    'pisos',
    'gesso',
    'pintura',
    'marmoraria',
    'marcenaria',
  ])
  const [serviceRooms, setServiceRooms] = useState<Record<ServiceId, string[]>>(() => {
    const allIds = DEFAULT_ROOMS.map((r) => r.id)
    return {
      demolicao: allIds,
      eletrica: allIds,
      hidraulica: allIds,
      pisos: allIds,
      gesso: allIds,
      pintura: allIds,
      marmoraria: allIds,
      marcenaria: allIds,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  // Auto-scroll suave para o início da calculadora ao mudar de etapa
  useEffect(() => {
    if (formTopRef.current) {
      const headerOffset = 90
      const elementPosition = formTopRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [currentStep])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsRevealed(sessionStorage.getItem('araca_obra_unlocked') === 'true')
    }
  }, [])

  // Ambientes efetivos exibidos para o escopo de serviços (escalados se a metragem variar)
  const effectiveRooms = useMemo(() => {
    const defaultTotal = rooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0) || 75.5
    const scale = totalArea / (defaultTotal > 0 ? defaultTotal : 75.5)
    return rooms.map((r) => ({
      ...r,
      area: Math.round(r.area * scale * 10) / 10,
    }))
  }, [rooms, totalArea])

  // Adicionar um novo cômodo rapidamente a partir da etapa de serviços
  const handleAddRoom = (typeId: import('@/lib/calculator-config').RoomTypeId) => {
    const config = CALCULATOR_CONFIG.roomTypes[typeId]
    const countOfSameType = rooms.filter((r) => r.typeId === typeId).length
    const labelSuffix = countOfSameType > 0 ? ` ${countOfSameType + 1}` : ''

    const newRoom: AddedRoom = {
      id: `${typeId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      typeId,
      name: `${config.label}${labelSuffix}`,
      sizePreset: 'Médio',
      area: config.defaultSize,
      isWetArea: config.isWetArea,
    }

    const updatedRooms = [...rooms, newRoom]
    setRooms(updatedRooms)

    setServiceRooms((prev) => {
      const next: Record<ServiceId, string[]> = { ...prev }
      Object.keys(next).forEach((key) => {
        const sKey = key as ServiceId
        if (next[sKey] && next[sKey].length >= rooms.length) {
          next[sKey] = [...next[sKey], newRoom.id]
        }
      })
      return next
    })
  }

  // Estado unificado da simulação
  const simulationState: SimulationState = useMemo(
    () => ({
      mode: 'total-area' as const,
      totalArea,
      standardId,
      rooms,
      selectedServices,
      serviceRooms,
    }),
    [totalArea, standardId, rooms, selectedServices, serviceRooms]
  )

  // Resultado recalculado de forma puramente reativa
  const result = useMemo(
    () => calculateRenovationEstimate(simulationState),
    [simulationState]
  )

  // Adaptar metragem total para a soma dos cômodos
  const handleAdaptTotalAreaToRooms = (newTotal: number) => {
    const safe = Math.max(15, Math.min(600, Math.round(newTotal)))
    setTotalArea(safe)
  }

  // Adaptar cômodos proporcionalmente à metragem total
  const handleAdaptRoomsToTotalArea = (targetArea: number) => {
    const safeTarget = Math.max(15, Math.min(600, Math.round(targetArea)))
    setRooms(scaleRoomsToTotalArea(rooms, safeTarget))
  }

  // Resetar para valores padrão
  const handleReset = () => {
    setTotalArea(75)
    setStandardId('medio')
    setRooms(DEFAULT_ROOMS)
    setSelectedServices([
      'demolicao',
      'eletrica',
      'hidraulica',
      'pisos',
      'gesso',
      'pintura',
      'marmoraria',
      'marcenaria',
    ])
    const allIds = DEFAULT_ROOMS.map((r) => r.id)
    setServiceRooms({
      demolicao: allIds,
      eletrica: allIds,
      hidraulica: allIds,
      pisos: allIds,
      gesso: allIds,
      pintura: allIds,
      marmoraria: allIds,
      marcenaria: allIds,
    })
    setCurrentStep(1)
  }

  const whatsappUrl = getWhatsAppSimulationUrl(simulationState, result)

  return (
    <div id="calculadora" ref={formTopRef} className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-28">
      {/* Cabeçalho Limpo */}
      <CalculatorHeader
        roomsCount={rooms.length}
        totalArea={result.totalArea}
      />

      {/* ── BARRA DE PROGRESSO & STEPPER WIZARD (1 a 3) ── */}
      <div className="mb-8 p-2.5 sm:p-3.5 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/60 shadow-sm">
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          {[
            { step: 1 as const, label: '1. Imóvel & Área', sub: 'Metragem e Padrão' },
            { step: 2 as const, label: '2. Escopo & Ambientes', sub: 'Serviços da Obra' },
            { step: 3 as const, label: '3. Estimativa & Preço', sub: 'Orçamento Final' },
          ].map((item) => {
            const isPassed = item.step < currentStep
            const isCurrent = item.step === currentStep
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-left transition-all flex-1',
                  isCurrent
                    ? 'bg-white shadow-sm border border-[var(--araca-mineral-green)] ring-2 ring-[var(--araca-mineral-green)]/20'
                    : isPassed
                    ? 'bg-white/60 hover:bg-white text-[var(--araca-cafe-escuro)] cursor-pointer'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-600'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                    isCurrent
                      ? 'bg-[var(--araca-mineral-green)] text-white shadow-xs'
                      : isPassed
                      ? 'bg-[var(--araca-mineral-green)]/20 text-[var(--araca-mineral-green)]'
                      : 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : item.step}
                </div>
                <div className="hidden sm:block">
                  <div
                    className={cn(
                      'text-xs font-bold leading-tight',
                      isCurrent
                        ? 'text-[var(--araca-cafe-escuro)]'
                        : isPassed
                        ? 'text-[var(--araca-mineral-green)]'
                        : 'text-neutral-500'
                    )}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-[var(--araca-chocolate-amargo)]/60 leading-tight">
                    {item.sub}
                  </div>
                </div>
                <div className="sm:hidden text-[11px] font-bold truncate">
                  {item.step === 1 && '1. Área'}
                  {item.step === 2 && '2. Serviços'}
                  {item.step === 3 && '3. Orçamento'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo Principal em 2 Colunas no Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Configurações de Etapa 1 e Etapa 2 (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ETAPA 1: Metragem Total, Composição de Ambientes e Padrão */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <StepModeTotalArea
                totalArea={totalArea}
                onAreaChange={setTotalArea}
                rooms={rooms}
                onRoomsChange={setRooms}
                selectedStandard={standardId}
                onStandardChange={setStandardId}
                onAdaptTotalAreaToRooms={handleAdaptTotalAreaToRooms}
                onAdaptRoomsToTotalArea={handleAdaptRoomsToTotalArea}
              />

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--araca-chocolate-amargo)]/60 hover:text-[var(--araca-cafe-escuro)] transition-colors py-2 px-3 rounded-lg hover:bg-white/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Redefinir simulação</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Avançar para Escopo de Serviços</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 2: Escopo de Serviços com Ambientes e m² */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-[var(--araca-bege-medio)]/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <StepServicesScope
                  selectedServices={selectedServices}
                  onServicesChange={setSelectedServices}
                  serviceRooms={serviceRooms}
                  onServiceRoomsChange={setServiceRooms}
                  effectiveRooms={effectiveRooms}
                  rawRooms={rooms}
                  onAddRoom={handleAddRoom}
                  totalArea={result.totalArea}
                  onAdaptTotalAreaToRooms={handleAdaptTotalAreaToRooms}
                  onAdaptRoomsToTotalArea={handleAdaptRoomsToTotalArea}
                />
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--araca-bege-medio)] text-xs font-semibold text-[var(--araca-chocolate-amargo)] hover:bg-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para Área</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Ver Meu Orçamento Estimado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3 (No Mobile ou quando selecionada no Desktop): Resumo das Escolhas */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-[var(--araca-bege-medio)]/50 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Resumo da Configuração Escolhida</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                  Reforma para {result.totalArea} m² • {result.standard.name}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                    <span className="text-[10px] uppercase font-bold text-[var(--araca-chocolate-amargo)]/60 block">Metragem</span>
                    <strong className="text-sm text-[var(--araca-cafe-escuro)]">{result.totalArea} m²</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40">
                    <span className="text-[10px] uppercase font-bold text-[var(--araca-chocolate-amargo)]/60 block">Padrão</span>
                    <strong className="text-sm text-[var(--araca-cafe-escuro)]">{result.standard.name}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-[var(--araca-chocolate-amargo)]/60 block">Serviços</span>
                    <strong className="text-sm text-[var(--araca-cafe-escuro)]">{selectedServices.length} selecionados</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 font-semibold text-[var(--araca-mineral-green)] hover:underline"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Ajustar Metragem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 font-semibold text-[var(--araca-mineral-green)] hover:underline"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Ajustar Serviços</span>
                  </button>
                </div>
              </div>

              {/* No Mobile, exibe o ResultCostCard aqui na Etapa 3 */}
              <div className="lg:hidden">
                <ResultCostCard
                  simulationState={simulationState}
                  result={result}
                  onRequestPdf={() => setIsPdfModalOpen(true)}
                  onRequestProposal={() => setIsModalOpen(true)}
                  isRevealed={isRevealed}
                  onReveal={() => setIsRevealed(true)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resultado Dinâmico (5 colunas, sticky para acompanhar o scroll no Desktop) */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <ResultCostCard
            simulationState={simulationState}
            result={result}
            onRequestPdf={() => setIsPdfModalOpen(true)}
            onRequestProposal={() => setIsModalOpen(true)}
            isRevealed={isRevealed}
            onReveal={() => setIsRevealed(true)}
          />
        </div>
      </div>

      {/* ── BARRA FIXA NO MOBILE PARA ALTA CONVERSÃO ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[var(--araca-bege-medio)]/60 shadow-lg flex items-center justify-between gap-3">
        {currentStep === 1 && (
          <>
            <div>
              <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 uppercase tracking-wider block font-semibold">
                Etapa 1 de 3
              </span>
              <span className="font-display text-sm font-medium text-[var(--araca-cafe-escuro)]">
                {result.totalArea} m² • {result.standard.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--araca-mineral-green)] text-white text-xs font-semibold shadow-sm active:scale-95"
            >
              <span>Avançar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div>
              <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 uppercase tracking-wider block font-semibold">
                Etapa 2 de 3
              </span>
              <span className="font-display text-sm font-medium text-[var(--araca-cafe-escuro)]">
                {selectedServices.length} serviços selecionados
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--araca-mineral-green)] text-white text-xs font-semibold shadow-sm active:scale-95"
            >
              <span>Ver Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div>
              <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 uppercase tracking-wider block font-semibold">
                {isRevealed ? 'Estimativa Média' : 'Etapa 3: Desbloqueio'}
              </span>
              <span
                className={cn(
                  'font-serif text-lg font-normal text-[var(--araca-cafe-escuro)] transition-all',
                  !isRevealed && 'filter blur-[6px] select-none pointer-events-none'
                )}
              >
                {formatCurrencyBRL(result.averageCost)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    ;(window as any).gtag('event', 'generate_lead', {
                      event_category: 'calculadora_obra',
                      event_label: 'whatsapp_mobile_footer',
                      value: result.averageCost,
                      currency: 'BRL',
                    })
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Orçar</span>
              </a>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--araca-mineral-green)] text-white text-xs font-semibold shadow-sm active:scale-95"
              >
                <FileDown className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de Captura para Proposta Formal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        simulationState={simulationState}
        result={result}
      />

      {/* Modal de Download de PDF com Captura para Planilha / Google Script */}
      <PdfLeadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        simulationState={simulationState}
        result={result}
      />
    </div>
  )
}
