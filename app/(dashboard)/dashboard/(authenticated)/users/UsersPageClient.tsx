'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UsersListWithEdit } from '@/components/dashboard/UsersListWithEdit'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AddUserSheet } from '@/components/dashboard/AddUserSheet'
import { useRouter } from 'next/navigation'

interface UserItem {
    id: string
    name?: string | null
    email: string
    role?: string | null
    permissions?: string[] | null
    showAsPublicAuthor?: boolean | null
}

export function UsersPageClient({
    users,
}: {
    users: UserItem[]
}) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const router = useRouter()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Usuários</h1>
                    <p className="text-muted-foreground">
                        Gerencie usuários, permissões de acesso a cada painel e exibição como autor no blog.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Adicionar Usuário
                    </Button>
                </div>
            </div>

            <UsersListWithEdit users={users} />

            <AddUserSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSaved={() => router.refresh()}
            />

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Acesso aos painéis</CardTitle>
                    <CardDescription>
                        Use &quot;Editar&quot; em cada card para definir quais módulos (Blog, Financeiro, CRM, Projetos, Usuários) o usuário pode acessar. Administradores têm acesso total.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
