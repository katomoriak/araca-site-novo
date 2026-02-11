import type { CollectionConfig } from 'payload'
import { dashboardAccess } from '../access/dashboardAccess'

export const Projetos: CollectionConfig = {
  slug: 'projetos',
  labels: {
    singular: { en: 'Project', pt: 'Projeto' },
    plural: { en: 'Projects', pt: 'Projetos' },
  },
  access: {
    create: dashboardAccess.create,
    read: dashboardAccess.read,
    update: dashboardAccess.update,
    delete: dashboardAccess.delete,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tag'],
    description: { pt: 'Projetos exibidos na galeria da home. Imagens no Supabase Storage (bucket a_public).' },
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: { en: 'Slug', pt: 'Slug' },
      admin: { description: { pt: 'Identificador único (ex.: areasocial_residencia-ninhoverce). Usado na URL do Storage.' } },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
    },
    {
      name: 'tag',
      type: 'text',
      label: { en: 'Tag', pt: 'Tag' },
      admin: { description: { pt: 'Ex.: Interiores, Residencial' } },
    },
    {
      name: 'cover',
      type: 'text',
      required: true,
      label: { en: 'Cover filename', pt: 'Arquivo da capa' },
      admin: { description: { pt: 'Nome do arquivo no Supabase Storage (ex.: cover.png).' } },
    },
    {
      name: 'media',
      type: 'array',
      label: { en: 'Gallery media', pt: 'Mídias da galeria' },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: { en: 'Image', pt: 'Imagem' }, value: 'image' },
            { label: { en: 'Video', pt: 'Vídeo' }, value: 'video' },
          ],
          defaultValue: 'image',
        },
        {
          name: 'file',
          type: 'text',
          required: true,
          label: { en: 'Filename', pt: 'Arquivo' },
          admin: { description: { pt: 'Nome do arquivo no Storage.' } },
        },
        {
          name: 'name',
          type: 'text',
          label: { en: 'Caption', pt: 'Legenda' },
        },
      ],
    },
  ],
}
