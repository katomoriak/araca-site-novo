import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import type { PayloadTransaction } from '@/lib/payload'
import { cookies } from 'next/headers'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

/**
 * GET /api/dashboard/transactions
 * Retorna todas as transações (para o dashboard financeiro). Requer autenticação.
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'transactions',
      sort: '-date',
      limit: 500,
      pagination: false,
      overrideAccess: true,
    })
    const docs = (result.docs ?? []) as PayloadTransaction[]
    return NextResponse.json(docs)
  } catch (e) {
    console.error('[api/dashboard/transactions GET]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao listar transações.' },
      { status: 500 },
    )
  }
}

function nextMonth(date: Date): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * POST /api/dashboard/transactions
 * Body: { type, description, amount, date, category?, fixedExpense?: boolean }
 * Se fixedExpense === true, cria esta transação + 11 parcelas mensais (mesmo grupo), para receita ou despesa.
 * Requer autenticação (cookie payload-token).
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const type = body?.type === 'income' || body?.type === 'expense' ? body.type : null
    const description = typeof body?.description === 'string' ? body.description.trim() : ''
    const amount = Number(body?.amount)
    const dateStr = typeof body?.date === 'string' ? body.date : null
    const category = typeof body?.category === 'string' ? body.category.trim() || undefined : undefined
    const fixedRecurring = body?.fixedExpense === true

    if (!type || !description || Number.isNaN(amount) || amount <= 0 || !dateStr) {
      return NextResponse.json(
        { message: 'Dados inválidos. Envie type, description, amount e date.' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const baseDate = new Date(dateStr)
    if (Number.isNaN(baseDate.getTime())) {
      return NextResponse.json({ message: 'Data inválida.' }, { status: 400 })
    }

    if (fixedRecurring) {
      const groupId = crypto.randomUUID()
      const docs: { id: string }[] = []
      let d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
      for (let i = 0; i < 12; i++) {
        const doc = await payload.create({
          collection: 'transactions',
          data: {
            type,
            description,
            amount,
            date: toISODate(d),
            category,
            fixedExpenseGroupId: groupId,
          },
          overrideAccess: true,
        })
        docs.push({ id: String(doc.id) })
        d = nextMonth(d)
      }
      return NextResponse.json({ doc: docs[0], created: docs.length, fixedExpenseGroupId: groupId })
    }

    const doc = await payload.create({
      collection: 'transactions',
      data: {
        type,
        description,
        amount,
        date: dateStr,
        category,
      },
      overrideAccess: true,
    })
    return NextResponse.json({ doc: { id: String(doc.id) } })
  } catch (e) {
    console.error('[api/dashboard/transactions]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao criar transação.' },
      { status: 500 },
    )
  }
}
