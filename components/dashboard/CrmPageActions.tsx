'use client'

import { useRouter } from 'next/navigation'
import { AddLeadSheet } from '@/components/dashboard/AddLeadSheet'

/** Botões de ação do CRM. Adicionar lead cria contact + deal no ERP Aracá via Supabase. */
export function CrmPageActions() {
  const router = useRouter()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AddLeadSheet onLeadAdded={() => router.refresh()} />
    </div>
  )
}
