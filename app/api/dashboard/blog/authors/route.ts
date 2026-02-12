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
      collection: 'users',
      where: { showAsPublicAuthor: { equals: true } },
      limit: 100,
      pagination: false,
      sort: 'name',
      overrideAccess: true,
    })

    return NextResponse.json({ authors: result.docs })
  } catch (error) {
    console.error('[API] Erro ao buscar autores:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar autores' },
      { status: 500 }
    )
  }
}
