import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { projetoCreateSchema, validateWithSchema } from '@/lib/validation-schemas'

/**
 * GET /api/dashboard/projetos
 * Lista todos os projetos (Payload). Requer admin ou editor.
 */
export async function GET() {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      limit: 100,
      pagination: false,
      sort: 'slug',
      overrideAccess: true,
    })
    return NextResponse.json(result.docs ?? [])
  } catch (e) {
    console.error('[api/dashboard/projetos GET]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao listar.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/projetos
 * Cria um novo projeto. Body: slug, title, description?, tag?, cover, media[].
 * Requer admin ou editor.
 */
export async function POST(request: Request) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const validation = validateWithSchema(projetoCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Dados inválidos.', errors: validation.errors },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'projetos',
      where: { slug: { equals: validation.data.slug } },
      limit: 1,
    })
    if ((existing.docs?.length ?? 0) > 0) {
      return NextResponse.json(
        { message: 'Já existe um projeto com este slug.' },
        { status: 409 }
      )
    }

    const doc = await payload.create({
      collection: 'projetos',
      data: {
        slug: validation.data.slug,
        title: validation.data.title,
        description: validation.data.description ?? '',
        tag: validation.data.tag ?? '',
        cover: validation.data.cover,
        media: validation.data.media,
      },
      overrideAccess: true,
    })

    const { revalidatePath, revalidateTag } = await import('next/cache')
    revalidatePath('/', 'layout')
    revalidateTag('projetos-home', 'max')

    return NextResponse.json(doc)
  } catch (e) {
    console.error('[api/dashboard/projetos POST]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao criar.' },
      { status: 500 }
    )
  }
}
