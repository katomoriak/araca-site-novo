import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', pt: 'Usuário' },
    plural: { en: 'Users', pt: 'Usuários' },
  },
  access: {
    read: () => true, // Página de autor do blog precisa ler perfil (nome, avatar, bio, redes) sem login
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
      sameSite: 'Lax',
    },
  },
  lockDocuments: false,
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => user?.role !== 'admin', // só admin vê e gerencia usuários
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
