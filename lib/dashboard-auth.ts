import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

export interface DashboardUser {
  id: string
  role: string
}

/**
 * Valida cookie de autenticação e retorna o usuário se for admin ou editor.
 * Use nas API routes do dashboard. Retorna null se não autenticado ou sem permissão.
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
    const role = (user as { role?: string })?.role
    if (role !== 'admin' && role !== 'editor') return null
    return { id: String(user.id), role }
  } catch {
    return null
  }
}
