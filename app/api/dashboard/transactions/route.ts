import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import type { PayloadTransaction } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { transactionSchema, validateWithSchema } from '@/lib/validation-schemas'
import { handleApiError, authenticationError, validationError } from '@/lib/error-handler'

/**
 * GET /api/dashboard/transactions
 * Retorna todas as transações (para o dashboard financeiro). Requer admin/editor.
 */
export async function GET() {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'transactions',
      sort: '-date',
      limit: 500,
      pagination: false,
      // overrideAccess necessário: rota já protegida por proxy + cookie check
      // Precisa acessar todas as transações para o dashboard financeiro
      overrideAccess: true,
    })
    const docs = (result.docs ?? []) as PayloadTransaction[]
    return NextResponse.json(docs)
  } catch (e) {
    return handleApiError(e, 'api/dashboard/transactions/GET')
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
 * Requer admin/editor (getDashboardUser).
 */
export async function POST(request: Request) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return authenticationError('Não autorizado.', 'api/dashboard/transactions/POST')
    }

    const body = await request.json().catch(() => ({}))
    
    // Validação robusta com Zod
    const validation = validateWithSchema(transactionSchema, body)
    if (!validation.success) {
      return validationError('Dados inválidos.', validation.errors, 'api/dashboard/transactions/POST')
    }

    const { type, description, amount, date: dateStr, category, fixedExpense: fixedRecurring } = validation.data

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
          // overrideAccess necessário: rota já protegida por proxy + cookie check
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
      // overrideAccess necessário: rota já protegida por proxy + cookie check
      overrideAccess: true,
    })
    return NextResponse.json({ doc: { id: String(doc.id) } })
  } catch (e) {
    return handleApiError(e, 'api/dashboard/transactions/POST')
  }
}
