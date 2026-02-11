/**
 * Layout raiz do segmento /dashboard.
 * Não exige auth aqui: a proteção fica em (authenticated)/layout.tsx.
 * Rotas /dashboard/login e /dashboard são irmãs; apenas as que estão em
 * (authenticated) exigem login.
 */
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
