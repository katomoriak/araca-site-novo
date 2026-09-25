'use client'

import { useState } from 'react'
import {
  CALCULATOR_CONFIG,
  FinishStandardId,
  RoomTypeId,
  AddedRoom,
  formatCurrencyBRL,
  scaleRoomsToTotalArea,
} from '@/lib/calculator-config'
import { cn } from '@/lib/utils'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Minus,
  Plus,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Utensils,
  Bath,
  Droplets,
  Sun,
  Flame,
  Shirt,
  Baby,
  Headphones,
  Laptop,
  Package,
  Layers,
  Leaf,
  Waves,
  Briefcase,
  Trash2,
  Sliders,
  Scale,
  Maximize2,
  type LucideIcon,
} from 'lucide-react'

interface StepModeTotalAreaProps {
  totalArea: number
  onAreaChange: (area: number) => void
  rooms: AddedRoom[]
  onRoomsChange: (rooms: AddedRoom[]) => void
  selectedStandard: FinishStandardId
  onStandardChange: (standard: FinishStandardId) => void
  onAdaptTotalAreaToRooms?: (newTotal: number) => void
  onAdaptRoomsToTotalArea?: (targetArea: number) => void
}

const COMMON_PRESETS = [
  { label: 'Studio', area: 35 },
  { label: '2 Quartos', area: 68 },
  { label: '3 Quartos', area: 98 },
  { label: '4 Quartos / Duplex', area: 160 },
]

const SLIDER_MIN = 15
const SLIDER_MAX = 400

const SLIDER_MILESTONES = [
  { area: 15, label: '15 m²', sublabel: 'Studio' },
  { area: 100, label: '100 m²', sublabel: '2 a 3 Qts' },
  { area: 200, label: '200 m²', sublabel: 'Alto Padrão' },
  { area: 300, label: '300 m²', sublabel: 'Cobertura' },
  { area: 400, label: '400 m²', sublabel: 'Mansão' },
]

const ROOM_ICONS: Record<string, LucideIcon> = {
  salaEstar: Sofa,
  salaJantar: UtensilsCrossed,
  cozinha: Utensils,
  areaGourmet: Flame,
  miniVaranda: Sun,
  banheiro: Bath,
  lavabo: Droplets,
  quarto: BedDouble,
  closet: Shirt,
  quartoBebe: Baby,
  quartoCrianca: Sparkles,
  quartoAdolescente: Headphones,
  homeOffice: Laptop,
  despensa: Package,
  lavanderia: Droplets,
  areaServico: Layers,
  jardim: Leaf,
  // Aliases para compatibilidade total
  sala: Sofa,
  varanda: Flame,
  homeoffice: Laptop,
}

const ROOM_TYPE_ORDER: RoomTypeId[] = [
  'salaEstar',
  'salaJantar',
  'cozinha',
  'areaGourmet',
  'miniVaranda',
  'banheiro',
  'lavabo',
  'quarto',
  'closet',
  'quartoBebe',
  'quartoCrianca',
  'quartoAdolescente',
  'homeOffice',
  'despensa',
  'lavanderia',
  'areaServico',
  'jardim',
]

