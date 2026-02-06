import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

export function CardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">Card com variante default. Borda e sombra leve.</p>
        </CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
      <Card variant="glass" className="bg-neutral-900/80 text-white">
        <CardHeader>
          <CardTitle>Glass</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-300">Card glass com backdrop blur. Ideal para overlays.</p>
        </CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
      <Card variant="glassmorphism" className="border-white/20">
        <CardHeader>
          <CardTitle>Glassmorphism</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">Card glassmorphism com blur e transparência.</p>
        </CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    </div>
  )
}
