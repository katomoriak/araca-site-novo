import { requireDashboardPermission } from '@/lib/dashboard-route-guard'

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDashboardPermission('users')
  return <>{children}</>
}
