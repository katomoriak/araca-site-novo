'use client'

import { useState } from 'react'
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
import type { LeadStatus, LeadSource } from '@/lib/payload'

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'contacted', label: 'Contatado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal_sent', label: 'Proposta enviada' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
]

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Site' },
  { value: 'social', label: 'Redes sociais' },
  { value: 'referral', label: 'Indicação' },
  { value: 'other', label: 'Outro' },
]

type AddLeadSheetProps = {
  /** Chamado após criar um lead com sucesso; use para atualizar a lista (ex.: refetch). */
  onLeadAdded?: () => void
}

export function AddLeadSheet({ onLeadAdded }: AddLeadSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    status: 'contacted' as LeadStatus,
    source: 'website' as LeadSource,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          status: form.status,
          source: form.source,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message ?? data.message ?? `Erro ${res.status}`)
      }
      setForm({ name: '', email: '', company: '', status: 'contacted', source: 'website' })
      setOpen(false)
      onLeadAdded?.()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lead-added'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar lead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="inline-flex items-center gap-2">
          <Plus className="size-4" />
          Adicionar lead
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-md border-araca-bege-medio/30 bg-araca-creme text-araca-cafe-escuro shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-araca-cafe-escuro">Novo lead</SheetTitle>
          <SheetDescription className="text-araca-chocolate-amargo/90">
            Preencha os dados para adicionar o lead à tabela.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome *
            </label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nome do lead"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail *
            </label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Empresa
            </label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              placeholder="Empresa (opcional)"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Origem
            </label>
            <select
              id="source"
              value={form.source}
              onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as LeadSource }))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {SOURCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
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
            <Button type="submit" className="flex-1" disabled={loading} loading={loading}>
              Adicionar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
