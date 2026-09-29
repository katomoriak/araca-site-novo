'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { ProjetoGridCard } from './ProjetoGridCard'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'

interface ProjetosGridProps {
  projects: ProjectGalleryItem[]
}

export function ProjetosGrid({ projects }: ProjetosGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <Container as="section" className="py-16">
        <p className="text-center text-muted-foreground">
          Nenhum projeto disponível no momento.
        </p>
      </Container>
    )
  }

  return (
    <Container as="section" className="py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-6 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="relative aspect-[4/5] w-full overflow-visible"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-32px' }}
            transition={{
              duration: 0.75,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProjetoGridCard
              project={project}
              priority={index < 2}
            />
          </motion.div>
        ))}
      </div>
    </Container>
  )
}
