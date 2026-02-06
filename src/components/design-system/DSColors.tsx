'use client'

import { CopyButton } from './CopyButton'

const primaryMap: Record<number, { class: string; hex: string }> = {
  50: { class: 'bg-primary-50', hex: '#eff6ff' },
  100: { class: 'bg-primary-100', hex: '#dbeafe' },
  200: { class: 'bg-primary-200', hex: '#bfdbfe' },
  300: { class: 'bg-primary-300', hex: '#93c5fd' },
  400: { class: 'bg-primary-400', hex: '#60a5fa' },
  500: { class: 'bg-primary-500', hex: '#3b82f6' },
  600: { class: 'bg-primary-600', hex: '#2563eb' },
  700: { class: 'bg-primary-700', hex: '#1d4ed8' },
  800: { class: 'bg-primary-800', hex: '#1e40af' },
  900: { class: 'bg-primary-900', hex: '#1e3a8a' },
}

const secondaryMap: Record<number, { class: string; hex: string }> = {
  50: { class: 'bg-secondary-50', hex: '#faf5ff' },
  100: { class: 'bg-secondary-100', hex: '#f3e8ff' },
  200: { class: 'bg-secondary-200', hex: '#e9d5ff' },
  300: { class: 'bg-secondary-300', hex: '#d8b4fe' },
  400: { class: 'bg-secondary-400', hex: '#c084fc' },
  500: { class: 'bg-secondary-500', hex: '#a855f7' },
  600: { class: 'bg-secondary-600', hex: '#9333ea' },
  700: { class: 'bg-secondary-700', hex: '#7e22ce' },
  800: { class: 'bg-secondary-800', hex: '#6b21a8' },
  900: { class: 'bg-secondary-900', hex: '#581c87' },
}

const neutralMap: Record<number, { class: string; hex: string }> = {
  50: { class: 'bg-neutral-50', hex: '#fafafa' },
  100: { class: 'bg-neutral-100', hex: '#f5f5f5' },
  200: { class: 'bg-neutral-200', hex: '#e5e5e5' },
  300: { class: 'bg-neutral-300', hex: '#d4d4d4' },
  400: { class: 'bg-neutral-400', hex: '#a3a3a3' },
  500: { class: 'bg-neutral-500', hex: '#737373' },
  600: { class: 'bg-neutral-600', hex: '#525252' },
  700: { class: 'bg-neutral-700', hex: '#404040' },
  800: { class: 'bg-neutral-800', hex: '#262626' },
  900: { class: 'bg-neutral-900', hex: '#171717' },
}

const semanticColors = [
  { name: 'success', class: 'bg-[#22c55e]', value: '#22c55e' },
  { name: 'warning', class: 'bg-[#f59e0b]', value: '#f59e0b' },
  { name: 'error', class: 'bg-[#ef4444]', value: '#ef4444' },
  { name: 'info', class: 'bg-[#3b82f6]', value: '#3b82f6' },
]

const gradients = [
  { id: 'hero', label: 'Hero', class: 'bg-gradient-to-br from-primary-500 to-secondary-600' },
  { id: 'sunset', label: 'Sunset', class: 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-600' },
  { id: 'ocean', label: 'Ocean', class: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' },
  { id: 'glass', label: 'Glass', class: 'bg-gradient-to-br from-white/30 via-white/10 to-transparent' },
  { id: 'dark', label: 'Dark', class: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black' },
  { id: 'mesh', label: 'Mesh', class: 'bg-[radial-gradient(ellipse_at_top_right,_#a855f7,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_#3b82f6,_transparent_50%)]' },
]

function ColorSwatch({
  label,
  tailwindClass,
  value,
}: {
  label: string
  tailwindClass: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-12 w-full rounded-lg border border-neutral-200/80 ${tailwindClass}`} />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-600">{label}</span>
        <CopyButton value={value} label="Copiar hex" />
      </div>
    </div>
  )
}

export function DSColors() {
  return (
    <section id="colors" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Colors</h2>
      <p className="mt-1 text-neutral-600">
        Paletas primary (azul), secondary (roxo), neutral (cinza) e cores semânticas. Cada cor com copy to clipboard.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Primary (50–900)</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {(Object.keys(primaryMap) as unknown as number[]).map((s) => (
              <ColorSwatch
                key={s}
                label={`${s}`}
                tailwindClass={primaryMap[s].class}
                value={primaryMap[s].hex}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Secondary (50–900)</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {(Object.keys(secondaryMap) as unknown as number[]).map((s) => (
              <ColorSwatch
                key={s}
                label={`${s}`}
                tailwindClass={secondaryMap[s].class}
                value={secondaryMap[s].hex}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Neutral (50–900)</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {(Object.keys(neutralMap) as unknown as number[]).map((s) => (
              <ColorSwatch
                key={s}
                label={`${s}`}
                tailwindClass={neutralMap[s].class}
                value={neutralMap[s].hex}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Semantic</h3>
          <div className="mt-3 flex flex-wrap gap-4">
            {semanticColors.map((c) => (
              <div key={c.name} className="flex flex-col gap-1">
                <div className={`h-12 w-24 rounded-lg border border-neutral-200/80 ${c.class}`} />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-600">{c.name}</span>
                  <CopyButton value={c.value} label="Copiar" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Gradients (6)</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gradients.map((g) => (
              <div key={g.id} className="flex flex-col gap-2">
                <div className={`h-24 w-full rounded-xl ${g.class} border border-neutral-200/50`} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">{g.label}</span>
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
