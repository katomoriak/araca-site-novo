import { NextResponse } from 'next/server'
import { contactFormSchema, validateWithSchema } from '@/lib/validation-schemas'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { handleApiError, validationError, rateLimitError } from '@/lib/error-handler'
import { createErpLead } from '@/lib/erp-supabase'

/**
 * POST /api/contact
 * Formulário de contato do site.
 * Cria contact + deal diretamente no Supabase do ERP Aracá.
 * Os dados aparecem imediatamente no dashboard do site e no ERP.
 * Público (sem autenticação). Rate limit: 5 envios por minuto por IP.
 */
export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, 5, 60000)
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.resetAt
        ? Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)
        : 60
      return rateLimitError(
        'Muitas requisições. Tente novamente em alguns instantes.',
        retryAfter,
        'api/contact'
      )
    }

    const body = await request.json().catch(() => ({}))
    const validation = validateWithSchema(contactFormSchema, body)
    if (!validation.success) {
      return validationError(
        validation.errors[0] ?? 'Dados inválidos.',
        validation.errors,
        'api/contact'
      )
    }

    const data = validation.data

    // Cria contact + deal no Supabase (ERP Aracá)
    const result = await createErpLead({
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      telefone: data.telefone,
      tipoConsulta: data.tipoConsulta,
      mensagem: data.mensagem,
      pais: data.pais,
    })

    if (!result.ok) {
      console.error('[api/contact] Falha ao criar lead no ERP:', result.error)
      return NextResponse.json(
        { ok: false, error: 'Não foi possível registrar sua mensagem. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Mensagem enviada com sucesso. Em breve entraremos em contato.',
    })
  } catch (e) {
    return handleApiError(e, 'api/contact')
  }
}
