import { NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { getRecentContacts } from '@/lib/supabase-crm'
import { handleApiError } from '@/lib/error-handler'

/**
 * GET /api/crm/contacts
 * Retorna os deals+contacts mais recentes para o painel "Leads recentes".
 * Requer autenticação de dashboard.
 */
export async function GET() {
  try {
    const user = await getDashboardUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })

    const deals = await getRecentContacts(100)
    return NextResponse.json({ ok: true, docs: deals })
  } catch (e) {
    return handleApiError(e, 'api/crm/contacts')
  }
}
