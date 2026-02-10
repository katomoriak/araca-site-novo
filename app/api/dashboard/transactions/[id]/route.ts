import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { cookies } from 'next/headers'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

/**
 * PATCH /api/dashboard/transactions/[id]
 * Body: { executada?: boolean } — atualiza o campo executada da transação.
 * Requer autenticação.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const executada = typeof body?.executada === 'boolean' ? body.executada : undefined
    if (executada === undefined) {
      return NextResponse.json(
        { message: 'Envie { executada: true | false }.' },
        { status: 400 },
      )
    }
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'transactions',
      id,
      data: { executada },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true, executada })
  } catch (e) {
    console.error('[api/dashboard/transactions/[id] PATCH]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao atualizar.' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/dashboard/transactions/[id]?deleteFutureFixed=true
 * Remove a transação. Se deleteFutureFixed=true e a transação tiver fixedExpenseGroupId,
 * remove também todas as transações do mesmo grupo com data >= desta.
 * Requer autenticação.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const { id } = await params
    const url = new URL(request.url)
    const deleteFutureFixed = url.searchParams.get('deleteFutureFixed') === 'true'

    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: 'transactions',
      id,
      overrideAccess: true,
    })

    if (!doc) {
      return NextResponse.json({ message: 'Transação não encontrada.' }, { status: 404 })
    }

    const groupId = doc.fixedExpenseGroupId as string | undefined
    const docDate = typeof doc.date === 'string' ? doc.date : null

    if (deleteFutureFixed && groupId && docDate) {
      const all = await payload.find({
        collection: 'transactions',
        where: {
          and: [
            { fixedExpenseGroupId: { equals: groupId } },
            { date: { greater_than_equal: docDate } },
          ],
        },
        limit: 500,
        pagination: false,
        overrideAccess: true,
      })
      const toDelete = all.docs ?? []
      for (const t of toDelete) {
        await payload.delete({
          collection: 'transactions',
          id: t.id,
          overrideAccess: true,
        })
      }
      return NextResponse.json({ deleted: toDelete.length })
    }

    await payload.delete({
      collection: 'transactions',
      id,
      overrideAccess: true,
    })
    return NextResponse.json({ deleted: 1 })
  } catch (e) {
    console.error('[api/dashboard/transactions/[id]]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao excluir.' },
      { status: 500 },
    )
  }
}
