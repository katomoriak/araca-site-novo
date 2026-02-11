import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { emailSchema } from '@/lib/validation-schemas'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { handleApiError, validationError, rateLimitError } from '@/lib/error-handler'

/**
 * POST /api/newsletter/desinscrever
 * Body: { email: string }
 * Marca o inscrito com cancelado = true (e status = unsubscribed).
 * Público (sem autenticação).
 */
export async function POST(request: Request) {
  try {
    // Rate limiting: 5 requisições por minuto por IP
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, 5, 60000)
    
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.resetAt 
        ? Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)
        : 60
      
      return rateLimitError(
        'Muitas requisições. Tente novamente em alguns instantes.',
        retryAfter,
        'api/newsletter/desinscrever'
      )
    }
    
    const body = await request.json().catch(() => ({}))
    
    // Validação robusta com Zod
    const validation = emailSchema.safeParse(body?.email)
    if (!validation.success) {
      return validationError('E-mail inválido.', undefined, 'api/newsletter/desinscrever')
    }
    
    const email = validation.data

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    const doc = result.docs?.[0]
    if (!doc) {
      return NextResponse.json(
        { message: 'Este e-mail não está inscrito na nossa newsletter.', ok: true },
        { status: 200 },
      )
    }

    const id = (doc as { id: string | number }).id
    await payload.update({
      collection: 'subscribers',
      id,
      data: {
        cancelado: true,
        status: 'unsubscribed',
      },
      // overrideAccess necessário: rota pública de desinscrição
      // Email já validado e não expõe dados sensíveis
      overrideAccess: true,
    })

    return NextResponse.json({
      message: 'Você foi desinscrito da nossa newsletter.',
      ok: true,
    })
  } catch (e) {
    return handleApiError(e, 'api/newsletter/desinscrever')
  }
}
