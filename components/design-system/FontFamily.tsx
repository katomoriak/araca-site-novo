import { cn } from '@/lib/utils'

interface FontFamilyProps {
  name: string
  className?: string
  sample?: string
  fontClass?: 'font-primary' | 'font-secondary' | 'font-display' | 'font-mono'
}

const defaultSample = 'The quick brown fox jumps over the lazy dog. 0123456789'

export function FontFamily({
  name,
  className,
  sample = defaultSample,
  fontClass = 'font-primary',
}: FontFamilyProps) {
  return (
    <div className={cn('rounded-lg border border-neutral-200 bg-white p-6', className)}>
      <p className="mb-2 font-mono text-xs text-neutral-500">{name}</p>
      <p className={cn('text-xl text-neutral-900', fontClass)}>{sample}</p>
    </div>
  )
}
