import type { CollectionConfig } from 'payload'
import { usersAccess } from '../access/collectionAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', pt: 'Usuário' },
    plural: { en: 'Users', pt: 'Usuários' },
  },
  access: {
    read: usersAccess.read,
    create: usersAccess.create,
    update: usersAccess.update,
    delete: usersAccess.delete,
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 dias (em segundos)
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos (em ms)
    useAPIKey: false,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  lockDocuments: false,
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => {
      if (!user) return true
      if (user.role === 'admin') return false
      const perms = (user as { permissions?: string[] }).permissions
      return !Array.isArray(perms) || !perms.includes('users')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', pt: 'Nome' },
    },
    {
      name: 'role',
      type: 'select',
      label: { en: 'Role', pt: 'Função' },
      options: [
        { label: { en: 'Admin', pt: 'Administrador' }, value: 'admin' },
        { label: { en: 'Editor', pt: 'Editor' }, value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      admin: { description: { pt: 'Admin tem acesso total; Editor usa permissões específicas.' } },
    },
    {
      name: 'permissions',
      type: 'select',
      label: { en: 'Permissions', pt: 'Permissões' },
      hasMany: true,
      options: [
        { label: { en: 'Blog', pt: 'Blog' }, value: 'blog' },
        { label: { en: 'Finance', pt: 'Financeiro' }, value: 'finance' },
        { label: { en: 'CRM', pt: 'CRM' }, value: 'crm' },
        { label: { en: 'Projects', pt: 'Projetos' }, value: 'projetos' },
        { label: { en: 'Users', pt: 'Usuários' }, value: 'users' },
      ],
      admin: {
        description: { pt: 'Módulos do dashboard que este usuário pode acessar. Admin ignora e tem acesso total.' },
        condition: (_, siblingData) => siblingData?.role === 'editor',
      },
    },
    {
      name: 'showAsPublicAuthor',
      type: 'checkbox',
      label: { en: 'Show as public author', pt: 'Exibir como autor no blog' },
      defaultValue: false,
      admin: {
        description: { pt: 'Se marcado, o usuário aparece como autor nos posts e na página de perfil do blog.' },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Avatar', pt: 'Foto de perfil' },
      admin: { description: { pt: 'Foto do autor na página de perfil e nos posts.' } },
    },
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Cargo / Título' },
      admin: { description: { pt: 'Ex: Colaborador & Editor' } },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: { en: 'Bio', pt: 'Biografia' },
      admin: { description: { pt: 'Texto exibido na página de autor do blog.' } },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: { en: 'Social links', pt: 'Redes sociais' },
      fields: [
        {
          name: 'network',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        { name: 'url', type: 'text', required: true, label: { en: 'URL', pt: 'URL' } },
      ],
    },
  ],
}
