/**
 * Layout raiz do segmento (dashboard).
 * Não exige autenticação aqui: a proteção fica em (dashboard)/dashboard/layout.tsx.
 * Rotas como /dashboard/login ficam sem guard; /dashboard/* exigem login.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
