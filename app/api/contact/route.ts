import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { contactFormSchema, validateWithSchema } from '@/lib/validation-schemas'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { handleApiError, validationError, rateLimitError } from '@/lib/error-handler'

/**
 * POST /api/contact
 * Formulário da home: cria um lead e uma negociação vinculada (origem site).
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
    const fullName = [data.nome, data.sobrenome].filter(Boolean).join(' ').trim()
    const notesParts: string[] = []
    if (data.tipoConsulta) notesParts.push(`Tipo: ${data.tipoConsulta}`)
    if (data.pais) notesParts.push(`País: ${data.pais}`)
    if (data.telefone) notesParts.push(`Telefone: ${data.telefone}`)
    if (data.mensagem) notesParts.push(`Mensagem: ${data.mensagem}`)
    const notes = notesParts.join('\n') || undefined

    const payload = await getPayloadClient()

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name: fullName,
        email: data.email,
        company: undefined,
        status: 'contacted',
        source: 'website',
        notes,
        lastActivity: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    const leadId = (lead as { id: string | number }).id
    await payload.create({
      collection: 'negociacoes',
      data: {
        lead: leadId,
        stage: 'prospeccao',
        notes: data.mensagem || undefined,
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      ok: true,
      message: 'Mensagem enviada com sucesso. Em breve entraremos em contato.',
    })
  } catch (e) {
    return handleApiError(e, 'api/contact')
  }
}
