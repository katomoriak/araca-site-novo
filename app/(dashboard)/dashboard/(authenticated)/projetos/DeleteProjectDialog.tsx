'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  projectSlug: string
  onDeleted?: () => void
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectTitle,
  projectSlug,
  onDeleted,
}: DeleteProjectDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText.trim().toLowerCase() === projectTitle.trim().toLowerCase()

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setConfirmText('')
      setError(null)
    }
    onOpenChange(next)
  }

  const handleDelete = async () => {
    if (!isConfirmed) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/dashboard/projetos/${encodeURIComponent(projectSlug)}`, {
        method: 'DELETE',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message || 'Não foi possível excluir. Tente novamente.')
        return
      }
      handleOpenChange(false)
      onDeleted?.()
      window.location.reload()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir galeria</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Para confirmar, digite o nome da galeria abaixo:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="text-sm font-medium text-foreground">
            Digite &quot;<span className="font-mono">{projectTitle}</span>&quot; para confirmar:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={projectTitle}
            className="font-mono"
            disabled={deleting}
            autoComplete="off"
            aria-label="Confirmação do nome da galeria"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Excluindo…
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Excluir galeria
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
