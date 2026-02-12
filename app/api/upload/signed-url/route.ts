import { NextRequest, NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { createSignedUploadUrlForBlog } from '@/lib/storage-server'

/**
 * POST /api/upload/signed-url
 * Body: { filename: string }
 * Retorna signedUrl para o cliente fazer PUT direto no R2/Supabase (sem limite de tamanho).
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
            'Storage não configurado. Configure R2 (NEXT_PUBLIC_R2_PUBLIC_URL + S3_*) ou Supabase (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).',
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
