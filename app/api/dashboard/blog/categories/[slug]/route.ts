import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }
    const { slug } = await params
    const payload = await getPayloadClient()

    // Buscar categoria
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (!result.docs[0]) {
      return NextResponse.json({ message: 'Categoria não encontrada' }, { status: 404 })
    }

    const body = await request.json()
    
    const category = await payload.update({
      collection: 'categories',
      id: result.docs[0].id,
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('[API] Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { message: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }
    const { slug } = await params
    const payload = await getPayloadClient()

    // Buscar categoria
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (!result.docs[0]) {
      return NextResponse.json({ message: 'Categoria não encontrada' }, { status: 404 })
    }

    await payload.delete({
      collection: 'categories',
      id: result.docs[0].id,
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'Categoria deletada com sucesso' })
  } catch (error) {
    console.error('[API] Erro ao deletar categoria:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar categoria' },
      { status: 500 }
    )
  }
}
