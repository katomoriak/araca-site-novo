import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/servicos/comercial-corporativo`,
  },
}

export default function OldComercialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
