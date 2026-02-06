'use client'

import { ChevronsDown, Mouse, ArrowDown, MousePointerClick } from 'lucide-react'

export function DSScrollIndicators() {
  return (
    <section id="scroll-indicators" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-neutral-900">Scroll Indicators</h2>
      <p className="mt-1 text-neutral-600">
        Seis tipos em fundo escuro: Chevron animado, Mouse Scroll, Text + Arrow, Circular Progress, Dots, Click Mouse.
      </p>

      <div className="mt-8 grid gap-6 rounded-2xl bg-neutral-900 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Animated Chevron */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">1. Animated Chevron</span>
          <ChevronsDown className="mt-2 h-8 w-8 animate-scroll-down text-white/90" strokeWidth={2} />
        </div>

        {/* 2. Mouse Scroll */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">2. Mouse Scroll</span>
          <div className="mt-2 flex flex-col items-center">
            <Mouse className="h-8 w-8 text-white/90" />
            <span className="mt-1 h-1.5 w-1 rounded-full bg-white/80 animate-pulse-dot" />
          </div>
        </div>

        {/* 3. Text + Arrow */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">3. Text + Arrow</span>
          <p className="mt-2 text-sm text-white/90">Scroll para explorar</p>
          <ArrowDown className="mt-1 h-5 w-5 animate-scroll-down text-white/90" />
        </div>

        {/* 4. Circular Progress */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">4. Circular Progress</span>
          <svg className="mt-2 h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="30"
              strokeLinecap="round"
              className="animate-spin"
            />
          </svg>
        </div>

        {/* 5. Dots Indicator */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">5. Dots Indicator</span>
          <div className="mt-2 flex flex-col gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-scroll-down" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* 6. Click Mouse */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/80 py-10">
          <span className="text-xs font-medium uppercase text-neutral-500">6. Click Mouse</span>
          <MousePointerClick className="mt-2 h-8 w-8 animate-pulse text-white/90" />
        </div>
      </div>
    </section>
  )
}
