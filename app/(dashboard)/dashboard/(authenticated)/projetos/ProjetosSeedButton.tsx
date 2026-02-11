'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Upload } from 'lucide-react'

export function ProjetosSeedButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSeed() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/dashboard/projetos/seed', { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data?.message ?? 'Erro ao importar.')
        return
      }
      setMessage(
        `Importados: ${(data.created ?? []).length}. Já existentes: ${(data.skipped ?? []).length}. Recarregue a página.`
      )
      window.location.reload()
    } catch {
      setMessage('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={handleSeed}
        disabled={loading}
      >
        <Upload className="size-4" />
        {loading ? 'Importando…' : 'Importar projetos atuais'}
      </Button>
      {message && (
        <span className="text-xs text-muted-foreground">{message}</span>
      )}
    </div>
  )
}
