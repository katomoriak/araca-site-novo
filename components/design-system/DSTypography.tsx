'use client'

const typeScale = [
  { name: 'display', class: 'font-display text-5xl font-bold', sample: 'Display' },
  { name: 'h1', class: 'font-display text-4xl font-bold', sample: 'Heading 1' },
  { name: 'h2', class: 'font-display text-3xl font-semibold', sample: 'Heading 2' },
  { name: 'h3', class: 'font-display text-2xl font-semibold', sample: 'Heading 3' },
  { name: 'h4', class: 'font-display text-xl font-semibold', sample: 'Heading 4' },
  { name: 'h5', class: 'font-display text-lg font-semibold', sample: 'Heading 5' },
  { name: 'h6', class: 'font-display text-base font-semibold', sample: 'Heading 6' },
  { name: 'body-xl', class: 'font-body text-xl', sample: 'Body XL' },
  { name: 'body-lg', class: 'font-body text-lg', sample: 'Body LG' },
  { name: 'body', class: 'font-body text-base', sample: 'Body' },
  { name: 'body-sm', class: 'font-body text-sm', sample: 'Body SM' },
  { name: 'caption', class: 'font-body text-xs text-muted-foreground', sample: 'Caption' },
]

const fontSamples = [
  {
    name: 'Display: Cormorant Garamond',
    usage: 'Títulos e destaques',
    weights: [300, 400, 500, 600, 700],
    fontClass: 'font-display',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'Body: Rubik',
    usage: 'Corpo de texto e UI',
    weights: [300, 400, 500, 600, 700],
    fontClass: 'font-body',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'Mono: JetBrains Mono',
    usage: 'Code',
    weights: [400, 500, 700],
    fontClass: 'font-mono',
    sample: 'const x = 42; // code sample',
  },
]

export function DSTypography() {
  return (
    <section id="typography" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-foreground">Typography</h2>
      <p className="mt-1 text-muted-foreground">
        Cormorant Garamond (títulos) e Rubik (corpo). Escala de tipos display, h1–h6, body, caption.
      </p>

      <div className="mt-8 space-y-12">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Font families
          </h3>
          <div className="mt-4 space-y-8">
            {fontSamples.map((f) => (
              <div
                key={f.name}
                className="rounded-xl border border-border bg-background p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display text-lg font-semibold text-foreground">
                    {f.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{f.usage}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-6">
                  {f.weights.map((w) => (
                    <div key={w} className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{w}</span>
                      <span className={f.fontClass} style={{ fontWeight: w }}>
                        {f.sample}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Type scale
          </h3>
          <div className="mt-4 space-y-4">
            {typeScale.map((t) => (
              <div
                key={t.name}
                className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4"
              >
                <span className="text-sm font-mono text-muted-foreground">{t.name}</span>
                <span className={t.class}>{t.sample}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
