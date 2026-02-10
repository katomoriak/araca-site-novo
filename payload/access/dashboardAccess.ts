import type { Access } from 'payload'

/**
 * Leads e Transactions (dashboard CRM/Financeiro):
 * - Apenas usuários autenticados (admin ou editor) podem ler, criar, editar e deletar.
 */
export const dashboardAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  read: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  update: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  delete: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
}
