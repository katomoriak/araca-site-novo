'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
import { Upload, Pencil, Trash2, Loader2, ImageIcon, Search } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  filename: string
  alt: string
  fileType?: string
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/dashboard/blog/media?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Falha ao carregar mídias')
      const data = await res.json()
      setItems(data.media ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file?.type.startsWith('image/')) {
        setError('Selecione apenas imagens (JPG, PNG, GIF, WebP).')
        return
      }
      setUploading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.replace(/\.[^/.]+$/, ''))
        const res = await fetch('/api/dashboard/blog/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message ?? 'Falha no upload')
        setItems((prev) => [{ ...data }, ...prev])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro no upload')
      } finally {
        setUploading(false)
        e.target.value = ''
      }
    },
    []
  )

  const openEdit = useCallback((item: MediaItem) => {
    setEditItem(item)
    setEditAlt(item.alt || '')
    setEditOpen(true)
  }, [])

  const saveEdit = useCallback(async () => {
    if (!editItem) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/dashboard/blog/media/${editItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: editAlt.trim() || editItem.filename }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao atualizar')
      setItems((prev) =>
        prev.map((m) => (m.id === editItem.id ? { ...m, alt: editAlt.trim() || m.filename } : m))
      )
      setEditOpen(false)
      setEditItem(null)
    } catch {
      setError('Falha ao salvar texto alternativo')
    } finally {
      setSavingEdit(false)
    }
  }, [editItem, editAlt])

  const confirmDelete = useCallback((id: string) => {
    setDeleteId(id)
  }, [])

  const doDelete = useCallback(async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/dashboard/blog/media/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Falha ao excluir')
      setItems((prev) => prev.filter((m) => m.id !== deleteId))
      setDeleteId(null)
    } catch {
      setError('Falha ao excluir mídia')
    } finally {
      setDeleting(false)
    }
  }, [deleteId])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mídias do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie imagens utilizadas nos posts e no editor do blog.
          </p>
        </div>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Enviar imagem
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 py-16">
          <ImageIcon className="size-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Nenhuma mídia ainda
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Envie imagens para usá-las nos posts do blog
          </p>
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              variant="outline"
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Upload className="size-4" />
                  Enviar primeira imagem
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-4 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/30"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {item.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="size-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => openEdit(item)}
                    className="h-8 w-8"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => confirmDelete(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={item.alt || item.filename}>
                  {item.alt || item.filename || 'Sem descrição'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.fileType ? item.fileType : item.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar texto alternativo</DialogTitle>
            <DialogDescription>
              O texto alternativo melhora acessibilidade e SEO.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Descrição da imagem"
            value={editAlt}
            onChange={(e) => setEditAlt(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEdit} disabled={savingEdit}>
              {savingEdit ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir mídia</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. A imagem será removida da biblioteca.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={doDelete} disabled={deleting}>
              {deleting ? 'Excluindo…' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
