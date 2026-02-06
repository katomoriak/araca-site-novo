import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: isAdmin,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: isAdmin,
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 dias (em segundos)
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos (em ms)
    useAPIKey: false,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
    },
  ],
}
