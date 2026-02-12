import type { Access } from 'payload'
import { canAccessBlog, canAccessCRM, canAccessFinance, canAccessProjetos, canAccessUsers } from './permissions'

/** Access para coleções CRM (Leads, Negociacoes) */
export const crmAccess = {
  create: canAccessCRM,
  read: canAccessCRM,
  update: canAccessCRM,
  delete: canAccessCRM,
}

/** Access para coleções Finance (Transactions) */
export const financeAccess = {
  create: canAccessFinance,
  read: canAccessFinance,
  update: canAccessFinance,
  delete: canAccessFinance,
}

/** Access para coleções Projetos */
export const projetosAccess = {
  create: canAccessProjetos,
  read: canAccessProjetos,
  update: canAccessProjetos,
  delete: canAccessProjetos,
}

/** Access para Users: admin ou permissão users */
export const usersAccess: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: canAccessUsers,
  read: () => true, // Página de autor do blog precisa ler perfil sem login
  update: canAccessUsers,
  delete: canAccessUsers,
}
