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

    // Buscar post
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (!result.docs[0]) {
      return NextResponse.json({ message: 'Post não encontrado' }, { status: 404 })
    }

    const body = await request.json()

    const rawContent = body.content
    const content =
      typeof rawContent === 'string'
        ? rawContent.trim() || '<p></p>'
        : rawContent != null
          ? String(rawContent)
          : undefined

    // PostgreSQL usa IDs numéricos — converter string numérica para number para evitar ValidationError
    const rawAuthor = body.author
    const rawId =
      rawAuthor != null && rawAuthor !== '' && rawAuthor !== 'none'
        ? rawAuthor
        : user.id
    const author =
      typeof rawId === 'string' && /^\d+$/.test(rawId)
        ? parseInt(rawId, 10)
        : typeof rawId === 'number'
          ? rawId
          : rawId

    // Categoria: converter string numérica para number (PostgreSQL), igual ao autor
    const rawCategory = body.category
    const category =
      rawCategory != null && rawCategory !== '' && rawCategory !== 'none'
        ? typeof rawCategory === 'string' && /^\d+$/.test(rawCategory)
          ? parseInt(rawCategory, 10)
          : typeof rawCategory === 'number'
            ? rawCategory
            : rawCategory
        : null

    // coverImage: Payload espera ID numérico. Supabase retorna "supabase-..." — usar coverImageUrl.
    const rawCover = body.coverImage
    const isSupabaseCover =
      typeof rawCover === 'string' && rawCover.startsWith('supabase-')
    const coverImage = isSupabaseCover ? null : (rawCover ?? null)
    const coverImageUrl = isSupabaseCover ? body.coverImageUrl ?? null : null
    const coverUpdate =
      coverImageUrl != null
        ? { coverImage, coverImageUrl }
        : { coverImage, coverImageUrl: null }

    const post = await payload.update({
      collection: 'posts',
      id: result.docs[0].id,
      data: {
        title: body.title,
        excerpt: body.excerpt,
        metaDescription: body.metaDescription != null ? (String(body.metaDescription).trim() || null) : undefined,
        ...(content !== undefined && { content }),
        status: body.status,
        category,
        author,
        publishedAt: body.publishedAt ?? null,
        ...coverUpdate,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('[API] Erro ao atualizar post:', error)
    
    // Extrair mensagem de erro do Payload se disponível
    const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar post'
    
    return NextResponse.json(
      { message: errorMessage },
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

    // Buscar post
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (!result.docs[0]) {
      return NextResponse.json({ message: 'Post não encontrado' }, { status: 404 })
    }

    await payload.delete({
      collection: 'posts',
      id: result.docs[0].id,
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'Post deletado com sucesso' })
  } catch (error) {
    console.error('[API] Erro ao deletar post:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar post' },
      { status: 500 }
    )
  }
}
