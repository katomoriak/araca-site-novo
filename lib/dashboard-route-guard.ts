import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { hasPermission, type Permission, type UserWithPermissions } from '@/payload/access/permissions'

/**
 * Garante que o usuário tenha a permissão especificada para a rota.
 * Redireciona para /dashboard se não tiver permissão.
 * Retorna o usuário para uso opcional.
 */
export async function requireDashboardPermission(
  permission: Permission
): Promise<UserWithPermissions> {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: await headers(),
    })
    if (!user) redirect('/dashboard/login')
    const u = user as UserWithPermissions
    if (!hasPermission(u, permission)) {
      redirect('/dashboard?error=forbidden')
    }
    return u
  } catch {
    redirect('/dashboard/login')
  }
}
