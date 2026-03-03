import { getPayloadClient } from '@/lib/payload'
import { BusinessCardForm } from '../BusinessCardForm'
import { notFound } from 'next/navigation'

type Params = {
    params: Promise<{ slug: string }>
}

export default async function EditBusinessCardPage({ params }: Params) {
    const { slug } = await params
    const payload = await getPayloadClient()

    const result = await payload.find({
        collection: 'business-cards',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
        overrideAccess: true,
    })

    if (!result.docs.length) {
        notFound()
    }

    const card = JSON.parse(JSON.stringify(result.docs[0]))

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="text-2xl font-semibold">Editar Cartão de Visitas</h1>
            <BusinessCardForm initialData={card} isNew={false} />
        </div>
    )
}
