'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, ImagePlus, FolderOpen, FolderPlus, FolderMinus, Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MediaPicker, type MediaItem } from './MediaPicker'

const UPLOAD_FOLDER_GERAL = '__geral__'

/** Gera texto alternativo a partir do nome do arquivo (ex: "minha-foto.jpg" → "Minha foto"). */
export function filenameToAlt(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').trim()
  const withSpaces = base.replace(/[-_]+/g, ' ')
  if (!withSpaces) return filename
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase()
}

export interface ProjetoImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Chamado com path, URL, tipo e opcionalmente name (alt). Em modo múltiplo, chamado uma vez por item. */
  onSelect: (filePath: string, publicUrl: string, type?: 'image' | 'video', name?: string) => void
  /** Slug do projeto para upload direto (Enviar arquivo). Se vazio, só Banco estará disponível para imagens. */
  projectSlug: string | null
  /** Gera signed URL e faz upload; retorna { filename, publicUrl } ou null. */
  onUpload: (slug: string, file: File) => Promise<{ filename: string; publicUrl: string } | null>
  title?: string
  description?: string
  /** Se true, permite enviar/selecionar várias mídias e editar o alt de cada uma antes de adicionar. */
  allowMultiple?: boolean
  /** Se true, no modo "Enviar arquivo" mostra seletor de pasta, criar/excluir pasta e envia via banco de mídias (POST). Se false, usa onUpload para o slug do projeto (ex.: capa). */
  useFolderUpload?: boolean
}

type DialogMode = 'upload' | 'gallery'
type DialogStep = 'choose' | 'alt'

export interface PendingMediaItem {
  filePath: string
  publicUrl: string
  type: 'image' | 'video'
  defaultName: string
}

