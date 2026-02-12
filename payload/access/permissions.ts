import type { Access, User } from 'payload'

/** Permissões por módulo do dashboard */
export type Permission = 'blog' | 'finance' | 'crm' | 'projetos' | 'users'

/** Tipo do usuário com permissions (Payload adiciona campos customizados) */
export interface UserWithPermissions extends User {
  role?: 'admin' | 'editor'
  permissions?: string[]
}

/**
 * Verifica se o usuário tem uma permissão específica.
 * Admin sempre tem acesso; demais verificam o array permissions.
 */
export function hasPermission(user: UserWithPermissions | null | undefined, perm: Permission): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  const perms = user.permissions as string[] | undefined
  return Array.isArray(perms) && perms.includes(perm)
}

/**
 * Verifica se o usuário pode acessar o dashboard (admin ou tem pelo menos uma permissão).
 */
export function canAccessDashboard(user: UserWithPermissions | null | undefined): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  const perms = user.permissions as string[] | undefined
  return Array.isArray(perms) && perms.length > 0
}

/** Wrappers para cada permissão (uso em Access) */
export const canAccessBlog: Access = ({ req: { user } }) =>
  hasPermission(user as UserWithPermissions, 'blog')

export const canAccessFinance: Access = ({ req: { user } }) =>
  hasPermission(user as UserWithPermissions, 'finance')

export const canAccessCRM: Access = ({ req: { user } }) =>
  hasPermission(user as UserWithPermissions, 'crm')

export const canAccessProjetos: Access = ({ req: { user } }) =>
  hasPermission(user as UserWithPermissions, 'projetos')

export const canAccessUsers: Access = ({ req: { user } }) =>
  hasPermission(user as UserWithPermissions, 'users')
