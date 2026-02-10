'use client'

import { useRouter } from 'next/navigation'
import { AddLeadSheet } from '@/components/dashboard/AddLeadSheet'
import { AddNegociacaoSheet } from '@/components/dashboard/AddNegociacaoSheet'

/** Botões de ação do CRM (adicionar lead e adicionar negociação). Client component para poder chamar router.refresh() após criar negociação. */
export function CrmPageActions() {
  const router = useRouter()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AddLeadSheet />
      <AddNegociacaoSheet onNegociacaoAdded={() => router.refresh()} />
    </div>
  )
}
