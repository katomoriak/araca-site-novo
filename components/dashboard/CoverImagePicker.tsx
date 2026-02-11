'use client'

import { useCallback, useState } from 'react'
import { ImagePlus, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MediaPicker, type MediaItem } from './MediaPicker'

export interface CoverImagePickerProps {
  value: string | null
  imageUrl?: string | null
  onChange: (id: string | null, url?: string | null) => void
  className?: string
}

type DialogMode = 'upload' | 'gallery'

export function CoverImagePicker({
  value,
  imageUrl,
  onChange,
  className = '',
}: CoverImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DialogMode>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setMode('upload')
    setFile(null)
    setAltText('')
    setError(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) reset()
      setOpen(isOpen)
    },
    [reset]
  )

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setError(null)
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setError('Selecione apenas arquivos de imagem (JPG, PNG, GIF, WebP).')
      return
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(selected)
    })
    setFile(selected)
    setAltText((prev) => prev || selected.name.replace(/\.[^/.]+$/, ''))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped?.type.startsWith('image/')) {
      setError('Arraste apenas arquivos de imagem.')
      return
    }
    setError(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return dropped ? URL.createObjectURL(dropped) : null
    })
    setFile(dropped)
    setAltText((prev) => prev || dropped.name.replace(/\.[^/.]+$/, ''))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Selecione uma imagem para enviar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', altText.trim() || file.name)
      const res = await fetch('/api/dashboard/blog/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message ?? 'Erro ao enviar imagem')
      }
      onChange(data.id ?? null, data.url ?? null)
      handleClose(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar imagem')
    } finally {
      setLoading(false)
    }
  }, [file, altText, onChange, handleClose])

  const handleGallerySelect = useCallback(
    (item: MediaItem) => {
      const url =
        typeof item.url === 'string' && item.url.startsWith('/')
          ? `${typeof window !== 'undefined' ? window.location.origin : ''}${item.url}`
          : item.url
      onChange(item.id, url ?? null)
      handleClose(false)
    },
    [onChange, handleClose]
  )

  const handleRemove = useCallback(() => {
    onChange(null, null)
  }, [onChange])

  const previewSrc = imageUrl || null

  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">Imagem de capa</label>
      <div className="flex flex-col gap-3">
        {previewSrc ? (
          <div className="relative inline-block">
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-input bg-muted/30">
              <img
                src={previewSrc}
                alt="Imagem de capa"
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex min-h-[120px] max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
            onClick={() => setOpen(true)}
          >
            <ImagePlus className="size-10 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">
              Clique ou arraste uma imagem
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG, GIF ou WebP
            </span>
          </div>
        )}
        {(previewSrc || value) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            {value || previewSrc ? 'Trocar imagem' : 'Selecionar imagem de capa'}
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-araca-bege-claro border-border/80">
          <DialogHeader>
            <DialogTitle>Imagem de capa</DialogTitle>
            <DialogDescription>
              Envie uma nova imagem ou selecione do banco de mídias.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-1 rounded-lg border border-border/60 bg-background/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('upload')
                setError(null)
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'upload'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Upload className="size-4" />
              Enviar arquivo
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('gallery')
                setError(null)
              }}
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

          <div className="min-h-[200px] space-y-4 py-2">
            {mode === 'upload' ? (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
                >
                  {preview ? (
                    <div className="relative w-full max-h-48 overflow-hidden rounded-md">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 w-full object-contain"
                      />
                      <p className="mt-2 truncate text-center text-xs text-muted-foreground">
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
                        Trocar imagem
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                      <Upload className="size-10 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Clique ou arraste uma imagem
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG, GIF ou WebP
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="cover-alt" className="text-sm font-medium">
                    Texto alternativo (alt)
                  </label>
                  <Input
                    id="cover-alt"
                    placeholder="Descreva a imagem para leitores de tela"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    disabled={!file}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || loading}
                >
                  {loading ? 'Enviando…' : 'Usar como capa'}
                </Button>
              </>
            ) : (
              <div className="rounded-lg border border-border/60 bg-background/50 p-2">
                <MediaPicker onSelect={handleGallerySelect} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
