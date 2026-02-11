import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'
import { deleteBlogMediaFromStorage } from '@/lib/supabase-server'

function resolveId(id: string | string[]): string {
  return Array.isArray(id) ? id.join('/') : id
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }
    const id = resolveId((await params).id)
    const payload = await getPayloadClient()

    if (id.startsWith('supabase-')) {
      const body = await request.json()
      return NextResponse.json({
        id,
        url: '',
        filename: '',
        alt: body.alt ?? '',
      })
    }

    const body = await request.json()
    const media = await payload.update({
      collection: 'media',
      id,
      data: { alt: body.alt },
      overrideAccess: true,
    })

    return NextResponse.json({
      id: media.id,
      url: media.url,
      filename: media.filename,
      alt: media.alt,
    })
  } catch (error) {
    console.error('[API] Erro ao atualizar mídia:', error)
    return NextResponse.json(
      { message: 'Erro ao atualizar mídia' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const user = await getDashboardUser()
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }
    const id = resolveId((await params).id)
    const payload = await getPayloadClient()

    if (id.startsWith('supabase-')) {
      const storagePath = id.slice('supabase-'.length)
      const ok = await deleteBlogMediaFromStorage(storagePath)
      if (!ok) {
        return NextResponse.json(
          { message: 'Erro ao excluir mídia do storage' },
          { status: 500 }
        )
      }
      return NextResponse.json({ message: 'Mídia excluída com sucesso' })
    }

    await payload.delete({
      collection: 'media',
      id,
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'Mídia excluída com sucesso' })
  } catch (error) {
    console.error('[API] Erro ao excluir mídia:', error)
    return NextResponse.json(
      { message: 'Erro ao excluir mídia' },
      { status: 500 }
    )
  }
}
