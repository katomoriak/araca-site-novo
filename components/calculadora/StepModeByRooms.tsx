'use client'

import { useState } from 'react'
import {
  CALCULATOR_CONFIG,
  RoomTypeId,
  AddedRoom,
  FinishStandardId,
  formatCurrencyBRL,
} from '@/lib/calculator-config'
import { cn } from '@/lib/utils'
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Bath,
  Droplets,
  Sun,
  Waves,
  Briefcase,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Layers,
  Check,
  type LucideIcon,
} from 'lucide-react'

interface StepModeByRoomsProps {
  rooms: AddedRoom[]
  onRoomsChange: (rooms: AddedRoom[]) => void
  selectedStandard: FinishStandardId
  onStandardChange: (standard: FinishStandardId) => void
}

const ROOM_ICONS: Record<RoomTypeId, LucideIcon> = {
  sala: Sofa,
  quarto: Bed,
  cozinha: UtensilsCrossed,
  banheiro: Bath,
  lavabo: Droplets,
  varanda: Sun,
  lavanderia: Waves,
  homeoffice: Briefcase,
}

export function StepModeByRooms({
  rooms,
  onRoomsChange,
  selectedStandard,
  onStandardChange,
}: StepModeByRoomsProps) {
  const roomTypes = Object.values(CALCULATOR_CONFIG.roomTypes)
  const standards = Object.values(CALCULATOR_CONFIG.standards)

  // Adicionar um novo cômodo
  const handleAddRoom = (typeId: RoomTypeId) => {
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

    onRoomsChange([...rooms, newRoom])
  }

  // Alterar tamanho pré-definido de um cômodo
  const handlePresetChange = (roomId: string, presetName: 'Pequeno' | 'Médio' | 'Grande') => {
    const updated = rooms.map((room) => {
      if (room.id !== roomId) return room
      const config = CALCULATOR_CONFIG.roomTypes[room.typeId]
      const preset = config.presetSizes.find((p) => p.name === presetName)
      return {
        ...room,
        sizePreset: presetName,
        area: preset ? preset.area : room.area,
      }
    })
    onRoomsChange(updated)
  }

  // Alterar área manual (m²)
  const handleCustomAreaChange = (roomId: string, newArea: number) => {
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

  // Remover um cômodo
  const handleRemoveRoom = (roomId: string) => {
    onRoomsChange(rooms.filter((r) => r.id !== roomId))
  }

  // Presets completos de planta
  const applyPresetLayout = (presetKey: 'apto2' | 'apto3' | 'casa') => {
    let presetRooms: AddedRoom[] = []

    if (presetKey === 'apto2') {
      presetRooms = [
        { id: 'sala-1', typeId: 'sala', name: 'Living Integrado', sizePreset: 'Médio', area: 24, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha', sizePreset: 'Médio', area: 9, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Área de Serviço', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Principal', sizePreset: 'Médio', area: 15, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro da Suíte', sizePreset: 'Médio', area: 4.5, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Dormitório 2 / Hóspedes', sizePreset: 'Pequeno', area: 10, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Social', sizePreset: 'Pequeno', area: 3.5, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda', sizePreset: 'Pequeno', area: 6, isWetArea: true },
      ]
    } else if (presetKey === 'apto3') {
      presetRooms = [
        { id: 'sala-1', typeId: 'sala', name: 'Living Amplo', sizePreset: 'Grande', area: 36, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha Gourmet', sizePreset: 'Médio', area: 12, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Lavanderia', sizePreset: 'Médio', area: 4.5, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Master com Closet', sizePreset: 'Grande', area: 22, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Banheiro Suíte Master', sizePreset: 'Grande', area: 6.5, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Suíte 2', sizePreset: 'Médio', area: 14, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Suíte 2', sizePreset: 'Médio', area: 4.5, isWetArea: true },
        { id: 'quarto-3', typeId: 'quarto', name: 'Dormitório 3 / Escritório', sizePreset: 'Médio', area: 12, isWetArea: false },
        { id: 'lavabo-1', typeId: 'lavabo', name: 'Lavabo Social', sizePreset: 'Médio', area: 2.5, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Varanda Gourmet', sizePreset: 'Médio', area: 12, isWetArea: true },
      ]
    } else if (presetKey === 'casa') {
      presetRooms = [
        { id: 'sala-1', typeId: 'sala', name: 'Living Pé-Direito Duplo', sizePreset: 'Grande', area: 48, isWetArea: false },
        { id: 'coz-1', typeId: 'cozinha', name: 'Cozinha & Ilha', sizePreset: 'Grande', area: 18, isWetArea: true },
        { id: 'lavand-1', typeId: 'lavanderia', name: 'Área de Serviço & Despensa', sizePreset: 'Grande', area: 8, isWetArea: true },
        { id: 'quarto-1', typeId: 'quarto', name: 'Suíte Master', sizePreset: 'Grande', area: 26, isWetArea: false },
        { id: 'banh-1', typeId: 'banheiro', name: 'Sala de Banho Master', sizePreset: 'Grande', area: 8.5, isWetArea: true },
        { id: 'quarto-2', typeId: 'quarto', name: 'Suíte 2', sizePreset: 'Médio', area: 16, isWetArea: false },
        { id: 'quarto-3', typeId: 'quarto', name: 'Suíte 3', sizePreset: 'Médio', area: 16, isWetArea: false },
        { id: 'banh-2', typeId: 'banheiro', name: 'Banheiro Suíte 2', sizePreset: 'Médio', area: 5, isWetArea: true },
        { id: 'banh-3', typeId: 'banheiro', name: 'Banheiro Suíte 3', sizePreset: 'Médio', area: 5, isWetArea: true },
        { id: 'lavabo-1', typeId: 'lavabo', name: 'Lavabo', sizePreset: 'Médio', area: 3, isWetArea: true },
        { id: 'var-1', typeId: 'varanda', name: 'Espaço Gourmet & Churrasqueira', sizePreset: 'Grande', area: 25, isWetArea: true },
      ]
    }

    onRoomsChange(presetRooms)
  }

  // Cálculos de resumo
  const totalArea = rooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0)
  const wetArea = rooms.filter((r) => r.isWetArea).reduce((acc, r) => acc + (Number(r.area) || 0), 0)
  const wetPercent = totalArea > 0 ? Math.round((wetArea / totalArea) * 100) : 0

  return (
    <div className="space-y-10">
      {/* 1. SELEÇÃO RÁPIDA DE PLANTA PRESET */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[var(--araca-bege-medio)]/60 shadow-[0_10px_35px_rgb(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] mb-2">
              <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Etapa 1.1 • Montagem da Planta</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
              Adicione os ambientes da sua reforma
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">Modelos prontos:</span>
            <button
              type="button"
              onClick={() => applyPresetLayout('apto2')}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors shadow-sm"
            >
              Apto 2 Dorms (~75m²)
            </button>
            <button
              type="button"
              onClick={() => applyPresetLayout('apto3')}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors shadow-sm"
            >
              Apto 3 Dorms (~125m²)
            </button>
            <button
              type="button"
              onClick={() => applyPresetLayout('casa')}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors shadow-sm"
            >
              Casa / Cobertura (~180m²)
            </button>
            {rooms.length > 0 && (
              <button
                type="button"
                onClick={() => onRoomsChange([])}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                title="Limpar todos os cômodos"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Botões Rápidos para Adicionar Cômodos */}
        <div className="pt-3 border-t border-[var(--araca-bege-medio)]/30">
          <div className="text-xs font-semibold text-[var(--araca-chocolate-amargo)]/80 mb-3">
            Clique para adicionar ambientes à simulação:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {roomTypes.map((type) => {
              const Icon = ROOM_ICONS[type.id] || Sofa
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleAddRoom(type.id)}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[var(--araca-bege-medio)]/50 hover:border-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green)]/5 transition-all text-center shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-[var(--araca-bege-claro)]/60 group-hover:bg-[var(--araca-mineral-green)]/15 flex items-center justify-center text-[var(--araca-mineral-green)] mb-1.5 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--araca-cafe-escuro)] line-clamp-1">
                    {type.label.split('/')[0].trim()}
                  </span>
                  <span className="text-[9px] text-[var(--araca-chocolate-amargo)]/60 font-semibold mt-0.5">
                    + Adicionar
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. LISTA DE CÔMODOS ADICIONADOS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[var(--araca-bege-medio)]/60 shadow-[0_10px_35px_rgb(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-display text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
              Ambientes Selecionados ({rooms.length})
            </h4>
            <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
              Personalize a área ou selecione os tamanhos pré-definidos de cada ambiente.
            </p>
          </div>

          {/* Resumo de Metragem e Áreas Molhadas */}
          {rooms.length > 0 && (
            <div className="flex items-center gap-3 text-xs bg-white/80 px-4 py-2 rounded-2xl border border-[var(--araca-bege-medio)]/40 shadow-sm">
              <div>
                <span className="text-[var(--araca-chocolate-amargo)]/70">Área total: </span>
                <span className="font-bold text-[var(--araca-cafe-escuro)]">{Math.round(totalArea)} m²</span>
              </div>
              <div className="w-px h-4 bg-[var(--araca-bege-medio)]/60" />
              <div title="Cozinhas e banheiros exigem maior custo com encanamento, impermeabilização e pedras">
                <span className="text-[var(--araca-chocolate-amargo)]/70">Áreas Molhadas: </span>
                <span className="font-bold text-[var(--araca-mineral-green)]">
                  {Math.round(wetArea)} m² ({wetPercent}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white/40 border border-dashed border-[var(--araca-bege-medio)] text-center">
            <Layers className="w-10 h-10 text-[var(--araca-mineral-green)]/40 mx-auto mb-3" />
            <div className="font-serif text-lg text-[var(--araca-cafe-escuro)] mb-1">
              Nenhum ambiente adicionado ainda
            </div>
            <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 max-w-md mx-auto mb-4">
              Clique nos botões acima para adicionar salas, quartos, cozinhas e banheiros, ou utilize
              um dos nossos modelos prontos de apartamento.
            </p>
            <button
              type="button"
              onClick={() => applyPresetLayout('apto2')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--araca-mineral-green)] text-white hover:bg-[var(--araca-mineral-green-hover)] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carregar Apartamento Padrão 75m²
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const Icon = ROOM_ICONS[room.typeId] || Sofa
              const config = CALCULATOR_CONFIG.roomTypes[room.typeId]

              return (
                <div
                  key={room.id}
                  className={cn(
                    'p-4 sm:p-5 rounded-3xl bg-white/80 backdrop-blur-md border transition-all duration-200 shadow-sm flex flex-col justify-between',
                    room.isWetArea
                      ? 'border-[var(--araca-mineral-green)]/40 hover:border-[var(--araca-mineral-green)]'
                      : 'border-[var(--araca-bege-medio)]/40 hover:border-[var(--araca-bege-medio)]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                          room.isWetArea
                            ? 'bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]'
                            : 'bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)]'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif text-base text-[var(--araca-cafe-escuro)] font-medium">
                          {room.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {room.isWetArea ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)]/10 px-2 py-0.5 rounded-md">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Área Molhada (Alto impacto)
                            </span>
                          ) : (
                            <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/60 font-medium">
                              Área Seca
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(room.id)}
                      className="p-1.5 text-[var(--araca-chocolate-amargo)]/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover cômodo"
                      aria-label={`Remover ${room.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Seletores de Tamanho */}
                  <div className="pt-3 border-t border-[var(--araca-bege-medio)]/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {(['Pequeno', 'Médio', 'Grande'] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handlePresetChange(room.id, preset)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all',
                            room.sizePreset === preset
                              ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                              : 'bg-[var(--araca-bege-claro)]/70 text-[var(--araca-chocolate-amargo)] hover:bg-[var(--araca-bege-claro)]'
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Input de m² customizado */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={150}
                        step={0.5}
                        value={room.area}
                        onChange={(e) => handleCustomAreaChange(room.id, parseFloat(e.target.value))}
                        className="w-16 h-7 text-center text-xs font-semibold text-[var(--araca-cafe-escuro)] bg-white rounded-lg border border-[var(--araca-bege-medio)] focus:outline-none focus:ring-1 focus:ring-[var(--araca-mineral-green)]"
                      />
                      <span className="text-[11px] font-semibold text-[var(--araca-chocolate-amargo)]/60">m²</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 3. SELEÇÃO DO PADRÃO DE ACABAMENTO (EM LINHAS EMPILHADAS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[var(--araca-bege-medio)]/60 shadow-[0_10px_35px_rgb(0,0,0,0.05)]">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Etapa 1.2 • Padrão de Acabamento dos Ambientes</span>
          </div>
          <h4 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
            Qual o padrão de acabamento para os cômodos?
          </h4>
        </div>

        <div className="space-y-3">
          {standards.map((standard) => {
            const isSelected = selectedStandard === standard.id
            return (
              <div
                key={standard.id}
                onClick={() => onStandardChange(standard.id)}
                className={cn(
                  'p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                  isSelected
                    ? 'bg-white border-[var(--araca-mineral-green)] shadow-md ring-2 ring-[var(--araca-mineral-green)]/30 scale-[1.005]'
                    : 'bg-white/60 border-[var(--araca-bege-medio)]/40 hover:bg-white/90'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)]/10 px-2 py-0.5 rounded-full">
                      {standard.badge}
                    </span>
                    <h5 className="font-display text-lg text-[var(--araca-cafe-escuro)] font-normal">
                      {standard.name}
                    </h5>
                  </div>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/75 line-clamp-1">
                    {standard.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:border-l sm:border-[var(--araca-bege-medio)]/40 sm:pl-5 shrink-0 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/60 uppercase tracking-wider block font-semibold">
                      Média mercado
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[var(--araca-cafe-escuro)]">
                      {formatCurrencyBRL(standard.minCostPerM2)} a {formatCurrencyBRL(standard.maxCostPerM2)}/m²
                    </span>
                  </div>

                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0',
                      isSelected
                        ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                        : 'border border-[var(--araca-bege-medio)] text-transparent bg-white'
                    )}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
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
