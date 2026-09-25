'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { MessageCircle, FileSpreadsheet, FileDown, RotateCcw } from 'lucide-react'

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
  }

  const whatsappUrl = getWhatsAppSimulationUrl(simulationState, result)

  return (
    <div id="calculadora" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Cabeçalho Limpo */}
      <CalculatorHeader
        roomsCount={rooms.length}
        totalArea={result.totalArea}
      />

      {/* Conteúdo Principal em 2 Colunas no Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Configurações de Etapa 1 e Etapa 2 (7 colunas) */}
        <div className="lg:col-span-7 space-y-10">
          {/* ETAPA 1: Metragem Total, Composição de Ambientes e Padrão */}
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

          {/* ETAPA 2: Escopo de Serviços com Ambientes e m² */}
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

          {/* Botão de Redefinir Simulação */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--araca-chocolate-amargo)]/60 hover:text-[var(--araca-cafe-escuro)] transition-colors py-1 px-3 rounded-lg hover:bg-white/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Redefinir simulação para o padrão</span>
            </button>
          </div>
        </div>

        {/* Coluna Direita: Resultado Dinâmico (5 colunas, sticky para acompanhar o scroll) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
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

      {/* Barra Fixa no Mobile para Alta Conversão */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[var(--araca-bege-medio)]/60 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 uppercase tracking-wider block font-semibold">
            Estimativa Média
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Orçar Projeto</span>
          </a>

          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--araca-mineral-green)] text-white text-xs font-semibold shadow-sm active:scale-95"
          >
            <FileDown className="w-4 h-4" />
            <span>Gerar PDF</span>
          </button>
        </div>
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
