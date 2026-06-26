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
import { LEAD_ADDED_EVENT } from '@/components/dashboard/LeadsRecentCard'

type AddLeadSheetProps = {
  onLeadAdded?: () => void
}

export function AddLeadSheet({ onLeadAdded }: AddLeadSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectName: '',
    projectType: 'Residencial' as 'Residencial' | 'Comercial',
    notes: '',
    origin: 'Dashboard',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          origin: form.origin,
          projectName: form.projectName.trim() || 'Novo lead',
          projectType: form.projectType,
          notes: form.notes.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Não foi possível criar o lead.')
        return
      }
      setOpen(false)
      setForm({ name: '', email: '', phone: '', projectName: '', projectType: 'Residencial', notes: '', origin: 'Dashboard' })
      window.dispatchEvent(new Event(LEAD_ADDED_EVENT))
      onLeadAdded?.()
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  function field(id: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [id]: e.target.value }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Novo lead
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo lead</SheetTitle>
          <SheetDescription>
            Cria um contato e uma negociação no ERP Aracá.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <Input value={form.name} onChange={field('name')} placeholder="Nome completo" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={form.email} onChange={field('email')} placeholder="email@exemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <Input type="tel" value={form.phone} onChange={field('phone')} placeholder="+55 11 99999-9999" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Projeto / Consulta</label>
            <Input value={form.projectName} onChange={field('projectName')} placeholder="Ex.: Residência Vila Mariana" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={form.projectType}
              onChange={field('projectType')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origem</label>
            <select
              value={form.origin}
              onChange={field('origin')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Dashboard">Dashboard</option>
              <option value="Indicação">Indicação</option>
              <option value="Site">Site</option>
              <option value="Redes sociais">Redes sociais</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={field('notes')}
              rows={3}
              placeholder="Observações sobre o lead..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Salvando…' : 'Criar lead'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
