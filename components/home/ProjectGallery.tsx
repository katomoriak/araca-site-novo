'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export interface ProjectGalleryItem {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  tag?: string
}

interface ProjectGalleryProps {
  project: ProjectGalleryItem
  onClose?: () => void
}

interface ProjectCardProps {
  project: ProjectGalleryItem
  onClick: (e?: React.MouseEvent) => void
  reverse?: boolean
  showContent?: boolean
}

// Card do projeto (thumbnail clicável)
export function ProjectCard({ project, onClick, reverse = false, showContent = true }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl"
      onClick={onClick}
    >
      {/* Container com imagem de fundo */}
      <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden rounded-3xl">
        {/* Imagem de Fundo */}
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Overlay gradiente */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          showContent 
            ? 'bg-gradient-to-b from-black/30 via-black/40 to-black/80 group-hover:from-black/40 group-hover:to-black/85'
            : 'bg-gradient-to-b from-black/20 to-black/40 group-hover:from-black/30 group-hover:to-black/50'
        }`} />
        
        {/* Conteúdo sobre a imagem - Só mostra se showContent for true */}
        {showContent && (
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-2xl space-y-6">
              <div>
                {project.tag && (
                  <span 
                    className="inline-block rounded-full px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {project.tag}
                  </span>
                )}
                <h3 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl drop-shadow-2xl">
                  {project.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-white/90 drop-shadow-lg md:text-xl">
                  {project.description}
                </p>
              </div>
              
              {/* Botão Liquid Glass */}
              <button
                className="group/btn relative w-fit overflow-hidden rounded-full px-8 py-4 text-sm font-medium text-araca-cafe-escuro transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                }}
              >
                <span className="relative z-10 font-medium">Conheça</span>
                <div 
                  className="absolute inset-0 rounded-full opacity-0 transition-all duration-500 group-hover/btn:opacity-100"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(219, 152, 71, 0.2) 0%, transparent 70%)',
                  }}
                />
              </button>
            </div>
            
            {/* Indicador de mais imagens */}
            <div className="absolute bottom-8 right-8 flex items-center gap-1.5">
              {project.images.slice(0, 3).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 w-2 rounded-full backdrop-blur-sm ${idx === 0 ? 'bg-white/80' : 'bg-white/40'}`} 
                />
              ))}
              {project.images.length > 3 && (
                <span className="ml-1 text-sm font-medium text-white/80 drop-shadow-lg">
                  +{project.images.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Modal de galeria com navegação horizontal
export function ProjectGallery({ project, onClose }: ProjectGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const totalImages = project.images.length

  const goToNext = () => {
    setDirection('right')
    setCurrentImageIndex((prev) => (prev + 1) % totalImages)
  }

  const goToPrevious = () => {
    setDirection('left')
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const goToImage = (index: number) => {
    setDirection(index > currentImageIndex ? 'right' : 'left')
    setCurrentImageIndex(index)
  }

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-araca-cafe-escuro/95 p-4 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Container da Galeria */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative h-full w-full max-w-7xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-araca-bege-claro sm:text-4xl">
                {project.title}
              </h2>
              <p className="mt-2 text-araca-bege-claro/70">
                {project.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-araca-bege-claro backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110"
              aria-label="Fechar galeria"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Área da Imagem Principal */}
          <div className="relative flex h-[calc(100%-12rem)] items-center justify-center" style={{ perspective: '1500px' }}>
            {/* Botão Anterior */}
            <motion.button
              onClick={goToPrevious}
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(42px) saturate(180%)',
                WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  0 2px 8px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </motion.button>

            {/* Imagem */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentImageIndex}
                custom={direction}
                initial={{ 
                  opacity: 0, 
                  x: direction === 'right' ? 400 : -400,
                  scale: 0.8,
                  rotateY: direction === 'right' ? 35 : -35,
                  z: -300,
                  filter: 'blur(8px)',
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1,
                  rotateY: 0,
                  z: 0,
                  filter: 'blur(0px)',
                }}
                exit={{ 
                  opacity: 0.2, 
                  x: direction === 'right' ? -400 : 400,
                  scale: 0.8,
                  rotateY: direction === 'right' ? -35 : 35,
                  z: -300,
                  filter: 'blur(8px)',
                }}
                transition={{
                  x: { type: 'spring', stiffness: 250, damping: 35 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.4, ease: 'easeInOut' },
                  z: { duration: 0.4 },
                  filter: { duration: 0.4 },
                }}
                className="absolute inset-0 h-full w-full overflow-hidden rounded-3xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - Imagem ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Botão Próximo */}
            <motion.button
              onClick={goToNext}
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(42px) saturate(180%)',
                WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  0 2px 8px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-7 w-7" />
            </motion.button>
          </div>

          {/* Navegação de Miniaturas + Indicadores */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {project.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToImage(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: index === currentImageIndex ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-2 ring-araca-dourado-ocre ring-offset-2 ring-offset-araca-cafe-escuro'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Contador */}
            <div 
              className="rounded-full px-4 py-2 text-sm font-medium text-araca-bege-claro"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(42px) saturate(180%)',
                WebkitBackdropFilter: 'blur(42px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              {currentImageIndex + 1} / {totalImages}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
