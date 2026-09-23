'use client'

import { cn } from '@/lib/utils'

export const TypewriterEffect = ({
  words,
  className,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}) => {
  return (
    <div
      className={cn(
        'font-display text-4xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl leading-tight',
        className
      )}
    >
      <div className="inline">
        {words.map((word, idx) => (
          <span key={`word-${idx}`} className={cn('inline-block mr-1.5', word.className)}>
            {word.text}
          </span>
        ))}
      </div>
    </div>
  )
}

