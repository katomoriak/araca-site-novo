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
      collection: 'categories',
      limit: 100,
      pagination: false,
      sort: 'name',
      overrideAccess: true,
    })

    return NextResponse.json({ categories: result.docs })
  } catch (error) {
    console.error('[API] Erro ao buscar categorias:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar categorias' },
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
    
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        color: body.color || '#3B82F6',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('[API] Erro ao criar categoria:', error)
    return NextResponse.json(
      { message: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
