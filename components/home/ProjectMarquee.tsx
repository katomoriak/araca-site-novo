'use client'

import { cn } from '@/lib/utils'

interface ProjectMarqueeProps {
  items: string[]
  direction?: 'left' | 'right'
  className?: string
}

/** Carrossel marquee infinito - exibe itens em scroll contínuo */
export function ProjectMarquee({
  items,
  direction = 'left',
  className,
}: ProjectMarqueeProps) {
  if (!items || items.length === 0) return null

  // Triplicar para loop contínuo (translate -33.333% volta ao início)
  const triplicated = [...items, ...items, ...items]

  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden py-4',
        'border-y border-white/10',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 gap-12',
          direction === 'right' ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
      >
        {triplicated.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="shrink-0 whitespace-nowrap text-sm font-medium tracking-wider text-white/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
