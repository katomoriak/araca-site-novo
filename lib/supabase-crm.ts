/**
 * supabase-crm.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Funções SERVER-SIDE para o dashboard do site ler o CRM do ERP Aracá.
 * Usa o mesmo Supabase (service_role) que o ERP_araca, garantindo que
 * ambos os sistemas vejam exatamente os mesmos dados.
 *
 * Schema Supabase (ERP):
 *   contacts       → id, name, email, phone, origin, created_at
 *   deals          → id, contact_id, project_name, project_type, status_id,
 *                    order_index, value, notes, company, created_at
 *   kanban_columns → id, name, order, created_at
 */

import { createClient } from '@supabase/supabase-js'

// ─── cliente server-side (service_role bypassa RLS) ──────────────────────────

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('[supabase-crm] NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  return createClient(url, key, { auth: { persistSession: false } })
}

// ─── tipos públicos ───────────────────────────────────────────────────────────

export interface CrmContact {
  id: string
  name: string
  email: string | null
  phone: string | null
  origin: string
  created_at: string
}

export interface CrmDeal {
  id: string
  contact_id: string
  project_name: string
  project_type: 'Residencial' | 'Comercial'
  status_id: string | null
  order_index: number
  value: number
  notes: string | null
  company: string | null
  created_at: string
  contacts: CrmContact
}

export interface CrmKanbanColumn {
  id: string
  name: string
  order: number
  deals: CrmDeal[]
  totalValue: number
}

// ─── funções ──────────────────────────────────────────────────────────────────

/**
 * Retorna colunas kanban com deals + contatos aninhados.
 * Deals sem status_id aparecem em coluna virtual "Sem etapa".
 */
export async function getCrmKanban(): Promise<CrmKanbanColumn[]> {
  const supabase = getClient()

  const [{ data: cols, error: colsErr }, { data: deals, error: dealsErr }] =
    await Promise.all([
      supabase.from('kanban_columns').select('*').order('order', { ascending: true }),
      supabase.from('deals').select('*, contacts(*)').order('order_index', { ascending: true }),
    ])

  if (colsErr) { console.error('[supabase-crm] kanban_columns:', colsErr); return [] }
  if (dealsErr) { console.error('[supabase-crm] deals:', dealsErr); return [] }

  const columns: CrmKanbanColumn[] = (cols ?? []).map((col) => {
    const colDeals = (deals ?? []).filter((d) => d.status_id === col.id) as CrmDeal[]
    return {
      id: col.id,
      name: col.name,
      order: col.order,
      deals: colDeals,
      totalValue: colDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
    }
  })

  // Deals sem coluna → coluna virtual no final
  const unassigned = (deals ?? []).filter((d) => !d.status_id) as CrmDeal[]
  if (unassigned.length > 0) {
    columns.push({
      id: '__unassigned__',
      name: 'Sem etapa',
      order: 9999,
      deals: unassigned,
      totalValue: unassigned.reduce((sum, d) => sum + (d.value ?? 0), 0),
    })
  }

  return columns
}

/**
 * Retorna os N contatos mais recentes com seu deal mais recente.
 */
export async function getRecentContacts(limit = 50): Promise<CrmDeal[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('deals')
    .select('*, contacts(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[supabase-crm] getRecentContacts:', error); return [] }
  return (data ?? []) as CrmDeal[]
}

/**
 * Retorna a primeira coluna kanban (menor order), usada como etapa padrão
 * para novos leads vindos do formulário do site.
 */
export async function getFirstKanbanColumn(): Promise<{ id: string; name: string } | null> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('kanban_columns')
    .select('id, name')
    .order('order', { ascending: true })
    .limit(1)
    .single()

  if (error) { console.error('[supabase-crm] getFirstKanbanColumn:', error); return null }
  return data as { id: string; name: string }
}

/**
 * Atualiza o status_id (coluna kanban) de um deal — drag & drop.
 */
export async function updateDealStatus(dealId: string, statusId: string | null): Promise<boolean> {
  const supabase = getClient()
  const { error } = await supabase
    .from('deals')
    .update({ status_id: statusId })
    .eq('id', dealId)

  if (error) { console.error('[supabase-crm] updateDealStatus:', error); return false }
  return true
}

/**
 * Cria um contact + deal diretamente no ERP (usado pelo dashboard do site).
 */
export async function createContactAndDeal(input: {
  name: string
  email?: string | null
  phone?: string | null
  origin?: string
  projectName: string
  projectType: 'Residencial' | 'Comercial'
  notes?: string | null
  value?: number
  statusId?: string | null
}): Promise<{ ok: true; dealId: string } | { ok: false; error: string }> {
  const supabase = getClient()

  const { data: contact, error: contactErr } = await supabase
    .from('contacts')
    .insert([{ name: input.name, email: input.email ?? null, phone: input.phone ?? null, origin: input.origin ?? 'Dashboard' }])
    .select('id')
    .single()

  if (contactErr) return { ok: false, error: contactErr.message }

  const { data: deal, error: dealErr } = await supabase
    .from('deals')
    .insert([{
      contact_id: contact.id,
      project_name: input.projectName,
      project_type: input.projectType,
      notes: input.notes ?? null,
      value: input.value ?? 0,
      status_id: input.statusId ?? null,
    }])
    .select('id')
    .single()

  if (dealErr) return { ok: false, error: dealErr.message }
  return { ok: true, dealId: deal.id }
}
