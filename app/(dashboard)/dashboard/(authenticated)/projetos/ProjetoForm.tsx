'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import { ArrowLeft, Loader2, Trash2, GripVertical, Video, ImagePlus } from 'lucide-react'
import { ProjetoImageDialog } from '@/components/dashboard/ProjetoImageDialog'

export interface MediaItem {
  type: 'image' | 'video'
  file: string
  name?: string
  /** URL pública (vinda do upload). Usada para exibir miniatura logo após o upload. */
  publicUrl?: string
}

export interface ProjetoFormData {
  slug: string
  title: string
  description: string
  tag: string
  cover: string
  media: MediaItem[]
}

interface ProjetoFormProps {
  initialData?: ProjetoFormData | null
  slugParam?: string | null
  isNew: boolean
  /** Base URL das mídias do projeto (do servidor). Evita depender de env no cliente para miniaturas. */
  projetosBaseUrl?: string | null
}

function safeFilename(name: string): string {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .slice(0, 100) || 'file'
}

/** URL pública da mídia para miniatura. Se file contém '/', é path no bucket (ex: midias/arquivo.jpg); senão é arquivo do projeto (slug/file). */
function getMediaThumbUrl(
  slug: string,
  file: string,
  projetosBaseUrl?: string | null
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET ?? 'a_public'
  const bucketBase = supabaseUrl
    ? `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}`
    : ''

  if (file.includes('/')) {
    return bucketBase ? `${bucketBase}/${file}` : `/projetos/${file}`
  }
  const encoded = encodeURIComponent(file)
  if (projetosBaseUrl) {
    return `${projetosBaseUrl.replace(/\/$/, '')}/${encoded}`
  }
  if (supabaseUrl) {
    return `${bucketBase}/${slug}/${encoded}`
  }
  return `/projetos/${slug}/${encoded}`
}

