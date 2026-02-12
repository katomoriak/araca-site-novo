import { requireDashboardPermission } from '@/lib/dashboard-route-guard'

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDashboardPermission('finance')
  return <>{children}</>
}
