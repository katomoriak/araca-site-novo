'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import LiquidGlass from 'liquid-glass-react'

const SIZE_BASE = 20
const SIZE_HOVER = 44
const FISHEYE_SCALE = 1.08
const ZOOM_SCALE = 2.0

const HOVER_SELECTORS = 'a, button, [role="button"], input, select, textarea, [data-cursor-hover], [href]'

function copyComputedStyles(source: Element, target: Element) {
  const computed = window.getComputedStyle(source)
  const position = computed.getPropertyValue('position')
  const isFixed = position === 'fixed'

  const criticalProps = [
    'transform', 'opacity', 'filter', 'background', 'backgroundColor',
    'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat',
    'color', 'font', 'fontSize', 'fontWeight', 'lineHeight',
    'border', 'borderRadius', 'boxShadow', 'textShadow',
    'width', 'height', 'margin', 'padding',
    'display', 'zIndex',
    'animation', 'transition', 'animationName', 'animationDuration',
    'animationTimingFunction', 'animationDelay', 'animationIterationCount',
    'animationDirection', 'animationFillMode', 'animationPlayState',
    'backdropFilter', 'WebkitBackdropFilter'
  ]

  criticalProps.forEach(prop => {
    try {
      const value = computed.getPropertyValue(prop)
      if (value && target instanceof HTMLElement) {
        target.style.setProperty(prop, value, 'important')
      }
    } catch {
      // ignore
    }
  })

  if (target instanceof HTMLElement) {
    if (isFixed && source instanceof Element) {
      const scrollX = window.scrollX || window.pageXOffset || 0
      const scrollY = window.scrollY || window.pageYOffset || 0
      const rect = source.getBoundingClientRect()
      target.style.setProperty('position', 'absolute', 'important')
      target.style.setProperty('top', `${rect.top + scrollY}px`, 'important')
      target.style.setProperty('left', `${rect.left + scrollX}px`, 'important')
      target.style.setProperty('right', 'auto', 'important')
      target.style.setProperty('bottom', 'auto', 'important')
    } else {
      target.style.setProperty('position', position, 'important')
      ;['top', 'left', 'right', 'bottom'].forEach(prop => {
        const value = computed.getPropertyValue(prop)
        if (value && value !== 'auto') {
          target.style.setProperty(prop, value, 'important')
        }
      })
    }
  }

  const animations = source.getAnimations?.()
  if (animations && target instanceof HTMLElement) {
    animations.forEach(anim => {
      if (anim instanceof CSSAnimation) {
        const currentTime = anim.currentTime as number
        const animName = anim.animationName
        target.style.animationPlayState = 'paused'
        target.style.animationName = animName
        if (currentTime !== null) {
          target.style.animationDelay = `-${currentTime}ms`
        }
      }
    })
  }
}

function deepCloneWithStyles(node: Node, skipSelectors: string[] = []): Node {
  const clone = node.cloneNode(false)

  if (node instanceof Element && clone instanceof Element) {
    clone.removeAttribute('id')
    const shouldSkip = skipSelectors.some(selector => {
      try {
        return node.matches(selector)
      } catch {
        return false
      }
    })
    if (shouldSkip) return clone
    copyComputedStyles(node, clone)
    node.childNodes.forEach(child => {
      clone.appendChild(deepCloneWithStyles(child, skipSelectors))
    })
  } else if (node.nodeType === Node.TEXT_NODE) {
    return node.cloneNode(false)
  }
  return clone
}

