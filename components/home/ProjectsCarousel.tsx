'use client'

import { useCallback, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ProjectCard = {
  title: string
  subtitle?: string
  tag?: string
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function ProjectsCarousel({
  projects,
  className,
}: {
  projects: ProjectCard[]
  className?: string
}) {
  const pages = useMemo(() => chunk(projects, 6), [projects])
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [currentPage, setCurrentPage] = useState(0)

  const scrollPrev = useCallback(() => {
    setDirection('left')
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }, [])
  
  const scrollNext = useCallback(() => {
    setDirection('right')
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1))
  }, [pages.length])

  // Variantes de animação para os cards com profundidade
  const cardVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 0.85,
      rotateY: direction === 'right' ? 25 : -25,
      z: -200,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      filter: 'blur(0px)',
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0.3,
      scale: 0.85,
      rotateY: direction === 'right' ? -25 : 25,
      z: -200,
      filter: 'blur(4px)',
    }),
  }

  if (!projects || projects.length === 0) {
    return <div className="text-center text-muted-foreground">Nenhum projeto disponível</div>
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="relative w-full" style={{ transformStyle: 'preserve-3d', minHeight: '400px' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {pages.length > 0 && pages[currentPage] && (
              <motion.div
                key={currentPage}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 250, damping: 35 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotateY: { duration: 0.5, ease: 'easeInOut' },
                  z: { duration: 0.5 },
                  filter: { duration: 0.5 },
                }}
                className="absolute inset-0 w-full px-1 sm:px-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
                  {pages[currentPage].map((p, idx) => (
                    <motion.div
                      key={`${currentPage}-${idx}-${p.title}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: idx * 0.1,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      className={cn(
                        'group relative overflow-hidden rounded-[1.25rem] border border-border bg-white/40 backdrop-blur-[5px]',
                        '[box-shadow:var(--glass-shadow),inset_0_1px_0_var(--glass-inset-top),inset_0_-1px_0_var(--glass-inset-bottom),inset_0_0_36px_18px_var(--glass-inset-glow)]',
                        'transition-transform duration-300 will-change-transform',
                        'hover:-translate-y-0.5'
                      )}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-80">
                        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-araca-dourado-ocre/25 blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-araca-mineral-green/25 blur-2xl" />
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
                            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                              {p.tag}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-araca-bege-claro/60 via-white/30 to-araca-bege-medio/40 ring-1 ring-border/60" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controles */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground"
        >
          Navegue pelos projetos usando as setas.
        </motion.p>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={scrollPrev}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/70 backdrop-blur-md transition hover:bg-muted"
            aria-label="Projetos anteriores"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            onClick={scrollNext}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/70 backdrop-blur-md transition hover:bg-muted"
            aria-label="Próximos projetos"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

