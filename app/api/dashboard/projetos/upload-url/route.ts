import { NextResponse } from 'next/server'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { createSignedUploadUrl } from '@/lib/storage-server'
import { projectSlugSchema } from '@/lib/validation-schemas'

/**
 * POST /api/dashboard/projetos/upload-url
 * Body: { slug: string, filename: string }
 * Retorna signedUrl para o cliente fazer PUT do arquivo direto no Supabase (upload direto, sem limite 4 MB).
 * Requer admin ou editor.
 */
export async function POST(request: Request) {
  const user = await getDashboardUser()
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const slugResult = projectSlugSchema.safeParse(body?.slug)
    const filename =
      typeof body?.filename === 'string' && body.filename.length > 0
        ? body.filename.replace(/[/\\]/g, '').trim()
        : null

    if (!slugResult.success || !filename) {
      return NextResponse.json(
        {
          message: 'Envie slug (válido) e filename (nome do arquivo no storage).',
        },
        { status: 400 }
      )
    }

    const result = await createSignedUploadUrl(slugResult.data, filename)
    if (!result) {
      return NextResponse.json(
        {
          message:
            'Storage não configurado (R2 ou Supabase) ou erro ao gerar URL.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      signedUrl: result.signedUrl,
      path: result.path,
      publicUrl: result.publicUrl,
      filename,
    })
  } catch (e) {
    console.error('[api/dashboard/projetos/upload-url POST]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao gerar URL.' },
      { status: 500 }
    )
  }
}
