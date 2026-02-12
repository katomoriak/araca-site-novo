import { requireDashboardPermission } from '@/lib/dashboard-route-guard'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDashboardPermission('blog')
  return <>{children}</>
}
