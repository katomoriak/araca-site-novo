'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface ProjectCoverImageProps {
  src: string
  alt: string
  className?: string
}

export function ProjectCoverImage({ src, alt, className }: ProjectCoverImageProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground ${className ?? ''}`}
        aria-label="Imagem não disponível"
      >
        <ImageIcon className="h-12 w-12 opacity-50" />
        <span className="text-xs">Imagem indisponível</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
