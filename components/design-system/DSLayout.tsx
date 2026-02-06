'use client'

const containerSizes = [
  { name: 'sm', maxWidth: '768px', class: 'max-w-3xl' },
  { name: 'md', maxWidth: '1024px', class: 'max-w-5xl' },
  { name: 'lg', maxWidth: '1280px', class: 'max-w-6xl' },
]

const spacingScale = [
  { name: 'xs', value: '4px', class: 'p-1' },
  { name: 'sm', value: '8px', class: 'p-2' },
  { name: 'md', value: '16px', class: 'p-4' },
  { name: 'lg', value: '24px', class: 'p-6' },
  { name: 'xl', value: '32px', class: 'p-8' },
  { name: '2xl', value: '48px', class: 'p-12' },
  { name: '3xl', value: '64px', class: 'p-16' },
]

export function DSLayout() {
  return (
    <section id="layout" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Layout</h2>
      <p className="mt-1 text-neutral-600">
        Container sizes (sm 768px, md 1024px, lg 1280px), grid 2/3/4 colunas e escala de espaçamento.
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Container sizes</h3>
          <div className="mt-3 space-y-4">
            {containerSizes.map((c) => (
              <div key={c.name} className="border border-neutral-200">
                <p className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700">
                  {c.name} — max-width: {c.maxWidth}
                </p>
                <div className={`mx-auto ${c.class} border-2 border-dashed border-primary-300 bg-primary-50/30 py-4`}>
                  <p className="text-center text-sm text-primary-700">Container {c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Grid (2, 3, 4 columns)</h3>
          <div className="mt-3 space-y-6">
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-500">2 columns</p>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-lg bg-neutral-100 py-6 text-center text-sm text-neutral-600">
                    Col {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-500">3 columns</p>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-neutral-100 py-6 text-center text-sm text-neutral-600">
                    Col {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-500">4 columns</p>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg bg-neutral-100 py-6 text-center text-sm text-neutral-600">
                    Col {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Spacing scale (xs 4px → 3xl 64px)</h3>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            {spacingScale.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-1">
                <div className={`rounded border-2 border-primary-400 bg-primary-100 ${s.class}`} />
                <span className="text-xs font-medium text-neutral-600">{s.name}</span>
                <span className="text-xs text-neutral-500">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
