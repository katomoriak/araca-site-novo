import type { Access } from 'payload'
import { hasPermission, type UserWithPermissions } from './permissions'

/**
 * Posts:
 * - Permissão blog: criar posts.
 * - Admin: ver todos, editar e deletar qualquer post.
 * - Editor com blog: ver apenas os próprios (author === user.id), editar e deletar só os próprios.
 */
export const postsEditorAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req: { user } }) => hasPermission(user as UserWithPermissions, 'blog'),
  read: ({ req: { user } }) => {
    if (!user) return true // site público: listagem do blog vê todos os posts
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { author: { equals: user.id } }
  },
  update: ({ req: { user } }) => {
    if (!user) return false
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { author: { equals: user.id } }
  },
  delete: ({ req: { user } }) => {
    if (!user) return false
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { author: { equals: user.id } }
  },
}

/**
 * Media:
 * - Permissão blog: criar mídia.
 * - Admin: ver todos, editar e deletar qualquer mídia.
 * - Editor com blog: ver apenas as que fez upload (createdBy === user.id), editar e deletar só as próprias.
 */
export const mediaEditorAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req: { user } }) => hasPermission(user as UserWithPermissions, 'blog'),
  read: ({ req: { user } }) => {
    if (!user) return true // site público: exibir mídia dos posts (ex.: capa)
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { createdBy: { equals: user.id } }
  },
  update: ({ req: { user } }) => {
    if (!user) return false
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { createdBy: { equals: user.id } }
  },
  delete: ({ req: { user } }) => {
    if (!user) return false
    if (!hasPermission(user as UserWithPermissions, 'blog')) return false
    if (user.role === 'admin') return true
    return { createdBy: { equals: user.id } }
  },
}
