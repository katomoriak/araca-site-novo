import { GlassButton } from '@/components/ui'

export function ButtonRow() {
  return (
    <div className="flex flex-wrap gap-4">
      <GlassButton variant="primary" size="sm">Primary sm</GlassButton>
      <GlassButton variant="primary" size="md">Primary md</GlassButton>
      <GlassButton variant="primary" size="lg">Primary lg</GlassButton>
      <GlassButton variant="secondary">Secondary</GlassButton>
      <GlassButton variant="accent">Accent</GlassButton>
      <GlassButton variant="glass">Glass</GlassButton>
    </div>
  )
}
