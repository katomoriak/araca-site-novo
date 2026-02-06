import { Button } from '@/components/ui'

export function ButtonRow() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" size="sm">Primary sm</Button>
      <Button variant="primary" size="md">Primary md</Button>
      <Button variant="primary" size="lg">Primary lg</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glass">Glass</Button>
    </div>
  )
}
