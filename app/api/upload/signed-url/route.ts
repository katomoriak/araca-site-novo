import { NextRequest, NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { createSignedUploadUrlForBlog } from '@/lib/supabase-server'

/**
 * POST /api/upload/signed-url
 * Body: { filename: string }
 * Retorna signedUrl para o cliente fazer PUT direto no Supabase (sem limite de tamanho).
 * Usado para imagens do conteúdo do blog.
 */
export async function POST(request: NextRequest) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json(
      { message: 'Não autenticado. Faça login no painel de administração.' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const filename =
      typeof body?.filename === 'string' && body.filename.trim().length > 0
        ? body.filename.replace(/[/\\]/g, '').trim()
        : null

    if (!filename) {
      return NextResponse.json(
        { message: 'Envie filename no corpo da requisição.' },
        { status: 400 }
      )
    }

    const result = await createSignedUploadUrlForBlog(filename)
    if (!result) {
      return NextResponse.json(
        {
          message:
            'Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY). ' +
            'Crie o bucket "media" no Supabase Storage (público).',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      signedUrl: result.signedUrl,
      publicUrl: result.publicUrl,
    })
  } catch (e) {
    console.error('[api/upload/signed-url]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao gerar URL.' },
      { status: 500 }
    )
  }
}
