'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, Lock, Mail, Eye, EyeOff } from 'lucide-react'

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
  const searchParams = useSearchParams()
  const redirectTo = safeRedirectTarget(searchParams.get('redirect'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

      // Login efetuado com sucesso!
      setSuccess(true)
      setLoading(false)

      // Redirecionamento completo do navegador para evitar o Router Cache do Next.js
      setTimeout(() => {
        window.location.href = redirectTo
      }, 1500)
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <Card className="relative overflow-hidden w-full border border-white/20 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-2xl rounded-2xl transition-all duration-300">
        {/* Barra superior de gradiente brilhante decorativa */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground dark:text-white">
                  Entrar no dashboard
                </CardTitle>
                <CardDescription className="text-muted-foreground/90">
                  Use suas credenciais do painel para acessar.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Banner de erro animado */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      E-mail
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-9 bg-white/20 dark:bg-black/20 border-white/10 dark:border-white/5 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 focus:bg-white/40 focus:dark:bg-black/40 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Senha
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-9 pr-10 bg-white/20 dark:bg-black/20 border-white/10 dark:border-white/5 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 focus:bg-white/40 focus:dark:bg-black/40 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 py-2.5 rounded-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Entrando…</span>
                        </>
                      ) : (
                        <span>Entrar</span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
            >
              {/* Círculo com checkmark animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500"
              >
                {/* Efeito de ripple pulsante */}
                <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                <CheckCircle2 className="h-10 w-10 relative z-10" />
              </motion.div>

              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground dark:text-white mb-2"
              >
                Acesso Autorizado!
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground max-w-[250px] mb-6"
              >
                Autenticado com sucesso. Redirecionando para o seu painel de controle...
              </motion.p>

              {/* Barra de progresso animada */}
              <div className="w-full max-w-[200px] h-[3px] bg-muted dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.3, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

