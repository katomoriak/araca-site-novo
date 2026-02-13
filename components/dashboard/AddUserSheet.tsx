'use client'

import { useState } from 'react'
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

export type UserAddData = {
    name: string
    email: string
    password: string
    role: 'admin' | 'editor'
    permissions: string[]
    showAsPublicAuthor: boolean
    avatarId?: string | null
    avatarUrl?: string | null
}

type AddUserSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved?: () => void
}

export function AddUserSheet({
    open,
    onOpenChange,
    onSaved,
}: AddUserSheetProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState<UserAddData>({
        name: '',
        email: '',
        password: '',
        role: 'editor',
        permissions: [],
        showAsPublicAuthor: false,
        avatarId: null,
        avatarUrl: null,
    })

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
        setError(null)
        setLoading(true)
        try {
            const res = await fetch(`/api/dashboard/users`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    permissions: form.role === 'editor' ? form.permissions : undefined,
                    showAsPublicAuthor: form.showAsPublicAuthor,
                    avatar: form.avatarUrl,
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                throw new Error(typeof data.message === 'string' ? data.message : 'Erro ao criar usuário.')
            }
            onOpenChange(false)
            // Reset form
            setForm({
                name: '',
                email: '',
                password: '',
                role: 'editor',
                permissions: [],
                showAsPublicAuthor: false,
                avatarId: null,
                avatarUrl: null,
            })
            onSaved?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar usuário.')
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
                    <SheetTitle className="text-araca-cafe-escuro">Adicionar usuário</SheetTitle>
                    <SheetDescription className="text-araca-chocolate-amargo/90">
                        Cadastre um novo usuário para acessar o dashboard.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
                    <div className="flex justify-center py-2">
                        <AvatarPicker
                            value={form.avatarId || null}
                            imageUrl={form.avatarUrl || null}
                            onChange={(id, url) => setForm(p => ({ ...p, avatarId: id, avatarUrl: url ?? null }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-user-name" className="text-sm font-medium">
                            Nome
                        </label>
                        <Input
                            id="add-user-name"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-user-email" className="text-sm font-medium">
                            E-mail
                        </label>
                        <Input
                            id="add-user-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-user-password" className="text-sm font-medium">
                            Senha
                        </label>
                        <Input
                            id="add-user-password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                            placeholder="Senha de acesso"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-user-role" className="text-sm font-medium">
                            Função
                        </label>
                        <select
                            id="add-user-role"
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
                                Pode ser listado como autor de posts.
                            </p>
                        </div>
                        <Switch
                            checked={form.showAsPublicAuthor}
                            onCheckedChange={(checked) =>
                                setForm((p) => ({ ...p, showAsPublicAuthor: checked }))
                            }
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
                            Criar Usuário
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
