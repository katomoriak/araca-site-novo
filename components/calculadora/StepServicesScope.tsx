'use client'

import { useState } from 'react'
import {
  CALCULATOR_CONFIG,
  ServiceId,
  RoomTypeId,
  AddedRoom,
} from '@/lib/calculator-config'
import { cn } from '@/lib/utils'
import {
  Zap,
  Droplets,
  Grid3X3,
  Sparkles,
  Layers,
  Paintbrush,
  Hammer,
  Check,
  CheckCircle2,
  X,
  Info,
  ChevronDown,
  MapPin,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Utensils,
  Bath,
  Sun,
  Flame,
  Shirt,
  Baby,
  Headphones,
  Laptop,
  Package,
  Leaf,
  Waves,
  Briefcase,
  Plus,
  PanelTop,
  Scale,
  Maximize2,
  type LucideIcon,
} from 'lucide-react'

interface StepServicesScopeProps {
  selectedServices: ServiceId[]
  onServicesChange: (services: ServiceId[]) => void
  serviceRooms?: Record<ServiceId, string[]>
  onServiceRoomsChange?: (serviceRooms: Record<ServiceId, string[]>) => void
  effectiveRooms?: AddedRoom[]
  rawRooms?: AddedRoom[]
  onAddRoom?: (typeId: RoomTypeId) => void
  totalArea?: number
  onAdaptTotalAreaToRooms?: (newTotal: number) => void
  onAdaptRoomsToTotalArea?: (targetArea: number) => void
}

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  demolicao: Hammer,
  eletrica: Zap,
  hidraulica: Droplets,
  pisos: Grid3X3,
  gesso: PanelTop,
  pintura: Paintbrush,
  marmoraria: Sparkles,
  marcenaria: Layers,
}

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
  // Aliases
  sala: Sofa,
  varanda: Flame,
  homeoffice: Laptop,
}

