'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[1.25rem] border border-white/40 px-4 py-3',
            'bg-white/30 backdrop-blur-[5px]',
            'text-[var(--araca-cafe-escuro)] placeholder:text-[var(--araca-chocolate-amargo)]/60',
            'shadow-[var(--glass-shadow)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]',
            'dark:text-[var(--araca-bege-claro)] dark:placeholder:text-[var(--araca-bege-claro)]/60',
            'dark:focus:ring-[var(--araca-dourado-ocre)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'

export { GlassInput }
