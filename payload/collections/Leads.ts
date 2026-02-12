import type { CollectionConfig } from 'payload'
import { crmAccess } from '../access/collectionAccess'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: { en: 'Lead', pt: 'Lead' },
    plural: { en: 'Leads', pt: 'Leads' },
  },
  access: {
    create: crmAccess.create,
    read: crmAccess.read,
    update: crmAccess.update,
    delete: crmAccess.delete,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'status', 'source', 'lastActivity'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', pt: 'Nome' },
    },
    {
      name: 'company',
      type: 'text',
      label: { en: 'Company', pt: 'Empresa' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: { en: 'Email', pt: 'E-mail' },
    },
    {
      name: 'status',
      type: 'select',
      label: { en: 'Status', pt: 'Status' },
      options: [
        { label: { en: 'Contacted', pt: 'Contatado' }, value: 'contacted' },
        { label: { en: 'Qualified', pt: 'Qualificado' }, value: 'qualified' },
        { label: { en: 'Proposal Sent', pt: 'Proposta enviada' }, value: 'proposal_sent' },
        { label: { en: 'Negotiation', pt: 'Negociação' }, value: 'negotiation' },
        { label: { en: 'Won', pt: 'Ganho' }, value: 'won' },
        { label: { en: 'Lost', pt: 'Perdido' }, value: 'lost' },
      ],
      defaultValue: 'contacted',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      label: { en: 'Source', pt: 'Origem' },
      options: [
        { label: { en: 'Website', pt: 'Site' }, value: 'website' },
        { label: { en: 'Social Media', pt: 'Redes sociais' }, value: 'social' },
        { label: { en: 'Referral', pt: 'Indicação' }, value: 'referral' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      defaultValue: 'website',
    },
    {
      name: 'estimatedValue',
      type: 'number',
      label: { en: 'Estimated value', pt: 'Valor estimado' },
      admin: {
        description: 'Valor estimado do lead (opcional).',
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      label: { en: 'Last activity', pt: 'Última atividade' },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: "d 'de' MMM 'de' yyyy, HH:mm",
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: { en: 'Notes', pt: 'Notas' },
    },
  ],
}
