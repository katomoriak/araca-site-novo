'use client'

import { useState } from 'react'
import { ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectCoverImageProps {
  src: string
  alt: string
  className?: string
}

export function ProjectCoverImage({ src, alt, className }: ProjectCoverImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground',
          className
        )}
        aria-label="Imagem não disponível"
      >
        <ImageIcon className="h-12 w-12 opacity-50" />
        <span className="text-xs">Imagem indisponível</span>
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full bg-muted/20', className)}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}
