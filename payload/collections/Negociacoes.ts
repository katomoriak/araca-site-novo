import type { CollectionConfig } from 'payload'
import { crmAccess } from '../access/collectionAccess'

/** Etapas de fechamento do contrato (pipeline Kanban). */
export const NEGOCIACAO_STAGES = [
  { label: { en: 'Prospecting', pt: 'Prospecção' }, value: 'prospeccao' },
  { label: { en: 'Proposal sent', pt: 'Proposta enviada' }, value: 'proposta' },
  { label: { en: 'Negotiation', pt: 'Negociação' }, value: 'negociacao' },
  { label: { en: 'Closed won', pt: 'Fechado' }, value: 'fechado' },
  { label: { en: 'Lost', pt: 'Perdido' }, value: 'perdido' },
] as const

export type NegociacaoStage = (typeof NEGOCIACAO_STAGES)[number]['value']

export const Negociacoes: CollectionConfig = {
  slug: 'negociacoes',
  labels: {
    singular: { en: 'Negotiation', pt: 'Negociação' },
    plural: { en: 'Negotiations', pt: 'Negociações' },
  },
  access: {
    create: crmAccess.create,
    read: crmAccess.read,
    update: crmAccess.update,
    delete: crmAccess.delete,
  },
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        // Admin espera relationship no formato { relationTo, value }.
        if (req?.user == null || doc?.lead == null) return doc
        const id =
          typeof doc.lead === 'object' && doc.lead !== null && 'id' in doc.lead
            ? (doc.lead as { id: string | number }).id
            : doc.lead
        return { ...doc, lead: { relationTo: 'leads' as const, value: id } }
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (data?.lead == null) return data
        // Admin/API pode enviar relationship como { relationTo, value }; Payload espera só o ID.
        let id: string | number | undefined
        if (typeof data.lead === 'object' && data.lead !== null) {
          const obj = data.lead as { value?: string | number; id?: string | number }
          id = obj.value ?? obj.id
        } else {
          id = data.lead as string | number
        }
        if (id != null && id !== '') {
          const normalized = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id
          return { ...data, lead: normalized }
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'lead',
    defaultColumns: ['lead', 'stage', 'value', 'updatedAt'],
    description: { pt: 'Negociações do pipeline. A etapa define a coluna do Kanban no CRM. Um lead pode ter várias negociações.' },
  },
  fields: [
    {
      name: 'lead',
      type: 'relationship',
      label: { en: 'Lead', pt: 'Lead' },
      relationTo: 'leads',
      required: true,
      hooks: {
        // Admin/API às vezes envia { relationTo, value }; o Payload espera só o ID. Normaliza antes da validação.
        beforeValidate: [
          ({ value }) => {
            if (value == null || value === '') return value
            if (typeof value === 'object' && value !== null) {
              const obj = value as { value?: string | number; id?: string | number }
              const id = obj.value ?? obj.id
              if (id != null) {
                // Postgres usa ID numérico; coerção evita "campo inválido" quando vem como string
                return typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id
              }
            }
            return value
          },
        ],
      },
      admin: {
        description: { pt: 'Lead atrelado a esta negociação. Um mesmo lead pode ter várias negociações.' },
      },
    },
    {
      name: 'stage',
      type: 'select',
      label: { en: 'Stage', pt: 'Etapa' },
      options: [...NEGOCIACAO_STAGES],
      defaultValue: 'prospeccao',
      required: true,
      admin: {
        description: { pt: 'Etapa de fechamento do contrato (coluna no Kanban).' },
      },
    },
    {
      name: 'value',
      type: 'number',
      label: { en: 'Value', pt: 'Valor (R$)' },
      required: false,
      min: 0,
      admin: {
        description: { pt: 'Valor estimado da negociação. Soma por etapa aparece no Kanban.' },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: { en: 'Notes', pt: 'Notas' },
    },
  ],
  timestamps: true,
}
