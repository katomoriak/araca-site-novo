import { Container } from '@/components/layout/Container'
import { SectionNav } from '@/components/design-system/SectionNav'
import { DSColors } from '@/components/design-system/DSColors'
import { DSTypography } from '@/components/design-system/DSTypography'
import { DSIconGallery } from '@/components/design-system/DSIconGallery'
import { DSMenuVariations } from '@/components/design-system/DSMenuVariations'
import { DSScrollIndicators } from '@/components/design-system/DSScrollIndicators'
import { DSButtons } from '@/components/design-system/DSButtons'
import { DSCardsEffects } from '@/components/design-system/DSCardsEffects'
import { DSForms } from '@/components/design-system/DSForms'
import { DSLayout } from '@/components/design-system/DSLayout'
import { DSAnimations } from '@/components/design-system/DSAnimations'

const SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'icon-gallery', label: 'Icon Gallery' },
  { id: 'menu-variations', label: 'Menu Variations' },
  { id: 'scroll-indicators', label: 'Scroll Indicators' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'cards-effects', label: 'Cards & Effects' },
  { id: 'forms', label: 'Forms' },
  { id: 'layout', label: 'Layout' },
  { id: 'animations', label: 'Animations' },
]

export const metadata = {
  title: 'Design System Lab — Aracá Interiores',
  description: 'Paleta Aracá, Cormorant Garamond, Rubik, GlassCard, GlassButton, GlassInput, glassmorphism premium.',
}

export default function DesignSystemPage() {
  return (
    <Container className="py-16">
      <div className="flex gap-12">
        <div className="min-w-0 flex-1">
          <header className="mb-16">
            <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Design System Lab
            </h1>
            <p className="mt-2 font-body text-sm font-medium text-primary">Aracá Interiores</p>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Paleta natural e terrosa, tipografia Cormorant Garamond + Rubik, componentes Glass
              (GlassCard, GlassButton, GlassInput), glassmorphism premium. Navegação por smooth scroll na sidebar.
            </p>
          </header>

          <div className="space-y-20">
            <DSColors />
            <DSTypography />
            <DSIconGallery />
            <DSMenuVariations />
            <DSScrollIndicators />
            <DSButtons />
            <DSCardsEffects />
            <DSForms />
            <DSLayout />
            <DSAnimations />
          </div>
        </div>

        <SectionNav sections={SECTIONS} className="w-48 shrink-0" />
      </div>
    </Container>
  )
}
