'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EditUserSheet } from './EditUserSheet'
import { Pencil, Trash2 } from 'lucide-react'
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

const PERMISSION_LABELS: Record<string, string> = {
  blog: 'Blog',
  finance: 'Financeiro',
  crm: 'CRM',
  projetos: 'Projetos',
  users: 'Usuários',
}

type UserItem = {
  id: string
  name?: string | null
  email: string
  role?: string | null
  permissions?: string[] | null
  showAsPublicAuthor?: boolean | null
  avatarUrl?: string | null
}

export function UsersListWithEdit({ users }: { users: UserItem[] }) {
  const router = useRouter()
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function openEdit(userId: string) {
    setEditingUserId(userId)
    setSheetOpen(true)
  }

  function handleSaved() {
    router.refresh()
  }

  async function confirmDelete() {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/dashboard/users/${deletingId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message || 'Erro ao excluir usuário.')
      } else {
        router.refresh()
      }
    } catch {
      alert('Erro ao excluir usuário.')
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum usuário</CardTitle>
          <CardDescription>
            Não há usuários cadastrados no sistema.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1 text-base">
                    {user.name || user.email}
                  </CardTitle>
                  {user.name && (
                    <CardDescription className="mt-1">
                      {user.email}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'Editor'}
                  </Badge>
                  {user.avatarUrl && (
                    <div className="size-8 overflow-hidden rounded-full border border-border bg-muted">
                      <img
                        src={user.avatarUrl}
                        alt={user.name || 'Avatar'}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.role !== 'admin' && user.permissions && user.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map((p) => (
                    <Badge key={p} variant="outline" className="text-xs">
                      {PERMISSION_LABELS[p] ?? p}
                    </Badge>
                  ))}
                </div>
              )}
              {user.showAsPublicAuthor && (
                <Badge variant="outline" className="text-xs">
                  Autor público
                </Badge>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(user.id)}
                >
                  <Pencil className="mr-2 size-4" />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-10 px-0"
                  onClick={() => setDeletingId(user.id)}
                  title="Excluir usuário"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditUserSheet
        userId={editingUserId}
        open={sheetOpen}
        onOpenChange={(open: boolean) => {
          setSheetOpen(open)
          if (!open) setEditingUserId(null)
        }}
        onSaved={handleSaved}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
