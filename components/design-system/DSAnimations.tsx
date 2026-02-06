'use client'

import { useState } from 'react'

export function DSAnimations() {
  const [toggle, setToggle] = useState(false)

  return (
    <section id="animations" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Animations</h2>
      <p className="mt-1 text-neutral-600">
        Toggle on/off, animações CSS (fade-in, slide-up, bounce, spin, pulse), hover scale e nota sobre Framer Motion.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Toggle on/off</h3>
          <button
            type="button"
            onClick={() => setToggle((v) => !v)}
            className={`mt-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${toggle ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-700'}`}
          >
            {toggle ? 'On' : 'Off'}
          </button>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">CSS animations</h3>
          <div className="mt-3 flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-primary-500 animate-fade-in" />
              <span className="text-xs text-neutral-600">fade-in</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-secondary-500 animate-slide-up" />
              <span className="text-xs text-neutral-600">slide-up</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-primary-400 animate-bounce" />
              <span className="text-xs text-neutral-600">bounce</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-secondary-400 animate-spin" />
              <span className="text-xs text-neutral-600">spin</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-primary-600 animate-pulse" />
              <span className="text-xs text-neutral-600">pulse</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Hover scale</h3>
          <div className="mt-3 inline-block rounded-xl bg-neutral-200 p-6 transition-transform duration-200 hover:scale-105">
            <p className="text-sm font-medium text-neutral-700">Passe o mouse</p>
            <p className="text-xs text-neutral-500">hover:scale-105</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Framer Motion</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Para animações mais complexas (gestos, layout, exit), use Framer Motion. Exemplo:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-sm text-neutral-100">
{`import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo animado
</motion.div>`}
          </pre>
        </div>
      </div>
    </section>
  )
}
