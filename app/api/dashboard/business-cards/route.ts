import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'

export async function GET(request: NextRequest) {
    try {
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        const payload = await getPayloadClient()
        const result = await payload.find({
            collection: 'business-cards',
            limit: 100,
            pagination: false,
            sort: 'slug',
            depth: 1,
            overrideAccess: true,
        })

        return NextResponse.json({ businessCards: result.docs })
    } catch (error) {
        console.error('[API] Erro ao buscar cartões de visita:', error)
        return NextResponse.json(
            { message: 'Erro ao buscar cartões de visita' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        const payload = await getPayloadClient()
        const body = await request.json()

        // Validação simples
        if (!body.slug || !body.user) {
            return NextResponse.json({ message: 'Slug e Usuário são obrigatórios.' }, { status: 400 })
        }

        const rawUser = body.user
        const userId = typeof rawUser === 'string' && /^\d+$/.test(rawUser)
            ? parseInt(rawUser, 10)
            : rawUser

        const card = await payload.create({
            collection: 'business-cards',
            data: {
                slug: body.slug,
                user: userId,
                name: body.name || null,
                role: body.role || null,
                email: body.email || null,
                phone: body.phone || null,
                address: body.address || 'Santo André - SP • Aracá Interiores',
            },
            overrideAccess: true,
        })

        return NextResponse.json({ businessCard: card }, { status: 201 })
    } catch (error) {
        console.error('[API] Erro ao criar cartão de visita:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar cartão de visita'
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        )
    }
}
