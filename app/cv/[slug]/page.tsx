import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { CVClient } from './CVClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'business-cards',
    where: { slug: { equals: p.slug } },
    limit: 1,
  })

  if (!result.docs.length) {
    return { title: 'Cartão de Visita não encontrado | Aracá Interiores' }
  }

  const cv = result.docs[0]
  const user = typeof cv.user === 'object' ? cv.user : null

  const name = cv.name || user?.name || 'Membro'
  const role = cv.role || user?.title || 'Aracá Interiores'

  return {
    title: `${name} | Aracá Interiores`,
    description: `Cartão de Visitas Virtual - ${name}, ${role} na Aracá Interiores.`,
    openGraph: {
      title: `${name} | Aracá Interiores`,
      description: `Cartão de Visitas Virtual - ${name}, ${role} na Aracá Interiores.`,
      url: `https://aracainteriores.com.br/cv/${p.slug}`,
      siteName: 'Aracá Interiores',
      type: 'profile',
    },
  }
}

export default async function CVPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'business-cards',
    where: { slug: { equals: p.slug } },
    limit: 1,
  })

  if (!result.docs.length) {
    notFound()
  }

  const cv = result.docs[0]
  const user = typeof cv.user === 'object' ? cv.user : null

  const name = cv.name || user?.name || ''
  const role = cv.role || user?.title || 'Aracá Interiores'
  const email = cv.email || user?.email || ''
  const phone = cv.phone || ''
  const address = cv.address || 'Santo André - SP • Aracá Interiores'

  // Pegar foto de perfil se existir
  // Importante checar pois user pode ter avatarUrl
  const avatarUrl = user?.avatarUrl || null

  // Extrair iniciais do nome para fallback
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  const cardData = {
    slug: p.slug,
    name,
    role,
    email,
    phone,
    address,
    avatarUrl,
    initials
  }

  return <CVClient card={cardData} />
}
