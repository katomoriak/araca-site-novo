'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from '@/components/dashboard/RichTextEditor'
import { CoverImagePicker } from '@/components/dashboard/CoverImagePicker'
import { SchedulePicker } from '@/components/dashboard/SchedulePicker'

const EXCERPT_IDEAL_MIN = 150
const EXCERPT_IDEAL_MAX = 160

export interface PostFormData {
  title: string
  slug: string
  excerpt: string
  metaDescription: string
  content: string
  status: 'draft' | 'published'
  categoryId?: string | null
  authorId?: string | null
  publishedAt?: string | null
  coverImageId?: string | null
  coverImageUrl?: string | null
}

interface PostFormProps {
  initialData?: any
  isNew: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Author {
  id: string
  name?: string
  email: string
}

export function PostForm({ initialData, isNew }: PostFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Normaliza author para ID string (Payload pode retornar object com id ou value, e id pode ser number)
  const normalizedAuthorId = (() => {
    const a = initialData?.author
    if (a == null) return null
    const id = typeof a === 'object' && a !== null && 'id' in a
      ? (a as { id?: string | number }).id
      : typeof a === 'object' && a !== null && 'value' in a
        ? (a as { value?: string | number }).value
        : a
    return id != null ? String(id) : null
  })()

  // Normaliza category para ID string (mesmo padrão do autor — Select do Radix exige match exato de tipo)
  const normalizedCategoryId = (() => {
    const c = initialData?.category
    if (c == null) return null
    const id = typeof c === 'object' && c !== null && 'id' in c
      ? (c as { id?: string | number }).id
      : typeof c === 'object' && c !== null && 'value' in c
        ? (c as { value?: string | number }).value
        : c
    return id != null ? String(id) : null
  })()

  const coverImage = initialData?.coverImage
  const coverImageUrlField = initialData?.coverImageUrl
  const initialCoverId =
    typeof coverImage === 'object' && coverImage?.id
      ? coverImage.id
      : initialData?.coverImage ?? null
  const initialCoverUrl =
    (typeof coverImage === 'object' && coverImage?.url
      ? (coverImage.url as string)
      : coverImageUrlField) ?? null
  // Quando capa vem do Supabase (coverImageUrl sem coverImage), usar id sintético para o form
  const effectiveCoverId =
    initialCoverId ?? (initialCoverUrl ? 'supabase-cover' : null)

  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    excerpt: initialData?.excerpt ?? '',
    metaDescription: initialData?.metaDescription ?? '',
    content: initialData?.content ?? '',
    status: initialData?.status ?? 'draft',
    categoryId: normalizedCategoryId,
    authorId: normalizedAuthorId,
    publishedAt: initialData?.publishedAt ?? null,
    coverImageId: effectiveCoverId,
    coverImageUrl: initialCoverUrl,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, authorsRes] = await Promise.all([
          fetch('/api/dashboard/blog/categories'),
          fetch('/api/dashboard/blog/authors'),
        ])
        
        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data.categories ?? [])
        }
        
        if (authorsRes.ok) {
          const data = await authorsRes.json()
          setAuthors(data.authors ?? [])
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoadingData(false)
      }
    }
    
    loadData()
  }, [])

  const handleSubmit = async (
    e?: React.FormEvent,
    overrides?: Partial<Pick<PostFormData, 'publishedAt' | 'status'>>
  ) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)

    const data = { ...form, ...overrides }

    if (!data.authorId) {
      setError('Selecione um autor.')
      setSaving(false)
      return
    }
    
    try {
      // Conteúdo: sempre string (editor pode não ter disparado onChange no início)
      const contentValue =
        typeof form.content === 'string' ? form.content : (form.content ?? '')
      const contentStr = contentValue.trim() === '' ? '<p></p>' : contentValue

      const payload = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        metaDescription: data.metaDescription?.trim() || null,
        content: contentStr,
        status: data.status,
        category: data.categoryId && data.categoryId !== 'none' ? data.categoryId : null,
        author: data.authorId && data.authorId !== 'none' ? data.authorId : null,
        publishedAt: data.publishedAt || null,
        coverImage: data.coverImageId || null,
        ...(data.coverImageId?.startsWith?.('supabase-') && data.coverImageUrl && {
          coverImageUrl: data.coverImageUrl,
        }),
      }

      if (isNew) {
        const res = await fetch('/api/dashboard/blog/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao criar post.')
          return
        }
        router.push('/dashboard/blog/posts')
        router.refresh()
      } else {
        const res = await fetch(`/api/dashboard/blog/posts/${encodeURIComponent(form.slug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data?.message ?? 'Erro ao salvar post.')
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

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setForm((p) => ({ ...p, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href="/dashboard/blog/posts">
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
          <CardTitle>Informações básicas</CardTitle>
          <CardDescription>
            Título, slug, resumo e imagem de capa do post.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Título do post"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Slug *</label>
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="url-amigavel"
                required
                disabled={!isNew}
                className="font-mono text-sm"
              />
              {isNew && (
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Gerar
                </Button>
              )}
            </div>
            {!isNew && (
              <p className="mt-1 text-xs text-muted-foreground">Slug não pode ser alterado.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Resumo *</label>
            <p className="mb-1 text-xs text-muted-foreground">
              Ideal 150–160 caracteres para snippet em buscas.
            </p>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="Breve resumo do post"
              className={`w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ${
                form.excerpt.length > 0 && (form.excerpt.length < EXCERPT_IDEAL_MIN || form.excerpt.length > EXCERPT_IDEAL_MAX)
                  ? 'border-amber-500/50 focus-visible:ring-amber-500/30'
                  : ''
              }`}
              rows={3}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              <span className={form.excerpt.length >= EXCERPT_IDEAL_MIN && form.excerpt.length <= EXCERPT_IDEAL_MAX ? 'text-green-600' : ''}>
                {form.excerpt.length}/160
              </span>
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meta description (opcional)</label>
            <p className="mb-1 text-xs text-muted-foreground">
              Se preenchido, usado em buscas no lugar do resumo. Ideal 150–160 caracteres.
            </p>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))}
              placeholder="Opcional"
              className={`w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ${
                form.metaDescription.length > 0 && (form.metaDescription.length < EXCERPT_IDEAL_MIN || form.metaDescription.length > EXCERPT_IDEAL_MAX)
                  ? 'border-amber-500/50 focus-visible:ring-amber-500/30'
                  : ''
              }`}
              rows={2}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {form.metaDescription.length}/160
            </p>
          </div>
          <CoverImagePicker
            value={form.coverImageId ?? null}
            imageUrl={form.coverImageUrl ?? null}
            onChange={(id, url) =>
              setForm((p) => ({
                ...p,
                coverImageId: id,
                coverImageUrl: url ?? null,
              }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
          <CardDescription>
            Conteúdo principal do post com editor rico (igual ao Payload Admin).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={form.content}
            onChange={(value) => setForm((p) => ({ ...p, content: value }))}
            placeholder="Escreva o conteúdo do post aqui..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadados</CardTitle>
          <CardDescription>
            Categoria, autor e status do post.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Categoria</label>
            <Select
              value={form.categoryId ?? 'none'}
              onValueChange={(value) => setForm((p) => ({ ...p, categoryId: value === 'none' ? null : value }))}
              disabled={loadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={String(cat.id)} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Autor *</label>
            <Select
              value={form.authorId ?? 'none'}
              onValueChange={(value) => setForm((p) => ({ ...p, authorId: value === 'none' ? null : value }))}
              disabled={loadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um autor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Selecione um autor —</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={String(author.id)} value={String(author.id)}>
                    {author.name || author.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status *</label>
            <Select
              value={form.status}
              onValueChange={(value: 'draft' | 'published') => setForm((p) => ({ ...p, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {isNew ? (
          <>
            <Button
              type="button"
              disabled={saving}
              onClick={() =>
                handleSubmit(undefined, {
                  publishedAt: new Date().toISOString(),
                  status: 'published',
                })
              }
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Postar agora
                </>
              )}
            </Button>
            <SchedulePicker
              value={form.publishedAt ?? null}
              onChange={(iso) => setForm((p) => ({ ...p, publishedAt: iso }))}
              onStatusChange={(status) => setForm((p) => ({ ...p, status }))}
              onConfirm={(iso) =>
                handleSubmit(undefined, { publishedAt: iso, status: 'published' })
              }
              hidePostNow
              triggerVariant="outline"
              disabled={saving}
            />
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() =>
                handleSubmit(undefined, { publishedAt: null, status: 'draft' })
              }
            >
              Salvar rascunho
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
            <SchedulePicker
              value={form.publishedAt ?? null}
              onChange={(iso) => setForm((p) => ({ ...p, publishedAt: iso }))}
              onStatusChange={(status) => setForm((p) => ({ ...p, status }))}
              onConfirm={(iso) =>
                handleSubmit(undefined, { publishedAt: iso, status: 'published' })
              }
              hidePostNow
              triggerVariant="outline"
              disabled={saving}
            />
          </>
        )}
        <Button type="button" variant="ghost" asChild>
          <Link href="/dashboard/blog/posts">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}
