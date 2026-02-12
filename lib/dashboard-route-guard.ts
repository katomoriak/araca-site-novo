import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { hasPermission, type Permission, type UserWithPermissions } from '@/payload/access/permissions'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

/**
 * Garante que o usuário tenha a permissão especificada para a rota.
 * Redireciona para /dashboard se não tiver permissão.
 * Retorna o usuário para uso opcional.
 */
export async function requireDashboardPermission(
  permission: Permission
): Promise<UserWithPermissions> {
  const cookieStore = await cookies()
  const token = cookieStore.get(PAYLOAD_TOKEN_COOKIE)?.value
  if (!token) redirect('/dashboard/login')

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `${PAYLOAD_TOKEN_COOKIE}=${token}` }),
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
