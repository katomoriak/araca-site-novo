import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getProjetosBaseUrl } from '@/lib/projetos-server'
import { ProjetoForm } from '../ProjetoForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditarProjetoPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projetos',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = result.docs?.[0] as unknown as
    | {
        slug: string
        title: string
        description?: string | null
        tag?: string | null
        cover: string
        media?: Array<{ type: 'image' | 'video'; file: string; name?: string | null }> | null
      }
    | undefined

  if (!doc) notFound()

  const initialData = {
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? '',
    tag: doc.tag ?? '',
    cover: doc.cover,
    media: (doc.media ?? []).map((m) => ({
      type: m.type as 'image' | 'video',
      file: m.file,
      name: m.name ?? undefined,
    })),
  }

  const projetosBaseUrl = getProjetosBaseUrl(slug)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-semibold">Editar projeto</h1>
      <ProjetoForm
        initialData={initialData}
        slugParam={slug}
        isNew={false}
        projetosBaseUrl={projetosBaseUrl}
      />
    </div>
  )
}
