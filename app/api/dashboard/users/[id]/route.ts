import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getDashboardUser } from '@/lib/dashboard-auth'

const PERMISSIONS = ['blog', 'finance', 'crm', 'projetos', 'users'] as const

function canManageUsers(user: { role?: string; permissions?: string[] }): boolean {
  if (user.role === 'admin') return true
  return Array.isArray(user.permissions) && user.permissions.includes('users')
}

/**
 * GET /api/dashboard/users/[id]
 * Retorna um usuário por ID (campos editáveis). Requer permissão "users" ou admin.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getDashboardUser()
  if (!currentUser || !canManageUsers(currentUser)) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: 'users',
      id,
      depth: 1,
      overrideAccess: true,
    })
    if (!doc) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 })
    }
    const user = doc as {
      id: string
      name?: string | null
      email: string
      role?: string | null
      permissions?: string[] | null
      showAsPublicAuthor?: boolean | null
      title?: string | null
      bio?: string | null
      avatarUrl?: string | null
    }
    return NextResponse.json({
      id: user.id,
      name: user.name ?? '',
      email: user.email,
      role: user.role ?? 'editor',
      permissions: user.permissions ?? [],
      showAsPublicAuthor: user.showAsPublicAuthor ?? false,
      title: user.title ?? '',
      bio: user.bio ?? '',
      avatarId: null,
      avatarUrl: typeof user.avatarUrl === 'string' ? user.avatarUrl : null,
    })
  } catch (e) {
    console.error('[api/dashboard/users/[id] GET]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao buscar usuário.' },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/dashboard/users/[id]
 * Atualiza dados do usuário: name, email, password, role, permissions, showAsPublicAuthor, title, bio.
 * Requer permissão "users" ou admin. Admin não pode ser rebaixado por editor.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getDashboardUser()
  if (!currentUser || !canManageUsers(currentUser)) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await request.json().catch(() => ({}))
    const name = typeof body.name === 'string' ? body.name.trim() : undefined
    const email = typeof body.email === 'string' ? body.email.trim() : undefined
    const password = typeof body.password === 'string' && body.password.length > 0 ? body.password : undefined
    const role = body.role === 'admin' || body.role === 'editor' ? body.role : undefined
    const permissions =
      Array.isArray(body.permissions) &&
        body.permissions.every((p: unknown) => typeof p === 'string' && PERMISSIONS.includes(p as (typeof PERMISSIONS)[number]))
        ? (body.permissions as string[])
        : undefined
    const showAsPublicAuthor =
      typeof body.showAsPublicAuthor === 'boolean' ? body.showAsPublicAuthor : undefined
    const title = typeof body.title === 'string' ? body.title.trim() : undefined
    const bio = typeof body.bio === 'string' ? body.bio : undefined
    const avatar = typeof body.avatar === 'string' || body.avatar === null ? body.avatar : undefined

    const payload = await getPayloadClient()
    const existing = await payload.findByID({
      collection: 'users',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!existing) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 })
    }

    const existingRole = (existing as { role?: string }).role
    if (
      currentUser.role !== 'admin' &&
      existingRole === 'admin'
    ) {
      return NextResponse.json(
        { message: 'Apenas administradores podem editar outros admins.' },
        { status: 403 },
      )
    }
    if (role === 'admin' && currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Apenas administradores podem atribuir a função Admin.' },
        { status: 403 },
      )
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (email !== undefined) data.email = email
    if (password !== undefined) data.password = password
    if (role !== undefined) data.role = role
    if (permissions !== undefined) data.permissions = permissions
    if (showAsPublicAuthor !== undefined) data.showAsPublicAuthor = showAsPublicAuthor
    if (title !== undefined) data.title = title
    if (bio !== undefined) data.bio = bio
    if (avatar !== undefined) data.avatarUrl = avatar

    await payload.update({
      collection: 'users',
      id,
      data,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[api/dashboard/users/[id] PATCH]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao atualizar usuário.' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/dashboard/users/[id]
 * Exclui um usuário. Requer permissão "users" ou admin.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = await getDashboardUser()
  if (!currentUser || !canManageUsers(currentUser)) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const { id } = await params
  try {
    const payload = await getPayloadClient()

    // Check if user exists and permissions
    const existing = await payload.findByID({
      collection: 'users',
      id,
      depth: 0,
      overrideAccess: true,
    })

    if (!existing) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 })
    }

    // Prevent deleting yourself
    if (existing.id === currentUser.id) {
      return NextResponse.json({ message: 'Você não pode excluir a si mesmo.' }, { status: 403 })
    }

    const existingRole = (existing as { role?: string }).role
    if (
      currentUser.role !== 'admin' &&
      existingRole === 'admin'
    ) {
      return NextResponse.json(
        { message: 'Apenas administradores podem excluir outros admins.' },
        { status: 403 },
      )
    }

    await payload.delete({
      collection: 'users',
      id,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[api/dashboard/users/[id] DELETE]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Erro ao excluir usuário.' },
      { status: 500 },
    )
  }
}
