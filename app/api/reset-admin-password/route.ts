/**
 * POST /api/reset-admin-password
 *
 * Redefine a senha de um usuário (admin ou editor) pelo email.
 * Use quando tiver perdido a senha do único admin.
 *
 * Segurança: exige o header X-Reset-Admin-Secret igual a RESET_ADMIN_SECRET.
 * Em produção: defina RESET_ADMIN_SECRET no ambiente; se não estiver definido, a rota retorna 503.
 *
 * Body: { email: string, password: string }
 *
 * Uso (com servidor rodando):
 *   curl -X POST http://localhost:3000/api/reset-admin-password \
 *     -H "Content-Type: application/json" \
 *     -H "X-Reset-Admin-Secret: seu-token-secreto" \
 *     -d '{"email":"admin@example.com","password":"NovaSenha123"}'
 */
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const RESET_SECRET = process.env.RESET_ADMIN_SECRET

export async function POST(request: Request) {
  try {
    if (!RESET_SECRET) {
      return NextResponse.json(
        { error: 'Rota de reset desativada. Defina RESET_ADMIN_SECRET no servidor para usar.' },
        { status: 503 }
      )
    }

    const secret = request.headers.get('X-Reset-Admin-Secret')
    if (secret !== RESET_SECRET) {
      return NextResponse.json(
        { error: 'Secret inválido.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Informe email e password no body JSON.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 8 caracteres.' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      pagination: false,
    })

    const user = result.docs[0]
    if (!user) {
      return NextResponse.json(
        { error: 'Nenhum usuário encontrado com este email.' },
        { status: 404 }
      )
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { password },
      overrideAccess: true,
    })

    return NextResponse.json({
      message: 'Senha alterada com sucesso.',
      email: user.email,
    })
  } catch (err) {
    console.error('[reset-admin-password]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao redefinir senha.' },
      { status: 500 }
    )
  }
}
