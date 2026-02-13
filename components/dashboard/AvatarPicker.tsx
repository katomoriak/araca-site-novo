'use client'

import { useCallback, useState } from 'react'
import { User, Upload, X, ImagePlus } from 'lucide-react'
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
import { cn } from '@/lib/utils'

export interface AvatarPickerProps {
    value: string | null
    imageUrl?: string | null
    onChange: (id: string | null, url?: string | null) => void
    className?: string
}

type DialogMode = 'upload' | 'gallery'

export function AvatarPicker({
    value,
    imageUrl,
    onChange,
    className = '',
}: AvatarPickerProps) {
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
            // Usamos o mesmo endpoint de mídia do blog por padrão
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
        <div className={cn('flex flex-col items-center gap-4', className)}>
            <div className="relative group">
                <div
                    className={cn(
                        "size-24 rounded-full overflow-hidden border-2 border-araca-bege-medio/30 bg-araca-bege-claro flex items-center justify-center cursor-pointer hover:border-araca-bege-medio transition-colors",
                        !previewSrc && "border-dashed"
                    )}
                    onClick={() => setOpen(true)}
                >
                    {previewSrc ? (
                        <img
                            src={previewSrc}
                            alt="Avatar"
                            className="size-full object-cover"
                        />
                    ) : (
                        <User className="size-10 text-araca-bege-medio/60" />
                    )}
                </div>

                {previewSrc && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                    >
                        <X className="size-3" />
                    </button>
                )}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="text-xs h-8"
            >
                {previewSrc ? 'Alterar foto' : 'Adicionar foto'}
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md bg-araca-creme border-araca-bege-medio/30">
                    <DialogHeader>
                        <DialogTitle className="text-araca-cafe-escuro">Foto de perfil</DialogTitle>
                        <DialogDescription className="text-araca-chocolate-amargo/80">
                            Escolha uma imagem de perfil para o autor.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-1 rounded-lg border border-araca-bege-medio/20 bg-araca-bege-claro/30 p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('upload')
                                setError(null)
                            }}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                mode === 'upload'
                                    ? "bg-araca-chocolate-amargo text-white shadow-sm"
                                    : "text-araca-chocolate-amargo/70 hover:bg-araca-bege-claro/50"
                            )}
                        >
                            <Upload className="size-4" />
                            Enviar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode('gallery')
                                setError(null)
                            }}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                mode === 'gallery'
                                    ? "bg-araca-chocolate-amargo text-white shadow-sm"
                                    : "text-araca-chocolate-amargo/70 hover:bg-araca-bege-claro/50"
                            )}
                        >
                            <ImagePlus className="size-4" />
                            Galeria
                        </button>
                    </div>

                    <div className="min-h-[200px] space-y-4 py-2">
                        {mode === 'upload' ? (
                            <>
                                <div
                                    className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-araca-bege-medio/30 bg-araca-bege-claro/20 p-4 transition-colors hover:border-araca-bege-medio/50"
                                >
                                    {preview ? (
                                        <div className="relative flex flex-col items-center gap-4">
                                            <div className="size-24 rounded-full overflow-hidden border-2 border-araca-bege-medio">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <p className="truncate text-center text-xs text-muted-foreground max-w-[200px]">
                                                {file?.name}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
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
                                            <Upload className="size-10 text-araca-bege-medio/60" />
                                            <span className="text-sm font-medium text-araca-chocolate-amargo/80">
                                                Clique para selecionar uma imagem
                                            </span>
                                            <span className="text-xs text-araca-chocolate-amargo/60">
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
                                    <label htmlFor="avatar-alt" className="text-sm font-medium text-araca-cafe-escuro">
                                        Descrição (alt)
                                    </label>
                                    <Input
                                        id="avatar-alt"
                                        placeholder="Descrição para acessibilidade"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        disabled={!file}
                                        className="bg-white/50 border-araca-bege-medio/30"
                                    />
                                </div>
                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                >
                                    {loading ? 'Enviando…' : 'Usar esta foto'}
                                </Button>
                            </>
                        ) : (
                            <div className="rounded-lg border border-araca-bege-medio/20 bg-araca-bege-claro/10 p-2">
                                <MediaPicker onSelect={handleGallerySelect} />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
