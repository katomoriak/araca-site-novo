import { z } from 'zod'

/**
 * Schema de validação para transações financeiras
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    message: 'Tipo deve ser "income" ou "expense"',
  }),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
  amount: z
    .number({
      message: 'Valor deve ser um número',
    })
    .positive('Valor deve ser positivo')
    .max(999999999, 'Valor muito alto'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  category: z.string().max(100, 'Categoria muito longa').optional(),
  fixedExpense: z.boolean().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>

/**
 * Schema de validação para email (newsletter, desinscrição, etc.)
 */
export const emailSchema = z
  .string()
  .min(1, 'E-mail é obrigatório')
  .max(255, 'E-mail muito longo')
  .email('E-mail inválido')
  .toLowerCase()
  .trim()

/**
 * Schema de validação para slug de projeto
 * Permite letras minúsculas, números, hífens e underscores (ex.: aintima_residencianinhoverde)
 */
export const projectSlugSchema = z
  .string()
  .regex(
    /^[a-z0-9_-]+$/,
    'Slug deve conter apenas letras minúsculas, números, hífens e underscores'
  )
  .min(1, 'Slug não pode ser vazio')
  .max(100, 'Slug muito longo')

const projectMediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  file: z.string().min(1, 'Arquivo é obrigatório'),
  name: z.string().max(200).optional(),
})

export const projetoCreateSchema = z.object({
  slug: projectSlugSchema,
  title: z.string().min(1, 'Título é obrigatório').max(300),
  description: z.string().max(2000).optional(),
  tag: z.string().max(100).optional(),
  showOnHome: z.boolean().optional(),
  showOnProjectsPage: z.boolean().optional(),
  cover: z.string().min(1, 'Arquivo da capa é obrigatório'),
  media: z.array(projectMediaItemSchema).default([]),
})

export const projetoUpdateSchema = projetoCreateSchema.partial().extend({
  slug: projectSlugSchema.optional(),
})

export type ProjetoCreateInput = z.infer<typeof projetoCreateSchema>
export type ProjetoUpdateInput = z.infer<typeof projetoUpdateSchema>

/**
 * Schema de validação para subscriber (inscrição na newsletter)
 */
export const subscriberSchema = z.object({
  email: emailSchema,
  name: z.string().max(255, 'Nome muito longo').optional(),
})

export type SubscriberInput = z.infer<typeof subscriberSchema>

/**
 * Schema do formulário de contato da home (cria lead + negociação).
 */
export const contactFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(120, 'Nome muito longo').trim(),
  sobrenome: z.string().max(120, 'Sobrenome muito longo').trim().optional(),
  pais: z.string().max(100, 'País muito longo').trim().optional(),
  telefone: z.string().max(30, 'Telefone muito longo').trim().optional(),
  email: emailSchema,
  tipoConsulta: z.string().max(100).optional(),
  mensagem: z.string().max(2000, 'Mensagem muito longa').trim().optional(),
  newsletter: z.boolean().optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

/**
 * Helper para validar e retornar erros formatados
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map((err) => {
    const path = err.path.join('.')
    return path ? `${path}: ${err.message}` : err.message
  })

  return { success: false, errors }
}
