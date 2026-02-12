import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { canAccessDashboard, type UserWithPermissions } from '@/payload/access/permissions'

/**
 * Layout das páginas internas do dashboard (requer autenticação).
 * Valida token Payload no servidor; redireciona para /dashboard/login se não autenticado.
 * Admin tem acesso total; demais precisam de pelo menos uma permissão.
 */
export default async function DashboardInnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/dashboard/login')
  }

  let dashboardUser: { id: string; role?: string; permissions?: string[] } | null = null

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })

    if (!user) {
      redirect('/dashboard/login')
    }

    const u = user as UserWithPermissions
    if (!canAccessDashboard(u)) {
      redirect('/dashboard/login')
    }

    dashboardUser = {
      id: String(user.id),
      role: u.role,
      permissions: u.permissions ?? [],
    }
  } catch (error) {
    console.error('[dashboard/(authenticated)/layout] Auth failed:', error instanceof Error ? error.message : 'Unknown')
    redirect('/dashboard/login')
  }

  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>
}
