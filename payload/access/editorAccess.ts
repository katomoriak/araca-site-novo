import type { Access } from 'payload'

/**
 * Posts:
 * - Admin: ver todos, criar, editar e deletar qualquer post.
 * - Editor: ver apenas os próprios (author === user.id), criar (como autor), editar e deletar só os próprios.
 */
export const postsEditorAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  read: ({ req: { user } }) => {
    if (!user) return true // site público: listagem do blog vê todos os posts
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { author: { equals: user.id } }
    return false
  },
  update: ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { author: { equals: user.id } }
    return false
  },
  delete: ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { author: { equals: user.id } }
    return false
  },
}

/**
 * Media:
 * - Admin: ver todos, criar, editar e deletar qualquer mídia.
 * - Editor: ver apenas as que fez upload (createdBy === user.id), criar, editar e deletar só as próprias.
 */
export const mediaEditorAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  read: ({ req: { user } }) => {
    if (!user) return true // site público: exibir mídia dos posts (ex.: capa)
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { createdBy: { equals: user.id } }
    return false
  },
  update: ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { createdBy: { equals: user.id } }
    return false
  },
  delete: ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'editor') return { createdBy: { equals: user.id } }
    return false
  },
}
