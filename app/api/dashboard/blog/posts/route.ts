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
      collection: 'posts',
      limit: 100,
      pagination: false,
      sort: '-publishedAt',
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json({ posts: result.docs })
  } catch (error) {
    console.error('[API] Erro ao buscar posts:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar posts' },
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

    // Normalizar conteúdo: Payload exige string; vazio ou inválido vira HTML mínimo
    const rawContent = body.content
    const content =
      typeof rawContent === 'string'
        ? rawContent.trim() || '<p></p>'
        : rawContent != null
          ? String(rawContent)
          : '<p></p>'

    // Autor: relationship exige ID válido; ignorar "none", null ou vazio e usar o usuário logado
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

    // Categoria: relationship exige ID; converter string numérica para number (PostgreSQL)
    const rawCategory = body.category
    const category =
      rawCategory != null && rawCategory !== '' && rawCategory !== 'none'
        ? typeof rawCategory === 'string' && /^\d+$/.test(rawCategory)
          ? parseInt(rawCategory, 10)
          : typeof rawCategory === 'number'
            ? rawCategory
            : rawCategory
        : null

    // coverImage: Payload espera ID numérico da collection media. Supabase retorna "supabase-..." — usar coverImageUrl.
    const rawCover = body.coverImage
    const isSupabaseCover =
      typeof rawCover === 'string' && rawCover.startsWith('supabase-')
    const coverImage = isSupabaseCover ? null : rawCover || null
    const coverImageUrl = isSupabaseCover ? body.coverImageUrl || null : null

    const post = await payload.create({
      collection: 'posts',
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content,
        status: body.status || 'draft',
        category,
        author,
        publishedAt: body.publishedAt || null,
        coverImage,
        ...(coverImageUrl != null && { coverImageUrl }),
      },
      overrideAccess: true,
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('[API] Erro ao criar post:', error)
    
    // Extrair mensagem de erro do Payload se disponível
    const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post'
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
