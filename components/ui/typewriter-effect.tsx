'use client'

import { cn } from '@/lib/utils'
import { motion, stagger, useAnimate, useInView } from 'motion/react'
import { useEffect } from 'react'

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }))

  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.05),
          ease: 'easeInOut',
        }
      )
    }
  }, [isInView, animate])

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <motion.span
              initial={{}}
              key={`char-${index}`}
              className={cn(
                'text-foreground opacity-0 hidden',
                word.className
              )}
            >
              {char}
            </motion.span>
          ))}
          &nbsp;
        </div>
      ))}
    </motion.div>
  )

  return (
    <div
      className={cn(
        'font-display text-4xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl leading-tight',
        'min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[8rem] lg:min-h-[10rem]',
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'inline-block rounded-sm w-[3px] h-6 sm:h-8 md:h-10 lg:h-12 bg-foreground ml-0.5 align-middle',
          cursorClassName
        )}
      />
    </div>
  )
}
