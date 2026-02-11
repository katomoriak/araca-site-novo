import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

/**
 * Layout das páginas internas do dashboard (requer autenticação).
 * Valida token Payload no servidor; redireciona para /dashboard/login se não autenticado.
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

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({
      headers: new Headers({ cookie: `payload-token=${token}` }),
    })

    if (!user) {
      redirect('/dashboard/login')
    }

    const role = (user as { role?: string })?.role
    if (role !== 'admin' && role !== 'editor') {
      redirect('/dashboard/login')
    }
  } catch (error) {
    console.error('[dashboard/(authenticated)/layout] Auth failed:', error instanceof Error ? error.message : 'Unknown')
    redirect('/dashboard/login')
  }

  return <DashboardShell>{children}</DashboardShell>
}
