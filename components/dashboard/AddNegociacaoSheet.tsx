'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { NegociacaoStage } from '@/lib/payload'

const STAGE_OPTIONS: { value: NegociacaoStage; label: string }[] = [
  { value: 'prospeccao', label: 'Prospecção' },
  { value: 'proposta', label: 'Proposta enviada' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' },
]

interface LeadOption {
  id: string
  name: string
  email?: string | null
  company?: string | null
}

type AddNegociacaoSheetProps = {
  /** Chamado após criar uma negociação com sucesso; use para atualizar o Kanban (ex.: router.refresh()). */
  onNegociacaoAdded?: () => void
}

export function AddNegociacaoSheet({ onNegociacaoAdded }: AddNegociacaoSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [form, setForm] = useState({
    leadId: '',
    stage: 'prospeccao' as NegociacaoStage,
    value: '',
    notes: '',
  })

  useEffect(() => {
    if (!open) return
    setLoadingLeads(true)
    setError(null)
    fetch('/api/leads?limit=500&sort=-lastActivity', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data: { docs?: LeadOption[] }) => setLeads(data.docs ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoadingLeads(false))
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.leadId.trim()) {
      setError('Selecione um lead.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/negociacoes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: form.leadId.trim(),
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
        const msg = data.errors?.[0]?.message ?? data.message ?? `Erro ${res.status}`
        throw new Error(typeof msg === 'string' ? msg : 'Falha ao criar negociação.')
      }
      setForm({ leadId: '', stage: 'prospeccao', value: '', notes: '' })
      setOpen(false)
      onNegociacaoAdded?.()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('negociacao-added'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar negociação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">
          <Plus className="size-4" />
          Adicionar negociação
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-md border-araca-bege-medio/30 bg-araca-creme text-araca-cafe-escuro shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-araca-cafe-escuro">Nova negociação</SheetTitle>
          <SheetDescription className="text-araca-chocolate-amargo/90">
            Vincule um lead e defina a etapa do pipeline. Um lead pode ter várias negociações.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="lead" className="text-sm font-medium">
              Lead *
            </label>
            <select
              id="lead"
              required
              value={form.leadId}
              onChange={(e) => setForm((p) => ({ ...p, leadId: e.target.value }))}
              disabled={loadingLeads}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">
                {loadingLeads ? 'Carregando leads...' : 'Selecione o lead'}
              </option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.company ? ` · ${l.company}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="stage" className="text-sm font-medium">
              Etapa
            </label>
            <select
              id="stage"
              value={form.stage}
              onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value as NegociacaoStage }))}
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
            <label htmlFor="value" className="text-sm font-medium">
              Valor (R$)
            </label>
            <Input
              id="value"
              type="text"
              inputMode="numeric"
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notas
            </label>
            <textarea
              id="notes"
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || loadingLeads} loading={loading}>
              Adicionar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
