'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const glassCardVariants = cva(
  [
    'relative overflow-hidden rounded-[1.25rem]',
    'border transition-all duration-300',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'backdrop-blur-[5px]',
          '[box-shadow:var(--glass-shadow),inset_0_1px_0_var(--glass-inset-top),inset_0_-1px_0_var(--glass-inset-bottom),inset_0_0_36px_18px_var(--glass-inset-glow)]',
          'bg-white/40 border-white/30 dark:bg-[rgba(48,22,12,0.4)] dark:border-white/20',
        ].join(' '),
        strong: [
          'backdrop-blur-[5px]',
          '[box-shadow:var(--glass-shadow),inset_0_1px_0_var(--glass-inset-top),inset_0_-1px_0_var(--glass-inset-bottom),inset_0_0_36px_18px_var(--glass-inset-glow)]',
          'bg-white/40 border-white/60 dark:bg-[rgba(48,22,12,0.5)] dark:border-white/30',
        ].join(' '),
        subtle: [
          'backdrop-blur-[5px]',
          '[box-shadow:var(--glass-shadow),inset_0_1px_0_var(--glass-inset-top),inset_0_-1px_0_var(--glass-inset-bottom),inset_0_0_36px_18px_var(--glass-inset-glow)]',
          'bg-white/15 border-white/25 dark:bg-[rgba(48,22,12,0.25)] dark:border-white/15',
        ].join(' '),
        flat: 'bg-white/40 border-white/30 dark:bg-[rgba(48,22,12,0.4)] dark:border-white/20',
        ghost: 'bg-transparent border-white/20 dark:border-white/10 [box-shadow:none]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  children: ReactNode
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant }), className)}
      {...props}
    >
      {/* Highlights premium - pseudo-elementos visuais */}
      <span
        className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/60"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/80 via-transparent to-white/30 dark:from-white/60 dark:to-white/20"
        aria-hidden
      />
      {children}
    </div>
  )
)

GlassCard.displayName = 'GlassCard'

export { GlassCard, glassCardVariants }
