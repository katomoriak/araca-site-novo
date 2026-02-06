'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export function DSCardsEffects() {
  return (
    <section id="cards-effects" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Cards & Effects</h2>
      <p className="mt-1 text-neutral-600">
        Standard Card, Liquid Glass, Glassmorphism e hover effects (scale, shadow, border-color).
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Standard Card</h3>
          <div className="mt-3 max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600">
                  Fundo branco, borda e sombra leve. Uso geral para conteúdo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Liquid Glass Card</h3>
          <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary-500/80 to-secondary-600/80 p-6">
            <Card variant="glass" className="max-w-sm rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Liquid Glass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  backdrop-blur-xl bg-white/10 border border-white/20 em fundo gradient.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Glassmorphism Card</h3>
          <div className="mt-3 max-w-sm">
            <Card variant="glassmorphism" className="border-neutral-200/50">
              <CardHeader>
                <CardTitle>Glassmorphism</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600">
                  backdrop-blur-md com gradient sutil. Bom para overlays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Hover effects</h3>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            <Card className="transition-transform duration-200 hover:scale-105">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Scale</p>
                <p className="text-xs text-neutral-500">hover:scale-105</p>
              </CardContent>
            </Card>
            <Card className="transition-shadow duration-200 hover:shadow-lg">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Shadow</p>
                <p className="text-xs text-neutral-500">hover:shadow-lg</p>
              </CardContent>
            </Card>
            <Card className="transition-colors duration-200 hover:border-primary-400 hover:shadow-md">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Border color</p>
                <p className="text-xs text-neutral-500">hover:border-primary-400</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
