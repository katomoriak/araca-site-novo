import type { CollectionConfig } from 'payload'
import { postsEditorAccess } from '../access/editorAccess'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { en: 'Category', pt: 'Categoria' },
    plural: { en: 'Categories', pt: 'Categorias' },
  },
  access: {
    read: postsEditorAccess.read,
    create: postsEditorAccess.create,
    update: postsEditorAccess.update,
    delete: postsEditorAccess.delete,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', pt: 'Nome' },
      admin: {
        description: 'Nome da categoria (ex: Design, Desenvolvimento)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: { en: 'Slug', pt: 'URL amigável' },
      required: true,
      unique: true,
      admin: {
        description: 'URL amigável (ex: design, desenvolvimento)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      admin: {
        description: 'Descrição da categoria (opcional)',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: { en: 'Color', pt: 'Cor' },
      admin: {
        description: 'Cor em hexadecimal (ex: #3B82F6) para identificação visual',
      },
    },
  ],
}
