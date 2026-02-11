'use client'

import { useCallback, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { MediaPicker, type MediaItem } from './MediaPicker'

export interface ProjetoImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Chamado com path do arquivo (filename ou "midias/xxx.jpg") e URL para preview. type só em modo galeria. */
  onSelect: (filePath: string, publicUrl: string, type?: 'image' | 'video') => void
  /** Slug do projeto para upload direto (Enviar arquivo). Se vazio, só Banco estará disponível para imagens. */
  projectSlug: string | null
  /** Gera signed URL e faz upload; retorna { filename, publicUrl } ou null. */
  onUpload: (slug: string, file: File) => Promise<{ filename: string; publicUrl: string } | null>
  title?: string
  description?: string
}

type DialogMode = 'upload' | 'gallery'

export function ProjetoImageDialog({
  open,
  onOpenChange,
  onSelect,
  projectSlug,
  onUpload,
  title = 'Inserir imagem',
  description = 'Envie uma nova imagem ou selecione do banco de mídias dos projetos.',
}: ProjetoImageDialogProps) {
  const [mode, setMode] = useState<DialogMode>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setMode('upload')
    setFile(null)
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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setError(null)
    if (!selected) return
    const isImage = selected.type.startsWith('image/')
    const isVideo = selected.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Selecione uma imagem ou vídeo.')
      return
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return isImage ? URL.createObjectURL(selected) : null
    })
    setFile(selected)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return
    const isImage = dropped.type.startsWith('image/')
    const isVideo = dropped.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Arraste apenas imagem ou vídeo.')
      return
    }
    setError(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return isImage ? URL.createObjectURL(dropped) : null
    })
    setFile(dropped)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleInsert = useCallback(async () => {
    if (!file || !projectSlug) {
      setError(projectSlug ? 'Selecione um arquivo.' : 'Defina o slug do projeto antes de enviar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await onUpload(projectSlug, file)
      if (result) {
        const type = file.type.startsWith('video/') ? 'video' : 'image'
        onSelect(result.filename, result.publicUrl, type)
        handleClose(false)
      } else {
        setError('Falha no upload.')
      }
    } catch {
      setError('Erro ao enviar.')
    } finally {
      setLoading(false)
    }
  }, [file, projectSlug, onUpload, onSelect, handleClose])

  const handleGallerySelect = useCallback(
    (item: MediaItem) => {
      const path = item.path || item.url
      if (!path) return
      const url =
        typeof path === 'string' && path.startsWith('/') && typeof window !== 'undefined'
          ? `${window.location.origin}${path}`
          : item.url
      const type = item.fileType?.toLowerCase().match(/mp4|mov|avi|webm/) ? 'video' : 'image'
      onSelect(path, url, type)
      requestAnimationFrame(() => handleClose(false))
    },
    [onSelect, handleClose]
  )

  const canUpload = Boolean(projectSlug)
  const isVideo = file ? file.type.startsWith('video/') : false

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-araca-bege-claro border-border/80">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

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
            Enviar arquivo
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
              {!canUpload && (
                <p className="text-sm text-muted-foreground">
                  Defina o slug do projeto para enviar novos arquivos. Use o banco de mídias para escolher imagens já enviadas.
                </p>
              )}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
              >
                {preview && !isVideo ? (
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
                  <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                    <Upload className="size-10 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Clique ou arraste imagem/vídeo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, GIF, WebP, MP4, MOV
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </>
          ) : (
            <div className="rounded-lg border border-border/60 bg-background/50 p-2">
              <MediaPicker source="projetos" onSelect={handleGallerySelect} />
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
              disabled={!file || loading || !projectSlug}
            >
              {loading ? 'Enviando…' : 'Inserir'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
