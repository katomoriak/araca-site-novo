import type { CollectionConfig } from 'payload'
import { mediaEditorAccess } from '../access/editorAccess'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', pt: 'Mídia' },
    plural: { en: 'Media', pt: 'Mídias' },
  },
  access: {
    read: mediaEditorAccess.read,
    create: mediaEditorAccess.create,
    update: mediaEditorAccess.update,
    delete: mediaEditorAccess.delete,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user && data) {
          return { ...data, createdBy: req.user.id }
        }
        return data
      },
    ],
  },
  lockDocuments: false,
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: { en: 'Uploaded by', pt: 'Enviado por' },
      admin: {
        description: 'Usuário que fez o upload (preenchido automaticamente).',
        readOnly: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: { en: 'Description / alt text', pt: 'Descrição / texto alternativo' },
    },
  ],
}
