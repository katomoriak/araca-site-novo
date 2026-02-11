'use client'

import { Button } from '@/components/ui/Button'
import { GlassButton } from '@/components/ui/GlassButton'
import { Plus, Loader } from 'lucide-react'

const buttonVariants = [
  { id: 'default', name: 'Default', variant: 'default' as const },
  { id: 'secondary', name: 'Secondary', variant: 'secondary' as const },
  { id: 'outline', name: 'Outline', variant: 'outline' as const },
  { id: 'ghost', name: 'Ghost', variant: 'ghost' as const },
  { id: 'link', name: 'Link', variant: 'link' as const },
  { id: 'destructive', name: 'Destructive', variant: 'destructive' as const },
]

const glassButtonVariants = [
  { id: 'primary', name: 'Primary', variant: 'primary' as const },
  { id: 'secondary', name: 'Secondary', variant: 'secondary' as const },
  { id: 'accent', name: 'Accent', variant: 'accent' as const },
  { id: 'glass', name: 'Glass', variant: 'glass' as const },
]

const sizes = [
  { id: 'sm', name: 'SM', size: 'sm' as const },
  { id: 'md', name: 'MD', size: 'md' as const },
  { id: 'lg', name: 'LG', size: 'lg' as const },
]

const codeExample = `import { GlassButton } from '@/components/ui/GlassButton'

<GlassButton variant="primary" size="md">Primary</GlassButton>
<GlassButton variant="accent">Accent</GlassButton>
<GlassButton variant="glass" size="lg">
  <Plus className="h-4 w-4" /> Adicionar
</GlassButton>`

export function DSButtons() {
  return (
    <section id="buttons" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-foreground">Buttons</h2>
      <p className="mt-1 text-muted-foreground">
        Button (legado), GlassButton (Aracá). Variants, sizes e exemplos com ícones.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            GlassButton — Componente Aracá (primary, secondary, accent, glass)
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {glassButtonVariants.map((v) => (
              <GlassButton key={v.id} variant={v.variant}>
                {v.name}
              </GlassButton>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            GlassButton sizes
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {sizes.map((s) => (
              <GlassButton key={s.id} size={s.size} variant="primary">
                Button
              </GlassButton>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            GlassButton com ícones
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <GlassButton variant="primary">
              <Plus className="h-4 w-4" /> Adicionar
            </GlassButton>
            <GlassButton variant="glass">
              <Loader className="h-4 w-4 animate-spin" /> Processando
            </GlassButton>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Button (legado) — Variants
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {buttonVariants.map((v) => (
              <Button key={v.id} variant={v.variant}>
                {v.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Code example
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-araca-cafe-escuro p-4 font-mono text-sm text-araca-bege-claro">
            {codeExample}
          </pre>
        </div>
      </div>
    </section>
  )
}
