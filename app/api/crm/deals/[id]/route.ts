import { NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { updateDealStatus } from '@/lib/supabase-crm'
import { handleApiError } from '@/lib/error-handler'

/**
 * PATCH /api/crm/deals/[id]
 * Atualiza status_id (coluna kanban) de um deal — usado pelo drag & drop.
 * Requer autenticação de dashboard.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getDashboardUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const statusId = body.status_id ?? null

    const ok = await updateDealStatus(id, statusId)
    if (!ok) return NextResponse.json({ error: 'Falha ao atualizar deal.' }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return handleApiError(e, 'api/crm/deals/[id]')
  }
}
