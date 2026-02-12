'use client'

import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/Container'
import { ProjectCard, type ProjectGalleryItem } from './ProjectGallery'

import 'swiper/css'
import 'swiper/css/navigation'

interface GalleryCarouselProps {
  projects: ProjectGalleryItem[]
  onSelectProject: (project: ProjectGalleryItem) => void
  className?: string
}

export function GalleryCarousel({
  projects,
  onSelectProject,
  className,
}: GalleryCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!projects || projects.length === 0) {
    return <div className="text-center text-muted-foreground">Nenhum projeto disponível</div>
  }

  // Duplicar slides para o loop do Swiper 11 funcionar (exige slidesPerView * 2+ slides)
  const loopSlides = [...projects, ...projects, ...projects]

  return (
    <div className={cn('relative w-full', className)}>
      {/* Carrossel full width até as bordas da viewport */}
      <div className="w-full min-h-[600px] md:min-h-[700px]">
        <div className="rounded-[28px] py-2 px-0 sm:py-3 md:rounded-[32px] md:py-4 [--swiper-navigation-size:2.5rem] h-full">
          <Swiper
          direction="horizontal"
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex % projects.length)}
          modules={[Navigation, A11y, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.1, spaceBetween: 28 },
            1024: { slidesPerView: 1.2, spaceBetween: 32 },
          }}
          centeredSlides
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          grabCursor
          allowTouchMove={true}
          simulateTouch={true}
          touchRatio={1}
          resistance={true}
          resistanceRatio={0.85}
          longSwipesRatio={0.2}
          threshold={5}
          a11y={{
            prevSlideMessage: 'Projeto anterior',
            nextSlideMessage: 'Próximo projeto',
          }}
          className="!min-h-[600px] md:!min-h-[700px]"
        >
          {loopSlides.map((project, index) => (
            <SwiperSlide key={`${project.id}-${index}`} className="!h-auto">
              <div className="cursor-grab active:cursor-grabbing h-full min-h-[600px] md:min-h-[700px]">
                <ProjectCard
                  project={project}
                  onClick={() => onSelectProject(project)}
                  reverse={false}
                  showContent={true}
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>

      {/* Controles alinhados ao restante do site */}
      <Container>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/70">
          Arraste para o lado ou use as setas para navegar.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
              backdropFilter: 'blur(42px) saturate(180%)',
              WebkitBackdropFilter: 'blur(42px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
            aria-label="Projeto anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={cn(
                  'h-3.5 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-12 bg-araca-bege-claro shadow-lg shadow-araca-bege-claro/40'
                    : 'w-3.5 bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Ir para projeto ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
              backdropFilter: 'blur(42px) saturate(180%)',
              WebkitBackdropFilter: 'blur(42px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
            aria-label="Próximo projeto"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        </div>
      </Container>
    </div>
  )
}
