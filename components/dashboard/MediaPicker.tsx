'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Search, Check, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const FOLDER_ALL = '__all__'
const FOLDER_GERAL = '__geral__'

export interface MediaItem {
  id: string
  url: string
  /** URL de miniatura (proxy redimensionado) para carregamento rápido em listas. */
  thumbnailUrl?: string
  filename: string
  alt: string
  fileType?: string
  /** Path no bucket (ex: midias/arquivo.jpg). Usado pelo formulário de projetos. */
  path?: string
  folder?: string
}

interface MediaPickerProps {
  onSelect: (item: MediaItem) => void
  onClose?: () => void
  className?: string
  /** 'blog' = /api/dashboard/blog/media | 'projetos' = /api/dashboard/projetos/media */
  source?: 'blog' | 'projetos'
  /** Se true, exibe checkboxes e permite selecionar vários itens; use onSelectMultiple para receber a lista. */
  multiSelect?: boolean
  /** Chamado ao confirmar seleção múltipla (botão "Adicionar selecionadas"). */
  onSelectMultiple?: (items: MediaItem[]) => void
  /** Slug do projeto atual (no formulário de projeto). Pré-seleciona a pasta ao abrir. */
  currentProjectSlug?: string | null
}

const MEDIA_API = {
  blog: '/api/dashboard/blog/media',
  projetos: '/api/dashboard/projetos/media',
} as const

interface ProjectOption {
  slug: string
  title: string
}

function ThumbnailCell({ item }: { item: MediaItem }) {
  const [loaded, setLoaded] = useState(false)
  const src = item.thumbnailUrl || item.url
  if (!item.url) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
        <span className="break-all p-1 text-center text-[10px] text-muted-foreground">
          {item.filename}
        </span>
      </div>
    )
  }
  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded border bg-muted">
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted"
          aria-hidden
        >
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={item.alt || item.filename}
        className="relative size-full object-cover"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}

export function MediaPicker({
  onSelect,
  onClose,
  className = '',
  source = 'blog',
  multiSelect = false,
  onSelectMultiple,
  currentProjectSlug = null,
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>(FOLDER_ALL)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ limit: '200' })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (source === 'projetos' && selectedFolder && selectedFolder !== FOLDER_ALL) {
      params.set('folder', selectedFolder)
    }
    try {
      const res = await fetch(`${MEDIA_API[source]}?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Falha ao carregar mídias')
      const data = await res.json()
      if (mountedRef.current) {
        setItems(data.media ?? [])
        if (source === 'projetos' && Array.isArray(data.projects)) {
          setProjects(data.projects)
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [debouncedSearch, source, selectedFolder, currentProjectSlug])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  useEffect(() => {
    if (source === 'projetos' && currentProjectSlug !== undefined) {
      setSelectedFolder(currentProjectSlug && currentProjectSlug.trim() ? currentProjectSlug : FOLDER_ALL)
    }
  }, [source, currentProjectSlug])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectedItems = items.filter((item) => selectedIds.has(item.id))
  const handleAddSelected = useCallback(() => {
    if (multiSelect && onSelectMultiple && selectedItems.length > 0) {
      onSelectMultiple(selectedItems)
      setSelectedIds(new Set())
      onClose?.()
    }
  }, [multiSelect, onSelectMultiple, selectedItems, onClose])

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-sm text-destructive ${className}`}>
        {error}
        {onClose && (
          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={onClose}>
            Fechar
          </Button>
        )}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          {debouncedSearch ? 'Nenhuma mídia encontrada com esse nome.' : 'Nenhuma mídia encontrada. Envie imagens pelo botão "Enviar arquivo" ou pelo admin.'}
          {onClose && (
            <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 max-h-72 overflow-hidden flex flex-col ${className}`}>
      {source === 'projetos' && (
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-full shrink-0">
            <FolderOpen className="size-4 shrink-0" />
            <SelectValue placeholder="Pasta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FOLDER_ALL}>Todas as pastas</SelectItem>
            <SelectItem value={FOLDER_GERAL}>Geral</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="relative shrink-0">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {items.map((item) => {
          const isSelected = multiSelect && selectedIds.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                'flex w-full items-center gap-3 rounded-md border border-input bg-muted/30 px-2 py-2 text-left transition-colors hover:bg-muted/60 hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary',
                isSelected && 'ring-2 ring-primary bg-primary/10'
              )}
              onClick={() => {
                if (multiSelect) {
                  handleToggleSelect(item.id)
                } else {
                  onSelect(item)
                  onClose?.()
                }
              }}
            >
              {multiSelect && (
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded border',
                    isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-input'
                  )}
                >
                  {isSelected ? <Check className="size-3" /> : null}
                </div>
              )}
              <ThumbnailCell item={item} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={item.alt || item.filename}>
                  {item.alt || item.filename || 'Sem nome'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.fileType ? `${item.fileType}` : ''}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      {multiSelect && onSelectMultiple && selectedItems.length > 0 && (
        <div className="shrink-0 border-t pt-2">
          <Button type="button" size="sm" className="w-full" onClick={handleAddSelected}>
            Adicionar selecionadas ({selectedItems.length})
          </Button>
        </div>
      )}
    </div>
  )
}
