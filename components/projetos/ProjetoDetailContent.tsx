'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ProgressiveImage } from '@/components/ui'
import { ArrowLeft, Play } from 'lucide-react'
import { getBlurPlaceholderUrl } from '@/lib/transform-content-images'
import { Container } from '@/components/layout/Container'
import { ProjectGallery } from '@/components/home/ProjectGallery'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'
import { useGalleryOpen } from '@/components/context/GalleryOpenContext'

interface ProjetoDetailContentProps {
  project: ProjectGalleryItem
}

export function ProjetoDetailContent({ project }: ProjetoDetailContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { setGalleryOpen } = useGalleryOpen()
  const openLightbox = useCallback((index: number | null) => {
    setLightboxIndex(index)
    setGalleryOpen(index !== null)
  }, [setGalleryOpen])
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    setGalleryOpen(false)
  }, [setGalleryOpen])

  return (
    <>
      <article className="py-10 md:py-16">
        <Container>
          <Link
            href="/projetos"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos projetos
          </Link>

          <header className="mt-8 max-w-3xl">
            {project.tag && (
              <span className="inline-block rounded-full bg-araca-cafe-escuro/10 px-4 py-1.5 text-sm font-medium text-araca-cafe-escuro">
                {project.tag}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            )}
          </header>

          {/* Grid de thumbnails */}
          {project.media.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {project.media.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted transition-transform hover:scale-[1.02]"
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-12 w-12 text-white" fill="white" />
                      </div>
                    </>
                  ) : (
                    <ProgressiveImage
                      src={item.url}
                      alt={item.name ?? `${project.title} - ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      blurPlaceholderUrl={getBlurPlaceholderUrl(item.url)}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </Container>
      </article>

      {lightboxIndex !== null && (
        <ProjectGallery
          project={project}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}