export function ProjetoForm({
  initialData,
  slugParam,
  isNew,
  projetosBaseUrl = null,
}: ProjetoFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<ProjetoFormData>(
    initialData ?? {
      slug: '',
      title: '',
      description: '',
      tag: '',
      cover: '',
      media: [],
    }
  )
  const [coverUploading, setCoverUploading] = useState(false)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [coverDialogOpen, setCoverDialogOpen] = useState(false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)

  const uploadFileToSignedUrl = useCallback(
    async (slug: string, file: File): Promise<{ filename: string; publicUrl: string } | null> => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const filename = `${safeFilename(file.name.slice(0, -ext.length - 1))}.${ext}`
      const res = await fetch('/api/dashboard/projetos/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, filename }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.signedUrl) return null
      const putRes = await fetch(data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      })
      if (!putRes.ok) return null
      return { filename, publicUrl: data.publicUrl ?? '' }
    },
    []
  )

  const handleCoverSelect = useCallback(
    (filePath: string) => {
      setForm((prev) => ({ ...prev, cover: filePath }))
    },
    []
  )

  const handleAddMediaFromDialog = useCallback(
    (filePath: string, _publicUrl: string, type?: 'image' | 'video') => {
      const mediaType = type ?? 'image'
      setForm((prev) => ({
        ...prev,
        media: [
          ...prev.media,
          { type: mediaType, file: filePath, name: '', publicUrl: _publicUrl },
        ],
      }))
    },
    []
  )


  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }))
  }

  const updateMediaName = (index: number, name: string) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.map((m, i) =>
        i === index ? { ...m, name } : m
      ),
    }))
  }

  const reorderMedia = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setForm((prev) => {
      const arr = [...prev.media]
      const [item] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, item)
      return { ...prev, media: arr }
    })
  }

  const handleMediaDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.effectAllowed = 'move'
    setDragIndex(index)
  }

  const handleMediaDragEnd = () => {
    setDragIndex(null)
  }

  const handleMediaDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    const fromStr = e.dataTransfer.getData('text/plain')
    if (fromStr === '') return
    const fromIndex = parseInt(fromStr, 10)
    if (Number.isNaN(fromIndex) || fromIndex === toIndex) return
    reorderMedia(fromIndex, toIndex)
    setDragIndex(null)
  }

  const handleMediaDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        const res = await fetch('/api/dashboard/projetos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao criar.')
          return
        }
        router.push('/dashboard/projetos')
        router.refresh()
      } else {
        const slug = slugParam ?? form.slug
        const res = await fetch(`/api/dashboard/projetos/${encodeURIComponent(slug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            tag: form.tag,
            cover: form.cover,
            media: form.media.map((m) => ({ type: m.type, file: m.file, name: m.name ?? '' })),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao salvar.')
          return
        }
        setError(null)
        router.refresh()
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projetos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dados do projeto</CardTitle>
          <CardDescription>
            Título, descrição e tag exibidos na home. Slug identifica a pasta no Storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="ex: areasocial_residencia-ninhoverce"
              disabled={!isNew}
              className="font-mono text-sm"
            />
            {!isNew && (
              <p className="mt-1 text-xs text-muted-foreground">Slug não pode ser alterado.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Título do projeto"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descrição exibida na home"
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tag (opcional)</label>
            <Input
              value={form.tag}
              onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
              placeholder="ex: Interiores"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capa</CardTitle>
          <CardDescription>
            Envie uma nova imagem ou selecione do banco de mídias dos projetos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCoverDialogOpen(true)}
            disabled={coverUploading}
          >
            <ImagePlus className="size-4" />
            {form.cover ? 'Trocar capa' : 'Selecionar capa'}
          </Button>
          {form.cover && (
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={getMediaThumbUrl(
                    form.slug || slugParam || '',
                    form.cover,
                    projetosBaseUrl ?? undefined
                  )}
                  alt="Capa"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-xs">Arquivo: {form.cover}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProjetoImageDialog
        open={coverDialogOpen}
        onOpenChange={setCoverDialogOpen}
        title="Imagem de capa"
        description="Envie uma nova imagem ou selecione do banco de mídias dos projetos."
        projectSlug={form.slug || slugParam || null}
        onUpload={async (slug, file) => {
          setCoverUploading(true)
          setError(null)
          const result = await uploadFileToSignedUrl(slug, file)
          setCoverUploading(false)
          return result
        }}
        onSelect={(filePath, _url) => handleCoverSelect(filePath)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Mídias da galeria</CardTitle>
          <CardDescription>
            Adicione imagens ou vídeos enviando novos arquivos ou escolhendo do banco de mídias. Ordem = ordem na galeria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setMediaDialogOpen(true)}
          >
            <ImagePlus className="size-4" />
            Adicionar mídia
          </Button>

          <ProjetoImageDialog
            open={mediaDialogOpen}
            onOpenChange={setMediaDialogOpen}
            title="Adicionar mídia à galeria"
            description="Envie uma nova imagem/vídeo ou selecione do banco de mídias dos projetos."
            projectSlug={form.slug || slugParam || null}
            onUpload={async (slug, file) => {
              setMediaUploading(true)
              setError(null)
              const result = await uploadFileToSignedUrl(slug, file)
              setMediaUploading(false)
              return result
            }}
            onSelect={handleAddMediaFromDialog}
          />
          <ul className="space-y-2">
            {form.media.map((m, i) => {
              const slug = form.slug || slugParam
              const thumbUrl =
                m.publicUrl ||
                (slug ? getMediaThumbUrl(slug, m.file, projetosBaseUrl) : null)
              return (
                <li
                  key={`${m.file}-${i}`}
                  className={`flex items-center gap-3 rounded border p-2 ${dragIndex === i ? 'opacity-50' : ''}`}
                  onDragOver={handleMediaDragOver}
                  onDrop={(e) => handleMediaDrop(e, i)}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleMediaDragStart(e, i)}
                    onDragEnd={handleMediaDragEnd}
                    className="cursor-grab active:cursor-grabbing touch-none shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted"
                    title="Arrastar para reordenar"
                  >
                    <GripVertical className="size-4" />
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {m.type === 'image' && thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : m.type === 'video' ? (
                      <Video className="size-6 text-muted-foreground" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                  <span className="w-28 shrink-0 truncate text-sm font-mono text-muted-foreground">
                    {m.file}
                  </span>
                  <Input
                    placeholder="Legenda"
                    value={m.name ?? ''}
                    onChange={(e) => updateMediaName(i, e.target.value)}
                    className="min-w-0 flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedia(i)}
                    aria-label="Remover"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando…
            </>
          ) : isNew ? (
            'Criar projeto'
          ) : (
            'Salvar alterações'
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/projetos">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
