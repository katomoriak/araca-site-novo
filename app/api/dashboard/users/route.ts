import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'

const PERMISSIONS = ['blog', 'finance', 'crm', 'projetos', 'users'] as const

function canManageUsers(user: { role?: string; permissions?: string[] }): boolean {
    if (user.role === 'admin') return true
    return Array.isArray(user.permissions) && user.permissions.includes('users')
}

/**
 * POST /api/dashboard/users
 * Cria um novo usuário. Requer permissão "users" ou admin.
 */
export async function POST(request: Request) {
    const currentUser = await getDashboardUser()
    if (!currentUser || !canManageUsers(currentUser)) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    try {
        const body = await request.json().catch(() => ({}))
        const name = typeof body.name === 'string' ? body.name.trim() : undefined
        const email = typeof body.email === 'string' ? body.email.trim() : undefined
        const password = typeof body.password === 'string' ? body.password : undefined
        const role = body.role === 'admin' || body.role === 'editor' ? body.role : 'editor'
        const permissions =
            Array.isArray(body.permissions) &&
                body.permissions.every((p: unknown) => typeof p === 'string' && PERMISSIONS.includes(p as (typeof PERMISSIONS)[number]))
                ? (body.permissions as string[])
                : []
        const showAsPublicAuthor =
            typeof body.showAsPublicAuthor === 'boolean' ? body.showAsPublicAuthor : false
        const avatar = typeof body.avatar === 'string' ? body.avatar : undefined

        if (!email || !password || !name) {
            return NextResponse.json({ message: 'Nome, E-mail e Senha são obrigatórios.' }, { status: 400 })
        }

        if (role === 'admin' && currentUser.role !== 'admin') {
            return NextResponse.json(
                { message: 'Apenas administradores podem criar novos admins.' },
                { status: 403 },
            )
        }

        const payload = await getPayloadClient()

        // Check if email already exists
        const existing = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
            overrideAccess: true,
        })

        if (existing.totalDocs > 0) {
            return NextResponse.json({ message: 'E-mail já está em uso.' }, { status: 400 })
        }

        await payload.create({
            collection: 'users',
            data: {
                name,
                email,
                password,
                role,
                permissions: role === 'editor' ? permissions : undefined,
                showAsPublicAuthor,
                avatarUrl: avatar,
            },
            overrideAccess: true,
        })

        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('[api/dashboard/users POST]', e)
        return NextResponse.json(
            { message: e instanceof Error ? e.message : 'Erro ao criar usuário.' },
            { status: 500 },
        )
    }
}
