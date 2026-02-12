'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParallax, useParallaxController } from 'react-scroll-parallax'
import { Container } from '@/components/layout/Container'
import { ProgressiveImage, TypewriterEffect } from '@/components/ui'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'

interface ProjetosHeroProps {
  title: string
  subtitle: string
  heroImage: string
}

export function ProjetosHero({ title, subtitle, heroImage }: ProjetosHeroProps) {
  const parallaxController = useParallaxController()
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({
    translateY: [-30, 30],
  })

  useEffect(() => {
    parallaxController?.update()
  }, [parallaxController])

  return (
    <section className="relative overflow-hidden -mt-28 pt-28 min-h-[32rem] pb-16 sm:pb-20 md:pb-24">
      {heroImage && (
        <div
          className="absolute inset-0 z-0 grayscale opacity-20 mix-blend-multiply overflow-hidden"
          aria-hidden
        >
          <div
            ref={parallaxRef}
            className="absolute left-0 right-0 top-0 w-full min-h-[140%]"
            style={{ willChange: 'transform' }}
          >
            <ProgressiveImage
              src={heroImage}
              alt=""
              fill
              className="object-cover object-top"
              sizes="100vw"
              priority
              blurPlaceholderUrl={getBlurPlaceholderUrl(heroImage)}
              onLoad={() => parallaxController?.update()}
            />
          </div>
        </div>
      )}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 30%, var(--araca-bege-claro) 55%, var(--araca-bege-claro) 100%)',
        }}
        aria-hidden
      />
      <Container className="relative z-10 pt-8 sm:pt-10 md:pt-12">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            <TypewriterEffect
              words={title.split(' ').map((w) => ({ text: w }))}
            />
          </h1>
          <div className="mt-6 max-w-3xl mx-auto leading-relaxed">
            <TypewriterEffect
              words={subtitle.split(' ').map((w) => ({ text: w }))}
              className="!text-base sm:!text-lg md:!text-lg font-body font-normal text-muted-foreground min-h-[4rem] md:min-h-[5rem]"
              cursorClassName="h-4 sm:h-5 md:h-6 bg-muted-foreground"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
