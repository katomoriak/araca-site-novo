import { NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { createContactAndDeal, getFirstKanbanColumn } from '@/lib/supabase-crm'
import { handleApiError } from '@/lib/error-handler'

/**
 * POST /api/crm/leads
 * Cria um contact + deal no ERP via dashboard do site.
 * Requer autenticação de dashboard.
 */
export async function POST(request: Request) {
  try {
    const user = await getDashboardUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const { name, email, phone, origin, projectName, projectType, notes, value, statusId } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    }

    // Se não veio statusId, usar a primeira coluna kanban
    let resolvedStatusId = statusId ?? null
    if (!resolvedStatusId) {
      const firstCol = await getFirstKanbanColumn()
      resolvedStatusId = firstCol?.id ?? null
    }

    const result = await createContactAndDeal({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      origin: origin || 'Dashboard',
      projectName: projectName?.trim() || 'Novo lead',
      projectType: projectType === 'Comercial' ? 'Comercial' : 'Residencial',
      notes: notes?.trim() || null,
      value: Number(value) || 0,
      statusId: resolvedStatusId,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, dealId: result.dealId })
  } catch (e) {
    return handleApiError(e, 'api/crm/leads')
  }
}
