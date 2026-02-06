'use client'

import { useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

export function LiquidGlassCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [isPointer, setIsPointer] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const mousePos = useRef<Position>({ x: 0, y: 0 })
  const cursorPos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      
      // Verifica se está sobre elemento clicável
      const target = e.target as HTMLElement
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a, button, [role="button"], input, select, textarea, [data-cursor-hover]') !== null
      
      setIsPointer(isClickable)
    }

    const onMouseDown = () => setIsPressed(true)
    const onMouseUp = () => setIsPressed(false)

    // Animação com física suave (easing spring-like)
    const animate = () => {
      const cursor = cursorRef.current
      const inner = innerRef.current
      if (!cursor || !inner) return

      // Física de mola suave para movimento fluido
      const spring = 0.15
      const friction = 0.7

      // Calcula diferença entre posição atual e alvo
      const dx = mousePos.current.x - cursorPos.current.x
      const dy = mousePos.current.y - cursorPos.current.y

      // Aplica velocidade
      velocity.current.x += dx * spring
      velocity.current.y += dy * spring

      // Aplica fricção
      velocity.current.x *= friction
      velocity.current.y *= friction

      // Atualiza posição
      cursorPos.current.x += velocity.current.x
      cursorPos.current.y += velocity.current.y

      // Calcula velocidade para efeito de mola (espichar)
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)
      const maxSpeed = 20
      const stretch = Math.min(speed / maxSpeed, 1)

      // Aplica transformação na posição
      cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      
      // Efeito de mola sutil - espicha na direção horizontal/vertical sem rotação
      const scaleX = 1 + stretch * 0.15
      const scaleY = 1 - stretch * 0.08
      
      inner.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`

      rafId.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.body.classList.add('has-liquid-cursor')
    
    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.classList.remove('has-liquid-cursor')
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        .liquid-cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          margin: -16px 0 0 -16px;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .liquid-cursor-container.is-pointer {
          width: 48px;
          height: 48px;
          margin: -24px 0 0 -24px;
        }

        .liquid-cursor-container.is-pressed {
          width: 28px;
          height: 28px;
          margin: -14px 0 0 -14px;
        }

        .liquid-cursor-inner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(3px) saturate(180%);
          -webkit-backdrop-filter: blur(3px) saturate(180%);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 8px 40px rgba(0, 0, 0, 0.08);
          will-change: transform;
          transition: background 0.2s ease;
        }

        .liquid-cursor-container.is-pointer .liquid-cursor-inner {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .liquid-cursor-container.is-pressed .liquid-cursor-inner {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Brilho superior (característica do glass da Apple) */
        .liquid-cursor-inner::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 35%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 50%;
          filter: blur(4px);
        }

        /* Reflexo inferior */
        .liquid-cursor-inner::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 25%;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0) 100%
          );
          border-radius: 50%;
          filter: blur(3px);
        }

        /* Oculta cursor padrão */
        :global(body.has-liquid-cursor),
        :global(body.has-liquid-cursor *) {
          cursor: none !important;
        }

        /* Desabilita em dispositivos touch */
        @media (pointer: coarse) {
          .liquid-cursor-container {
            display: none !important;
          }
          
          :global(body.has-liquid-cursor),
          :global(body.has-liquid-cursor *) {
            cursor: auto !important;
          }
        }
      `}</style>

      <div
        ref={cursorRef}
        className={`liquid-cursor-container ${isPointer ? 'is-pointer' : ''} ${isPressed ? 'is-pressed' : ''}`}
        aria-hidden="true"
      >
        <div ref={innerRef} className="liquid-cursor-inner" />
      </div>
    </>
  )
}
