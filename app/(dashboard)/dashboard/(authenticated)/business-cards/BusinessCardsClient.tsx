'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Loader2
} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/AlertDialog'

interface BusinessCard {
    id: string
    slug: string
    name?: string | null
    role?: string | null
    email?: string | null
    user?: {
        name?: string | null
        email: string
    } | string | null
}

export function BusinessCardsClient({
    businessCards,
}: {
    businessCards: BusinessCard[]
}) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [cardToDelete, setCardToDelete] = useState<BusinessCard | null>(null)

    const handleDelete = async () => {
        if (!cardToDelete) return
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/dashboard/business-cards/${cardToDelete.slug}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Erro ao excluir cartão:', error)
        } finally {
            setIsDeleting(false)
            setCardToDelete(null)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Cartões de Visitas</h1>
                    <p className="text-muted-foreground">
                        Gerencie os cartões de visita digitais da equipe.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/business-cards/novo">
                        <Plus className="mr-2 size-4" />
                        Novo Cartão
                    </Link>
                </Button>
            </div>

            {businessCards.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Nenhum cartão encontrado</CardTitle>
                        <CardDescription>
                            Crie seu primeiro cartão de visitas digital para começar.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {businessCards.map((card) => {
                        const displayName = card.name || (typeof card.user === 'object' ? card.user?.name : null) || 'Sem nome'
                        const displayRole = card.role || 'Aracá Interiores'

                        return (
                            <Card key={card.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-1">{displayName}</CardTitle>
                                            <CardDescription className="line-clamp-1">{displayRole}</CardDescription>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Ver Público">
                                                <a href={`/cv/${card.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground font-mono truncate bg-muted p-2 rounded">
                                        /cv/{card.slug}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/dashboard/business-cards/${card.slug}`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Editar
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-10 px-0"
                                            onClick={() => setCardToDelete(card)}
                                            title="Excluir"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <AlertDialog open={cardToDelete !== null} onOpenChange={(open: boolean) => !open && setCardToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. O cartão de visitas de <strong>{cardToDelete?.name}</strong> será permanentemente removido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
