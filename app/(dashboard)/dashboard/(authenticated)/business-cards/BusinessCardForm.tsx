'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Loader2, Send, Save } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export interface BusinessCardFormData {
    slug: string
    user: string
    name: string
    role: string
    email: string
    phone: string
    address: string
}

interface BusinessCardFormProps {
    initialData?: any
    isNew: boolean
}

interface DashboardUser {
    id: string
    name?: string
    email: string
}

export function BusinessCardForm({ initialData, isNew }: BusinessCardFormProps) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<DashboardUser[]>([])
    const [loadingData, setLoadingData] = useState(true)

    const [form, setForm] = useState<BusinessCardFormData>({
        slug: initialData?.slug ?? '',
        user: initialData?.user?.id ? String(initialData.user.id) : (initialData?.user ? String(initialData.user) : ''),
        name: initialData?.name ?? '',
        role: initialData?.role ?? '',
        email: initialData?.email ?? '',
        phone: initialData?.phone ?? '',
        address: initialData?.address ?? 'Santo André - SP • Aracá Interiores',
    })

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetch('/api/dashboard/users')
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.users ?? [])
                }
            } catch (err) {
                console.error('Erro ao carregar usuários:', err)
            } finally {
                setLoadingData(false)
            }
        }
        loadUsers()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        if (!form.slug || !form.user) {
            setError('Slug e Usuário são obrigatórios.')
            setSaving(false)
            return
        }

        try {
            const url = isNew
                ? '/api/dashboard/business-cards'
                : `/api/dashboard/business-cards/${encodeURIComponent(initialData.slug)}`

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data?.message ?? 'Erro ao salvar cartão.')
                return
            }

            router.push('/dashboard/business-cards')
            router.refresh()
        } catch (err) {
            setError('Erro de conexão.')
        } finally {
            setSaving(false)
        }
    }

    const generateSlug = () => {
        const nameToUse = form.name || (users.find(u => u.id === form.user)?.name) || ''
        if (!nameToUse) return

        const slug = nameToUse
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
                    <Link href="/dashboard/business-cards">
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
                    <CardTitle>Configuração do Cartão</CardTitle>
                    <CardDescription>
                        Defina o dono do cartão e a URL de acesso.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Usuário Vinculado *</label>
                        <p className="mb-2 text-xs text-muted-foreground">
                            A foto de perfil será puxada automaticamente deste usuário.
                        </p>
                        <Select
                            value={form.user}
                            onValueChange={(value) => setForm((p) => ({ ...p, user: value }))}
                            disabled={loadingData}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={String(user.id)} value={String(user.id)}>
                                        {user.name || user.email} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Slug / URL *</label>
                        <div className="flex gap-2">
                            <span className="flex items-center text-sm text-muted-foreground bg-muted px-3 rounded-md border border-input">
                                /cv/
                            </span>
                            <Input
                                value={form.slug}
                                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                                placeholder="nome-do-usuario"
                                required
                                className="font-mono"
                            />
                            <Button type="button" variant="outline" onClick={generateSlug}>
                                Gerar
                            </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Este será o link final: araca.arq.br/cv/{form.slug || '...'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informações de Exibição</CardTitle>
                    <CardDescription>
                        Campos que aparecerão no cartão. Se deixados em branco, o sistema tentará usar os dados do usuário.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Nome de Exibição</label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Ex: Marcos Paulo"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Cargo</label>
                            <Input
                                value={form.role}
                                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                                placeholder="Ex: Arquiteto"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">E-mail de Contato</label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder="marcos@araca.arq.br"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Telefone / WhatsApp</label>
                            <Input
                                value={form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="Ex: 5511999999999"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Endereço de Exibição</label>
                        <Input
                            value={form.address}
                            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                            placeholder="Ex: Santo André - SP • Aracá Interiores"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={saving}>
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isNew ? (
                        <Send className="mr-2 h-4 w-4" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isNew ? 'Criar Cartão' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="ghost" asChild disabled={saving}>
                    <Link href="/dashboard/business-cards">Cancelar</Link>
                </Button>
            </div>
        </form>
    )
}
