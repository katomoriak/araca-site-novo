import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'

type Params = {
    params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        const { slug } = await params
        const payload = await getPayloadClient()
        const result = await payload.find({
            collection: 'business-cards',
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1,
            overrideAccess: true,
        })

        if (!result.docs.length) {
            return NextResponse.json({ message: 'Cartão não encontrado' }, { status: 404 })
        }

        return NextResponse.json({ businessCard: result.docs[0] })
    } catch (error) {
        console.error('[API] Erro ao buscar cartão:', error)
        return NextResponse.json(
            { message: 'Erro ao buscar cartão' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        const { slug } = await params
        const payload = await getPayloadClient()
        const body = await request.json()

        // Buscar ID pelo slug original
        const result = await payload.find({
            collection: 'business-cards',
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: true,
        })

        if (!result.docs.length) {
            return NextResponse.json({ message: 'Cartão não encontrado' }, { status: 404 })
        }

        const cardId = result.docs[0].id

        const dataToUpdate = { ...body }
        if (dataToUpdate.user) {
            dataToUpdate.user = typeof dataToUpdate.user === 'string' && /^\d+$/.test(dataToUpdate.user)
                ? parseInt(dataToUpdate.user, 10)
                : dataToUpdate.user
        }

        const updated = await payload.update({
            collection: 'business-cards',
            id: cardId,
            data: dataToUpdate,
            overrideAccess: true,
        })

        return NextResponse.json({ businessCard: updated })
    } catch (error) {
        console.error('[API] Erro ao atualizar cartão:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar cartão'
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        const { slug } = await params
        const payload = await getPayloadClient()

        // Buscar ID pelo slug
        const result = await payload.find({
            collection: 'business-cards',
            where: { slug: { equals: slug } },
            limit: 1,
            overrideAccess: true,
        })

        if (!result.docs.length) {
            return NextResponse.json({ message: 'Cartão não encontrado' }, { status: 404 })
        }

        await payload.delete({
            collection: 'business-cards',
            id: result.docs[0].id,
            overrideAccess: true,
        })

        return NextResponse.json({ message: 'Cartão excluído com sucesso' })
    } catch (error) {
        console.error('[API] Erro ao excluir cartão:', error)
        return NextResponse.json(
            { message: 'Erro ao excluir cartão' },
            { status: 500 }
        )
    }
}
