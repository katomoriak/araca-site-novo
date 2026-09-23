'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useParallax, useParallaxController } from 'react-scroll-parallax'
import { ArrowRight, MessageCircle, Instagram } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { GlassCard, ProgressiveImage, Badge } from '@/components/ui'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { sobreContent } from '@/content/sobre'
import { getHeroVideoUrl } from '@/lib/hero-video'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
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
  const { hero, quemSomos, equipe, valores, processo, depoimentos, cta } = sobreContent
  const parallaxController = useParallaxController()
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({
    translateY: [-30, 30],
  })

  const [loadVideo, setLoadVideo] = useState(false)
  const posterUrl = getHeroVideoUrl('poster') || '/api/hero-video?quality=poster'
  const videoUrl = getHeroVideoUrl('default') || '/api/hero-video'

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadVideo(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

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
                alt={hero.heroImageAlt || 'Projeto de interiores Aracá'}
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
            className="mx-auto max-w-4xl text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Emblema / Selo oficial da marca no marrom da marca, sem fundo nem borda */}
            <motion.div
              className="mb-8 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logotipos/LOGOTIPO_REDONDO_MARROM.svg"
                  alt="Selo Aracá Interiores"
                  className="h-full w-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                />
              </div>
            </motion.div>

            <h1 className="font-display text-4xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground">
              {hero.title}
            </h1>
            <p
              className="mt-6 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-lg lg:text-lg font-body font-normal text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: hero.subtitle }}
            />
          </motion.div>

          {/* Hero Card com vídeo da home, sobreposição em degradê marrom escuro e CTA para projetos */}
          <motion.div
            className="mt-12 sm:mt-14 md:mt-16 mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
          >
            <Link
              href="/projetos"
              className="group relative block aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {/* Imagem de poster estático enquanto o vídeo carrega */}
              <Image
                src={posterUrl}
                alt="Projetos Aracá Interiores"
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Vídeo da home em autoplay loop */}
              {loadVideo && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={videoUrl}
                  className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-1000 transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Sobreposição degradê marrom escuro (#30160C / #473018) */}
              <div
                className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(to top, rgba(48, 22, 12, 0.92) 0%, rgba(71, 48, 24, 0.65) 45%, rgba(48, 22, 12, 0.25) 100%)',
                }}
                aria-hidden
              />

              {/* Conteúdo sobreposto: Conheça nossos projetos */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#E8B56F] drop-shadow-sm mb-1.5">
                      Portfólio & Realizações
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                      Conheça nossos projetos
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-medium text-sm sm:text-base transition-all duration-300 group-hover:bg-white group-hover:text-araca-cafe-escuro shadow-lg self-start sm:self-auto">
                    <span>Ver galeria completa</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
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
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Fundadores & Equipe */}
      {equipe && (
        <section className="py-12 sm:py-16 md:py-20 bg-araca-bege-claro/40" aria-labelledby="equipe-heading">
          <Container>
            <motion.div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16" {...fadeInUp}>
              <h2
                id="equipe-heading"
                className="font-display text-3xl font-bold text-foreground sm:text-4xl"
              >
                {equipe.title}
              </h2>
              <p className="mt-3 font-body text-muted-foreground text-base sm:text-lg">
                {equipe.subtitle}
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {equipe.membros.map((membro, i) => (
                <motion.div
                  key={membro.nome}
                  {...fadeInUp}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="h-full"
                >
                  <GlassCard
                    variant="subtle"
                    className="flex h-full flex-col overflow-hidden p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      {/* Foto única com moldura elegante */}
                      <div className="group relative h-44 w-44 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-2xl border-2 border-border/80 bg-muted shadow-md">
                        <ProgressiveImage
                          src={membro.foto}
                          alt={membro.fotoAlt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 176px, 192px"
                          blurPlaceholderUrl={getBlurPlaceholderUrl(membro.foto)}
                        />
                      </div>

                      {/* Dados principais */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                          <Badge variant="outline" className="border-primary/40 text-primary text-xs font-medium">
                            Co-fundador(a)
                          </Badge>
                          <Badge variant="secondary" className="text-[11px] font-normal">
                            FSA · 2028
                          </Badge>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                          {membro.nome}{membro.cargo ? ` | ${membro.cargo}` : ''}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground font-body">
                          Graduando(a) em Arquitetura e Urbanismo (Fundação Santo André)
                        </p>
                      </div>
                    </div>

                    {/* Biografia / Perfil */}
                    <div className="mt-6 pt-5 border-t border-border/60">
                      <p
                        className="font-body text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: membro.bio }}
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Valores */}
      <section className="py-12 sm:py-16 md:py-20" aria-labelledby="valores-heading">
        <Container>
          <motion.h2
            id="valores-heading"
            className="font-display text-3xl font-bold text-foreground sm:text-4xl text-center mb-10 sm:mb-12"
            {...fadeInUp}
          >
            Nossos Pilares no Design de Interiores
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

      {/* Seção Pinterest / Acesse nossos pins */}
      <section
        className="relative py-14 sm:py-16 md:py-20 bg-araca-mineral-green text-white overflow-hidden"
        aria-labelledby="pinterest-heading"
      >
        {/* Detalhe sutil de iluminação decorativa no fundo verde */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-araca-verde-claro/15 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none"
          aria-hidden
        />

        <Container className="relative z-10">
          <motion.div className="mx-auto max-w-3xl text-center" {...fadeInUp}>
            {/* Tag / Badge com o ícone clássico do Pinterest em vermelho */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wide text-white mb-4 shadow-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#E60023] fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.094.399-.303 1.236-.346 1.417-.056.236-.184.288-.429.174-1.604-.748-2.607-3.098-2.607-4.99 0-4.067 2.956-7.809 8.536-7.809 4.492 0 7.989 3.2 7.989 7.472 0 4.467-2.812 8.067-6.723 8.067-1.313 0-2.548-.682-2.972-1.492l-.809 3.085c-.292 1.114-1.085 2.508-1.618 3.36 1.247.388 2.571.597 3.939.597 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                </svg>
              </span>
              <span>Inspirações & Moodboards</span>
            </div>

            <h2
              id="pinterest-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              Acesse Nossos Pins
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-body leading-relaxed">
              Explore nossas pastas no Pinterest com referências visuais exclusivas, tendências de interiores, paletas de materiais e criações autorais da Aracá Interiores.
            </p>

            {/* Links / Botões interativos */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://br.pinterest.com/aracainteriores/_saved/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-araca-cafe-escuro font-semibold text-base shadow-lg transition-all duration-300 hover:bg-[#E60023] hover:text-white hover:shadow-xl hover:scale-105 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#E60023] group-hover:text-white fill-current transition-colors"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.094.399-.303 1.236-.346 1.417-.056.236-.184.288-.429.174-1.604-.748-2.607-3.098-2.607-4.99 0-4.067 2.956-7.809 8.536-7.809 4.492 0 7.989 3.2 7.989 7.472 0 4.467-2.812 8.067-6.723 8.067-1.313 0-2.548-.682-2.972-1.492l-.809 3.085c-.292 1.114-1.085 2.508-1.618 3.36 1.247.388 2.571.597 3.939.597 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                </svg>
                <span>Pins Salvos & Referências</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="https://br.pinterest.com/aracainteriores/_created/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-medium text-base shadow-sm transition-all duration-300 hover:bg-white hover:text-araca-cafe-escuro hover:shadow-lg hover:scale-105 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#E60023] fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.094.399-.303 1.236-.346 1.417-.056.236-.184.288-.429.174-1.604-.748-2.607-3.098-2.607-4.99 0-4.067 2.956-7.809 8.536-7.809 4.492 0 7.989 3.2 7.989 7.472 0 4.467-2.812 8.067-6.723 8.067-1.313 0-2.548-.682-2.972-1.492l-.809 3.085c-.292 1.114-1.085 2.508-1.618 3.36 1.247.388 2.571.597 3.939.597 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                </svg>
                <span>Criações & Projetos Aracá</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
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


      {/* Depoimentos */}
      <section
        className="relative py-16 sm:py-20 overflow-hidden bg-araca-bege-claro/50"
        aria-labelledby="depoimentos-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 backdrop-blur-md px-3.5 py-1 text-xs text-foreground mb-4 shadow-sm"
              {...fadeInUp}
            >
              <span className="flex items-center gap-1 text-[#d4a853] font-semibold">
                ★ 5.0
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">Avaliações 5 estrelas no Google</span>
            </motion.div>
            <motion.h2
              id="depoimentos-heading"
              className="font-display text-3xl font-bold text-foreground sm:text-4xl"
              {...fadeInUp}
            >
              O Que Nossos Clientes Dizem: Experiências Reais
            </motion.h2>
            <motion.p className="mt-3 text-muted-foreground" {...fadeInUp}>
              Avaliações reais que resumem a experiência Aracá Interiores.
            </motion.p>
          </div>
          <TestimonialsMarquee className="mt-10" items={[...depoimentos]} />
        </Container>
      </section>

      {/* Seção Instagram / Siga-nos no Instagram */}
      <section
        className="relative py-16 sm:py-20 md:py-24 bg-araca-creme overflow-hidden border-t border-b border-border/40"
        aria-labelledby="instagram-heading"
      >
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Texto de chamada */}
            <motion.div className="max-w-xl text-center lg:text-left" {...fadeInUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-araca-laranja-queimado/30 bg-araca-laranja-queimado/10 px-3.5 py-1 text-xs text-araca-laranja-queimado font-medium mb-4 shadow-sm">
                <Instagram className="h-4 w-4" />
                <span>@aracainteriores</span>
              </div>

              <h2
                id="instagram-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-araca-cafe-escuro tracking-tight"
              >
                Acompanhe o Dia a Dia do Nosso Estúdio
              </h2>

              <p className="mt-4 text-base sm:text-lg text-araca-chocolate-amargo/85 font-body leading-relaxed">
                No nosso Instagram você confere os bastidores das obras, especificações de materiais, tendências de arquitetura e design de interiores, antes e depois de ambientes e novas ideias autorais.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.instagram.com/aracainteriores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-araca-cafe-escuro text-white font-medium text-base shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:shadow-xl hover:scale-105 group"
                >
                  <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6 text-[#E8B56F] group-hover:text-white" />
                  <span>Seguir no Instagram</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>

            {/* Grid com publicações reais do Instagram */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg lg:max-w-md shrink-0"
              {...fadeInUp}
              transition={{ delay: 0.15 }}
            >
              {[
                {
                  src: '/instagram/post-1.png',
                  alt: 'Luminária pendente helicoidal e painel ripado - Aracá Interiores',
                  tag: 'Iluminação & Painel',
                },
                {
                  src: '/instagram/post-2.png',
                  alt: 'Quarto aconchegante com poltrona e manta terracota - Aracá Interiores',
                  tag: 'Suíte & Texturas',
                },
                {
                  src: '/instagram/post-3.png',
                  alt: 'Equipe fundadora Aracá Interiores - Marcos Paulo e Rafaela Garbuio',
                  tag: 'Quem Cria',
                },
                {
                  src: '/instagram/post-4.png',
                  alt: 'Antes e Depois / Cozinha e Sala Integradas - Aracá Interiores',
                  tag: 'Antes & Depois',
                },
                {
                  src: '/instagram/post-5.png',
                  alt: '10 coisas que você deveria fazer antes de começar sua obra - Dicas Aracá',
                  tag: 'Dicas de Obra',
                },
                {
                  src: '/instagram/post-1.png',
                  alt: 'Conceito e Composição de Interiores - Aracá',
                  tag: 'Composição & Arte',
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="https://www.instagram.com/aracainteriores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, 150px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2.5">
                    <span className="text-[10px] sm:text-xs text-white/90 font-medium">
                      {item.tag}
                    </span>
                    <span className="text-white text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <Instagram className="h-3 w-3" />
                      Ver post
                    </span>
                  </div>
                </a>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24" aria-labelledby="cta-heading">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              id="cta-heading"
              className="font-display text-3xl font-bold text-foreground sm:text-4xl"
              {...fadeInUp}
            >
              {cta.title}
            </motion.h2>
            <motion.p
              className="mt-4 font-body text-base sm:text-lg text-muted-foreground leading-relaxed"
              {...fadeInUp}
            >
              {cta.description}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
              {...fadeInUp}
            >
              <a
                href={cta.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold text-white',
                  'bg-araca-mineral-green shadow-lg hover:bg-araca-mineral-green-hover hover:scale-105 transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-araca-mineral-green focus-visible:ring-offset-2'
                )}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                <span>{cta.primary.label}</span>
              </a>

              <Link
                href={cta.secondary.href}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-medium text-foreground/80',
                  'border border-border/80 bg-transparent hover:bg-muted/50 hover:text-foreground transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <span>{cta.secondary.label}</span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}