export function ProjetoImageDialog({
  open,
  onOpenChange,
  onSelect,
  projectSlug,
  onUpload,
  title = 'Inserir imagem',
  description = 'Envie uma nova imagem ou selecione do banco de mídias dos projetos.',
  allowMultiple = false,
  useFolderUpload = false,
}: ProjetoImageDialogProps) {
  const [mode, setMode] = useState<DialogMode>('upload')
  const [step, setStep] = useState<DialogStep>('choose')
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingItems, setPendingItems] = useState<PendingMediaItem[]>([])
  const [altNames, setAltNames] = useState<string[]>([])
  const [projects, setProjects] = useState<{ slug: string; title: string }[]>([])
  const [uploadFolder, setUploadFolder] = useState<string>(UPLOAD_FOLDER_GERAL)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [newFolderSlug, setNewFolderSlug] = useState('')
  const [newFolderTitle, setNewFolderTitle] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [deletingFolderSlug, setDeletingFolderSlug] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/projetos/media?limit=1', { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      if (mountedRef.current && Array.isArray(data.projects)) {
        setProjects(data.projects)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchProjects()
      setUploadFolder(projectSlug && projectSlug.trim() ? projectSlug : UPLOAD_FOLDER_GERAL)
    }
  }, [open, projectSlug, fetchProjects])

  const handleCreateFolder = useCallback(async () => {
    const slug = newFolderSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]/g, '')
    const title = newFolderTitle.trim()
    if (!slug || !title) {
      setError('Informe o slug e o título da pasta.')
      return
    }
    setCreatingFolder(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          description: '',
          tag: '',
          cover: '_',
          media: [],
        }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message ?? 'Falha ao criar pasta')
      if (mountedRef.current) {
        await fetchProjects()
        setUploadFolder(slug)
        setCreateFolderOpen(false)
        setNewFolderSlug('')
        setNewFolderTitle('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pasta')
    } finally {
      setCreatingFolder(false)
    }
  }, [newFolderSlug, newFolderTitle, fetchProjects])

  const canDeleteFolder =
    uploadFolder && uploadFolder !== UPLOAD_FOLDER_GERAL

  const handleDeleteFolder = useCallback(async () => {
    if (!canDeleteFolder) return
    if (!confirm('Excluir esta pasta (projeto)? Os arquivos no storage não serão apagados.')) return
    setDeletingFolderSlug(uploadFolder)
    setError(null)
    try {
      const res = await fetch(`/api/dashboard/projetos/${encodeURIComponent(uploadFolder)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message ?? 'Falha ao excluir pasta')
      }
      if (mountedRef.current) {
        setUploadFolder(UPLOAD_FOLDER_GERAL)
        await fetchProjects()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pasta')
    } finally {
      setDeletingFolderSlug(null)
    }
  }, [canDeleteFolder, uploadFolder, fetchProjects])

  const reset = useCallback(() => {
    setMode('upload')
    setStep('choose')
    setFile(null)
    setFiles([])
    setPendingItems([])
    setAltNames([])
    setError(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) reset()
      onOpenChange(isOpen)
    },
    [onOpenChange, reset]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedList = e.target.files ? Array.from(e.target.files) : []
      setError(null)
      if (selectedList.length === 0) return
      const valid = selectedList.filter((f) => {
        const isImage = f.type.startsWith('image/')
        const isVideo = f.type.startsWith('video/')
        return isImage || isVideo
      })
      if (valid.length === 0) {
        setError('Selecione apenas imagens ou vídeos.')
        return
      }
      if (valid.length < selectedList.length) {
        setError('Alguns arquivos foram ignorados (use apenas imagens ou vídeos).')
      }
      if (allowMultiple && valid.length > 1) {
        setFiles(valid)
        setFile(null)
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return null
        })
      } else {
        const selected = valid[0]
        setFile(selected)
        setFiles([])
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return selected.type.startsWith('image/') ? URL.createObjectURL(selected) : null
        })
      }
    },
    [allowMultiple]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedList = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
      if (droppedList.length === 0) return
      const valid = droppedList.filter((f) => {
        const isImage = f.type.startsWith('image/')
        const isVideo = f.type.startsWith('video/')
        return isImage || isVideo
      })
      if (valid.length === 0) {
        setError('Arraste apenas imagens ou vídeos.')
        return
      }
      setError(null)
      if (allowMultiple && valid.length > 1) {
        setFiles(valid)
        setFile(null)
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return null
        })
      } else {
        const dropped = valid[0]
        setFile(dropped)
        setFiles([])
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return dropped.type.startsWith('image/') ? URL.createObjectURL(dropped) : null
        })
      }
    },
    [allowMultiple]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const goToAltStep = useCallback((items: PendingMediaItem[]) => {
    setPendingItems(items)
    setAltNames(items.map((i) => i.defaultName))
    setStep('alt')
  }, [])

  const handleInsert = useCallback(async () => {
    const toUpload = files.length > 0 ? files : file ? [file] : []
    if (toUpload.length === 0) {
      setError('Selecione ao menos um arquivo.')
      return
    }
    if (useFolderUpload) {
      const folderToUse =
        uploadFolder === UPLOAD_FOLDER_GERAL || !uploadFolder ? undefined : uploadFolder
      setLoading(true)
      setError(null)
      try {
        const results: PendingMediaItem[] = []
        for (const f of toUpload) {
          const formData = new FormData()
          formData.append('file', f)
          if (folderToUse) formData.append('folder', folderToUse)
          const res = await fetch('/api/dashboard/projetos/media', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          })
          const data = await res.json()
          if (!mountedRef.current) return
          if (!res.ok) throw new Error(data?.message ?? 'Falha no upload')
          const type = f.type.startsWith('video/') ? 'video' : 'image'
          results.push({
            filePath: data.path ?? data.filename ?? f.name,
            publicUrl: data.url ?? data.publicUrl ?? '',
            type,
            defaultName: filenameToAlt(data.filename ?? f.name),
          })
        }
        if (!mountedRef.current) return
        if (results.length === 0) {
          setError('Falha no upload.')
          return
        }
        if (allowMultiple && results.length > 0) {
          goToAltStep(results)
        } else {
          onSelect(results[0].filePath, results[0].publicUrl, results[0].type, results[0].defaultName)
          handleClose(false)
        }
      } catch (err) {
        if (mountedRef.current) setError(err instanceof Error ? err.message : 'Erro ao enviar.')
      } finally {
        if (mountedRef.current) setLoading(false)
      }
      return
    }
    if (!projectSlug) {
      setError('Defina o slug do projeto antes de enviar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const results: PendingMediaItem[] = []
      for (const f of toUpload) {
        const result = await onUpload(projectSlug, f)
        if (!mountedRef.current) return
        if (result) {
          const type = f.type.startsWith('video/') ? 'video' : 'image'
          results.push({
            filePath: result.filename,
            publicUrl: result.publicUrl,
            type,
            defaultName: filenameToAlt(f.name),
          })
        }
      }
      if (!mountedRef.current) return
      if (results.length === 0) {
        setError('Falha no upload.')
        return
      }
      if (allowMultiple && results.length > 0) {
        goToAltStep(results)
      } else {
        onSelect(results[0].filePath, results[0].publicUrl, results[0].type, results[0].defaultName)
        handleClose(false)
      }
    } catch {
      if (mountedRef.current) setError('Erro ao enviar.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [file, files, uploadFolder, useFolderUpload, projectSlug, onUpload, onSelect, handleClose, allowMultiple, goToAltStep])

  const handleConfirmAltStep = useCallback(() => {
    pendingItems.forEach((item, i) => {
      const name = (altNames[i] ?? item.defaultName).trim() || item.defaultName
      onSelect(item.filePath, item.publicUrl, item.type, name)
    })
    handleClose(false)
  }, [pendingItems, altNames, onSelect, handleClose])

  const handleGallerySelect = useCallback(
    (item: MediaItem) => {
      const path = item.path || item.url
      if (!path) return
      const url =
        typeof path === 'string' && path.startsWith('/') && typeof window !== 'undefined'
          ? `${window.location.origin}${path}`
          : item.url
      const type = item.fileType?.toLowerCase().match(/mp4|mov|avi|webm/) ? 'video' : 'image'
      const defaultName = filenameToAlt(item.filename || item.alt || '')
      if (allowMultiple) {
        goToAltStep([{ filePath: path, publicUrl: url, type, defaultName }])
      } else {
        onSelect(path, url, type, defaultName)
        requestAnimationFrame(() => handleClose(false))
      }
    },
    [onSelect, handleClose, allowMultiple, goToAltStep]
  )

  const handleGallerySelectMultiple = useCallback(
    (items: MediaItem[]) => {
      const pending: PendingMediaItem[] = items.map((item) => {
        const path = item.path || item.url
        const url =
          typeof path === 'string' && path.startsWith('/') && typeof window !== 'undefined'
            ? `${window.location.origin}${path}`
            : item.url
        const type = item.fileType?.toLowerCase().match(/mp4|mov|avi|webm/) ? 'video' : 'image'
        return {
          filePath: path,
          publicUrl: url,
          type,
          defaultName: filenameToAlt(item.filename || item.alt || ''),
        }
      })
      if (pending.length > 0) goToAltStep(pending)
    },
    [goToAltStep]
  )

  const canUpload = useFolderUpload || Boolean(projectSlug)
  const isVideo = file ? file.type.startsWith('video/') : false
  const hasFiles = file !== null || files.length > 0

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-araca-bege-claro border-border/80">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {step === 'alt' ? (
          <>
            <p className="text-sm text-muted-foreground">
              Edite o texto alternativo (alt) de cada mídia. O nome foi gerado a partir do arquivo.
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto py-2">
              {pendingItems.map((item, i) => (
                <div key={`${item.filePath}-${i}`} className="flex items-center gap-3 rounded border p-2">
                  <div className="size-12 shrink-0 overflow-hidden rounded bg-muted">
                    {item.type === 'image' ? (
                      <img
                        src={item.publicUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        Vídeo
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-muted-foreground">{item.filePath}</p>
                    <Input
                      value={altNames[i] ?? item.defaultName}
                      onChange={(e) => {
                        const next = [...altNames]
                        next[i] = e.target.value
                        setAltNames(next)
                      }}
                      placeholder="Texto alternativo"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setStep('choose'); setPendingItems([]); setAltNames([]) }}>
                Voltar
              </Button>
              <Button type="button" onClick={handleConfirmAltStep}>
                Adicionar todas
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex gap-1 rounded-lg border border-border/60 bg-background/60 p-1">
              <button
                type="button"
                onClick={() => { setMode('upload'); setError(null) }}
                disabled={!canUpload}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'upload'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-50'
                }`}
              >
                <Upload className="size-4" />
                Enviar arquivo{allowMultiple ? 's' : ''}
              </button>
              <button
                type="button"
                onClick={() => { setMode('gallery'); setError(null) }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'gallery'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <ImagePlus className="size-4" />
                Banco de mídias
              </button>
            </div>

            <div className="space-y-4 py-2 min-h-[200px]">
              {mode === 'upload' ? (
                <>
                  {useFolderUpload && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pasta para enviar</label>
                      <div className="flex gap-2">
                        <Select value={uploadFolder} onValueChange={setUploadFolder}>
                          <SelectTrigger className="flex-1">
                            <FolderOpen className="size-4 shrink-0" />
                            <SelectValue placeholder="Escolha a pasta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UPLOAD_FOLDER_GERAL}>Geral</SelectItem>
                            {projects.map((p) => (
                              <SelectItem key={p.slug} value={p.slug}>
                                {p.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setCreateFolderOpen(true)}
                          title="Nova pasta (projeto)"
                        >
                          <FolderPlus className="size-4" />
                        </Button>
                        {canDeleteFolder && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={handleDeleteFolder}
                            disabled={!!deletingFolderSlug}
                            title="Excluir pasta"
                          >
                            {deletingFolderSlug === uploadFolder ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <FolderMinus className="size-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {!canUpload && (
                    <p className="text-sm text-muted-foreground">
                      Defina o slug do projeto para enviar novos arquivos. Use o banco de mídias para escolher imagens já enviadas.
                    </p>
                  )}
                  <input
                    id="projeto-dialog-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple={allowMultiple}
                    className="sr-only"
                    onChange={handleFileChange}
                    aria-hidden
                  />
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
                  >
                    {files.length > 1 ? (
                      <div className="w-full space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {files.length} arquivo(s) selecionado(s)
                        </p>
                        <ul className="max-h-32 overflow-y-auto text-xs text-muted-foreground">
                          {files.map((f, idx) => (
                            <li key={idx} className="truncate">{f.name}</li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => { setFiles([]) }}
                        >
                          Limpar
                        </Button>
                      </div>
                    ) : preview && !isVideo ? (
                      <div className="relative w-full max-h-48 overflow-hidden rounded-md">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-auto max-h-48 w-full object-contain"
                        />
                        <p className="mt-2 text-center text-xs text-muted-foreground truncate">
                          {file?.name}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => {
                            setFile(null)
                            if (preview) URL.revokeObjectURL(preview)
                            setPreview(null)
                          }}
                        >
                          Trocar arquivo
                        </Button>
                      </div>
                    ) : file && isVideo ? (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => { setFile(null); setPreview(null) }}
                        >
                          Trocar arquivo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center gap-3">
                        <label
                          htmlFor="projeto-dialog-file-input"
                          className="flex cursor-pointer flex-col items-center gap-2 text-center"
                        >
                          <Upload className="size-10 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Clique ou arraste imagem(s)/vídeo(s){allowMultiple ? ' (vários permitidos)' : ''}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            JPG, PNG, GIF, WebP, MP4, MOV
                          </span>
                        </label>
                        {allowMultiple && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Escolher arquivo(s)
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </>
              ) : (
                <div className="rounded-lg border border-border/60 bg-background/50 p-2 space-y-2">
                  <MediaPicker
                    source="projetos"
                    currentProjectSlug={projectSlug}
                    onSelect={handleGallerySelect}
                    multiSelect={allowMultiple}
                    onSelectMultiple={handleGallerySelectMultiple}
                  />
                </div>
              )}
            </div>

            {mode === 'upload' && (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleInsert}
                  disabled={!hasFiles || loading}
                >
                  {loading ? 'Enviando…' : allowMultiple && (files.length > 1 || file) ? 'Próximo: editar alt' : 'Inserir'}
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>

    <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova pasta</DialogTitle>
          <DialogDescription>
            Crie uma pasta (projeto) para organizar mídias. Depois você pode editar o projeto para adicionar capa e galeria.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug (identificador)</label>
            <Input
              value={newFolderSlug}
              onChange={(e) =>
                setNewFolderSlug(
                  e.target.value
                    .replace(/\s/g, '_')
                    .replace(/[^a-zA-Z0-9_.-]/g, '')
                    .toLowerCase()
                )
              }
              placeholder="ex: meu-projeto-2025"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={newFolderTitle}
              onChange={(e) => setNewFolderTitle(e.target.value)}
              placeholder="ex: Meu Projeto 2025"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCreateFolderOpen(false)}
            disabled={creatingFolder}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleCreateFolder}
            disabled={!newFolderSlug.trim() || !newFolderTitle.trim() || creatingFolder}
          >
            {creatingFolder && <Loader2 className="mr-2 size-4 animate-spin" />}
            Criar pasta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
