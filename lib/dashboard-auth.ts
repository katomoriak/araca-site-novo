import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { canAccessDashboard, type UserWithPermissions } from '@/payload/access/permissions'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

export interface DashboardUser {
  id: string
  role?: string
  permissions?: string[]
}

/**
 * Valida cookie de autenticação e retorna o usuário se tiver acesso ao dashboard.
 * Admin tem acesso total; demais precisam de pelo menos uma permissão.
 */
export async function getDashboardUser(): Promise<DashboardUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value
  if (!token) return null

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `${PAYLOAD_TOKEN_COOKIE}=${token}` }),
    })
    if (!user) return null
    const u = user as UserWithPermissions
    if (!canAccessDashboard(u)) return null
    return {
      id: String(user.id),
      role: u.role,
      permissions: u.permissions ?? [],
    }
  } catch {
    return null
  }
}
