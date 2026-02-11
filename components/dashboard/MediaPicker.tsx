'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export interface MediaItem {
  id: string
  url: string
  filename: string
  alt: string
  fileType?: string
  /** Path no bucket (ex: midias/arquivo.jpg). Usado pelo formulário de projetos. */
  path?: string
}

interface MediaPickerProps {
  onSelect: (item: MediaItem) => void
  onClose?: () => void
  className?: string
  /** 'blog' = /api/dashboard/blog/media | 'projetos' = /api/dashboard/projetos/media */
  source?: 'blog' | 'projetos'
}

const MEDIA_API = {
  blog: '/api/dashboard/blog/media',
  projetos: '/api/dashboard/projetos/media',
} as const

export function MediaPicker({ onSelect, onClose, className = '', source = 'blog' }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ limit: '200' })
    if (debouncedSearch) params.set('search', debouncedSearch)
    try {
      const res = await fetch(`${MEDIA_API[source]}?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Falha ao carregar mídias')
      const data = await res.json()
      setItems(data.media ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, source])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

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
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-center gap-3 rounded-md border border-input bg-muted/30 px-2 py-2 text-left transition-colors hover:bg-muted/60 hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => {
              onSelect(item)
              onClose?.()
            }}
          >
            <div className="size-12 shrink-0 overflow-hidden rounded border bg-muted">
              {item.url ? (
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-[10px] text-muted-foreground break-all p-1">
                  {item.filename}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={item.alt || item.filename}>
                {item.alt || item.filename || 'Sem nome'}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.fileType ? `${item.fileType}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