export function StepModeTotalArea({
  totalArea,
  onAreaChange,
  rooms,
  onRoomsChange,
  selectedStandard,
  onStandardChange,
  onAdaptTotalAreaToRooms,
  onAdaptRoomsToTotalArea,
}: StepModeTotalAreaProps) {
  const [showDetailedRooms, setShowDetailedRooms] = useState(false)
  const standards = Object.values(CALCULATOR_CONFIG.standards)

  // Metragem somada dos cômodos atuais
  const roomsSum = Math.round(rooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0) * 10) / 10
  const areaDiff = Math.round((roomsSum - totalArea) * 10) / 10
  const hasAreaMismatch = Math.abs(areaDiff) >= 0.5
  const isRoomsGreater = areaDiff > 0

  // Percentual exato do slider (15 a 400 m²) para preenchimento visual e indicador flutuante
  const sliderPercentage = Math.min(
    100,
    Math.max(
      0,
      ((Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, totalArea)) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100
    )
  )

  // Ao mover o slider, escalona os cômodos proporcionalmente para manter 100% de consistência
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (!isNaN(val)) {
      onAreaChange(val)
      onRoomsChange(scaleRoomsToTotalArea(rooms, val))
    }
  }

  // Ao clicar em qualquer marco proporcional da escala abaixo do slider
  const handleMilestoneClick = (area: number) => {
    onAreaChange(area)
    onRoomsChange(scaleRoomsToTotalArea(rooms, area))
  }

  // Ao digitar a metragem total, também escalona os cômodos proporcionalmente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (!isNaN(val)) {
      const safe = Math.max(15, Math.min(600, val))
      onAreaChange(safe)
      onRoomsChange(scaleRoomsToTotalArea(rooms, safe))
    }
  }

  // Botões de ajuste rápido +/- 5 m²
  const adjustArea = (delta: number) => {
    const safe = Math.max(15, Math.min(600, totalArea + delta))
    onAreaChange(safe)
    onRoomsChange(scaleRoomsToTotalArea(rooms, safe))
  }

  // Ação: Adaptar metragem total para a soma dos cômodos
  const handleAdaptToRooms = () => {
    if (onAdaptTotalAreaToRooms) {
      onAdaptTotalAreaToRooms(roomsSum)
    } else {
      onAreaChange(Math.round(roomsSum))
    }
  }

  // Ação: Adaptar cômodos proporcionalmente à metragem total informada
  const handleAdaptToTotalArea = () => {
    if (onAdaptRoomsToTotalArea) {
      onAdaptRoomsToTotalArea(totalArea)
    } else {
      onRoomsChange(scaleRoomsToTotalArea(rooms, totalArea))
    }
  }

  // Contagem de ambientes por tipo com suporte a aliases
  const getRoomCount = (typeId: RoomTypeId): number => {
    return rooms.filter((r) => {
      if (r.typeId === typeId) return true
      if (typeId === 'salaEstar' && r.typeId === 'sala') return true
      if (typeId === 'areaGourmet' && r.typeId === 'varanda') return true
      if (typeId === 'homeOffice' && r.typeId === 'homeoffice') return true
      return false
    }).length
  }

  // Alterar quantidade de ambientes de um determinado tipo
  const handleRoomCountChange = (typeId: RoomTypeId, delta: number) => {
    const currentRoomsOfType = rooms.filter((r) => {
      if (r.typeId === typeId) return true
      if (typeId === 'salaEstar' && r.typeId === 'sala') return true
      if (typeId === 'areaGourmet' && r.typeId === 'varanda') return true
      if (typeId === 'homeOffice' && r.typeId === 'homeoffice') return true
      return false
    })

    if (delta > 0) {
      const config = CALCULATOR_CONFIG.roomTypes[typeId] || CALCULATOR_CONFIG.roomTypes.quarto
      const count = currentRoomsOfType.length + 1
      let name = `${config.label}`

      if (typeId === 'salaEstar' || typeId === 'sala') name = count === 1 ? 'Sala de Estar' : `Sala de Estar ${count}`
      else if (typeId === 'salaJantar') name = count === 1 ? 'Sala de Jantar' : `Sala de Jantar ${count}`
      else if (typeId === 'cozinha') name = count === 1 ? 'Cozinha' : `Cozinha ${count}`
      else if (typeId === 'areaGourmet' || typeId === 'varanda') name = count === 1 ? 'Área Gourmet / Varanda' : `Área Gourmet / Varanda ${count}`
      else if (typeId === 'miniVaranda') name = count === 1 ? 'Mini Varanda' : `Mini Varanda ${count}`
      else if (typeId === 'banheiro') name = count === 1 ? 'Banheiro Social / Suíte' : `Banheiro Social / Suíte ${count}`
      else if (typeId === 'lavabo') name = count === 1 ? 'Lavabo Social' : `Lavabo Social ${count}`
      else if (typeId === 'quarto') name = count === 1 ? 'Quarto / Suíte Principal' : `Quarto / Suíte ${count}`
      else if (typeId === 'closet') name = count === 1 ? 'Closet' : `Closet ${count}`
      else if (typeId === 'quartoBebe') name = count === 1 ? 'Quarto de Bebê' : `Quarto de Bebê ${count}`
      else if (typeId === 'quartoCrianca') name = count === 1 ? 'Quarto de Criança' : `Quarto de Criança ${count}`
      else if (typeId === 'quartoAdolescente') name = count === 1 ? 'Quarto de Adolescente' : `Quarto de Adolescente ${count}`
      else if (typeId === 'homeOffice' || typeId === 'homeoffice') name = count === 1 ? 'Home Office' : `Home Office ${count}`
      else if (typeId === 'despensa') name = count === 1 ? 'Despensa' : `Despensa ${count}`
      else if (typeId === 'lavanderia') name = count === 1 ? 'Lavanderia' : `Lavanderia ${count}`
      else if (typeId === 'areaServico') name = count === 1 ? 'Área de Serviço' : `Área de Serviço ${count}`
      else if (typeId === 'jardim') name = count === 1 ? 'Jardim / Área Externa' : `Jardim / Área Externa ${count}`

      const newRoom: AddedRoom = {
        id: `${typeId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        typeId,
        name,
        sizePreset: 'Médio',
        area: config.defaultSize,
        isWetArea: config.isWetArea,
      }

      onRoomsChange([...rooms, newRoom])
    } else if (delta < 0 && currentRoomsOfType.length > 0) {
      const lastRoom = currentRoomsOfType[currentRoomsOfType.length - 1]
      onRoomsChange(rooms.filter((r) => r.id !== lastRoom.id))
    }
  }

  // Alterar metragem manual de um cômodo específico
  const handleCustomRoomAreaChange = (roomId: string, newArea: number) => {
    const safeArea = Math.max(1, Math.min(200, Number(newArea) || 1))
    const updated = rooms.map((room) => {
      if (room.id !== roomId) return room
      return {
        ...room,
        sizePreset: 'Personalizado' as const,
        area: safeArea,
      }
    })
    onRoomsChange(updated)
  }

  // Aplicar preset completo de planta (área + cômodos perfeitamente alinhados)
  const applyPlantPreset = (presetKey: 'studio' | 'apto2' | 'apto3' | 'duplex') => {
    if (presetKey === 'studio') {
      onAreaChange(35)
      onRoomsChange([
        { id: 'sala-1', typeId: 'sala', name: 'Living / Dormitório Integrado', sizePreset: 'Médio', area: 19, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha Compacta', sizePreset: 'Pequeno', area: 6, isWetArea: true },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda Integrada', sizePreset: 'Pequeno', area: 4, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Área de Serviço', sizePreset: 'Pequeno', area: 2.5, isWetArea: true },
      ])
    } else if (presetKey === 'apto2') {
      onAreaChange(68)
      onRoomsChange([
        { id: 'sala-1', typeId: 'sala', name: 'Living Integrado', sizePreset: 'Médio', area: 22, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha', sizePreset: 'Médio', area: 8, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Lavanderia', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Principal', sizePreset: 'Médio', area: 13, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro da Suíte', sizePreset: 'Médio', area: 4, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Dormitório 2', sizePreset: 'Pequeno', area: 10, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Social', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda', sizePreset: 'Pequeno', area: 4, isWetArea: true },
      ])
    } else if (presetKey === 'apto3') {
      onAreaChange(98)
      onRoomsChange([
        { id: 'sala-1', typeId: 'sala', name: 'Living Amplo', sizePreset: 'Grande', area: 28, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha & Copa', sizePreset: 'Médio', area: 10, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Lavanderia', sizePreset: 'Médio', area: 4, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Master', sizePreset: 'Grande', area: 16, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro Suíte Master', sizePreset: 'Médio', area: 4.5, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Dormitório 2', sizePreset: 'Médio', area: 11, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Social', sizePreset: 'Médio', area: 4, isWetArea: true },
        { id: 'quarto-3', typeId: 'quarto', name: 'Dormitório 3 / Home Office', sizePreset: 'Médio', area: 10, isWetArea: false },
        { id: 'lavabo-1', typeId: 'lavabo', name: 'Lavabo Social', sizePreset: 'Médio', area: 2.5, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda Gourmet', sizePreset: 'Médio', area: 8, isWetArea: true },
      ])
    } else if (presetKey === 'duplex') {
      onAreaChange(160)
      onRoomsChange([
        { id: 'sala-1', typeId: 'sala', name: 'Living Integrado com TV', sizePreset: 'Grande', area: 42, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha com Ilha Gourmet', sizePreset: 'Grande', area: 15, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Lavanderia Completa', sizePreset: 'Médio', area: 6, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Master com Closet', sizePreset: 'Grande', area: 24, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro Master com Banheira', sizePreset: 'Grande', area: 7, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Suíte 2', sizePreset: 'Médio', area: 14, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Suíte 2', sizePreset: 'Médio', area: 4, isWetArea: true },
        { id: 'quarto-3', typeId: 'quarto', name: 'Suíte 3', sizePreset: 'Médio', area: 13, isWetArea: false },
        { id: 'banh-3', typeId: 'banheiro', name: 'Banheiro Suíte 3', sizePreset: 'Médio', area: 4, isWetArea: true },
        { id: 'lavabo-1', typeId: 'lavabo', name: 'Lavabo de Visitas', sizePreset: 'Médio', area: 3, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda Gourmet & Churrasqueira', sizePreset: 'Grande', area: 18, isWetArea: true },
        { id: 'homeoffice-1', typeId: 'homeoffice', name: 'Home Office / Gabinete', sizePreset: 'Médio', area: 10, isWetArea: false },
      ])
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. SELEÇÃO DE METRAGEM TOTAL & COMPOSIÇÃO DE AMBIENTES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[var(--araca-bege-medio)]/60 shadow-[0_10px_35px_rgb(0,0,0,0.05)] space-y-6">
        {/* Cabeçalho da Etapa 1.1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] mb-2">
              <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Etapa 1.1 • Dimensões & Ambientes do Imóvel</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
              Qual a área privativa a ser reformada?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 mt-1">
              Defina a metragem total e ajuste a quantidade de cômodos do seu imóvel.
            </p>
          </div>

          {/* Input Numérico com Botões +/- */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => adjustArea(-5)}
              className="w-10 h-10 rounded-xl bg-white border border-[var(--araca-bege-medio)]/60 flex items-center justify-center text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors active:scale-95 shadow-sm"
              aria-label="Diminuir 5 m²"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative">
              <input
                type="number"
                min={15}
                max={600}
                value={totalArea}
                onChange={handleInputChange}
                className="w-28 h-10 px-3 pr-9 text-center font-semibold text-lg text-[var(--araca-cafe-escuro)] bg-white rounded-xl border border-[var(--araca-bege-medio)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)] shadow-sm"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--araca-chocolate-amargo)]/60 pointer-events-none">
                m²
              </span>
            </div>

            <button
              type="button"
              onClick={() => adjustArea(5)}
              className="w-10 h-10 rounded-xl bg-white border border-[var(--araca-bege-medio)]/60 flex items-center justify-center text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors active:scale-95 shadow-sm"
              aria-label="Aumentar 5 m²"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider Numérico Interativo de Alta Precisão */}
        <div className="space-y-3 pt-1">
          <div className="relative pt-7 pb-1">
            {/* Indicador Flutuante Dinâmico que acompanha o cursor do slider */}
            <div
              className="absolute top-0 pointer-events-none transition-[left] duration-75 -translate-x-1/2 z-20"
              style={{ left: `${sliderPercentage}%` }}
            >
              <div className="px-2.5 py-0.5 rounded-full bg-[var(--araca-cafe-escuro)] text-white text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/20">
                <span>{totalArea} m²</span>
              </div>
              <div className="w-1.5 h-1.5 bg-[var(--araca-cafe-escuro)] rotate-45 mx-auto -mt-0.5 border-r border-b border-white/20" />
            </div>

            {/* Input range com preenchimento verde dinâmico */}
            <input
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={1}
              value={Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, totalArea))}
              onChange={handleSliderChange}
              style={{
                background: `linear-gradient(to right, var(--araca-mineral-green) 0%, var(--araca-mineral-green) ${sliderPercentage}%, var(--araca-bege-medio) ${sliderPercentage}%, var(--araca-bege-medio) 100%)`,
              }}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[var(--araca-mineral-green)] focus:outline-none transition-all shadow-inner"
              aria-label="Metragem privativa em metros quadrados"
            />
          </div>

          {/* Escala Numérica Proporcional com Pontos Exatos (100% Sincronizada) */}
          <div className="relative w-full h-11 select-none">
            {SLIDER_MILESTONES.map((m, idx) => {
              const pct = ((m.area - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100
              const isPast = totalArea >= m.area
              const isExact = Math.abs(totalArea - m.area) <= 8

              const alignClass =
                idx === 0
                  ? 'translate-x-0 text-left items-start'
                  : idx === SLIDER_MILESTONES.length - 1
                  ? '-translate-x-full text-right items-end'
                  : '-translate-x-1/2 text-center items-center'

              return (
                <button
                  key={m.area}
                  type="button"
                  onClick={() => handleMilestoneClick(m.area)}
                  className={cn(
                    'absolute top-0 flex flex-col cursor-pointer transition-all duration-150 group',
                    alignClass
                  )}
                  style={{ left: `${pct}%` }}
                  title={`Clique para selecionar ${m.area} m²`}
                >
                  {/* Marcador no track */}
                  <div
                    className={cn(
                      'w-1.5 h-2 rounded-full mb-1 transition-all',
                      isExact
                        ? 'bg-[var(--araca-mineral-green)] h-3 scale-125 ring-2 ring-[var(--araca-mineral-green)]/30'
                        : isPast
                        ? 'bg-[var(--araca-mineral-green)]'
                        : 'bg-[var(--araca-bege-medio)] group-hover:bg-[var(--araca-mineral-green)]'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-bold leading-tight transition-colors whitespace-nowrap',
                      isExact
                        ? 'text-[var(--araca-mineral-green)]'
                        : isPast
                        ? 'text-[var(--araca-cafe-escuro)]'
                        : 'text-[var(--araca-chocolate-amargo)]/60 group-hover:text-[var(--araca-cafe-escuro)]'
                    )}
                  >
                    {m.label}
                  </span>
                  <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/50 hidden sm:block leading-tight font-medium whitespace-nowrap">
                    {m.sublabel}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Presets Rápidos de Tipologia de Imóvel */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--araca-bege-medio)]/30">
          <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-semibold mr-1">
            Plantas comuns:
          </span>
          <button
            type="button"
            onClick={() => applyPlantPreset('studio')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              totalArea === 35
                ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                : 'bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)]'
            )}
          >
            Studio (35m²)
          </button>
          <button
            type="button"
            onClick={() => applyPlantPreset('apto2')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              totalArea === 68
                ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                : 'bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)]'
            )}
          >
            2 Quartos (68m²)
          </button>
          <button
            type="button"
            onClick={() => applyPlantPreset('apto3')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              totalArea === 98
                ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                : 'bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)]'
            )}
          >
            3 Quartos (98m²)
          </button>
          <button
            type="button"
            onClick={() => applyPlantPreset('duplex')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              totalArea === 160
                ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                : 'bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)]'
            )}
          >
            4 Quartos / Duplex (160m²)
          </button>
        </div>

        {/* ── DETALHAMENTO DA QUANTIDADE DE AMBIENTES ── */}
        <div className="pt-4 border-t border-[var(--araca-bege-medio)]/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                <span>Composição dos Ambientes</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]">
                  {rooms.length} cômodos
                </span>
              </h4>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
                Ajuste quantos cômodos compõem seu espaço para personalizar a simulação.
              </p>
            </div>

            {/* Alternador para ver metragens individuais */}
            <button
              type="button"
              onClick={() => setShowDetailedRooms(!showDetailedRooms)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--araca-mineral-green)] hover:text-[var(--araca-mineral-green-hover)] transition-colors self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showDetailedRooms ? 'Ocultar metragens por cômodo' : 'Ver metragens por cômodo'}</span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform duration-200', showDetailedRooms && 'rotate-180')}
              />
            </button>
          </div>

          {/* Grid de Contadores por Tipo de Ambiente (com botões - e +) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ROOM_TYPE_ORDER.map((typeId) => {
              const config = CALCULATOR_CONFIG.roomTypes[typeId] || CALCULATOR_CONFIG.roomTypes.quarto
              const Icon = ROOM_ICONS[typeId] || Sparkles
              const count = getRoomCount(typeId)

              return (
                <div
                  key={typeId}
                  className={cn(
                    'group relative p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-2.5',
                    'hover:shadow-md hover:border-[var(--araca-mineral-green)]/60',
                    count > 0
                      ? 'bg-white border-[var(--araca-bege-medio)]/60 shadow-xs'
                      : 'bg-[var(--araca-bege-claro)]/40 border-dashed border-[var(--araca-bege-medio)]/40 opacity-75 hover:opacity-100 hover:bg-white/80'
                  )}
                  title={`${config.label} • ${config.category} (~${config.defaultSize}m²) - ${config.description}`}
                >
                  {/* Tooltip no Hover com nome 100% completo, categoria e metragem típica */}
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-30 px-3 py-1.5 rounded-xl bg-[var(--araca-cafe-escuro)] text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-1.5 scale-95 group-hover:scale-100">
                    <span>{config.label}</span>
                    <span className="text-[var(--araca-dourado-ocre)] font-normal text-[10px]">({config.category})</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--araca-cafe-escuro)] rotate-45 border-r border-b border-white/10" />
                  </div>

                  <div className="flex items-start gap-2 min-h-[38px]">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        count > 0
                          ? 'bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]'
                          : 'bg-neutral-200 text-neutral-400'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-xs text-[var(--araca-cafe-escuro)] leading-snug block break-words">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Controles [-] Quantidade [+] */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[var(--araca-bege-medio)]/20">
                    <button
                      type="button"
                      onClick={() => handleRoomCountChange(typeId, -1)}
                      disabled={count === 0}
                      className="w-7 h-7 rounded-lg bg-[var(--araca-bege-claro)] hover:bg-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors active:scale-95"
                      aria-label={`Diminuir ${config.label}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="font-bold text-sm text-[var(--araca-cafe-escuro)]">
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRoomCountChange(typeId, 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white flex items-center justify-center transition-colors active:scale-95 shadow-xs"
                      aria-label={`Aumentar ${config.label}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── BANNER DE SINCRONIZAÇÃO DE METRAGEM COM 2 BOTÕES UI/UX ── */}
          {hasAreaMismatch && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-300/80 shadow-md space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[var(--araca-cafe-escuro)]">
                      {isRoomsGreater
                        ? `Ambientes somam ${roomsSum} m² (+${areaDiff} m² adicionados)`
                        : `Ambientes somam ${roomsSum} m² (${areaDiff} m² em relação ao topo)`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                      Ajuste de Metragem
                    </span>
                  </div>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/80 mt-1 leading-relaxed">
                    {isRoomsGreater
                      ? `Ao adicionar cômodos, a soma dos ambientes (${roomsSum} m²) superou a metragem informada no topo (${totalArea} m²). Como você deseja calcular o orçamento?`
                      : `A metragem total no topo é de ${totalArea} m², mas os cômodos somam ${roomsSum} m². Escolha como prefere que a calculadora proceda:`}
                  </p>
                </div>
              </div>

              {/* Os 2 Botões de Ação com UI/UX Clara */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={handleAdaptToRooms}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white shadow-xs transition-all active:scale-[0.98] text-left group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <Maximize2 className="w-4 h-4 shrink-0 text-white/90 group-hover:scale-110 transition-transform" />
                      <span>{isRoomsGreater ? `Expandir área para ${roomsSum} m²` : `Ajustar área para ${roomsSum} m²`}</span>
                    </div>
                    <span className="text-[11px] text-white/80 block mt-0.5 leading-snug">
                      Atualiza a área total e recalcula o orçamento
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/20 shrink-0">
                    {areaDiff > 0 ? `+${areaDiff}` : areaDiff} m²
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleAdaptToTotalArea}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white hover:bg-[var(--araca-bege-claro)] border border-[var(--araca-bege-medio)] text-[var(--araca-cafe-escuro)] shadow-2xs transition-all active:scale-[0.98] text-left group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[var(--araca-cafe-escuro)]">
                      <Scale className="w-4 h-4 shrink-0 text-[var(--araca-mineral-green)] group-hover:scale-110 transition-transform" />
                      <span>Distribuir nos {totalArea} m²</span>
                    </div>
                    <span className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 block mt-0.5 leading-snug">
                      Mantém {totalArea} m² e adapta cômodos proporcionalmente
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)] shrink-0">
                    Fixar {totalArea}m²
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Painel Expansível de Detalhamento de Metragens dos Cômodos */}
          {showDetailedRooms && (
            <div className="p-4 rounded-2xl bg-[var(--araca-creme)]/70 border border-[var(--araca-bege-medio)]/60 space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[var(--araca-chocolate-amargo)] font-medium pb-2 border-b border-[var(--araca-bege-medio)]/40">
                <span className="font-semibold text-[var(--araca-cafe-escuro)]">Metragem individual por cômodo:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Soma dos cômodos: <strong>{roomsSum} m²</strong></span>
                  <span>•</span>
                  <span>Área da simulação: <strong>{totalArea} m²</strong></span>
                  {!hasAreaMismatch ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--araca-mineral-green)] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% alinhado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-bold bg-amber-200/80 px-1.5 py-0.5 rounded">
                      Diferença: {areaDiff > 0 ? `+${areaDiff}` : areaDiff} m²
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {rooms.map((room) => {
                  const RoomIcon = ROOM_ICONS[room.typeId] || Sparkles
                  return (
                    <div
                      key={room.id}
                      className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[var(--araca-bege-medio)]/50 text-xs shadow-2xs hover:border-[var(--araca-mineral-green)]/60 hover:shadow-xs transition-all"
                      title={`${room.name} • ${room.isWetArea ? 'Área Molhada' : 'Área Seca'} (${room.area} m²)`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[var(--araca-bege-claro)] text-[var(--araca-mineral-green)] flex items-center justify-center shrink-0">
                          <RoomIcon className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-[var(--araca-cafe-escuro)] block break-words leading-tight">
                            {room.name}
                          </span>
                          <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/60 font-medium">
                            {room.isWetArea ? 'Área Molhada' : 'Área Seca'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min={1}
                          max={150}
                          step={0.5}
                          value={room.area}
                          onChange={(e) => handleCustomRoomAreaChange(room.id, Number(e.target.value))}
                          className="w-16 h-8 text-center font-bold text-xs bg-[var(--araca-creme)] rounded-lg border border-[var(--araca-bege-medio)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--araca-mineral-green)]"
                        />
                        <span className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 font-semibold">
                          m²
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SELEÇÃO DO PADRÃO DE ACABAMENTO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[var(--araca-bege-medio)]/60 shadow-[0_10px_35px_rgb(0,0,0,0.05)]">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Etapa 1.2 • Padrão de Acabamento & Especificação</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
            Escolha o nível de acabamento desejado
          </h3>
          <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 mt-1">
            O padrão define a nobreza dos revestimentos, marcenaria sob medida, ferragens e projeto luminotécnico.
          </p>
        </div>

        <div className="space-y-4">
          {standards.map((standard) => {
            const isSelected = selectedStandard === standard.id

            return (
              <div
                key={standard.id}
                onClick={() => onStandardChange(standard.id)}
                className={cn(
                  'relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer',
                  'border backdrop-blur-md',
                  isSelected
                    ? 'bg-white/95 border-[var(--araca-mineral-green)] shadow-[0_12px_36px_rgba(60,89,69,0.14)] ring-2 ring-[var(--araca-mineral-green)]/30 scale-[1.005]'
                    : 'bg-white/60 border-[var(--araca-bege-medio)]/40 hover:bg-white/80 hover:border-[var(--araca-bege-medio)]'
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          'text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full',
                          standard.id === 'alto'
                            ? 'bg-[var(--araca-dourado-ocre)]/15 text-[var(--araca-laranja-queimado)] border border-[var(--araca-dourado-ocre)]/30'
                            : standard.id === 'medio'
                            ? 'bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] border border-[var(--araca-mineral-green)]/30'
                            : standard.id === 'conforto' || standard.id === 'basico'
                            ? 'bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)] border border-[var(--araca-bege-medio)]'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                        )}
                      >
                        {standard.badge}
                      </span>
                    </div>

                    <h4 className="font-display text-xl sm:text-2xl font-normal text-[var(--araca-cafe-escuro)] mb-1 leading-snug">
                      {standard.name}
                    </h4>

                    <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 font-normal leading-relaxed">
                      {standard.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 md:border-l md:border-[var(--araca-bege-medio)]/40 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--araca-bege-medio)]/20 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-[var(--araca-chocolate-amargo)]/70 uppercase tracking-wider font-semibold">
                        Média Mercado SP/ABC
                      </div>
                      <div className="text-base sm:text-lg lg:text-xl font-bold text-[var(--araca-cafe-escuro)] whitespace-nowrap">
                        {formatCurrencyBRL(standard.minCostPerM2)} a {formatCurrencyBRL(standard.maxCostPerM2)}
                        <span className="text-xs font-normal text-[var(--araca-chocolate-amargo)]/60"> / m²</span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shrink-0',
                        isSelected
                          ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                          : 'border border-[var(--araca-bege-medio)] bg-white text-transparent'
                      )}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
