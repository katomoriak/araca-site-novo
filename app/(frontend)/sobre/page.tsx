import { Container } from '@/components/layout/Container'

export const metadata = {
  title: 'Sobre — Araça',
  description: 'Sobre o projeto Araça.',
}

export default function SobrePage() {
  return (
    <Container as="section" className="py-16">
      <h1 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">
        Sobre
      </h1>
      <p className="mt-6 max-w-2xl text-neutral-600">
        Placeholder. Edite esta página em{' '}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">
          app/(frontend)/sobre/page.tsx
        </code>{' '}
        ou crie uma collection no Payload para conteúdo editável.
      </p>
    </Container>
  )
}
