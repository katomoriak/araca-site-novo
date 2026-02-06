'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassInput } from '@/components/ui/GlassInput'

export function DSForms() {
  const [toggle, setToggle] = useState(false)
  const [radio, setRadio] = useState('a')

  return (
    <section id="forms" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-foreground">Forms</h2>
      <p className="mt-1 text-muted-foreground">
        GlassInput (Aracá), Text Input, Textarea, Select, Checkboxes, Radio, Toggle.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              GlassInput — Componente Aracá
            </h3>
            <GlassInput label="Seu e-mail" placeholder="email@exemplo.com" />
          </div>
          <div>
            <GlassInput label="Nome completo" placeholder="Digite seu nome" />
          </div>
          <div>
            <GlassInput placeholder="Sem label" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Text Input (padrão)
            </label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full rounded-xl border border-border bg-[var(--input-background)] px-4 py-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Com ícone</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full rounded-xl border border-border bg-[var(--input-background)] py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Error state</label>
            <input
              type="text"
              defaultValue="valor inválido"
              className="w-full rounded-xl border-2 border-error bg-[var(--input-background)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-error/30"
            />
            <p className="mt-1 text-xs text-error">Campo obrigatório</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Disabled</label>
            <GlassInput placeholder="Disabled" disabled />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Textarea</label>
            <textarea
              placeholder="Escreva aqui..."
              rows={4}
              className="w-full resize-y rounded-xl border border-border bg-[var(--input-background)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Select</label>
            <select className="w-full rounded-xl border border-border bg-[var(--input-background)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>Opção A</option>
              <option>Opção B</option>
              <option>Opção C</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Checkboxes</p>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Checked</span>
            </label>
            <label className="mt-1 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Unchecked</span>
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Radio buttons</p>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="demo-radio"
                  checked={radio === 'a'}
                  onChange={() => setRadio('a')}
                  className="h-4 w-4 border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Opção A</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="demo-radio"
                  checked={radio === 'b'}
                  onChange={() => setRadio('b')}
                  className="h-4 w-4 border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Opção B</span>
              </label>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Toggle switch</p>
            <button
              type="button"
              role="switch"
              aria-checked={toggle}
              onClick={() => setToggle((v) => !v)}
              className={cn(
                'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                toggle ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
                  toggle ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </button>
            <span className="ml-2 text-sm text-muted-foreground">{toggle ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
