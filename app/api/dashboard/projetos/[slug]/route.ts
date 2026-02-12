import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { projetoUpdateSchema, validateWithSchema } from '@/lib/validation-schemas'

/**
 * GET /api/dashboard/projetos/[slug]
 * Retorna um projeto por slug. Requer admin ou editor.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = result.docs?.[0]
    if (!doc) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 })
    }
    return NextResponse.json(doc)
  } catch (e) {
    console.error('[api/dashboard/projetos/[slug] GET]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao buscar.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/dashboard/projetos/[slug]
 * Atualiza projeto. Body parcial: title?, description?, tag?, cover?, media?.
 * Requer admin ou editor. Revalida a home após salvar.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { slug } = await params
  try {
    const body = await request.json().catch(() => ({}))
    const validation = validateWithSchema(projetoUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Dados inválidos.', errors: validation.errors },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'projetos',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = existing.docs?.[0]
    if (!doc) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (validation.data.title !== undefined) data.title = validation.data.title
    if (validation.data.description !== undefined)
      data.description = validation.data.description
    if (validation.data.tag !== undefined) data.tag = validation.data.tag
    if (validation.data.showOnHome !== undefined) data.showOnHome = validation.data.showOnHome
    if (validation.data.showOnProjectsPage !== undefined)
      data.showOnProjectsPage = validation.data.showOnProjectsPage
    if (validation.data.cover !== undefined) data.cover = validation.data.cover
    if (validation.data.media !== undefined) data.media = validation.data.media

    const updated = await payload.update({
      collection: 'projetos',
      id: doc.id,
      data,
      overrideAccess: true,
    })

    const { revalidatePath, revalidateTag } = await import('next/cache')
    revalidatePath('/', 'layout')
    revalidateTag('projetos-home', 'max')

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[api/dashboard/projetos/[slug] PATCH]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao atualizar.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dashboard/projetos/[slug]
 * Exclui o projeto. Requer admin ou editor. Os arquivos no storage da pasta não são removidos.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projetos',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = result.docs?.[0]
    if (!doc) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 })
    }

    await payload.delete({
      collection: 'projetos',
      id: doc.id,
      overrideAccess: true,
    })

    const { revalidatePath, revalidateTag } = await import('next/cache')
    revalidatePath('/', 'layout')
    revalidateTag('projetos-home', 'max')

    return NextResponse.json({ success: true, message: 'Pasta excluída.' })
  } catch (e) {
    console.error('[api/dashboard/projetos/[slug] DELETE]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao excluir.' },
      { status: 500 }
    )
  }
}
