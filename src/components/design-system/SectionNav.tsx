'use client'

const sections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'icon-gallery', label: 'Icon Gallery' },
  { id: 'menu-variations', label: 'Menu Variations' },
  { id: 'scroll-indicators', label: 'Scroll Indicators' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'cards-effects', label: 'Cards & Effects' },
  { id: 'forms', label: 'Forms' },
  { id: 'layout', label: 'Layout' },
  { id: 'animations', label: 'Animations' },
]

export function SectionNav() {
  return (
    <>
      <nav className="sticky top-20 hidden space-y-1 rounded-xl border border-neutral-200 bg-white/80 p-4 backdrop-blur-sm lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Seções
        </p>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="lg:hidden">
        <label htmlFor="ds-section" className="sr-only">Ir para seção</label>
        <select
          id="ds-section"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700"
          onChange={(e) => {
            const id = e.target.value
            if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <option value="">Seções...</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    </>
  )
}
