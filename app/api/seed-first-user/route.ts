/**
 * POST /api/seed-first-user
 *
 * Cria o primeiro usuário admin do Payload.
 * Só funciona quando a coleção users está vazia.
 *
 * Body: { email: string, password: string, name?: string }
 *
 * Uso (com servidor rodando):
 *   curl -X POST http://localhost:3000/api/seed-first-user \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@example.com","password":"suaSenha123","name":"Admin"}'
 *
 * Em produção: remova ou desabilite esta rota após criar o primeiro usuário.
 */
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : 'Admin'

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Informe email e password no body JSON.' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'users',
      limit: 1,
      pagination: false,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Já existem usuários. Use o login em /dashboard/login' },
        { status: 400 }
      )
    }

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name: name || 'Admin',
        role: 'admin',
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      message: 'Primeiro usuário admin criado com sucesso.',
      email,
    })
  } catch (err) {
    console.error('[seed-first-user]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao criar usuário.' },
      { status: 500 }
    )
  }
}
