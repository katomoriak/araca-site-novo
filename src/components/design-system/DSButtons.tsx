'use client'

import { Button } from '@/components/ui/Button'
import { Plus, Loader } from 'lucide-react'

const variants = [
  { id: 'primary', name: 'Primary', variant: 'primary' as const },
  { id: 'secondary', name: 'Secondary', variant: 'secondary' as const },
  { id: 'outline', name: 'Outline', variant: 'outline' as const },
  { id: 'ghost', name: 'Ghost', variant: 'ghost' as const },
  { id: 'glass', name: 'Glass', variant: 'glass' as const },
]

const sizes = [
  { id: 'sm', name: 'SM', size: 'sm' as const },
  { id: 'md', name: 'MD', size: 'md' as const },
  { id: 'lg', name: 'LG', size: 'lg' as const },
]

const codeExample = `import { Button } from '@/components/ui/Button'

<Button variant="primary" size="md">Primary</Button>
<Button variant="outline" loading>Loading</Button>
<Button variant="glass" size="lg">
  <Plus className="h-4 w-4" /> Add
</Button>`

export function DSButtons() {
  return (
    <section id="buttons" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Buttons</h2>
      <p className="mt-1 text-neutral-600">
        Variants (primary, secondary, outline, ghost, glass), sizes (sm, md, lg), states e exemplos com ícones.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Variants</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {variants.map((v) => (
              <Button key={v.id} variant={v.variant}>{v.name}</Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Sizes</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {sizes.map((s) => (
              <Button key={s.id} size={s.size}>Button</Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">States</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button className="bg-primary-700">Hover (simulado)</Button>
            <Button className="ring-2 ring-primary-400">Active (simulado)</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Com ícones</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button>
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
            <Button variant="outline">
              <Loader className="h-4 w-4 animate-spin" /> Processando
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Icon only</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button size="sm" className="h-10 w-10 rounded-full p-0">
              <Plus className="h-5 w-5" />
            </Button>
            <Button size="sm" className="h-8 w-8 rounded-lg p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Code example</h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-sm text-neutral-100">
            {codeExample}
          </pre>
        </div>
      </div>
    </section>
  )
}
