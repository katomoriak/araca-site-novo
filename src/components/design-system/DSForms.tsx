'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DSForms() {
  const [toggle, setToggle] = useState(false)
  const [radio, setRadio] = useState('a')

  return (
    <section id="forms" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Forms</h2>
      <p className="mt-1 text-neutral-600">
        Text Input (default, com ícone, erro, disabled), Textarea, Select, Checkboxes, Radio, Toggle.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Text Input (default)</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">With icon</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Error state</label>
            <input
              type="text"
              defaultValue="valor inválido"
              className="w-full rounded-lg border-2 border-red-500 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <p className="mt-1 text-xs text-red-600">Campo obrigatório</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Disabled</label>
            <input
              type="text"
              placeholder="Disabled"
              disabled
              className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Textarea</label>
            <textarea
              placeholder="Escreva aqui..."
              rows={4}
              className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Select</label>
            <select className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option>Opção A</option>
              <option>Opção B</option>
              <option>Opção C</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">Checkboxes</p>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm">Checked</span>
            </label>
            <label className="mt-1 flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm">Unchecked</span>
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">Radio buttons</p>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="demo-radio"
                  checked={radio === 'a'}
                  onChange={() => setRadio('a')}
                  className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Opção A</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="demo-radio"
                  checked={radio === 'b'}
                  onChange={() => setRadio('b')}
                  className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Opção B</span>
              </label>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">Toggle switch</p>
            <button
              type="button"
              role="switch"
              aria-checked={toggle}
              onClick={() => setToggle((v) => !v)}
              className={cn(
                'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                toggle ? 'bg-primary-600' : 'bg-neutral-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
                  toggle ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </button>
            <span className="ml-2 text-sm text-neutral-600">{toggle ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
