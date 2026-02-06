'use client'

import { CopyButton } from './CopyButton'

/* Paleta oficial Aracá Interiores */
const aracaPrincipal = [
  { name: 'Café Escuro', class: 'bg-araca-cafe-escuro', value: '#30160C' },
  { name: 'Laranja Queimado', class: 'bg-araca-laranja-queimado', value: '#944B20' },
  { name: 'Chocolate Amargo', class: 'bg-araca-chocolate-amargo', value: '#473018' },
  { name: 'Dourado Ocre', class: 'bg-araca-dourado-ocre', value: '#DB9847' },
  { name: 'Verde Pinho Escuro', class: 'bg-araca-verde-pinho-escuro', value: '#111913' },
  { name: 'Mineral Green', class: 'bg-araca-mineral-green', value: '#3C5945' },
  { name: 'Vinho Escuro', class: 'bg-araca-vinho-escuro', value: '#26161B' },
  { name: 'Ameixa', class: 'bg-araca-ameixa', value: '#502632' },
  { name: 'Rifle Green', class: 'bg-araca-rifle-green', value: '#444340' },
  { name: 'Bege Claro', class: 'bg-araca-bege-claro', value: '#ECE5DB' },
]

const aracaEstendida = [
  { name: 'Café Médio', class: 'bg-araca-cafe-medio', value: '#5A3020' },
  { name: 'Laranja Médio', class: 'bg-araca-laranja-medio', value: '#B86938' },
  { name: 'Dourado Claro', class: 'bg-araca-dourado-claro', value: '#E8B56F' },
  { name: 'Verde Médio', class: 'bg-araca-verde-medio', value: '#4A6B54' },
  { name: 'Verde Claro', class: 'bg-araca-verde-claro', value: '#658972' },
  { name: 'Ameixa Médio', class: 'bg-araca-ameixa-medio', value: '#6D3D4C' },
  { name: 'Bege Médio', class: 'bg-araca-bege-medio', value: '#D4C8BA' },
  { name: 'Creme', class: 'bg-araca-creme', value: '#F5F1ED' },
]

const semanticColors = [
  { name: 'Background', class: 'bg-background', value: 'var(--background)' },
  { name: 'Foreground', class: 'bg-foreground', value: 'var(--foreground)' },
  { name: 'Primary', class: 'bg-primary', value: 'var(--primary)' },
  { name: 'Secondary', class: 'bg-secondary', value: 'var(--secondary)' },
  { name: 'Accent', class: 'bg-accent', value: 'var(--accent)' },
  { name: 'Muted', class: 'bg-muted', value: 'var(--muted)' },
  { name: 'Success', class: 'bg-success', value: '#22c55e' },
  { name: 'Warning', class: 'bg-warning', value: '#f59e0b' },
  { name: 'Error', class: 'bg-error', value: '#ef4444' },
]

const gradients = [
  { id: 'araca-hero', label: 'Aracá Hero', class: 'bg-gradient-to-br from-araca-mineral-green via-araca-dourado-ocre/80 to-araca-ameixa' },
  { id: 'terroso', label: 'Terroso', class: 'bg-gradient-to-br from-araca-cafe-escuro via-araca-chocolate-amargo to-araca-laranja-queimado' },
  { id: 'naturaleza', label: 'Naturaleza', class: 'bg-gradient-to-r from-araca-mineral-green via-araca-verde-claro to-araca-dourado-ocre' },
  { id: 'glass', label: 'Glass', class: 'bg-gradient-to-br from-white/30 via-white/10 to-transparent' },
  { id: 'dark', label: 'Dark', class: 'bg-gradient-to-br from-araca-cafe-escuro via-araca-verde-pinho-escuro to-black' },
  { id: 'creme-soft', label: 'Creme Soft', class: 'bg-gradient-to-br from-araca-creme via-araca-bege-claro to-araca-bege-medio' },
]

function ColorSwatch({
  label,
  tailwindClass,
  value,
  darkText = false,
}: {
  label: string
  tailwindClass: string
  value: string
  darkText?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`h-14 w-full rounded-lg border border-border ${tailwindClass} ${darkText ? 'border-white/20' : ''}`}
      />
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-medium ${darkText ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
          {label}
        </span>
        <CopyButton value={value} label="Copiar" />
      </div>
    </div>
  )
}

export function DSColors() {
  return (
    <section id="colors" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-foreground">Colors</h2>
      <p className="mt-1 text-muted-foreground">
        Paleta oficial Aracá Interiores — cores principais, estendidas, semânticas e gradientes.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cores Principais (10)
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {aracaPrincipal.map((c) => (
              <ColorSwatch
                key={c.name}
                label={c.name}
                tailwindClass={c.class}
                value={c.value}
                darkText={['bege-claro', 'bege-medio', 'creme', 'dourado-claro'].some((x) =>
                  c.class.includes(x)
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cores Estendidas (8)
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {aracaEstendida.map((c) => (
              <ColorSwatch
                key={c.name}
                label={c.name}
                tailwindClass={c.class}
                value={c.value}
                darkText={['bege-claro', 'bege-medio', 'creme', 'dourado-claro'].some((x) =>
                  c.class.includes(x)
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cores Semânticas (Design System)
          </h3>
          <div className="mt-3 flex flex-wrap gap-4">
            {semanticColors.map((c) => (
              <div key={c.name} className="flex flex-col gap-1">
                <div
                  className={`h-12 w-28 rounded-lg border border-border ${c.class} ${
                    ['Background', 'Muted', 'Creme'].includes(c.name) ? 'border-foreground/10' : ''
                  }`}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{c.name}</span>
                  <CopyButton value={c.value} label="Copiar" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Gradients (6)
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gradients.map((g) => (
              <div key={g.id} className="flex flex-col gap-2">
                <div className={`h-24 w-full rounded-xl border border-border ${g.class}`} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{g.label}</span>
                  <CopyButton value={`${g.class}`} label="Copiar class" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
