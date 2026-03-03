import { getPayloadClient } from '@/lib/payload'
import { BusinessCardsClient } from './BusinessCardsClient'

export default async function BusinessCardsPage() {
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'business-cards',
        limit: 100,
        pagination: false,
        sort: 'slug',
        depth: 1,
        overrideAccess: true,
    })

    // Serialize to plain objects
    const cards = JSON.parse(JSON.stringify(result.docs))

    return <BusinessCardsClient businessCards={cards} />
}
