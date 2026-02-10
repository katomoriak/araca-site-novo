'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import type { CrmKanbanColumn, CrmKanbanLead, NegociacaoStage } from '@/lib/payload'
import { EditNegociacaoSheet, type EditNegociacaoData } from '@/components/dashboard/EditNegociacaoSheet'

const DRAG_DATA_NEGOCIACAO_ID = 'application/x-araca-negociacao-id'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return '—'
  }
}

function leadRef(id: string | number | undefined | null): string {
  const s = id != null ? String(id) : ''
  const num = s.replace(/\D/g, '').slice(-4) || s.slice(-4) || '—'
  return `L-${num}`
}

const STAGE_COLORS: Record<NegociacaoStage, string> = {
  prospeccao: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  proposta: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
  negociacao: 'border-l-violet-500 bg-violet-50/50 dark:bg-violet-950/20',
  fechado: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
  perdido: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
}

function KanbanCard({
  lead,
  currentStage,
  formatCurrency,
  leadRef,
  formatDate,
  onDragStart,
  onEdit,
  isDragging,
}: {
  lead: CrmKanbanLead
  currentStage: NegociacaoStage
  formatCurrency: (v: number) => string
  leadRef: (id: string | number | undefined | null) => string
  formatDate: (d: string | undefined | null) => string
  onDragStart: (e: React.DragEvent, negotiationId: string) => void
  onEdit: (data: EditNegociacaoData) => void
  isDragging: boolean
}) {
  const secondary = lead.company ? `${lead.company} · ${lead.email}` : lead.email
  const hasNotes = lead.negotiationNotes && lead.negotiationNotes.trim().length > 0
  const negotiationId = lead.negotiationId ?? ''
  const canDrag = Boolean(negotiationId)

  function handleClick(e: React.MouseEvent) {
    if (isDragging) return
    e.preventDefault()
    if (negotiationId) {
      onEdit({
        negotiationId,
        lead,
        currentStage,
      })
    }
  }

  return (
    <div
      draggable={canDrag}
      onDragStart={(e) => canDrag && onDragStart(e, negotiationId)}
      className={`rounded-md border border-border/60 bg-card shadow-sm transition-colors hover:border-primary/30 ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        className="block w-full p-3 text-left hover:bg-muted/50 rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{lead.name}</p>
            <p className="text-xs text-muted-foreground truncate" title={secondary}>
              {secondary}
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
            {lead.negotiationValue != null
              ? formatCurrency(lead.negotiationValue)
              : '—'}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
          <span className="font-mono">{leadRef(lead.id)}</span>
          <span title={lead.negotiationUpdatedAt ?? undefined}>
            {formatDate(lead.negotiationUpdatedAt ?? lead.lastActivity)}
          </span>
        </div>
        {hasNotes && (
          <p
            className="mt-2 text-[11px] text-muted-foreground line-clamp-2 border-t border-border/40 pt-2"
            title={lead.negotiationNotes ?? undefined}
          >
            {lead.negotiationNotes}
          </p>
        )}
      </button>
    </div>
  )
}

interface CrmKanbanProps {
  columns: CrmKanbanColumn[]
}

export function CrmKanban({ columns }: CrmKanbanProps) {
  const router = useRouter()
  const [draggingNegociacaoId, setDraggingNegociacaoId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<NegociacaoStage | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editNegociacao, setEditNegociacao] = useState<EditNegociacaoData | null>(null)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const justDraggedRef = useRef(false)

  const openEditSheet = useCallback((data: EditNegociacaoData) => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return
    }
    setEditNegociacao(data)
    setEditSheetOpen(true)
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent, negotiationId: string) => {
    e.dataTransfer.setData(DRAG_DATA_NEGOCIACAO_ID, negotiationId)
    e.dataTransfer.effectAllowed = 'move'
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    e.dataTransfer.setDragImage(el, Math.round(rect.width / 2), Math.round(rect.height / 2))
    setDraggingNegociacaoId(negotiationId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggingNegociacaoId(null)
    setDragOverStage(null)
    justDraggedRef.current = true
  }, [])

  const updateStage = useCallback(
    async (negotiationId: string, newStage: NegociacaoStage) => {
      setUpdatingId(negotiationId)
      try {
        const res = await fetch(`/api/negociacoes/${negotiationId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const msg = data.errors?.[0]?.message ?? data.message ?? 'Erro ao atualizar etapa'
          throw new Error(typeof msg === 'string' ? msg : 'Erro ao atualizar etapa')
        }
        router.refresh()
      } finally {
        setUpdatingId(null)
      }
    },
    [router],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStage: NegociacaoStage) => {
      e.preventDefault()
      setDraggingNegociacaoId(null)
      setDragOverStage(null)
      const negotiationId = e.dataTransfer.getData(DRAG_DATA_NEGOCIACAO_ID)
      if (!negotiationId) return
      void updateStage(negotiationId, targetStage)
    },
    [updateStage],
  )

  const handleDragEnter = useCallback((_e: React.DragEvent, stage: NegociacaoStage) => {
    setDragOverStage(stage)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null
    if (!related || !e.currentTarget.contains(related)) setDragOverStage(null)
  }, [])

  return (
    <>
    <div className="overflow-x-auto pb-2" onDragEnd={handleDragEnd}>
      <div className="flex gap-4 min-w-max">
        {columns.map((col) => (
          <div
            key={col.stage}
            className={[
              'flex w-72 shrink-0 flex-col rounded-lg border border-border transition-colors',
              STAGE_COLORS[col.stage],
              draggingNegociacaoId && dragOverStage === col.stage
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5'
                : '',
            ].join(' ')}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, col.stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.stage)}
          >
            <CardHeader className="border-b border-border/50 py-4">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-medium">
                  {col.title}
                </CardTitle>
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {formatCurrency(col.totalValue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {col.leads.length} {col.leads.length === 1 ? 'lead' : 'leads'}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 min-h-[400px] max-h-[calc(100vh-280px)]">
              {col.leads.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {draggingNegociacaoId ? 'Solte aqui para mover' : 'Nenhum lead nesta etapa'}
                </p>
              ) : (
                col.leads.map((lead) => (
                  <KanbanCard
                    key={lead.negotiationId ?? lead.id}
                    lead={lead}
                    currentStage={col.stage}
                    formatCurrency={formatCurrency}
                    leadRef={leadRef}
                    formatDate={formatDate}
                    onDragStart={handleDragStart}
                    onEdit={openEditSheet}
                    isDragging={draggingNegociacaoId === (lead.negotiationId ?? '') || updatingId === (lead.negotiationId ?? '')}
                  />
                ))
              )}
            </CardContent>
          </div>
        ))}
      </div>
    </div>
    <EditNegociacaoSheet
      negotiation={editNegociacao}
      open={editSheetOpen}
      onOpenChange={setEditSheetOpen}
      onSaved={() => router.refresh()}
    />
    </>
  )
}
