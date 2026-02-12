import type { CollectionConfig } from 'payload'
import { postsEditorAccess } from '../access/editorAccess'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { en: 'Post', pt: 'Post' },
    plural: { en: 'Posts', pt: 'Posts' },
  },
  access: {
    read: postsEditorAccess.read,
    create: postsEditorAccess.create,
    update: postsEditorAccess.update,
    delete: postsEditorAccess.delete,
  },
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        // Só reformatar author para o Admin: o campo Relationship espera { relationTo, value }.
        // Quando a leitura vem da API local (Next.js), não alterar — assim author vem populado (name, email).
        if (req?.user == null) return doc
        if (doc?.author == null) return doc
        const id =
          typeof doc.author === 'object' && doc.author !== null && 'id' in doc.author
            ? (doc.author as { id: string | number }).id
            : doc.author
        return { ...doc, author: { relationTo: 'users' as const, value: id } }
      },
    ],
    beforeValidate: [
      ({ data, req }) => {
        if (req.user?.role === 'editor' && data && !data.id) {
          return { ...data, author: req.user.id }
        }
        // Normaliza author no formato { relationTo, value } para ID (para persistência).
        if (data?.author && typeof data.author === 'object' && 'value' in data.author) {
          const id = (data.author as { value?: string | number }).value
          return { ...data, author: id }
        }
        return data
      },
    ],
  },
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'slug',
      type: 'text',
      label: { en: 'Slug', pt: 'URL amigável' },
      required: true,
      unique: true,
      admin: {
        description: 'URL amigável (ex: meu-post)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: { en: 'Excerpt', pt: 'Resumo' },
      admin: {
        description: 'Ideal 150–160 caracteres para snippet em buscas.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: false,
      label: { en: 'Meta description', pt: 'Meta description' },
      admin: {
        description: 'Opcional. Se preenchido, usado como description em buscas; senão usa o resumo. Ideal 150–160 caracteres.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: { en: 'Cover image', pt: 'Imagem de capa' },
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Imagem de capa via Payload media. Se usar Supabase Storage (dashboard), será salva em coverImageUrl.',
      },
    },
    {
      name: 'coverImageUrl',
      type: 'text',
      label: { en: 'Cover image URL', pt: 'URL da imagem de capa' },
      required: false,
      admin: {
        description: 'URL direta da imagem quando vem do Supabase Storage (preenchido automaticamente pelo dashboard).',
        readOnly: true,
        condition: (_, siblingData) => !siblingData?.coverImage,
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: { en: 'Content', pt: 'Conteúdo' },
      admin: {
        description: 'Conteúdo HTML do post (gerado pelo editor Lexical no dashboard).',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      label: { en: 'Author', pt: 'Autor' },
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Autor do post (usuário).',
        appearance: 'select',
        components: { Field: '/components/admin/AuthorSelectField#AuthorSelectField' },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: { en: 'Category', pt: 'Categoria' },
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Categoria do post.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: { en: 'Tags', pt: 'Tags' },
      admin: {
        description: 'Tags para organizar o post.',
        initCollapsed: false,
        components: {
          RowLabel: '/components/admin/ArrayRowLabel#ArrayRowLabel',
        },
      },
      labels: {
        singular: { en: 'Tag', pt: 'Tag' },
        plural: { en: 'Tags', pt: 'Tags' },
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: { en: 'Tag name', pt: 'Nome da tag' },
          admin: {
            description: 'Nome da tag',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: { en: 'Status', pt: 'Status' },
      options: [
        { label: { en: 'Draft', pt: 'Rascunho' }, value: 'draft' },
        { label: { en: 'Published', pt: 'Publicado' }, value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        description: 'Rascunho não aparece no site.',
        // components: { Field: '/components/admin/CategorySelectField#CategorySelectField' },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { en: 'Published at', pt: 'Publicado em' },
      admin: {
        description: 'Data e hora de publicação.',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: "d 'de' MMM 'de' yyyy, HH:mm",
        },
      },
    },
  ],
}
