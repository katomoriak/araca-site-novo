import { SectionNav } from '@/components/design-system/SectionNav'
import { DSColors } from '@/components/design-system/DSColors'

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
import { DSTypography } from '@/components/design-system/DSTypography'
import { DSIconGallery } from '@/components/design-system/DSIconGallery'
import { DSMenuVariations } from '@/components/design-system/DSMenuVariations'
import { DSScrollIndicators } from '@/components/design-system/DSScrollIndicators'
import { DSButtons } from '@/components/design-system/DSButtons'
import { DSCardsEffects } from '@/components/design-system/DSCardsEffects'
import { DSForms } from '@/components/design-system/DSForms'
import { DSLayout } from '@/components/design-system/DSLayout'
import { DSAnimations } from '@/components/design-system/DSAnimations'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <header className="mb-12">
          <h1 className="font-display text-4xl font-bold text-neutral-900 md:text-5xl">
            Design System Lab
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-neutral-600">
            Cores, tipografia, ícones, menus, scroll indicators, botões, cards, formulários, layout e animações.
            Navegação por smooth scroll na sidebar.
          </p>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <aside className="shrink-0 lg:w-56">
            <div className="mb-6 lg:mb-0">
              <SectionNav sections={SECTIONS} />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-20">
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
      </div>
    </div>
  )
}
