'use client'

import dynamic from 'next/dynamic'
import type { SilkProps } from './Silk'

const Silk = dynamic(
  () => import('@/components/dashboard/Silk').then((m) => ({ default: m.Silk })),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 bg-[#E8E0D5]"
        aria-hidden
      />
    ),
  }
)

/**
 * Fundo Silk (Three.js) carregado sob demanda para reduzir bundle inicial do dashboard.
 */
export function SilkDynamic(props: SilkProps) {
  return <Silk {...props} />
}
