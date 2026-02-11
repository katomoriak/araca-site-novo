"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

interface DeletePostButtonProps {
  slug: string
  title: string
}

export function DeletePostButton({ slug, title }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir o post "${title}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/blog/posts/${slug}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Erro ao deletar post')
      }
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      title="Excluir post"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
