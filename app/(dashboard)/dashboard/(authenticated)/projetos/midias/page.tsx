'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, Loader2, ImageIcon, Search, Pencil, Trash2, FolderOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectOption {
  slug: string
  title: string
}

interface MediaItem {
  id: string
  url: string
  filename: string
  alt: string
  fileType?: string
  path?: string
  folder?: string
}

const FILTER_ALL = '__all__'
/** Valor usado no Select para "Geral" (Radix não permite value vazio em SelectItem). */
const FOLDER_GERAL_SELECT = '__geral__'

export default function ProjetosMidiasPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>(FILTER_ALL)
  const [uploadFolder, setUploadFolder] = useState<string>(FOLDER_GERAL_SELECT)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [editFilename, setEditFilename] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/dashboard/projetos/media?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Falha ao carregar mídias')
      const data = await res.json()
      setItems(data.media ?? [])
      setProjects(data.projects ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  const filteredItems = useMemo(() => {
    if (selectedFolder === FILTER_ALL) return items
    if (selectedFolder === FOLDER_GERAL_SELECT) return items.filter((item) => !(item.folder ?? ''))
    return items.filter((item) => (item.folder ?? '') === selectedFolder)
  }, [items, selectedFolder])

  const folderLabel = useCallback(
    (folderSlug: string) => {
      if (!folderSlug || folderSlug === FOLDER_GERAL_SELECT) return 'Geral'
      const p = projects.find((x) => x.slug === folderSlug)
      return p?.title ?? folderSlug
    },
    [projects]
  )

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPendingFile(file ?? null)
  }, [])

  const handleUploadConfirm = useCallback(async () => {
    if (!pendingFile) return
    const isImage = pendingFile.type.startsWith('image/')
    const isVideo = pendingFile.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Selecione apenas imagens ou vídeos.')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', pendingFile)
      const folderToUse =
        uploadFolder === FOLDER_GERAL_SELECT || !uploadFolder ? undefined : uploadFolder
      if (folderToUse) formData.append('folder', folderToUse)
      const res = await fetch('/api/dashboard/projetos/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message ?? 'Falha no upload')
      setItems((prev) => [{ ...data }, ...prev])
      setPendingFile(null)
      setUploadDialogOpen(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploading(false)
    }
  }, [pendingFile, uploadFolder])

  const openUploadDialog = useCallback(() => {
    const initialFolder =
      !selectedFolder || selectedFolder === FILTER_ALL ? FOLDER_GERAL_SELECT : selectedFolder
    setUploadFolder(initialFolder)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploadDialogOpen(true)
  }, [selectedFolder])

  const closeUploadDialog = useCallback(() => {
    setUploadDialogOpen(false)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const openEdit = useCallback((item: MediaItem) => {
    setEditingItem(item)
    setEditFilename(item.filename || '')
    setError(null)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingItem?.path || !editFilename.trim()) return
    setSavingEdit(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/projetos/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: editingItem.path, newFilename: editFilename.trim() }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message ?? 'Falha ao renomear')
      setItems((prev) =>
        prev.map((it) => (it.id === editingItem.id ? { ...it, ...data } : it))
      )
      setEditingItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao renomear')
    } finally {
      setSavingEdit(false)
    }
  }, [editingItem, editFilename])

  const handleDelete = useCallback(
    async (item: MediaItem) => {
      if (!item.path) return
      if (!confirm(`Excluir "${item.filename || item.path}"? Esta ação não pode ser desfeita.`)) return
      setDeletingId(item.id)
      setError(null)
      try {
        const res = await fetch(
          `/api/dashboard/projetos/media?path=${encodeURIComponent(item.path)}`,
          { method: 'DELETE', credentials: 'include' }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message ?? 'Falha ao excluir')
        setItems((prev) => prev.filter((it) => it.id !== item.id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao excluir')
      } finally {
        setDeletingId(null)
      }
    },
    []
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mídias dos Projetos</h1>
          <p className="text-muted-foreground">
            Banco de imagens e vídeos por projeto. Escolha a pasta ao enviar e filtre pela pasta abaixo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={handleFileInputChange}
            disabled={uploading || !uploadDialogOpen}
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={openUploadDialog}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Enviar mídia
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-[200px]">
              <FolderOpen className="size-4 shrink-0" />
              <SelectValue placeholder="Ver pasta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_ALL}>Todas as pastas</SelectItem>
              <SelectItem value={FOLDER_GERAL_SELECT}>Geral</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            Nenhuma mídia no banco
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Envie imagens ou vídeos para reutilizar na capa e na galeria dos projetos
          </p>
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={handleFileInputChange}
              disabled={uploading || !uploadDialogOpen}
            />
            <Button
              variant="outline"
              type="button"
              disabled={uploading}
              onClick={openUploadDialog}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Upload className="size-4" />
                  Enviar primeira mídia
                </>
              )}
            </Button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma mídia nesta pasta. Altere o filtro ou envie arquivos para a pasta selecionada.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:bg-muted/30"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {item.url &&
                  (item.fileType?.toLowerCase().match(/mp4|mov|avi|webm/) ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="h-full w-full object-cover"
                    />
                  ))}
              </div>
              <div className="flex flex-1 flex-col p-2">
                <div className="mb-1 flex items-center gap-1">
                  <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {folderLabel(item.folder ?? '')}
                  </span>
                </div>
                <p className="truncate text-sm font-medium" title={item.filename}>
                  {item.filename || 'Sem nome'}
                </p>
                {item.path && (
                  <p className="truncate text-xs text-muted-foreground" title={item.path}>
                    {item.path}
                  </p>
                )}
                <div className="mt-2 flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(item)}
                    disabled={deletingId !== null}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId !== null}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadDialogOpen} onOpenChange={(open) => (open ? setUploadDialogOpen(true) : closeUploadDialog())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar mídia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar pasta</label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger>
                  <FolderOpen className="size-4 shrink-0" />
                  <SelectValue placeholder="Escolha a pasta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FOLDER_GERAL_SELECT}>Geral</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Arquivo</label>
              {pendingFile ? (
                <div className="rounded border border-dashed border-muted-foreground/40 px-3 py-2 text-sm">
                  {pendingFile.name}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum arquivo selecionado</p>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Escolher arquivo
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeUploadDialog}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUploadConfirm}
              disabled={!pendingFile || uploading}
            >
              {uploading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renomear mídia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <label className="text-sm font-medium">Nome do arquivo</label>
            <Input
              value={editFilename}
              onChange={(e) => setEditFilename(e.target.value)}
              placeholder="ex: minha-imagem.jpg"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingItem(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={!editFilename.trim() || savingEdit}
            >
              {savingEdit && <Loader2 className="size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
