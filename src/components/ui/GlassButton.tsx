'use client'

import React, { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const glassButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium',
    'rounded-[1.25rem] border transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--araca-mineral-green)] text-white border-transparent',
          'hover:opacity-90 shadow-lg',
        ].join(' '),
        secondary: [
          'bg-[var(--araca-dourado-ocre)] text-[var(--araca-cafe-escuro)] border-transparent',
          'hover:opacity-90 shadow-lg',
        ].join(' '),
        accent: [
          'bg-[var(--araca-ameixa)] text-white border-transparent',
          'hover:opacity-90 shadow-lg',
        ].join(' '),
        glass: [
          'bg-white/20 backdrop-blur-[5px] border-white/40',
          'hover:bg-white/30 text-[var(--foreground)]',
        ].join(' '),
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(glassButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
)

GlassButton.displayName = 'GlassButton'

export { GlassButton, glassButtonVariants }
