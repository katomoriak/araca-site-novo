'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

/** Destinos permitidos após login (evita open redirect e redirecionamento para rotas sensíveis). */
const ALLOWED_REDIRECT_PREFIXES = ['/dashboard', '/admin']

/** Permite apenas redirecionamento para /dashboard ou /admin (evita open redirect). */
function safeRedirectTarget(value: string | null): string {
  if (!value || typeof value !== 'string') return '/dashboard'
  const trimmed = value.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/dashboard'
  const allowed = ALLOWED_REDIRECT_PREFIXES.some((p) => trimmed === p || trimmed.startsWith(p + '/'))
  return allowed ? trimmed : '/dashboard'
}

export default function DashboardLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeRedirectTarget(searchParams.get('redirect'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.errors?.[0]?.message ?? data.message ?? 'E-mail ou senha inválidos.')
        setLoading(false)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm border-border/50 bg-white/90 shadow-lg backdrop-blur-sm dark:bg-background/90">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">Entrar no dashboard</CardTitle>
        <CardDescription>
          Use suas credenciais do painel para acessar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
