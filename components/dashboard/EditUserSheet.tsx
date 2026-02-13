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
import { Switch } from '@/components/ui/Switch'
import { AvatarPicker } from './AvatarPicker'

const PERMISSION_OPTIONS: { value: string; label: string }[] = [
  { value: 'blog', label: 'Blog' },
  { value: 'finance', label: 'Financeiro' },
  { value: 'crm', label: 'CRM' },
  { value: 'projetos', label: 'Projetos' },
  { value: 'users', label: 'Usuários' },
]

export type UserEditData = {
  id: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'editor'
  permissions: string[]
  showAsPublicAuthor: boolean
  title: string
  bio: string
  avatarId?: string | null
  avatarUrl?: string | null
}

type EditUserSheetProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

export function EditUserSheet({
  userId,
  open,
  onOpenChange,
  onSaved,
}: EditUserSheetProps) {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<UserEditData>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'editor',
    permissions: [],
    showAsPublicAuthor: false,
    title: '',
    bio: '',
    avatarId: null,
    avatarUrl: null,
  })

  useEffect(() => {
    if (!userId || !open) return
    setFetching(true)
    setError(null)
    setForm((prev) => ({ ...prev, password: '' })) // Reset password field
    fetch(`/api/dashboard/users/${userId}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar usuário.')
        return res.json()
      })
      .then((data: UserEditData) => {
        setForm({
          id: data.id,
          name: data.name ?? '',
          email: data.email ?? '',
          password: '',
          role: data.role === 'admin' ? 'admin' : 'editor',
          permissions: Array.isArray(data.permissions) ? [...data.permissions] : [],
          showAsPublicAuthor: Boolean(data.showAsPublicAuthor),
          title: data.title ?? '',
          bio: data.bio ?? '',
          avatarId: (data as any).avatarId ?? null,
          avatarUrl: (data as any).avatarUrl ?? null,
        })
      })
      .catch(() => setError('Não foi possível carregar o usuário.'))
      .finally(() => setFetching(false))
  }, [userId, open])

  function togglePermission(value: string) {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(value)
        ? prev.permissions.filter((p) => p !== value)
        : [...prev.permissions, value],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.id) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/users/${form.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password || undefined,
          role: form.role,
          permissions: form.role === 'editor' ? form.permissions : undefined,
          showAsPublicAuthor: form.showAsPublicAuthor,
          title: form.title || undefined,
          bio: form.bio || undefined,
          avatar: form.avatarUrl,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.message === 'string' ? data.message : 'Erro ao salvar.')
      }
      onOpenChange(false)
      onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-md overflow-y-auto border-araca-bege-medio/30 bg-araca-creme text-araca-cafe-escuro shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-araca-cafe-escuro">Editar usuário</SheetTitle>
          <SheetDescription className="text-araca-chocolate-amargo/90">
            Altere nome, e-mail, senha e permissões.
          </SheetDescription>
        </SheetHeader>

        {fetching ? (
          <p className="py-8 text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
            <div className="flex justify-center py-2">
              <AvatarPicker
                value={form.avatarId || null}
                imageUrl={form.avatarUrl || null}
                onChange={(id, url) => setForm(p => ({ ...p, avatarId: id, avatarUrl: url || null }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-user-name" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="edit-user-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Nome do usuário"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-user-email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="edit-user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-user-password" className="text-sm font-medium">
                Nova Senha
              </label>
              <Input
                id="edit-user-password"
                type="password"
                value={form.password || ''}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Deixe em branco para manter a atual"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-user-role" className="text-sm font-medium">
                Função
              </label>
              <select
                id="edit-user-role"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    role: e.target.value === 'admin' ? 'admin' : 'editor',
                  }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Admin tem acesso total; Editor usa as permissões abaixo.
              </p>
            </div>
            {form.role === 'editor' && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Acesso aos painéis</span>
                <p className="text-xs text-muted-foreground">
                  Marque os módulos que este usuário pode acessar no dashboard.
                </p>
                <div className="flex flex-wrap gap-3 rounded-md border border-input p-3">
                  {PERMISSION_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(opt.value)}
                        onChange={() => togglePermission(opt.value)}
                        className="h-4 w-4 rounded border-input"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 rounded-md border border-input p-3">
              <div>
                <span className="text-sm font-medium">Exibir como autor no blog</span>
                <p className="text-xs text-muted-foreground">
                  Aparece nos posts e na página de perfil do blog.
                </p>
              </div>
              <Switch
                checked={form.showAsPublicAuthor}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, showAsPublicAuthor: checked }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-user-title" className="text-sm font-medium">
                Cargo / Título
              </label>
              <Input
                id="edit-user-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ex: Colaborador & Editor"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-user-bio" className="text-sm font-medium">
                Biografia
              </label>
              <textarea
                id="edit-user-bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Texto exibido na página de autor do blog."
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
