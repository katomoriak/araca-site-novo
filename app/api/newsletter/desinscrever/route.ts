import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * POST /api/newsletter/desinscrever
 * Body: { email: string }
 * Marca o inscrito com cancelado = true (e status = unsubscribed).
 * Público (sem autenticação).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : null

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido.', ok: false },
        { status: 400 },
      )
    }

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
      overrideAccess: true,
    })

    return NextResponse.json({
      message: 'Você foi desinscrito da nossa newsletter.',
      ok: true,
    })
  } catch (e) {
    console.error('[desinscrever]', e)
    return NextResponse.json(
      { error: 'Erro ao processar desinscrição.', ok: false },
      { status: 500 },
    )
  }
}
