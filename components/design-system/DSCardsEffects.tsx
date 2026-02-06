'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { GlassCard } from '@/components/ui/GlassCard'

export function DSCardsEffects() {
  return (
    <section id="cards-effects" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-foreground">Cards & Effects</h2>
      <p className="mt-1 text-muted-foreground">
        GlassCard (Aracá premium), Card padrão, Liquid Glass e efeitos hover.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            GlassCard — Componente Aracá (default, strong, subtle)
          </h3>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            <GlassCard variant="default" className="p-6">
              <h4 className="font-display text-lg font-semibold text-foreground">Default</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Variant default: bg-white/40, border-white/30. Glassmorphism premium.
              </p>
            </GlassCard>
            <GlassCard variant="strong" className="p-6">
              <h4 className="font-display text-lg font-semibold text-foreground">Strong</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Variant strong: borda mais definida. Destaque visual.
              </p>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6">
              <h4 className="font-display text-lg font-semibold text-foreground">Subtle</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Variant subtle: transparência leve. Sutil e elegante.
              </p>
            </GlassCard>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            GlassCard em gradient Aracá
          </h3>
          <div className="mt-3 rounded-2xl bg-gradient-to-br from-araca-mineral-green/80 to-araca-ameixa/80 p-6">
            <GlassCard variant="default" className="max-w-md p-6">
              <h4 className="font-display text-lg font-semibold text-foreground">Liquid Glass Aracá</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                GlassCard sobre gradient mineral-green → ameixa. Backdrop blur e highlights premium.
              </p>
            </GlassCard>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Standard Card
          </h3>
          <div className="mt-3 max-w-sm">
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fundo background, borda border. Uso geral para conteúdo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Card Glass (legado)
          </h3>
          <div className="mt-3 max-w-sm">
            <Card variant="glass" className="border-border">
              <CardHeader>
                <CardTitle>Glassmorphism</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  backdrop-blur com gradient sutil. Bom para overlays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Hover effects
          </h3>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            <GlassCard className="p-6 transition-transform duration-200 hover:scale-105">
              <p className="text-sm font-medium text-foreground">Scale</p>
              <p className="text-xs text-muted-foreground">hover:scale-105</p>
            </GlassCard>
            <GlassCard className="p-6 transition-shadow duration-200 hover:shadow-xl">
              <p className="text-sm font-medium text-foreground">Shadow</p>
              <p className="text-xs text-muted-foreground">hover:shadow-xl</p>
            </GlassCard>
            <GlassCard className="border-primary/50 p-6 transition-colors duration-200 hover:border-primary">
              <p className="text-sm font-medium text-foreground">Border color</p>
              <p className="text-xs text-muted-foreground">hover:border-primary</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
