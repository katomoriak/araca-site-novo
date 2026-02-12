import { requireDashboardPermission } from '@/lib/dashboard-route-guard'

export default async function ProjetosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDashboardPermission('projetos')
  return <>{children}</>
}
