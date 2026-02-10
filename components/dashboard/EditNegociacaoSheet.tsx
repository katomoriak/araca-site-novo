'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CrmKanbanLead, NegociacaoStage } from '@/lib/payload'

const STAGE_OPTIONS: { value: NegociacaoStage; label: string }[] = [
  { value: 'prospeccao', label: 'Prospecção' },
  { value: 'proposta', label: 'Proposta enviada' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' },
]

export type EditNegociacaoData = {
  negotiationId: string
  lead: CrmKanbanLead
  /** Etapa atual da negociação (vem da coluna do Kanban). */
  currentStage: NegociacaoStage
}

type EditNegociacaoSheetProps = {
  /** Dados da negociação a editar; null = sheet fechado. */
  negotiation: EditNegociacaoData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Chamado após salvar com sucesso (ex.: router.refresh()). */
  onSaved?: () => void
}

export function EditNegociacaoSheet({
  negotiation,
  open,
  onOpenChange,
  onSaved,
}: EditNegociacaoSheetProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    stage: 'prospeccao' as NegociacaoStage,
    value: '',
    notes: '',
  })

  useEffect(() => {
    if (!negotiation || !open) return
    setForm({
      stage: negotiation.currentStage,
      value:
        negotiation.lead.negotiationValue != null
          ? String(negotiation.lead.negotiationValue)
          : '',
      notes: negotiation.lead.negotiationNotes?.trim() ?? '',
    })
    setError(null)
  }, [negotiation, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!negotiation) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/negociacoes/${negotiation.negotiationId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: form.stage,
          value: (() => {
            const v = form.value.trim().replace(',', '.')
            if (!v) return undefined
            const n = parseFloat(v)
            return Number.isFinite(n) ? n : undefined
          })(),
          notes: form.notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data.errors?.[0]?.message ?? data.message ?? 'Erro ao salvar'
        throw new Error(typeof msg === 'string' ? msg : 'Erro ao salvar.')
      }
      onOpenChange(false)
      onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const lead = negotiation?.lead

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-md border-araca-bege-medio/30 bg-araca-creme text-araca-cafe-escuro shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-araca-cafe-escuro">
            Editar negociação
          </SheetTitle>
          <SheetDescription className="text-araca-chocolate-amargo/90">
            {lead ? (
              <>
                <span className="font-medium text-araca-cafe-escuro">{lead.name}</span>
                {lead.company && ` · ${lead.company}`}
              </>
            ) : (
              'Altere etapa, valor e notas.'
            )}
          </SheetDescription>
        </SheetHeader>
        {negotiation && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lead</label>
              <p className="text-sm text-muted-foreground">
                {lead?.name}
                {lead?.company ? ` · ${lead.company}` : ''}
                {lead?.email ? ` · ${lead.email}` : ''}
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-stage" className="text-sm font-medium">
                Etapa
              </label>
              <select
                id="edit-stage"
                value={form.stage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, stage: e.target.value as NegociacaoStage }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-value" className="text-sm font-medium">
                Valor (R$)
              </label>
              <Input
                id="edit-value"
                type="text"
                inputMode="numeric"
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-notes" className="text-sm font-medium">
                Notas
              </label>
              <textarea
                id="edit-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Observações da negociação"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="mt-auto flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading} loading={loading}>
                Salvar
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
