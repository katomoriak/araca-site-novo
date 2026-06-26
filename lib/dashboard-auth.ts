import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { canAccessDashboard, type UserWithPermissions } from '@/payload/access/permissions'

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
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: await headers(),
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
