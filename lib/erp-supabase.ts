/**
 * erp-supabase.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Cria contact + deal no ERP Aracá (Supabase) a partir do formulário do site.
 * Usa a primeira coluna kanban como etapa inicial (ex.: "Prospecção").
 */

import { createClient } from '@supabase/supabase-js'

function getErpClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('[erp-supabase] NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function createErpLead(data: {
  nome: string
  sobrenome?: string
  email: string
  telefone?: string
  tipoConsulta?: string
  mensagem?: string
  pais?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = getErpClient()
    const fullName = [data.nome, data.sobrenome].filter(Boolean).join(' ').trim()
    const projectType: 'Residencial' | 'Comercial' =
      data.tipoConsulta?.toLowerCase().includes('comercial') ? 'Comercial' : 'Residencial'

    // 1. Buscar primeira coluna kanban para posicionar o deal em "Prospecção"
    const { data: firstCol } = await supabase
      .from('kanban_columns')
      .select('id, name')
      .order('order', { ascending: true })
      .limit(1)
      .single()

    // 2. Criar contato
    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .insert([{ name: fullName, email: data.email || null, phone: data.telefone || null, origin: 'Site' }])
      .select('id')
      .single()

    if (contactErr) { console.error('[erp-supabase] contacts:', contactErr); return { ok: false, error: contactErr.message } }

    // 3. Montar notas
    const notesParts: string[] = []
    if (data.tipoConsulta) notesParts.push(`Tipo: ${data.tipoConsulta}`)
    if (data.pais) notesParts.push(`País: ${data.pais}`)
    if (data.mensagem) notesParts.push(`Mensagem: ${data.mensagem}`)

    // 4. Criar deal vinculado ao contato, na primeira coluna kanban
    const { error: dealErr } = await supabase
      .from('deals')
      .insert([{
        contact_id: contact.id,
        project_name: data.tipoConsulta || 'Consulta via site',
        project_type: projectType,
        notes: notesParts.join('\n') || null,
        value: 0,
        status_id: firstCol?.id ?? null,
      }])

    if (dealErr) { console.error('[erp-supabase] deals:', dealErr); return { ok: false, error: dealErr.message } }

    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[erp-supabase] erro inesperado:', msg)
    return { ok: false, error: msg }
  }
}
