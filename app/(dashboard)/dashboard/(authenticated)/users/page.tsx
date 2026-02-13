import { getPayloadClient } from '@/lib/payload'
import { UsersPageClient } from './UsersPageClient'

export default async function UsersPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'users',
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })

  // Serialize Payload's users to plain objects for the client component
  const users = JSON.parse(JSON.stringify(result.docs))

  return <UsersPageClient users={users} />
}
