import { requireDashboardPermission } from '@/lib/dashboard-route-guard'

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDashboardPermission('crm')
  return <>{children}</>
}
