'use client'

import { useCallback, useState } from 'react'
import { Upload, ImagePlus, Link } from 'lucide-react'
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
import { uploadBlogImage } from '@/lib/blog-image-upload'
import { MediaPicker, type MediaItem } from './MediaPicker'

export interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (url: string, altText: string) => void
}

type DialogMode = 'upload' | 'gallery' | 'url'

export function ImageUploadDialog({
  open,
  onOpenChange,
  onInsert,
}: ImageUploadDialogProps) {
  const [mode, setMode] = useState<DialogMode>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setMode('upload')
    setFile(null)
    setAltText('')
    setImageUrl('')
    setError(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset()
      }
      onOpenChange(isOpen)
    },
    [onOpenChange, reset]
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

  const handleInsert = useCallback(async () => {
    if (!file) {
      setError('Selecione uma imagem para enviar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { url, alt } = await uploadBlogImage(file)
      onInsert(url, altText.trim() || alt || file.name)
      handleClose(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar imagem')
    } finally {
      setLoading(false)
    }
  }, [file, altText, onInsert, handleClose])

  const handleGallerySelect = useCallback(
    (item: MediaItem) => {
      const raw = item.url?.trim()
      if (!raw) return
      // Garantir URL absoluta para o <img> carregar (Payload pode retornar path relativo)
      const url =
        typeof window !== 'undefined' && raw.startsWith('/')
          ? `${window.location.origin}${raw}`
          : raw
      onInsert(url, item.alt || item.filename || '')
      // Fechar no próximo frame para evitar [Violation] 'message' handler took Xms:
      // o update do Lexical e o unmount do diálogo no mesmo tick sobrecarregam o handler.
      requestAnimationFrame(() => {
        handleClose(false)
      })
    },
    [onInsert, handleClose]
  )

  const handleInsertByUrl = useCallback(() => {
    const url = imageUrl.trim()
    if (!url) {
      setError('Informe o link da imagem.')
      return
    }
    // Aceitar URLs que parecem links de imagem (ou qualquer URL; o navegador carregará se for imagem)
    try {
      new URL(url)
    } catch {
      setError('Informe um link válido.')
      return
    }
    setError(null)
    onInsert(url, altText.trim() || 'Imagem')
    requestAnimationFrame(() => handleClose(false))
  }, [imageUrl, altText, onInsert, handleClose])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-araca-bege-claro border-border/80">
        <DialogHeader>
          <DialogTitle>Inserir imagem</DialogTitle>
          <DialogDescription>
            Envie uma nova imagem, selecione do banco de mídias ou insira por link.
          </DialogDescription>
        </DialogHeader>

        {/* Abas: Enviar | Banco de mídias | Por link */}
        <div className="flex gap-1 rounded-lg border border-border/60 bg-background/60 p-1">
          <button
            type="button"
            onClick={() => { setMode('upload'); setError(null) }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <Upload className="size-4 shrink-0" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('gallery'); setError(null) }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              mode === 'gallery'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <ImagePlus className="size-4 shrink-0" />
            <span className="hidden sm:inline">Mídias</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('url'); setError(null) }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              mode === 'url'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <Link className="size-4 shrink-0" />
            <span className="hidden sm:inline">Por link</span>
          </button>
        </div>

        <div className="space-y-4 py-2 min-h-[200px]">
          {mode === 'upload' && (
          <>
          {/* Área de upload */}
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

          {/* Alt text (só no modo upload) */}
          <div className="space-y-2">
            <label htmlFor="alt-text" className="text-sm font-medium">
              Texto alternativo (alt) <span className="text-muted-foreground">*</span>
            </label>
            <Input
              id="alt-text"
              placeholder="Descreva a imagem para leitores de tela"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              disabled={!file}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          </>
          )}

          {mode === 'gallery' && (
          <div className="rounded-lg border border-border/60 bg-background/50 p-2">
            <MediaPicker onSelect={handleGallerySelect} />
          </div>
          )}

          {mode === 'url' && (
          <>
          <p className="text-xs text-muted-foreground rounded-md bg-muted/50 border border-border/60 px-3 py-2">
            Se a imagem não aparecer na postagem (alguns sites bloqueiam links externos), use &quot;Enviar arquivo&quot; ou &quot;Banco de mídias&quot; para garantir que ela fique sempre visível.
          </p>
          <div className="space-y-2">
            <label htmlFor="image-url" className="text-sm font-medium">
              Link da imagem
            </label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="alt-text-url" className="text-sm font-medium">
              Texto alternativo (alt) <span className="text-muted-foreground">opcional</span>
            </label>
            <Input
              id="alt-text-url"
              placeholder="Descreva a imagem para leitores de tela"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          {imageUrl.trim() && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
              <p className="text-xs text-muted-foreground mb-2">Pré-visualização:</p>
              <img
                src={imageUrl.trim()}
                alt="Preview"
                className="max-h-32 w-full object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          </>
          )}
        </div>

        {(mode === 'upload' || mode === 'url') && (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={mode === 'url' ? handleInsertByUrl : handleInsert}
            disabled={mode === 'upload' ? (!file || loading) : !imageUrl.trim()}
          >
            {mode === 'upload' && loading ? 'Enviando…' : 'Inserir imagem'}
          </Button>
        </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
