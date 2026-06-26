'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { CrmKanbanColumn, CrmDeal } from '@/lib/supabase-crm'

const DRAG_DATA_DEAL_ID = 'application/x-araca-deal-id'

const COLUMN_COLORS: Record<string, string> = {
  default: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
}

const COLOR_BY_INDEX = [
  'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
  'border-l-violet-500 bg-violet-50/50 dark:bg-violet-950/20',
  'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
  'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
]

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
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(dateStr))
  } catch { return '—' }
}

function dealRef(id: string): string {
  return `D-${id.slice(-4).toUpperCase()}`
}

function KanbanCard({
  deal,
  onDragStart,
  isDragging,
}: {
  deal: CrmDeal
  onDragStart: (e: React.DragEvent, dealId: string) => void
  isDragging: boolean
}) {
  const contact = deal.contacts
  const secondary = deal.company ? `${deal.company} · ${contact?.email ?? ''}` : (contact?.email ?? contact?.phone ?? '—')

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className={`rounded-md border border-border/60 bg-card shadow-sm transition-colors hover:border-primary/30 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="block w-full p-3 text-left rounded-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{contact?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground truncate" title={secondary}>{secondary}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{deal.project_name}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
            {deal.value ? formatCurrency(deal.value) : '—'}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
          <span className="font-mono">{dealRef(deal.id)}</span>
          <span>{formatDate(deal.created_at)}</span>
        </div>
        {deal.notes && (
          <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 border-t border-border/40 pt-2">
            {deal.notes}
          </p>
        )}
      </div>
    </div>
  )
}

interface CrmKanbanProps {
  columns: CrmKanbanColumn[]
}

export function CrmKanban({ columns }: CrmKanbanProps) {
  const router = useRouter()
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null)
  const [dragOverColId, setDragOverColId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const justDraggedRef = useRef(false)

  const handleDragStart = useCallback((e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData(DRAG_DATA_DEAL_ID, dealId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingDealId(dealId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggingDealId(null)
    setDragOverColId(null)
    justDraggedRef.current = true
  }, [])

  const updateStatus = useCallback(async (dealId: string, statusId: string | null) => {
    setUpdatingId(dealId)
    try {
      const res = await fetch(`/api/crm/deals/${dealId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: statusId }),
      })
      if (!res.ok) throw new Error('Falha ao mover deal')
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }, [router])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, colId: string | null) => {
    e.preventDefault()
    setDraggingDealId(null)
    setDragOverColId(null)
    const dealId = e.dataTransfer.getData(DRAG_DATA_DEAL_ID)
    if (!dealId) return
    void updateStatus(dealId, colId)
  }, [updateStatus])

  return (
    <div className="overflow-x-auto pb-2" onDragEnd={handleDragEnd}>
      <div className="flex gap-4 min-w-max">
        {columns.map((col, idx) => (
          <div
            key={col.id}
            className={[
              'flex w-72 shrink-0 flex-col rounded-lg border border-border transition-colors',
              COLOR_BY_INDEX[idx % COLOR_BY_INDEX.length] ?? COLUMN_COLORS.default,
              draggingDealId && dragOverColId === col.id
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5'
                : '',
            ].join(' ')}
            onDragOver={handleDragOver}
            onDragEnter={() => setDragOverColId(col.id)}
            onDragLeave={(e) => {
              const related = e.relatedTarget as Node | null
              if (!related || !e.currentTarget.contains(related)) setDragOverColId(null)
            }}
            onDrop={(e) => handleDrop(e, col.id === '__unassigned__' ? null : col.id)}
          >
            <CardHeader className="border-b border-border/50 py-4">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-medium">{col.name}</CardTitle>
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {formatCurrency(col.totalValue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {col.deals.length} {col.deals.length === 1 ? 'deal' : 'deals'}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 min-h-[400px] max-h-[calc(100vh-280px)]">
              {col.deals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {draggingDealId ? 'Solte aqui para mover' : 'Nenhum deal nesta etapa'}
                </p>
              ) : (
                col.deals.map((deal) => (
                  <KanbanCard
                    key={deal.id}
                    deal={deal}
                    onDragStart={handleDragStart}
                    isDragging={draggingDealId === deal.id || updatingId === deal.id}
                  />
                ))
              )}
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  )
}
