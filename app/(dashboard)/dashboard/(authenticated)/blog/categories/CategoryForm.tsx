'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Loader2 } from 'lucide-react'

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
}

interface CategoryFormProps {
  initialData?: any
  isNew: boolean
}

export function CategoryForm({ initialData, isNew }: CategoryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CategoryFormData>({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    color: initialData?.color ?? '#3B82F6',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        color: form.color,
      }

      if (isNew) {
        const res = await fetch('/api/dashboard/blog/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao criar categoria.')
          return
        }
        router.push('/dashboard/blog/categories')
        router.refresh()
      } else {
        const res = await fetch(`/api/dashboard/blog/categories/${encodeURIComponent(form.slug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao salvar categoria.')
          return
        }
        setError(null)
        router.refresh()
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setForm((p) => ({ ...p, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href="/dashboard/blog/categories">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações da categoria</CardTitle>
          <CardDescription>
            Nome, slug e descrição da categoria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nome da categoria"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Slug *</label>
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="url-amigavel"
                required
                disabled={!isNew}
                className="font-mono text-sm"
              />
              {isNew && (
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Gerar
                </Button>
              )}
            </div>
            {!isNew && (
              <p className="mt-1 text-xs text-muted-foreground">Slug não pode ser alterado.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descrição da categoria (opcional)"
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Cor</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={form.color}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                className="h-10 w-20"
              />
              <Input
                value={form.color}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando…
            </>
          ) : isNew ? (
            'Criar categoria'
          ) : (
            'Salvar alterações'
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/blog/categories">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
