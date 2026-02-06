import { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LiquidGlassProps {
  children: ReactNode
  /**
   * Variante do Liquid Glass
   * - regular: Versátil, adapta-se a qualquer contexto
   * - clear: Permanentemente transparente, requer dimming layer
   */
  variant?: 'regular' | 'clear'
  /**
   * Tamanho influencia a intensidade do efeito
   * - sm: Elementos pequenos (navbars, toolbars) - blur 42px
   * - lg: Elementos grandes (sidebars, modals) - blur 60px
   */
  size?: 'sm' | 'lg'
  className?: string
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

/**
 * Liquid Glass Component
 * 
 * Implementação do Liquid Glass design system da Apple (WWDC 2025).
 * Um meta-material digital que dobra e molda luz dinamicamente.
 * 
 * @see {@link .cursor/rules/liquid-glass.md} - Diretrizes de uso
 * @see {@link docs/LIQUID_GLASS.md} - Documentação técnica completa
 * 
 * @example
 * ```tsx
 * // Menu de navegação
 * <LiquidGlass variant="regular" size="sm" className="rounded-full px-6 py-3">
 *   <nav>Menu items</nav>
 * </LiquidGlass>
 * 
 * // Sidebar
 * <LiquidGlass variant="regular" size="lg" className="rounded-2xl p-6">
 *   <aside>Sidebar content</aside>
 * </LiquidGlass>
 * 
 * // Clear sobre mídia
 * <LiquidGlass variant="clear" size="sm" className="rounded-xl p-4">
 *   <div>Content over rich media</div>
 * </LiquidGlass>
 * ```
 */
export function LiquidGlass({
  children,
  variant = 'regular',
  size = 'sm',
  className,
  style = {},
  as: Component = 'div',
}: LiquidGlassProps) {
  const baseStyle: CSSProperties = {
    // Background
    background:
      variant === 'regular'
        ? size === 'sm'
          ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)'
        : 'rgba(255,255,255,0.04)',

    // Blur + Saturation (Lensing Effect)
    backdropFilter:
      variant === 'regular'
        ? size === 'sm'
          ? 'blur(42px) saturate(180%)'
          : 'blur(60px) saturate(190%)'
        : 'blur(60px) saturate(200%)',
    WebkitBackdropFilter:
      variant === 'regular'
        ? size === 'sm'
          ? 'blur(42px) saturate(180%)'
          : 'blur(60px) saturate(190%)'
        : 'blur(60px) saturate(200%)',

    // Multi-layer Shadows (Depth)
    boxShadow:
      variant === 'regular'
        ? size === 'sm'
          ? `0 8px 32px rgba(0, 0, 0, 0.4),
             0 2px 8px rgba(0, 0, 0, 0.2),
             inset 0 1px 0 rgba(255, 255, 255, 0.2),
             inset 0 -1px 0 rgba(0, 0, 0, 0.1)`
          : `0 12px 48px rgba(0, 0, 0, 0.5),
             0 4px 12px rgba(0, 0, 0, 0.3),
             inset 0 2px 0 rgba(255, 255, 255, 0.25),
             inset 0 -2px 0 rgba(0, 0, 0, 0.15)`
        : '0 8px 24px rgba(0,0,0,0.3)',

    // Refractive Border
    border:
      variant === 'regular'
        ? size === 'sm'
          ? '1px solid rgba(255, 255, 255, 0.18)'
          : '1px solid rgba(255, 255, 255, 0.22)'
        : '1px solid rgba(255, 255, 255, 0.12)',

    // Smooth Transitions
    transition: 'all 300ms ease-out',

    // Custom styles override
    ...style,
  }

  return (
    <Component className={cn('liquid-glass', className)} style={baseStyle}>
      {children}
    </Component>
  )
}

/**
 * LiquidGlassButton
 * 
 * Botão com efeito Liquid Glass para estados ativos.
 * 
 * @example
 * ```tsx
 * <LiquidGlassButton active>
 *   Home
 * </LiquidGlassButton>
 * ```
 */
interface LiquidGlassButtonProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export function LiquidGlassButton({
  children,
  active = false,
  onClick,
  className,
  style = {},
}: LiquidGlassButtonProps) {
  const activeStyle: CSSProperties = {
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
    boxShadow:
      '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    color: 'rgb(23 23 23)', // neutral-900
  }

  const inactiveStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
        active ? 'hover:scale-[1.02]' : 'hover:text-white',
        className
      )}
      style={{
        ...(active ? activeStyle : inactiveStyle),
        ...style,
      }}
    >
      <span className="relative z-10">{children}</span>
      {/* Hover glow effect */}
      {!active && (
        <div
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />
      )}
      {/* Active state subtle glow on hover */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
      )}
    </button>
  )
}

/**
 * Utility: Text styling for content over Liquid Glass
 */
export const liquidGlassTextStyles: CSSProperties = {
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  color: 'rgba(255, 255, 255, 0.95)',
}

/**
 * Utility: Logo/SVG styling for Liquid Glass
 */
export const liquidGlassLogoStyles: CSSProperties = {
  filter: 'brightness(0) invert(1)',
  dropShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
}
