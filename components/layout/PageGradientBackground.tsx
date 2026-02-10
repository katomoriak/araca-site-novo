'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

/**
 * Gradientes por rota para fundo inconstante das abas.
 * Cada página tem um gradiente sutil que transiciona ao navegar.
 */
const ROUTE_GRADIENTS: Record<string, string> = {
  '/': 'linear-gradient(160deg, rgba(236,229,219,0.4) 0%, rgba(48,22,12,0.03) 40%, transparent 70%)',
  '/sobre': 'linear-gradient(140deg, rgba(236,229,219,0.5) 0%, rgba(120,80,60,0.08) 50%, rgba(236,229,219,0.2) 100%)',
  '/blog': 'linear-gradient(180deg, rgba(255,252,248,0.6) 0%, rgba(236,229,219,0.3) 30%, rgba(48,22,12,0.04) 100%)',
  '/design-system': 'linear-gradient(135deg, rgba(236,229,219,0.35) 0%, rgba(200,180,160,0.1) 50%, rgba(236,229,219,0.25) 100%)',
}

const DEFAULT_GRADIENT =
  'linear-gradient(150deg, rgba(236,229,219,0.45) 0%, rgba(48,22,12,0.02) 60%, transparent 100%)'

function getGradientForPath(pathname: string): string {
  if (ROUTE_GRADIENTS[pathname]) return ROUTE_GRADIENTS[pathname]
  // Rotas dinâmicas (ex: /blog/slug) usam o gradiente do segmento base
  const base = pathname.split('/').filter(Boolean)[0]
  if (base) {
    const key = `/${base}`
    if (ROUTE_GRADIENTS[key]) return ROUTE_GRADIENTS[key]
  }
  return DEFAULT_GRADIENT
}

export function PageGradientBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const gradient = getGradientForPath(pathname ?? '/')

  return (
    <div className="relative min-h-screen overflow-visible">
      {/* Fundo em gradiente que varia por rota e transiciona */}
      <motion.div
        key={pathname}
        className="pointer-events-none fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          background: gradient,
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
