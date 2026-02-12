import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { createClient } from '@supabase/supabase-js'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { uploadBlogFile, isR2Configured } from '@/lib/storage-server'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4 MB (compatível com Vercel serverless)

export async function POST(request: NextRequest) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json(
        { message: 'Não autenticado. Faça login no painel de administração.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'Imagem muito grande (máximo 4 MB)' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg'
    const fileName = `blog/${timestamp}-${randomStr}.${safeExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (isR2Configured()) {
      const result = await uploadBlogFile(fileName, buffer, file.type)
      if (result) {
        return NextResponse.json({
          url: result.publicUrl,
          filename: fileName,
          alt: file.name,
        })
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })

      const { error } = await supabase.storage
        .from('media')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error('[Supabase] Erro no upload:', error)
        const msg =
          error.message?.includes('Bucket') || error.message?.includes('bucket')
            ? 'Bucket "media" não encontrado. Crie no Supabase: Storage → New bucket → "media" (público).'
            : error.message || 'Falha no Supabase Storage'
        return NextResponse.json({ message: msg }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        filename: fileName,
        alt: file.name,
      })
    }

    // Fallback: Payload (Vercel Blob ou S3)
    const payload = await getPayloadClient()
    const media = await payload.create({
      collection: 'media',
      data: { alt: file.name },
      file: file as never,
      overrideAccess: true,
    })

    const url = typeof media.url === 'string' ? media.url : ''
    return NextResponse.json({
      url,
      id: media.id,
      alt: media.alt,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[API] Erro ao fazer upload:', msg)
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === 'development'
            ? msg
            : 'Erro ao fazer upload da imagem',
      },
      { status: 500 }
    )
  }
}
