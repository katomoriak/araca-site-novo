'use client'

import { useRef, useCallback } from 'react'
import { Quote, Star } from 'lucide-react'
import { GlassCard } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface TestimonialItem {
  name: string
  quote: string
  rating?: number
  time?: string
  source?: string
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
  const containerRef = useRef<HTMLDivElement>(null)

  const setPlaybackRate = useCallback((rate: number) => {
    if (!containerRef.current) return

    // 1. Tenta pegar animações pelo container com subtree: true (Web Animations API nativo)
    if (typeof containerRef.current.getAnimations === 'function') {
      try {
        const anims = containerRef.current.getAnimations({ subtree: true })
        if (anims.length > 0) {
          anims.forEach((anim) => {
            anim.playbackRate = rate
          })
          return
        }
      } catch {
        // Fallback caso subtree: true falhe
      }
    }

    // 2. Fallback buscando diretamente nos elementos animados das colunas
    const animatedElements = containerRef.current.querySelectorAll(
      '.animate-marquee-vertical, .animate-marquee-vertical-reverse'
    )
    animatedElements.forEach((el) => {
      if (typeof el.getAnimations === 'function') {
        el.getAnimations().forEach((anim) => {
          anim.playbackRate = rate
        })
      }
    })
  }, [])

  if (!items?.length) return null

  // Duplicar para loop contínuo (ao chegar em -50% o segundo bloco está no lugar)
  const duplicated = [...items, ...items]

  const columns = [
    { direction: 'down' as const, delay: '0s' },
    { direction: 'up' as const, delay: '-10s' },
    { direction: 'down' as const, delay: '-20s' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPlaybackRate(0.3)}
      onMouseLeave={() => setPlaybackRate(1)}
      className={cn(
        'group/marquee grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6',
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
            height: '28rem',
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
              <GlassCard key={`${t.name}-${colIndex}-${idx}`} variant="flat" className="shrink-0 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {t.name}
                      </p>
                      {t.time && (
                        <p className="text-xs text-muted-foreground/80 mt-0.5">
                          {t.time}
                        </p>
                      )}
                    </div>
                    <Quote className="h-5 w-5 shrink-0 text-muted-foreground/60" aria-hidden />
                  </div>

                  {/* Estrelas */}
                  <div className="flex items-center gap-1 mt-2.5" aria-label={`${t.rating || 5} de 5 estrelas`}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#d4a853] text-[#d4a853]" />
                    ))}
                  </div>

                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    Avaliação no Google
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">Verificada</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

