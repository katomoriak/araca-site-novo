import { SilkDynamic } from '@/components/dashboard/SilkDynamic'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { Suspense } from 'react'

/**
 * Layout da página de login do dashboard (/dashboard/login).
 * Mesmo fundo Silk do dashboard, sem sidebar.
 * Se já estiver autenticado, redireciona para o dashboard.
 */
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (token) {
    try {
      const payload = await getPayloadClient()
      const { user } = await payload.auth({
        headers: new Headers({ cookie: `payload-token=${token}` }),
      })
      const role = (user as { role?: string })?.role
      if (user && (role === 'admin' || role === 'editor')) {
        redirect('/dashboard')
      }
    } catch {
      // token inválido, mostrar login
    }
  }

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-[#E8E0D5]">
      <div className="pointer-events-none absolute inset-0">
        <SilkDynamic
          speed={5}
          scale={1}
          color="#E8E0D5"
          noiseIntensity={1.2}
          rotation={0}
        />
      </div>
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-4">
        <Suspense fallback={<div className="text-muted-foreground">Carregando…</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}
