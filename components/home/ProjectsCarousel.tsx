'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'

export type ProjectCard = {
  title: string
  subtitle?: string
  tag?: string
}

export function ProjectsCarousel({
  projects,
  className,
}: {
  projects: ProjectCard[]
  className?: string
}) {
  const swiperRef = useRef<SwiperType | null>(null)

  if (!projects || projects.length === 0) {
    return <div className="text-center text-muted-foreground">Nenhum projeto disponível</div>
  }

  return (
    <div className={cn('relative', className)}>
      {/* Material You: container com bordas arredondadas (shape system) e elevação */}
      <div className="rounded-[28px] p-2 sm:p-3 md:rounded-[32px] md:p-4 [--swiper-navigation-size:2.5rem]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          modules={[Navigation, A11y]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          loop={projects.length >= 3}
          grabCursor
          allowTouchMove={true}
          simulateTouch={true}
          touchRatio={1}
          resistance={true}
          resistanceRatio={0.85}
          longSwipesRatio={0.2}
          threshold={5}
          a11y={{
            prevSlideMessage: 'Projetos anteriores',
            nextSlideMessage: 'Próximos projetos',
          }}
          className="!overflow-visible"
        >
          {projects.map((p, idx) => (
            <SwiperSlide key={`${p.title}-${idx}`}>
              <div
                className={cn(
                  'group relative h-full overflow-hidden rounded-2xl border-0 bg-white/90 shadow-sm',
                  'transition-all duration-300 ease-out',
                  'hover:shadow-md hover:-translate-y-0.5',
                  'dark:bg-white/10 dark:shadow-none dark:ring-1 dark:ring-white/10'
                )}
              >
                {/* Material You: glow sutil no hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-araca-dourado-ocre/20 blur-2xl" />
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-araca-mineral-green/20 blur-2xl" />
                </div>

                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {p.title}
                      </p>
                      {p.subtitle && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {p.subtitle}
                        </p>
                      )}
                    </div>
                    {p.tag && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-araca-bege-claro/60 via-white/30 to-araca-bege-medio/40 ring-1 ring-black/5" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Controles Material You: botões circulares/rounded com elevação */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Arraste para o lado ou use as setas para navegar.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 shadow-sm backdrop-blur-sm transition hover:bg-muted hover:shadow active:scale-95"
            aria-label="Projetos anteriores"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 shadow-sm backdrop-blur-sm transition hover:bg-muted hover:shadow active:scale-95"
            aria-label="Próximos projetos"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
