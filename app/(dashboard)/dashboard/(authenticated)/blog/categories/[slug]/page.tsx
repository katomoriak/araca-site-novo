import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { CategoryForm } from '../CategoryForm'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  const category = result.docs[0]
  if (!category) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-semibold">Editar categoria</h1>
      <CategoryForm isNew={false} initialData={category} />
    </div>
  )
}
