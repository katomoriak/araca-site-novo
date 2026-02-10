import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: { en: 'Subscriber', pt: 'Inscrito' },
    plural: { en: 'Subscribers', pt: 'Inscritos' },
  },
  access: {
    create: () => true, // formulário do site inscreve sem login
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'tags', 'cancelado', 'status', 'updatedAt'],
    description: {
      pt: 'E-mails inscritos na newsletter. Use tags para segmentar envios. cancelado = true significa que a pessoa pediu desinscrição.',
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: { en: 'Email', pt: 'E-mail' },
      admin: {
        description: { pt: 'E-mail cadastrado no formulário do site.' },
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: { en: 'Tags', pt: 'Tags' },
      admin: {
        description: { pt: 'Tags para segmentar campanhas (ex.: clientes, leads, evento-x).' },
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: { en: 'Tag', pt: 'Tag' },
        },
      ],
    },
    {
      name: 'cancelado',
      type: 'checkbox',
      label: { en: 'Unsubscribed', pt: 'Cancelado (desinscrito)' },
      defaultValue: false,
      required: true,
      admin: {
        description: { pt: 'Se true, a pessoa pediu para sair da newsletter e não recebe mais e-mails.' },
      },
    },
    {
      name: 'status',
      type: 'select',
      label: { en: 'Status', pt: 'Status' },
      options: [
        { label: { en: 'Subscribed', pt: 'Inscrito' }, value: 'subscribed' },
        { label: { en: 'Unsubscribed', pt: 'Desinscrito' }, value: 'unsubscribed' },
      ],
      defaultValue: 'subscribed',
      required: true,
      admin: {
        description: { pt: 'Status interno. Preferir o campo "Cancelado" para desinscrição.' },
      },
    },
  ],
}
