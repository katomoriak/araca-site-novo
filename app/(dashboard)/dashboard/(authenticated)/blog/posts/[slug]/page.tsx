import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { PostForm } from '../PostForm'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })

  const post = result.docs[0]
  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-semibold">Editar post</h1>
      <PostForm isNew={false} initialData={post} />
    </div>
  )
}
