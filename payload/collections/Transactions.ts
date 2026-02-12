import type { CollectionConfig } from 'payload'
import { financeAccess } from '../access/collectionAccess'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  labels: {
    singular: { en: 'Transaction', pt: 'Transação' },
    plural: { en: 'Transactions', pt: 'Transações' },
  },
  access: {
    create: financeAccess.create,
    read: financeAccess.read,
    update: financeAccess.update,
    delete: financeAccess.delete,
  },
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['date', 'type', 'description', 'amount', 'category'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: { en: 'Type', pt: 'Tipo' },
      options: [
        { label: { en: 'Income', pt: 'Receita' }, value: 'income' },
        { label: { en: 'Expense', pt: 'Despesa' }, value: 'expense' },
      ],
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: { en: 'Amount', pt: 'Valor' },
      admin: {
        description: 'Valor positivo. Para despesas, o valor é exibido como negativo nos relatórios.',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: { en: 'Date', pt: 'Data' },
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: "d 'de' MMM 'de' yyyy",
        },
      },
    },
    {
      name: 'category',
      type: 'text',
      label: { en: 'Category', pt: 'Categoria' },
      admin: {
        description: 'Ex.: Projeto X, Marketing, Fornecedor.',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: { en: 'Description', pt: 'Descrição' },
    },
    {
      name: 'lead',
      type: 'relationship',
      label: { en: 'Lead', pt: 'Lead' },
      relationTo: 'leads',
      required: false,
      admin: {
        description: 'Opcional: associar a um lead.',
      },
    },
    {
      name: 'fixedExpenseGroupId',
      type: 'text',
      label: { en: 'Fixed expense group', pt: 'Série despesa fixa' },
      required: false,
      admin: {
        description: 'Preenchido automaticamente quando a transação é cadastrada como fixa mensal (receita ou despesa). Agrupa as parcelas da mesma série.',
        readOnly: true,
      },
    },
    {
      name: 'executada',
      type: 'checkbox',
      label: { en: 'Executed', pt: 'Executada?' },
      defaultValue: true,
      admin: {
        description: 'Se marcado, a transação já foi realizada e entra no balanço executado. Desmarque para projeções ou planejamento.',
      },
    },
  ],
}
