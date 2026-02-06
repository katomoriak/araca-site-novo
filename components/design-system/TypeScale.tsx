import { cn } from '@/lib/utils'

const scale = [
  { name: 'xs', class: 'text-xs', example: '12px' },
  { name: 'sm', class: 'text-sm', example: '14px' },
  { name: 'base', class: 'text-base', example: '16px' },
  { name: 'lg', class: 'text-lg', example: '18px' },
  { name: 'xl', class: 'text-xl', example: '20px' },
  { name: '2xl', class: 'text-2xl', example: '24px' },
  { name: '3xl', class: 'text-3xl', example: '30px' },
  { name: '4xl', class: 'text-4xl', example: '36px' },
]

export function TypeScale() {
  return (
    <div className="space-y-4">
      {scale.map(({ name, class: c, example }) => (
        <div
          key={name}
          className="flex flex-wrap items-baseline justify-between gap-4 border-b border-neutral-100 pb-4 last:border-0"
        >
          <span className={cn('font-primary text-neutral-900', c)}>
            Type scale {name}
          </span>
          <span className="font-mono text-xs text-neutral-500">{example}</span>
        </div>
      ))}
    </div>
  )
}
