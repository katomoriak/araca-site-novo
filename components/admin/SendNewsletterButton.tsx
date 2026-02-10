'use client'

/**
 * Botão "Enviar newsletter" na edição de uma newsletter.
 * Sempre mostra a seção; o botão só fica ativo quando há id e status = draft.
 */
import React from 'react'
import { Button, useDocumentInfo, useFormFields } from '@payloadcms/ui'

export function SendNewsletterButton() {
  const { id, collectionSlug } = useDocumentInfo()
  const status = useFormFields(([fields]) => {
    const s = fields?.status?.value
    return typeof s === 'string' ? s : undefined
  })

  const [sending, setSending] = React.useState(false)
  const [message, setMessage] = React.useState<{ error?: string; ok?: string } | null>(null)

  const isNewsletters = String(collectionSlug ?? '').toLowerCase() === 'newsletters'
  const canSend = Boolean(isNewsletters && id && status === 'draft')

  const handleSend = React.useCallback(async () => {
    if (!id || !canSend) return
    setSending(true)
    setMessage(null)
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${base}/api/newsletters/${id}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ error: data?.error ?? `Erro ${res.status}` })
        return
      }
      setMessage({ ok: data?.message ?? 'Enviada.' })
      if (data?.sent) {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (e) {
      setMessage({ error: e instanceof Error ? e.message : 'Erro ao enviar.' })
    } finally {
      setSending(false)
    }
  }, [id, canSend])

  if (!isNewsletters) return null

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
      {!id ? (
        <p style={{ color: 'var(--theme-elevation-500)', margin: 0 }}>
          Salve a newsletter primeiro (botão Salvar no canto superior direito) para poder enviar.
        </p>
      ) : status === 'sent' ? (
        <p style={{ color: 'var(--theme-elevation-500)', margin: 0 }}>
          Esta newsletter já foi enviada. Crie uma nova para enviar outra.
        </p>
      ) : (
        <>
          <Button
            buttonStyle="primary"
            disabled={sending}
            onClick={handleSend}
            size="medium"
          >
            {sending ? 'Enviando…' : 'Enviar para todos os inscritos'}
          </Button>
          {message?.error && (
            <p style={{ color: 'var(--theme-error-500)', marginTop: '0.5rem' }}>{message.error}</p>
          )}
          {message?.ok && (
            <p style={{ color: 'var(--theme-success-500)', marginTop: '0.5rem' }}>{message.ok}</p>
          )}
        </>
      )}
    </div>
  )
}