export function StepServicesScope({
  selectedServices,
  onServicesChange,
  serviceRooms,
  onServiceRoomsChange,
  effectiveRooms = [],
  rawRooms = [],
  onAddRoom,
  totalArea = 75,
  onAdaptTotalAreaToRooms,
  onAdaptRoomsToTotalArea,
}: StepServicesScopeProps) {
  const services = CALCULATOR_CONFIG.services
  const [modalService, setModalService] = useState<(typeof services)[number] | null>(null)
  const [expandedServices, setExpandedServices] = useState<Record<ServiceId, boolean>>({} as any)

  // Lista base de cômodos (com fallback para cômodos padrão)
  const roomsList = effectiveRooms.length > 0 ? effectiveRooms : []
  const rawRoomsList = rawRooms && rawRooms.length > 0 ? rawRooms : roomsList
  const rawRoomsSum = Math.round(rawRoomsList.reduce((acc, r) => acc + (Number(r.area) || 0), 0) * 10) / 10
  const hasAreaMismatch = Math.abs(rawRoomsSum - totalArea) >= 0.5

  // Alternar expansão do painel de ambientes de um serviço
  const toggleExpandService = (id: ServiceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Alternar inclusão do serviço geral
  const toggleService = (id: ServiceId) => {
    if (selectedServices.includes(id)) {
      onServicesChange(selectedServices.filter((s) => s !== id))
    } else {
      onServicesChange([...selectedServices, id])
    }
  }

  // Obter IDs dos cômodos selecionados para um serviço
  const getSelectedRoomIdsForService = (serviceId: ServiceId): string[] => {
    if (serviceRooms && serviceRooms[serviceId] !== undefined) {
      return serviceRooms[serviceId]
    }
    return roomsList.map((r) => r.id)
  }

  // Alternar um cômodo específico para um serviço
  const toggleRoomForService = (serviceId: ServiceId, roomId: string) => {
    if (!onServiceRoomsChange) return

    const currentRoomIds = getSelectedRoomIdsForService(serviceId)
    let nextRoomIds: string[]

    if (currentRoomIds.includes(roomId)) {
      nextRoomIds = currentRoomIds.filter((id) => id !== roomId)
    } else {
      nextRoomIds = [...currentRoomIds, roomId]
    }

    onServiceRoomsChange({
      ...(serviceRooms || ({} as Record<ServiceId, string[]>)),
      [serviceId]: nextRoomIds,
    })
  }

  // Selecionar todos os cômodos para um serviço
  const handleSelectAllRooms = (serviceId: ServiceId) => {
    if (!onServiceRoomsChange) return
    onServiceRoomsChange({
      ...(serviceRooms || ({} as Record<ServiceId, string[]>)),
      [serviceId]: roomsList.map((r) => r.id),
    })
  }

  // Selecionar apenas áreas molhadas para um serviço
  const handleSelectWetRooms = (serviceId: ServiceId) => {
    if (!onServiceRoomsChange) return
    const wetIds = roomsList.filter((r) => r.isWetArea).map((r) => r.id)
    onServiceRoomsChange({
      ...(serviceRooms || ({} as Record<ServiceId, string[]>)),
      [serviceId]: wetIds,
    })
  }

  // Selecionar apenas áreas secas para um serviço
  const handleSelectDryRooms = (serviceId: ServiceId) => {
    if (!onServiceRoomsChange) return
    const dryIds = roomsList.filter((r) => !r.isWetArea).map((r) => r.id)
    onServiceRoomsChange({
      ...(serviceRooms || ({} as Record<ServiceId, string[]>)),
      [serviceId]: dryIds,
    })
  }

  // Desmarcar todos os cômodos para um serviço
  const handleClearRooms = (serviceId: ServiceId) => {
    if (!onServiceRoomsChange) return
    onServiceRoomsChange({
      ...(serviceRooms || ({} as Record<ServiceId, string[]>)),
      [serviceId]: [],
    })
  }

  // Formatar resumo textual dos cômodos para o breadcrumb colapsado
  const getRoomSummaryLabel = (selectedIds: string[]) => {
    if (selectedIds.length === roomsList.length) {
      return 'Todo o imóvel'
    }
    if (selectedIds.length === 0) {
      return 'Nenhum ambiente (etapa pausada)'
    }

    const selectedRooms = roomsList.filter((r) => selectedIds.includes(r.id))
    const allWetSelected =
      roomsList.filter((r) => r.isWetArea).length > 0 &&
      roomsList.filter((r) => r.isWetArea).every((r) => selectedIds.includes(r.id)) &&
      selectedRooms.every((r) => r.isWetArea)

    if (allWetSelected) {
      return 'Áreas molhadas'
    }

    const allDrySelected =
      roomsList.filter((r) => !r.isWetArea).length > 0 &&
      roomsList.filter((r) => !r.isWetArea).every((r) => selectedIds.includes(r.id)) &&
      selectedRooms.every((r) => !r.isWetArea)

    if (allDrySelected) {
      return 'Áreas secas'
    }

    if (selectedRooms.length === 1) {
      return selectedRooms[0].name
    }
    if (selectedRooms.length === 2) {
      return `${selectedRooms[0].name} e ${selectedRooms[1].name}`
    }
    if (selectedRooms.length === 3) {
      return `${selectedRooms[0].name}, ${selectedRooms[1].name} e ${selectedRooms[2].name}`
    }
    return `${selectedRooms[0].name}, ${selectedRooms[1].name} + ${selectedRooms.length - 2} ambientes`
  }

  const selectAll = () => {
    onServicesChange(services.map((s) => s.id))
  }

  const selectFinishesOnly = () => {
    onServicesChange(['pisos', 'gesso', 'pintura', 'marmoraria', 'marcenaria'])
  }

  const selectInfrastructureOnly = () => {
    onServicesChange(['demolicao', 'eletrica', 'hidraulica', 'pisos', 'gesso'])
  }

  const openServiceModal = (e: React.MouseEvent, service: (typeof services)[number]) => {
    e.stopPropagation()
    setModalService(service)
  }

  const closeServiceModal = () => {
    setModalService(null)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Etapa 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--araca-mineral-green)] text-white inline-flex items-center justify-center text-[11px] font-bold">2</span>
            <span>Etapa 2 • Escopo Técnico da Reforma</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-[var(--araca-cafe-escuro)]">
            Quais serviços serão executados?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 mt-1">
            Selecione as etapas necessárias. Você pode detalhar exatamente em quais cômodos cada serviço será feito.
          </p>
        </div>

        {/* Ações Rápidas de Seleção */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              selectedServices.length === services.length
                ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm'
                : 'bg-white border border-[var(--araca-bege-medio)]/60 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)]'
            )}
          >
            Reforma Completa (Todos)
          </button>
          <button
            type="button"
            onClick={selectFinishesOnly}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[var(--araca-bege-medio)]/60 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors shadow-sm"
          >
            Acabamentos & Marcenaria
          </button>
          <button
            type="button"
            onClick={selectInfrastructureOnly}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[var(--araca-bege-medio)]/60 text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] transition-colors shadow-sm"
          >
            Infra & Quebra-quebra
          </button>
        </div>
      </div>

      {/* Lista de Serviços com Design Aracá */}
      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id)
          const isExpanded = !!expandedServices[service.id]
          const Icon = SERVICE_ICONS[service.id] || Sparkles

          const selectedRoomIds = getSelectedRoomIdsForService(service.id)
          const selectedRooms = roomsList.filter((r) => selectedRoomIds.includes(r.id))
          const serviceRoomsArea = selectedRooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0)
          const totalPropertyArea = totalArea > 0 ? totalArea : 75
          const areaRatioPct = Math.round((serviceRoomsArea / totalPropertyArea) * 100)
          const summaryLabel = getRoomSummaryLabel(selectedRoomIds)

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={cn(
                'group relative rounded-[2rem] p-5 sm:p-7 cursor-pointer transition-all duration-300 border select-none',
                'bg-white backdrop-blur-md shadow-sm',
                isSelected
                  ? 'border-[var(--araca-mineral-green)] ring-2 ring-[var(--araca-mineral-green)]/30 shadow-[0_10px_30px_rgba(60,89,69,0.1)]'
                  : 'border-[var(--araca-bege-medio)]/60 hover:border-[var(--araca-bege-medio)] opacity-70 hover:opacity-100'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
                {/* 1. Ícone Quadrado Arredondado */}
                <div
                  className={cn(
                    'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all shrink-0',
                    isSelected
                      ? 'bg-[var(--araca-mineral-green)] text-white shadow-md shadow-[var(--araca-mineral-green)]/20'
                      : 'bg-[var(--araca-bege-claro)]/80 text-[var(--araca-chocolate-amargo)]/60'
                  )}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />
                </div>

                {/* 2. Conteúdo Central: Título Maiúsculo Rubik Bold + Tag de Peso + Descrição + Link Veja Mais */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-body text-base sm:text-lg md:text-xl font-bold tracking-wide uppercase text-[var(--araca-cafe-escuro)] mb-1 leading-snug">
                    {service.label}
                  </h4>

                  <div className="text-xs sm:text-sm font-semibold text-[var(--araca-laranja-queimado)] mb-1.5">
                    ~{Math.round(service.weight * 100)}% do investimento base
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed font-light mb-2">
                    {service.description}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => openServiceModal(e, service)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--araca-mineral-green)] underline underline-offset-4 hover:text-[var(--araca-mineral-green-hover)] transition-colors"
                  >
                    <span>Veja tudo que contempla a etapa....</span>
                  </button>
                </div>

                {/* 3. Botão de Checkbox Arredondado à Direita */}
                <div className="flex items-center justify-end sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--araca-bege-medio)]/20">
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all',
                      isSelected
                        ? 'bg-[var(--araca-mineral-green)] text-white shadow-md shadow-[var(--araca-mineral-green)]/25'
                        : 'border-2 border-[var(--araca-bege-medio)] bg-white/80 text-transparent'
                    )}
                  >
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* 4. Barra Breadcrumb Compacta com Seta para Detalhar Ambientes */}
              {isSelected && (
                <div className="mt-4 pt-3.5 border-t border-[var(--araca-bege-medio)]/30">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpandService(service.id)
                    }}
                    title={`Ambientes contemplados (${selectedRooms.length}/${roomsList.length}):\n${selectedRooms.map((r) => `• ${r.name} (${r.area} m²)`).join('\n') || 'Nenhum ambiente selecionado'}`}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl transition-all border cursor-pointer select-none group/bc',
                      isExpanded
                        ? 'bg-[var(--araca-creme)] border-[var(--araca-mineral-green)]/40 shadow-xs ring-1 ring-[var(--araca-mineral-green)]/20'
                        : 'bg-[var(--araca-bege-claro)]/70 hover:bg-[var(--araca-bege-claro)] border-[var(--araca-bege-medio)]/40'
                    )}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
                      <span className="font-bold text-[var(--araca-mineral-green)] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Ambientes contemplados:
                      </span>
                      <span className="font-semibold text-[var(--araca-cafe-escuro)]">
                        {summaryLabel}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 border border-[var(--araca-bege-medio)]/40 text-[var(--araca-chocolate-amargo)] shadow-xs">
                        {Math.round(serviceRoomsArea * 10) / 10} m² ({selectedRooms.length}/{roomsList.length} amb.)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[var(--araca-mineral-green)] text-xs font-semibold shrink-0">
                      <span className="hidden sm:inline group-hover/bc:underline">
                        {isExpanded ? 'Recolher detalhes' : 'Detalhar onde será feito'}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-300 stroke-[2.2]',
                          isExpanded && 'rotate-180 text-[var(--araca-laranja-queimado)]'
                        )}
                      />
                    </div>
                  </div>

                  {/* 5. Gaveta Expansível com Breadcrumb Trail, Seleção de Cômodos e Contabilização em m² */}
                  {isExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white to-[var(--araca-creme)]/40 border border-[var(--araca-bege-medio)]/60 shadow-inner space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {/* Trilha Breadcrumb + Botões Rápidos */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--araca-bege-medio)]/30">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--araca-chocolate-amargo)]/80 flex-wrap">
                          <span className="font-semibold text-[var(--araca-mineral-green)]">Escopo</span>
                          <span className="text-neutral-400">›</span>
                          <span className="font-medium text-[var(--araca-cafe-escuro)]">{service.shortLabel}</span>
                          <span className="text-neutral-400">›</span>
                          <span className="text-[var(--araca-laranja-queimado)] font-bold">Onde será feito:</span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleSelectAllRooms(service.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-[var(--araca-bege-claro)] border border-[var(--araca-bege-medio)]/40 text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            Todos ({roomsList.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectWetRooms(service.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-[var(--araca-bege-claro)] border border-[var(--araca-bege-medio)]/40 text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            Áreas Molhadas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectDryRooms(service.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-[var(--araca-bege-claro)] border border-[var(--araca-bege-medio)]/40 text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            Áreas Secas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClearRooms(service.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>

                      {/* Grid de Cômodos Selecionáveis com Respectivas m² - Sem Truncamento */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roomsList.map((room) => {
                          const isRoomChecked = selectedRoomIds.includes(room.id)
                          const RoomIcon = ROOM_ICONS[room.typeId] || Sparkles

                          return (
                            <div
                              key={room.id}
                              onClick={() => toggleRoomForService(service.id, room.id)}
                              className={cn(
                                'relative p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none flex flex-col justify-between gap-2.5 group/room',
                                isRoomChecked
                                  ? 'bg-white border-[var(--araca-mineral-green)] ring-2 ring-[var(--araca-mineral-green)]/20 shadow-xs'
                                  : 'bg-white/70 border-[var(--araca-bege-medio)]/50 hover:border-[var(--araca-bege-medio)] opacity-60 hover:opacity-90'
                              )}
                              title={`${room.name} • ${room.isWetArea ? 'Área Molhada' : 'Área Seca'} (${room.area} m²)`}
                            >
                              {/* Tooltip flutuante no hover do cômodo */}
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 invisible group-hover/room:opacity-100 group-hover/room:visible transition-all duration-150 z-30 px-3 py-1 rounded-xl bg-[var(--araca-cafe-escuro)] text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-1.5 scale-95 group-hover/room:scale-100">
                                <span>{room.name}</span>
                                <span className="text-[var(--araca-dourado-ocre)] font-normal text-[10px]">({room.area} m²)</span>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--araca-cafe-escuro)] rotate-45 border-r border-b border-white/10" />
                              </div>
                              {/* Linha Superior: Ícone + Nome Completo (Sem Truncamento) + Checkbox */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={cn(
                                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5',
                                      isRoomChecked
                                        ? 'bg-[var(--araca-mineral-green)] text-white shadow-xs'
                                        : 'bg-[var(--araca-bege-claro)] text-[var(--araca-chocolate-amargo)]/60'
                                    )}
                                  >
                                    <RoomIcon className="w-4 h-4 stroke-[1.8]" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-xs sm:text-sm text-[var(--araca-cafe-escuro)] leading-snug block break-words">
                                      {room.name}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    'w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 mt-0.5',
                                    isRoomChecked
                                      ? 'bg-[var(--araca-mineral-green)] text-white shadow-xs'
                                      : 'border-2 border-[var(--araca-bege-medio)] bg-white'
                                  )}
                                >
                                  {isRoomChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>

                              {/* Linha Inferior: Categoria do Cômodo + Badge de Metragem */}
                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--araca-bege-medio)]/30 text-[11px]">
                                <span className="text-[var(--araca-chocolate-amargo)]/70 font-medium">
                                  {room.isWetArea ? 'Área Molhada' : 'Área Seca'}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-[var(--araca-creme)] border border-[var(--araca-bege-medio)]/60 font-bold text-[var(--araca-cafe-escuro)]">
                                  {room.area} m²
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Botões Rápidos para Adicionar Cômodos Adicionais se o Imóvel Tiver Mais Ambientes */}
                      {onAddRoom && (
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--araca-chocolate-amargo)]/70">
                          <span className="text-[11px] font-medium">Falta algum cômodo?</span>
                          <button
                            type="button"
                            onClick={() => onAddRoom('quarto')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/40 hover:bg-[var(--araca-bege-claro)] text-[11px] font-semibold text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                            + Dormitório
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddRoom('banheiro')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/40 hover:bg-[var(--araca-bege-claro)] text-[11px] font-semibold text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                            + Banheiro
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddRoom('closet')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/40 hover:bg-[var(--araca-bege-claro)] text-[11px] font-semibold text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                            + Closet
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddRoom('areaGourmet')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/40 hover:bg-[var(--araca-bege-claro)] text-[11px] font-semibold text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                            + Gourmet
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddRoom('homeOffice')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/40 hover:bg-[var(--araca-bege-claro)] text-[11px] font-semibold text-[var(--araca-cafe-escuro)] transition-colors shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                            + Home Office
                          </button>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onAddRoom(e.target.value as RoomTypeId)
                                e.target.value = ''
                              }
                            }}
                            defaultValue=""
                            className="px-2.5 py-1 rounded-lg bg-white border border-[var(--araca-bege-medio)]/50 text-[11px] font-semibold text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-claro)] cursor-pointer outline-none shadow-2xs"
                          >
                            <option value="" disabled>
                              + Mais Ambientes...
                            </option>
                            <option value="salaJantar">+ Sala de Jantar</option>
                            <option value="quartoBebe">+ Quarto de Bebê</option>
                            <option value="quartoCrianca">+ Quarto de Criança</option>
                            <option value="quartoAdolescente">+ Quarto de Adolescente</option>
                            <option value="miniVaranda">+ Mini Varanda</option>
                            <option value="lavabo">+ Lavabo Social</option>
                            <option value="despensa">+ Despensa</option>
                            <option value="areaServico">+ Área de Serviço</option>
                            <option value="jardim">+ Jardim / Área Externa</option>
                          </select>
                        </div>
                      )}

                      {/* Alerta de Sincronização ao Adicionar Cômodo no Escopo de Serviços */}
                      {hasAreaMismatch && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border border-amber-300/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2.5">
                            <Scale className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[var(--araca-cafe-escuro)]">
                                {rawRoomsSum > totalArea
                                  ? `Cômodo adicionado: ambientes somam ${rawRoomsSum} m² (+${(rawRoomsSum - totalArea).toFixed(1)} m²)`
                                  : `Ambientes somam ${rawRoomsSum} m² (Total no topo: ${totalArea} m²)`}
                              </span>
                              <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                                Deseja atualizar a metragem total da obra ou redistribuir proporcionalmente?
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => onAdaptTotalAreaToRooms && onAdaptTotalAreaToRooms(rawRoomsSum)}
                              className="px-2.5 py-1.5 rounded-lg bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-bold text-[11px] shadow-2xs transition-all active:scale-95 inline-flex items-center gap-1"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Expandir total para {rawRoomsSum} m²</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAdaptRoomsToTotalArea && onAdaptRoomsToTotalArea(totalArea)}
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[var(--araca-bege-claro)] border border-[var(--araca-bege-medio)] text-[var(--araca-cafe-escuro)] font-semibold text-[11px] shadow-2xs transition-all active:scale-95 inline-flex items-center gap-1"
                            >
                              <Scale className="w-3 h-3 text-[var(--araca-mineral-green)]" />
                              <span>Distribuir nos {totalArea} m²</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Banner de Impacto Financeiro e Metragem do Serviço */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/50 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[var(--araca-cafe-escuro)]">
                            Metragem de {service.shortLabel}:
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[var(--araca-mineral-green)] text-white font-bold text-[11px]">
                            {Math.round(serviceRoomsArea * 10) / 10} m²
                          </span>
                          <span className="text-[var(--araca-chocolate-amargo)]/70 text-[11px]">
                            ({selectedRooms.length} de {roomsList.length} cômodos • {areaRatioPct}% do imóvel)
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-[var(--araca-laranja-queimado)]">
                          {selectedRooms.length === roomsList.length
                            ? 'Execução em todo o imóvel'
                            : selectedRooms.length === 0
                            ? 'Nenhum ambiente (etapa não orçada)'
                            : `Custo desta etapa ajustado para ${areaRatioPct}%`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Nota de Rodapé Explicativa */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[var(--araca-creme)]/80 border border-[var(--araca-bege-medio)]/40 text-xs text-[var(--araca-chocolate-amargo)]/80 font-light">
        <Info className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
        <div>
          <strong>Transparência Aracá:</strong> Cada serviço calcula proporcionalmente à metragem dos cômodos
          onde será realizado. Por exemplo, caso a demolição ocorra apenas na cozinha e banheiro, o valor
          dessa etapa será contabilizado exclusivamente sobre esses ambientes, recalculando a estimativa na hora.
        </div>
      </div>

      {/* ── MODAL: O QUE CONTEMPLA A ETAPA ── */}
      {modalService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeServiceModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[var(--araca-bege-medio)]/60 max-h-[90vh] overflow-y-auto"
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={closeServiceModal}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[var(--araca-bege-claro)]/70 hover:bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)] flex items-center justify-center transition-colors"
              aria-label="Fechar modal de detalhes"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-4 mb-5 pr-8">
              {(() => {
                const ModalIcon = SERVICE_ICONS[modalService.id] || Sparkles
                return (
                  <div className="w-14 h-14 rounded-2xl bg-[var(--araca-mineral-green)] text-white flex items-center justify-center shrink-0 shadow-md">
                    <ModalIcon className="w-7 h-7" />
                  </div>
                )
              })()}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--araca-laranja-queimado)]">
                  ~{Math.round(modalService.weight * 100)}% do investimento total
                </span>
                <h3 className="font-body text-xl sm:text-2xl font-bold text-[var(--araca-cafe-escuro)] tracking-wide uppercase">
                  {modalService.label}
                </h3>
              </div>
            </div>

            {/* Descrição Geral */}
            <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed mb-6 font-light">
              {modalService.description}
            </p>

            {/* Lista Completa de Itens Contemplados */}
            <div className="space-y-3 mb-6">
              <div className="text-xs uppercase tracking-wider font-semibold text-[var(--araca-cafe-escuro)]">
                O que está incluso nesta etapa técnica:
              </div>
              <div className="space-y-2.5">
                {modalService.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/30 text-xs sm:text-sm text-[var(--araca-cafe-escuro)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--araca-mineral-green)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ação: Fechar ou Alternar Inclusão */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--araca-bege-medio)]/30">
              <button
                type="button"
                onClick={() => {
                  toggleService(modalService.id)
                }}
                className={cn(
                  'flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm',
                  selectedServices.includes(modalService.id)
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-[var(--araca-mineral-green)] text-white hover:bg-[var(--araca-mineral-green-hover)]'
                )}
              >
                {selectedServices.includes(modalService.id)
                  ? 'Remover este serviço do cálculo'
                  : 'Incluir este serviço no cálculo'}
              </button>

              <button
                type="button"
                onClick={closeServiceModal}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-medium bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)] hover:bg-[var(--araca-bege-medio)]/60 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