export function GlassCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const [isHover, setIsHover] = useState(false)
  const [mounted, setMounted] = useState(false)

  const rafUpdate = useRef<number>(0)
  const rafClone = useRef<number>(0)
  const posRef = useRef({ x: -100, y: -100 })
  const zoomRef = useRef<HTMLDivElement>(null)
  const cloneRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const lastCloneTime = useRef<number>(0)
  const isUpdating = useRef<boolean>(false)

  const checkHover = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY)
    if (!el) return false
    return Boolean(el.closest(HOVER_SELECTORS))
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const onScroll = () => {
      setScroll({
        x: window.scrollX || window.pageXOffset || 0,
        y: window.scrollY || window.pageYOffset || 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted || !zoomRef.current) return

    const updateClone = () => {
      if (isUpdating.current) return
      const now = performance.now()
      if (now - lastCloneTime.current < 16) return

      isUpdating.current = true
      lastCloneTime.current = now
      const zoomEl = zoomRef.current
      if (!zoomEl) {
        isUpdating.current = false
        return
      }

      if (rafClone.current) cancelAnimationFrame(rafClone.current)
      rafClone.current = requestAnimationFrame(() => {
        try {
          zoomEl.innerHTML = ''
          const bodyClone = deepCloneWithStyles(document.body, [
            '.glass-cursor',
            '[data-cursor-clone]',
            'script',
            'noscript'
          ]) as HTMLElement
          bodyClone.setAttribute('data-cursor-clone', 'true')

          const bodyStyles = window.getComputedStyle(document.body)
          ;['background', 'backgroundColor', 'color', 'font', 'fontSize'].forEach(prop => {
            const value = bodyStyles.getPropertyValue(prop)
            if (value) bodyClone.style.setProperty(prop, value)
          })

          cloneRef.current = bodyClone
          zoomEl.appendChild(bodyClone)
        } catch (error) {
          console.error('Erro ao atualizar clone:', error)
        }
        isUpdating.current = false
      })
    }

    updateClone()
    observerRef.current = new MutationObserver(mutations => {
      const hasSignificantChanges = mutations.some(m =>
        m.type === 'childList' || (m.type === 'attributes' && m.attributeName !== 'style')
      )
      if (hasSignificantChanges) updateClone()
    })

    observerRef.current.observe(document.body, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'data-*']
    })

    const animationLoop = () => {
      updateClone()
      rafClone.current = requestAnimationFrame(animationLoop)
    }
    rafClone.current = requestAnimationFrame(animationLoop)

    return () => {
      observerRef.current?.disconnect()
      if (rafClone.current) cancelAnimationFrame(rafClone.current)
      cloneRef.current = null
      isUpdating.current = false
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (rafUpdate.current) cancelAnimationFrame(rafUpdate.current)
      rafUpdate.current = requestAnimationFrame(() => {
        setPos(posRef.current)
        setIsHover(checkHover(posRef.current.x, posRef.current.y))
        rafUpdate.current = 0
      })
    }

    const onLeave = () => {
      setPos({ x: -100, y: -100 })
      setIsHover(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.body.addEventListener('mouseleave', onLeave)
    document.body.classList.add('has-glass-cursor')

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-glass-cursor')
      if (rafUpdate.current) cancelAnimationFrame(rafUpdate.current)
    }
  }, [mounted, checkHover])

  if (!mounted) return null

  const size = isHover ? SIZE_HOVER : SIZE_BASE
  const scale = isHover ? FISHEYE_SCALE : 1
  const viewportX = pos.x
  const viewportY = pos.y
  const absoluteX = viewportX + scroll.x
  const absoluteY = viewportY + scroll.y
  const centerX = size / 2
  const centerY = size / 2
  const zoomCenterX = centerX
  const zoomCenterY = centerY
  const zoomAbsoluteX = -absoluteX
  const zoomAbsoluteY = -absoluteY

  return (
    <div
      className="glass-cursor"
      aria-hidden
      style={{
        '--cursor-x': `${pos.x}px`,
        '--cursor-y': `${pos.y}px`,
        '--cursor-size': `${size}px`,
        '--cursor-scale': scale,
        '--zoom-scale': ZOOM_SCALE,
        '--zoom-center-x': `${zoomCenterX}px`,
        '--zoom-center-y': `${zoomCenterY}px`,
        '--zoom-absolute-x': `${zoomAbsoluteX}px`,
        '--zoom-absolute-y': `${zoomAbsoluteY}px`,
      } as React.CSSProperties}
    >
      <LiquidGlass
        className="glass-cursor-liquid"
        cornerRadius={999}
        displacementScale={50}
        blurAmount={0.06}
        saturation={140}
        elasticity={0.2}
        mode="standard"
        globalMousePos={pos}
        padding="0"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <div ref={zoomRef} className="glass-cursor-zoom" />
      </LiquidGlass>
    </div>
  )
}
