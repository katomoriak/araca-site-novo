'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Container } from '@/components/layout/Container'

interface ScrollTextRevealProps {
  texts: string[]
  highlights?: { [key: number]: string[] } // índice do texto e palavras a destacar
  className?: string
  textColor?: string // cor do texto (padrão: araca-cafe-escuro)
  highlightColors?: {
    gradient1: string // cor base do gradiente
    gradient2: string // cor intermediária
    gradient3: string // cor final
  }
}

export function ScrollTextReveal({ 
  texts, 
  highlights = {}, 
  className = '', 
  textColor = 'text-araca-cafe-escuro',
  highlightColors = {
    gradient1: '#FFD700',
    gradient2: '#FFC800',
    gradient3: '#FFE55C'
  }
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Intersection Observer para detectar quando o componente está visível
  useEffect(() => {
    const currentRef = containerRef.current
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Detecta quando entra/sai da viewport
          if (entry.isIntersecting) {
            console.log('Seção "Sobre Nós" está visível - ativando animações')
            setHasBeenSeen(true)
            setIsInView(true)
          } else {
            setIsInView(false)
          }
        })
      },
      {
        threshold: 0.1, // Ativa quando 10% do elemento está visível
        rootMargin: '0px'
      }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Divide o progresso do scroll pelo número de textos
      const progress = latest * texts.length * 1.2
      const newIndex = Math.min(
        Math.floor(progress),
        texts.length - 1
      )
      setActiveIndex(newIndex)
    })
  }, [scrollYProgress, texts.length])

  // Altura dinâmica baseada no número de textos (cada texto tem espaço para scroll)
  const sectionHeight = `${texts.length * 100}vh`

  // Função para renderizar texto com highlights
  const renderTextWithHighlight = (text: string, index: number) => {
    const wordsToHighlight = highlights[index] || []
    
    if (wordsToHighlight.length === 0) {
      return text
    }

    // Divide o texto em palavras e verifica se alguma deve ser destacada
    const parts = text.split(' ')
    let highlightCounter = 0 // Contador para palavras destacadas
    
    return (
      <>
        {parts.map((word, wordIndex) => {
          const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '')
          const shouldHighlight = wordsToHighlight.some(h => 
            cleanWord.includes(h.toLowerCase())
          )
          
          if (shouldHighlight) {
            const isActive = activeIndex === index
            const highlightIndex = highlightCounter
            highlightCounter++
            
            // Delay base de 0.3s + 0.4s para cada palavra subsequente
            const baseDelay = 0.3
            const delayPerWord = 0.4
            const totalDelay = baseDelay + (highlightIndex * delayPerWord)
            
            // Só anima se o elemento está ativo E a seção já foi vista
            const shouldAnimate = isActive && hasBeenSeen
            
            // Debug temporário
            if (isActive && wordIndex === 0) {
              console.log(`Texto ${index}: isActive=${isActive}, hasBeenSeen=${hasBeenSeen}, shouldAnimate=${shouldAnimate}`)
            }
            
            return (
              <span key={wordIndex} className="relative inline-block mx-2">
                <span className="relative z-10">{word}</span>
                {/* Marca-texto com efeito orgânico */}
                <motion.span
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={shouldAnimate ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ 
                    opacity: { duration: 0.1, delay: totalDelay },
                    scaleX: { duration: 0.5, delay: totalDelay, ease: "easeOut" }
                  }}
                  style={{ transformOrigin: 'left' }}
                >
                  {/* Camada 1 - Base do marca-texto */}
                  <span
                    className="absolute bottom-[0.05em] left-[-0.2em] right-[-0.2em] h-[0.65em]"
                    style={{
                      background: `linear-gradient(to bottom, transparent 0%, ${highlightColors.gradient1} 15%, ${highlightColors.gradient2} 85%, transparent 100%)`,
                      opacity: 0.6,
                      transform: 'skewY(-0.5deg)',
                      borderRadius: '40% 60% 45% 55%',
                    }}
                  />
                  {/* Camada 2 - Textura irregular */}
                  <span
                    className="absolute bottom-[0.08em] left-[-0.15em] right-[-0.15em] h-[0.55em]"
                    style={{
                      background: `linear-gradient(90deg, ${highlightColors.gradient3} 0%, ${highlightColors.gradient1} 20%, ${highlightColors.gradient2} 40%, ${highlightColors.gradient1} 60%, ${highlightColors.gradient3} 80%, ${highlightColors.gradient2} 100%)`,
                      opacity: 0.7,
                      transform: 'skewY(0.3deg)',
                      borderRadius: '50% 40% 55% 45%',
                    }}
                  />
                </motion.span>
              </span>
            )
          }
          
          return <span key={wordIndex} className="mx-1">{word}</span>
        })}
      </>
    )
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: sectionHeight }}>
      {/* Container sticky que mantém o texto fixo na viewport */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center py-8">
        <Container className="relative w-full flex items-center justify-center">
          <div className={`relative w-full flex items-center justify-center ${className}`}>
            {texts.map((text, index) => {
              const isActive = activeIndex === index
              const isExiting = activeIndex > index
              // Detecta se é um texto longo (mais de 80 caracteres)
              const isLongText = text.length > 80
              
              return (
                <motion.p
                  key={index}
                  className={`absolute inset-x-0 text-center font-display font-bold leading-tight ${textColor} px-[10%] ${
                    isLongText 
                      ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' 
                      : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.5,
                      ease: 'easeInOut',
                      // Adiciona delay na entrada, mas não na saída
                      delay: isActive && !isExiting ? 0.3 : 0
                    },
                    scale: {
                      duration: 0.5,
                      ease: 'easeInOut',
                      delay: isActive && !isExiting ? 0.3 : 0
                    }
                  }}
                >
                  {renderTextWithHighlight(text, index)}
                </motion.p>
              )
            })}
          </div>
        </Container>
      </div>

      {/* Indicadores de progresso (dots) - Só visível quando está na seção */}
      {isInView && hasBeenSeen && (
          <div className="fixed right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-3">
            {texts.map((_, index) => {
              const isPast = index < activeIndex
              const isActive = index === activeIndex
              const isFuture = index > activeIndex
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    // Calcula a posição de scroll para este índice
                    const container = containerRef.current
                    if (container) {
                      const scrollPerText = container.scrollHeight / texts.length
                      const targetScroll = container.offsetTop + (scrollPerText * index)
                      window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className="group relative flex items-center justify-center"
                  aria-label={`Ir para texto ${index + 1}`}
                >
                  {/* Dot/Barra - só o ativo fica alongado */}
                  <motion.span
                    className={`block rounded-full transition-all duration-500 ease-out ${
                      isActive
                        ? 'bg-araca-cafe-escuro'
                        : isPast
                        ? 'bg-araca-cafe-escuro hover:bg-araca-cafe-escuro'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    animate={{
                      width: isPast ? '7px' : '6px',
                      height: isActive ? '32px' : isPast ? '7px' : '6px',
                      opacity: 1,
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  />
                  
                  {/* Tooltip com número - aparece no hover */}
                  <motion.span 
                    className="pointer-events-none absolute right-10 whitespace-nowrap rounded-lg bg-araca-cafe-escuro px-3 py-1.5 text-xs font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-araca-cafe-escuro"></span>
                    {index + 1} de {texts.length}
                  </motion.span>
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
