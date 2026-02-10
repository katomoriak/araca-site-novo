'use client'

/**
 * View de edição de Newsletter que inclui o botão "Enviar newsletter" no topo.
 * Substitui a view padrão apenas para a collection newsletters.
 */
import React from 'react'
import type { DocumentViewClientProps } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { SendNewsletterButton } from './SendNewsletterButton'

export function NewsletterEditView(props: DocumentViewClientProps) {
  return (
    <>
      <div
        style={{
          marginBottom: 'var(--base, 1rem)',
          padding: 'var(--base, 1rem)',
          background: 'var(--theme-elevation-50)',
          borderRadius: 'var(--theme-border-radius-m)',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Enviar newsletter</strong>
        <SendNewsletterButton />
      </div>
      <DefaultEditView {...props} />
    </>
  )
}
