'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Container } from './Container'
import { cn } from '@/lib/utils'
import { useGalleryOpen } from '@/components/context/GalleryOpenContext'

export type SiteNavTheme = 'dark-bg' | 'light-bg'

export interface SiteNavLink {
  href: string
  label: string
}

const DEFAULT_LINKS: SiteNavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/#contato', label: 'Contato' },
  { href: '/blog', label: 'Blog' },
]

/** Cor do logo: default = branco (dark-bg) ou original (light-bg); cafe = tom café para contraste em fundo claro */
export type SiteNavLogoVariant = 'default' | 'cafe'

export interface SiteNavProps {
  /** Tema: dark-bg = sobre vídeo/fundo escuro (texto claro); light-bg = sobre fundo claro (texto escuro) */
  theme?: SiteNavTheme
  /** Variante do logo: 'cafe' exibe o logo no tom café (bom para fundo claro) */
  logoVariant?: SiteNavLogoVariant
  /** Links customizados; padrão: Home, Sobre nós, Projetos, Blog, Contato */
  links?: SiteNavLink[]
  /** Links extras exibidos após os principais (ex: Design System, Admin) */
  extraLinks?: SiteNavLink[]
  className?: string
  /** Se true, não usa animação de entrada (ex: quando já está dentro de uma section animada) */
  noEnterAnimation?: boolean
}

const liquidGlassBarStyles = (theme: SiteNavTheme) =>
  theme === 'dark-bg'
    ? {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
        backdropFilter: 'blur(42px) saturate(180%)',
        WebkitBackdropFilter: 'blur(42px) saturate(180%)' as const,
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }
    : {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(42px) saturate(180%)',
        WebkitBackdropFilter: 'blur(42px) saturate(180%)' as const,
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(0, 0, 0, 0.06)
        `,
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }

// Filtro para o SVG do logo (#d9b38a) ficar no tom café (#30160C): normaliza para preto e aplica filtro que gera o marrom
const LOGO_CAFE_FILTER =
  'brightness(0) saturate(100%) invert(9%) sepia(63%) saturate(1000%) hue-rotate(315deg) brightness(95%) contrast(92%)'

export function SiteNav({
  theme = 'dark-bg',
  logoVariant = 'default',
  links = DEFAULT_LINKS,
  extraLinks,
  className,
  noEnterAnimation = false,
}: SiteNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { galleryOpen } = useGalleryOpen()
  const allLinks = extraLinks ? [...links, ...extraLinks] : links

  if (galleryOpen) return null

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('#')) return false
    return pathname.startsWith(href)
  }

  const isDark = theme === 'dark-bg'
  const barStyle = liquidGlassBarStyles(theme)
  const useCafeLogo = logoVariant === 'cafe'
  const desktopLogoStyle = isDark ? { filter: 'brightness(0) invert(1)' } : useCafeLogo ? { filter: LOGO_CAFE_FILTER } : undefined
  const mobileLogoStyle = isDark ? { filter: 'brightness(0) invert(1)' } : useCafeLogo ? { filter: LOGO_CAFE_FILTER } : undefined

  const navContent = (
    <>
      <Container>
        <nav className="flex h-20 items-center justify-center">
          {/* Desktop - Liquid Glass bar */}
          <div
            className="hidden w-[80%] max-w-[1024px] items-center justify-between gap-6 rounded-full px-6 py-3 md:flex"
            style={barStyle}
          >
            <Link
              href="/"
              className="relative flex items-center transition-all duration-300 hover:opacity-90"
            >
              <Image
                src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                alt="Aracá Interiores"
                width={80}
                height={60}
                className={cn(
                  'h-auto w-[70px] transition-all duration-300 sm:w-[80px]',
                  isDark
                    ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                    : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                )}
                style={desktopLogoStyle}
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              {allLinks.map((link) => {
                const active = isActive(link.href)
                const isHash = link.href.startsWith('#')
                const href = isHash ? `/${link.href}` : link.href
                const isBlog = link.href === '/blog'

                /* Blog: destaque verde com hover mais escuro e scale */
                if (isBlog) {
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-araca-creme transition-all duration-300 hover:scale-[1.05] [--blog-bg:var(--araca-mineral-green)] hover:[--blog-bg:var(--araca-mineral-green-hover)]"
                      style={{
                        backgroundColor: 'var(--blog-bg)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                }

                if (active && isDark) {
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:scale-[1.05]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
                    </Link>
                  )
                }
                if (active && !isDark) {
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.05]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(48, 22, 12, 0.9) 0%, rgba(48, 22, 12, 0.75) 100%)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                }
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={cn(
                      'group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.05]',
                      isDark ? 'text-white/95 hover:text-white' : 'text-neutral-700 hover:text-neutral-900'
                    )}
                    style={isDark ? { textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' } : undefined}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          theme === 'dark-bg'
                            ? 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
                            : 'radial-gradient(circle at center, rgba(0,0,0,0.06) 0%, transparent 70%)',
                      }}
                    />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile - Logo + Toggle */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/" className="relative flex items-center">
              <Image
                src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                alt="Aracá Interiores"
                width={60}
                height={50}
                className="h-auto w-[55px]"
                style={mobileLogoStyle}
                priority
              />
            </Link>
            <button
              type="button"
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm transition',
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/15'
              )}
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <div className="space-y-1.5">
                <span className={cn('block h-0.5 w-5', isDark ? 'bg-white' : 'bg-neutral-800')} />
                <span className={cn('block h-0.5 w-5', isDark ? 'bg-white' : 'bg-neutral-800')} />
                <span className={cn('block h-0.5 w-5', isDark ? 'bg-white' : 'bg-neutral-800')} />
              </div>
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed inset-0 z-50 backdrop-blur-md md:hidden',
              isDark ? 'bg-araca-cafe-escuro/95' : 'bg-araca-bege-claro/98'
            )}
          >
            <div className="flex min-h-screen flex-col">
              <div className="flex items-center justify-between p-6">
                <Link href="/" className="relative flex items-center" onClick={() => setMobileOpen(false)}>
                  <Image
                    src="/logotipos/LOGOTIPO_PRINCIPAL_COMTAGLINE.svg"
                    alt="Aracá Interiores"
                    width={70}
                    height={60}
                    className="h-auto w-[65px]"
                    style={mobileLogoStyle}
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition',
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/15'
                  )}
                  aria-label="Fechar menu"
                >
                  <X className={cn('h-6 w-6', isDark ? 'text-white' : 'text-neutral-800')} />
                </button>
              </div>

              <nav className="flex flex-1 items-center justify-center">
                <ul className="space-y-6 text-center">
                  {allLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * (i + 1) }}
                    >
                      <Link
                        href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                        className={cn(
                          'block font-display text-3xl font-semibold transition-colors',
                          isDark
                            ? 'text-white hover:text-araca-dourado-ocre'
                            : 'text-araca-cafe-escuro hover:text-araca-mineral-green'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  if (noEnterAnimation) {
    return <div className={cn('relative z-20', className)}>{navContent}</div>
  }

  return (
    <motion.div
      className={cn('relative z-20', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {navContent}
    </motion.div>
  )
}
