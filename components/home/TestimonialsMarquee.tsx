'use client'

import { Quote } from 'lucide-react'
import { GlassCard } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface TestimonialItem {
  name: string
  quote: string
}

interface TestimonialsMarqueeProps {
  items: TestimonialItem[]
  className?: string
}

/**
 * Marquee vertical infinito estilo "Loved by thousands" (Boty):
 * 3 colunas, cada uma com scroll vertical contínuo, cards parcialmente visíveis.
 */
export function TestimonialsMarquee({ items, className }: TestimonialsMarqueeProps) {
  if (!items?.length) return null

  // Duplicar para loop contínuo (ao chegar em -50% o segundo bloco está no lugar)
  const duplicated = [...items, ...items]

  const columns = [
    { direction: 'down' as const, delay: '0s' },
    { direction: 'up' as const, delay: '2s' },
    { direction: 'down' as const, delay: '4s' },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6',
        className
      )}
    >
      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            'overflow-hidden rounded-2xl',
            colIndex > 0 && 'hidden md:block'
          )}
          style={{
            height: '26rem',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)',
          }}
          aria-hidden
        >
          <div
            className={cn(
              'flex flex-col gap-6',
              col.direction === 'down'
                ? 'animate-marquee-vertical'
                : 'animate-marquee-vertical-reverse'
            )}
            style={{
              animationDelay: col.delay,
              width: '100%',
            }}
          >
            {duplicated.map((t, idx) => (
              <GlassCard key={`${t.name}-${colIndex}-${idx}`} variant="flat" className="shrink-0 p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-display text-lg font-semibold text-foreground">
                    {t.name}
                  </p>
                  <Quote className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
