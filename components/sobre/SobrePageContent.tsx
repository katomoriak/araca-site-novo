'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useParallax, useParallaxController } from 'react-scroll-parallax'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { GlassCard, ProgressiveImage, TypewriterEffect } from '@/components/ui'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { sobreContent } from '@/content/sobre'
import { getBlurPlaceholderUrl, getProxiedImageUrlWithResize } from '@/lib/transform-content-images'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-32px' },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

export function SobrePageContent() {
  const { hero, quemSomos, valores, processo, equipe, depoimentos, cta } = sobreContent
  const parallaxController = useParallaxController()
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({
    translateY: [-30, 30],
  })

  // Atualiza o cache do parallax ao montar (rota /sobre) e quando a imagem carregar
  useEffect(() => {
    parallaxController?.update()
  }, [parallaxController])

  return (
    <>
      {/* Hero: imagem colada no topo do site (atrás do menu). Offset = header (pt-4 + h-20 + pb-2) ≈ 7rem */}
      <section className="relative overflow-hidden -mt-28 pt-28 min-h-[32rem] pb-16 sm:pb-20 md:pb-24">
        {/* Imagem de fundo: colada no topo (preenche da borda superior da section), parallax via useParallax */}
        {hero.heroImage && (
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
                src={hero.heroImage}
                alt=""
                fill
                className="object-cover object-top"
                sizes="100vw"
                priority
                blurPlaceholderUrl={getBlurPlaceholderUrl(hero.heroImage)}
                onLoad={() => parallaxController?.update()}
              />
            </div>
          </div>
        )}
        {/* Degradê no meio da imagem: transição para o bege no centro */}
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
            <h1>
              <TypewriterEffect
                words={hero.title.split(' ').map((w) => ({ text: w }))}
              />
            </h1>
            <p className="mt-6 max-w-3xl mx-auto leading-relaxed">
              <TypewriterEffect
                words={hero.subtitle.split(' ').map((w) => ({ text: w }))}
                className="!text-base sm:!text-lg md:!text-lg lg:!text-lg font-body font-normal text-muted-foreground min-h-[4rem] md:min-h-[5rem]"
                cursorClassName="h-4 sm:h-5 md:h-6 bg-muted-foreground"
              />
            </p>
          </motion.div>
          {(hero.heroCardImage ?? hero.heroImage) && (
            <motion.div
              className="mt-10 sm:mt-12 md:mt-14 mx-auto max-w-4xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-xl">
                <ProgressiveImage
                  src={getProxiedImageUrlWithResize(hero.heroCardImage ?? hero.heroImage ?? '', 896, 80)}
                  alt={hero.heroCardImageAlt ?? hero.heroImageAlt ?? 'Projeto Aracá Interiores'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                  blurPlaceholderUrl={getBlurPlaceholderUrl(hero.heroCardImage ?? hero.heroImage ?? '')}
                />
              </div>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Quem somos */}
      <section className="py-12 sm:py-16 md:py-20" aria-labelledby="quem-somos-heading">
        <Container>
          <motion.div className="mx-auto max-w-3xl" {...fadeInUp}>
            <h2
              id="quem-somos-heading"
              className="font-display text-3xl font-bold text-foreground sm:text-4xl"
            >
              {quemSomos.title}
            </h2>
            <div className="mt-6 space-y-4 font-body text-muted-foreground text-base sm:text-lg leading-relaxed">
              {quemSomos.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Valores */}
      <section className="py-12 sm:py-16 md:py-20" aria-labelledby="valores-heading">
        <Container>
          <motion.h2
            id="valores-heading"
            className="font-display text-3xl font-bold text-foreground sm:text-4xl text-center mb-10 sm:mb-12"
            {...fadeInUp}
          >
            Nossos pilares
          </motion.h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {valores.map((v, i) => (
              <motion.div
                key={v.title}
                {...stagger}
                transition={{ delay: i * 0.08 }}
                className="h-full"
              >
                <div className="h-full transition-transform duration-200 ease-out hover:scale-[1.06] origin-center">
                  <GlassCard variant="subtle" className="h-full p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed">
                      {v.description}
                    </p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Processo - Timeline */}
      <section className="py-12 sm:py-16 md:py-20" aria-labelledby="processo-heading">
        <Container>
          <motion.h2
            id="processo-heading"
            className="font-display text-3xl font-bold text-foreground sm:text-4xl text-center mb-12 sm:mb-16"
            {...fadeInUp}
          >
            {processo.title}
          </motion.h2>
          <div className="relative mx-auto max-w-2xl">
            {/* Linha vertical */}
            <div
              className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
              aria-hidden
            />
            {processo.steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="group relative flex gap-6 pb-10 last:pb-0 cursor-default"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: 6 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-display text-sm font-bold text-primary transition-all duration-200 group-hover:scale-[1.08] group-hover:bg-primary/10"
                  aria-hidden
                >
                  {step.number}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 font-body text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Equipe */}
      <section className="py-12 sm:py-16 md:py-20" aria-labelledby="equipe-heading">
        <Container>
          <motion.h2
            id="equipe-heading"
            className="font-display text-3xl font-bold text-foreground sm:text-4xl text-center mb-10 sm:mb-12"
            {...fadeInUp}
          >
            {equipe.title}
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {equipe.members.map((member, i) => (
              <motion.div key={member.name} {...stagger} transition={{ delay: i * 0.1 }}>
                <GlassCard variant="default" className="overflow-hidden p-0 h-full">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6 p-6">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted mx-auto sm:mx-0">
                      <ProgressiveImage
                        src={member.image}
                        alt={member.imageAlt}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                        blurPlaceholderUrl={getBlurPlaceholderUrl(member.image)}
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="mt-1 font-body text-sm text-primary font-medium">
                        {member.role}
                      </p>
                      <p className="mt-4 font-body text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Depoimentos */}
      <section
        className="relative py-16 sm:py-20 overflow-hidden bg-araca-bege-claro/50"
        aria-labelledby="depoimentos-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              id="depoimentos-heading"
              className="font-display text-3xl font-bold text-foreground sm:text-4xl"
              {...fadeInUp}
            >
              O que dizem sobre nós
            </motion.h2>
            <motion.p className="mt-3 text-muted-foreground" {...fadeInUp}>
              Avaliações que resumem a experiência Aracá.
            </motion.p>
          </div>
          <TestimonialsMarquee className="mt-10" items={[...depoimentos]} />
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24" aria-labelledby="cta-heading">
        <Container>
          <motion.div
            className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8"
            {...fadeInUp}
          >
            <h2 id="cta-heading" className="sr-only">
              Próximos passos
            </h2>
            <Link
              href={cta.primary.href}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium',
                'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              {cta.primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={cta.secondary.href}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium',
                'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {cta.secondary.label}
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
