import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Acesso ao Payload via Local API (Server Components, API routes).
 * Use para buscar posts e outros dados sem chamada HTTP.
 */
export async function getPayloadClient() {
  return getPayload({ config })
}

/** Categoria do post (valores do select em payload/collections/Posts.ts) */
export type PostCategory = 'design' | 'dev' | 'tutorial' | 'news'

/** Normaliza valor que pode vir como string ou objeto localizado { en, pt } (Payload i18n). */
export function stringFromLocale(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'en' in value && 'pt' in value) {
    const o = value as { en?: string; pt?: string }
    return o.pt ?? o.en ?? ''
  }
  return String(value)
}

/**
 * Documento Post retornado pelo Payload (com relations populadas depth 2).
 * content é o estado serializado do editor Lexical.
 */
export interface PayloadPost {
  id: string
  title: string
  slug: string
  excerpt: string
  /** Opcional. Se preenchido, usado como meta description em buscas. */
  metaDescription?: string | null
  coverImage?: {
    id: string
    url: string
    alt?: string | null
    filename?: string
  } | null
  /** URL direta quando a capa vem do Supabase Storage (coverImage fica null). */
  coverImageUrl?: string | null
  content: unknown // SerializedEditorState (Lexical)
  author: {
    id: string
    name?: string | null
    email?: string
    showAsPublicAuthor?: boolean | null
  }
  category?: PostCategory | null
  tags?: { tag?: string | null }[] | null
  status: 'draft' | 'published'
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
}

async function getPostsUncached(): Promise<PayloadPost[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 2,
      limit: 100,
      pagination: false,
    })
    return (result.docs ?? []) as PayloadPost[]
  } catch {
    return []
  }
}

/**
 * Busca posts publicados do Payload (cache ISR 60s).
 */
export async function getPosts(): Promise<PayloadPost[]> {
  return unstable_cache(getPostsUncached, ['payload-posts'], { revalidate: 60 })()
}

/**
 * Slug de categoria na URL → valor PostCategory.
 * Usado na página /blog/categoria/[slug].
 */
export const CATEGORY_SLUGS: Record<string, PostCategory> = {
  design: 'design',
  dev: 'dev',
  desenvolvimento: 'dev',
  tutorial: 'tutorial',
  news: 'news',
  noticias: 'news',
}

/** Label em português para exibição (breadcrumb, título). */
export const CATEGORY_LABELS: Record<PostCategory, string> = {
  design: 'Design',
  dev: 'Desenvolvimento',
  tutorial: 'Tutorial',
  news: 'Notícias',
}

export function getCategoryBySlug(slug: string): PostCategory | null {
  const normalized = slug.toLowerCase().trim()
  return CATEGORY_SLUGS[normalized] ?? null
}

export function getCategoryLabel(category: PostCategory): string {
  return CATEGORY_LABELS[category] ?? category
}

/**
 * Busca posts publicados por categoria, ordenados por publishedAt (mais recentes primeiro).
 * Retorna [] se o Payload/DB falhar ou categoria inválida.
 */
export async function getPostsByCategory(
  category: PostCategory,
): Promise<PayloadPost[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { category: { equals: category } },
        ],
      },
      sort: '-publishedAt',
      depth: 2,
      limit: 100,
      pagination: false,
    })
    return (result.docs ?? []) as PayloadPost[]
  } catch {
    return []
  }
}

async function getPostBySlugUncached(slug: string): Promise<PayloadPost | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      depth: 2,
      limit: 1,
    })
    const doc = result.docs?.[0]
    return (doc as PayloadPost) ?? null
  } catch {
    return null
  }
}

/**
 * Busca um post publicado pelo slug (cache ISR 60s por slug).
 */
export async function getPostBySlug(slug: string): Promise<PayloadPost | null> {
  return unstable_cache(
    () => getPostBySlugUncached(slug),
    ['payload-post', slug],
    { revalidate: 60 }
  )()
}

/** Autor (user) retornado pelo Payload com perfil para a página de autor. */
export interface PayloadAuthor {
  id: string
  name: string
  email?: string
  title?: string | null
  bio?: string | null
  avatar?: { id: string; url: string; alt?: string | null } | null
  socialLinks?: { network: string; url: string }[] | null
}

/**
 * Busca um autor (user) pelo id. Retorna null se não existir.
 * Usado na página de autor do blog.
 */
export async function getAuthorById(id: string): Promise<PayloadAuthor | null> {
  try {
    const payload = await getPayloadClient()
    const user = await payload.findByID({
      collection: 'users',
      id,
      depth: 2,
    })
    if (!user) return null
    const u = user as PayloadAuthor & { avatar?: { id: string; url: string; alt?: string | null }; showAsPublicAuthor?: boolean | null }
    if (u.showAsPublicAuthor !== true) return null
    return {
      id: u.id,
      name: u.name ?? '',
      email: u.email,
      title: u.title ?? null,
      bio: u.bio ?? null,
      avatar: u.avatar?.url ? { id: u.avatar.id, url: u.avatar.url, alt: u.avatar.alt } : null,
      socialLinks: u.socialLinks ?? null,
    }
  } catch {
    return null
  }
}

/**
 * Busca posts publicados de um autor, ordenados por publishedAt (mais recentes primeiro).
 */
export async function getPostsByAuthorId(authorId: string): Promise<PayloadPost[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { author: { equals: authorId } },
        ],
      },
      sort: '-publishedAt',
      depth: 2,
      limit: 100,
      pagination: false,
    })
    return (result.docs ?? []) as PayloadPost[]
  } catch {
    return []
  }
}

/**
 * Converte documento Post do Payload para o formato usado no grid do blog (tipo Post do mock).
 * content fica vazio na listagem pois não é exibido nos cards.
 */
export function toBlogPostListItem(
  p: PayloadPost,
): {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: { url: string; alt: string }
  author: { name: string; id: string; showAsPublicAuthor?: boolean }
  category: PostCategory
  tags: string[]
  publishedAt: string
  content: string
} {
  const name = p.author?.name ?? (p.author as { email?: string })?.email ?? 'Autor'
  const authorId = typeof p.author === 'object' && p.author != null && 'id' in p.author ? String((p.author as { id: string }).id) : ''
  const showAsPublicAuthor = typeof p.author === 'object' && p.author != null && 'showAsPublicAuthor' in p.author ? (p.author as { showAsPublicAuthor?: boolean }).showAsPublicAuthor === true : false
  const titleStr = stringFromLocale(p.title)
  const excerptStr = stringFromLocale(p.excerpt)
  return {
    id: p.id,
    title: titleStr,
    slug: p.slug,
    excerpt: excerptStr,
    coverImage:
      p.coverImage?.url != null
        ? { url: p.coverImage.url, alt: stringFromLocale(p.coverImage?.alt ?? p.title) }
        : p.coverImageUrl
          ? { url: p.coverImageUrl, alt: stringFromLocale(p.title) }
          : undefined,
    author: { name: String(name), id: authorId, showAsPublicAuthor },
    category: (p.category ?? 'news') as PostCategory,
    tags: (p.tags ?? []).map((t) => t?.tag ?? '').filter(Boolean),
    publishedAt: p.publishedAt ?? p.createdAt,
    content: '', // não usado na listagem
  }
}

// --- Dashboard (CRM + Financeiro) ---

/** Status do lead (payload/collections/Leads.ts). */
export type LeadStatus =
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'

/** Origem do lead. */
export type LeadSource = 'website' | 'social' | 'referral' | 'other'

/** Documento Lead retornado pela API Payload. */
export interface PayloadLead {
  id: string
  name: string
  company?: string | null
  email: string
  status: LeadStatus
  source?: LeadSource | null
  estimatedValue?: number | null
  lastActivity?: string | null
  notes?: string | null
  updatedAt: string
  createdAt: string
}

/** Etapa da negociação (pipeline de fechamento). */
export type NegociacaoStage =
  | 'prospeccao'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido'

/** Documento Negociação retornado pela API Payload (com lead populado). */
export interface PayloadNegociacao {
  id: string
  lead: string | (PayloadLead & { id: string })
  stage: NegociacaoStage
  value?: number | null
  notes?: string | null
  updatedAt: string
  createdAt: string
}

/** Lead enriquecido com dados da negociação no Kanban. */
export interface CrmKanbanLead extends PayloadLead {
  /** ID do documento negociação (para PATCH ao arrastar entre etapas). */
  negotiationId?: string | null
  negotiationValue?: number | null
  negotiationNotes?: string | null
  negotiationUpdatedAt?: string | null
}

/** Coluna do Kanban: etapa + leads nessa etapa + valor acumulado. */
export interface CrmKanbanColumn {
  stage: NegociacaoStage
  title: string
  leads: CrmKanbanLead[]
  totalValue: number
}

/** Filtros opcionais para transações. */
export interface TransactionFilters {
  type?: 'income' | 'expense'
  from?: string // ISO date
  to?: string // ISO date
}

/** Documento Transaction retornado pela API Payload. */
export interface PayloadTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category?: string | null
  description: string
  lead?: string | { id: string } | null
  fixedExpenseGroupId?: string | null
  /** Se true, a transação já foi executada (entra no balanço realizado). */
  executada?: boolean
  updatedAt: string
  createdAt: string
}

const NEGOCIACAO_STAGE_LABELS: Record<NegociacaoStage, string> = {
  prospeccao: 'Prospecção',
  proposta: 'Proposta enviada',
  negociacao: 'Negociação',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

const KANBAN_STAGE_ORDER: NegociacaoStage[] = [
  'prospeccao',
  'proposta',
  'negociacao',
  'fechado',
  'perdido',
]

async function getLeadsUncached(): Promise<PayloadLead[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'leads',
      sort: '-lastActivity',
      limit: 500,
      pagination: false,
      overrideAccess: true,
    })
    return (result.docs ?? []) as PayloadLead[]
  } catch {
    return []
  }
}

/** Busca leads (cache 30s para o dashboard). */
export async function getLeads(): Promise<PayloadLead[]> {
  return unstable_cache(getLeadsUncached, ['payload-leads'], { revalidate: 30 })()
}

async function getNegociacoesUncached(): Promise<PayloadNegociacao[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'negociacoes',
      depth: 1,
      sort: '-updatedAt',
      limit: 500,
      pagination: false,
      overrideAccess: true,
    })
    return (result.docs ?? []) as PayloadNegociacao[]
  } catch {
    return []
  }
}

/** Busca negociações (cache 30s para o dashboard). */
export async function getNegociacoes(): Promise<PayloadNegociacao[]> {
  return unstable_cache(getNegociacoesUncached, ['payload-negociacoes'], { revalidate: 30 })()
}

/**
 * Monta dados do Kanban CRM: uma coluna por etapa com leads e valor acumulado.
 * Usado na página CRM para exibir o pipeline de fechamento.
 */
export async function getCrmKanbanData(): Promise<CrmKanbanColumn[]> {
  const [leads, negociacoes] = await Promise.all([
    getLeads(),
    getNegociacoes(),
  ])
  const leadMap = new Map(leads.map((l) => [l.id, l]))
  const columns: CrmKanbanColumn[] = KANBAN_STAGE_ORDER.map((stage) => ({
    stage,
    title: NEGOCIACAO_STAGE_LABELS[stage],
    leads: [],
    totalValue: 0,
  }))
  const colByStage = new Map(columns.map((c) => [c.stage, c]))

  for (const neg of negociacoes) {
    const leadId = typeof neg.lead === 'string' ? neg.lead : neg.lead?.id
    if (!leadId) continue
    const lead = leadMap.get(leadId) ?? (typeof neg.lead === 'object' ? (neg.lead as PayloadLead) : null)
    if (!lead) continue
    const value = neg.value ?? 0
    const col = colByStage.get(neg.stage)
    if (col) {
      col.leads.push({
        ...lead,
        negotiationId: neg.id,
        negotiationValue: neg.value ?? undefined,
        negotiationNotes: neg.notes ?? undefined,
        negotiationUpdatedAt: neg.updatedAt ?? undefined,
      })
      col.totalValue += value
    }
  }

  return columns
}

export { NEGOCIACAO_STAGE_LABELS, KANBAN_STAGE_ORDER }

async function getTransactionsUncached(
  filters: TransactionFilters = {}
): Promise<PayloadTransaction[]> {
  try {
    const payload = await getPayloadClient()
    const where: Record<string, unknown> = {}
    if (filters.type) where.type = { equals: filters.type }
    if (filters.from || filters.to) {
      where.date = {
        ...(filters.from && { greater_than_equal: filters.from }),
        ...(filters.to && { less_than_equal: filters.to }),
      }
    }
    const result = await payload.find({
      collection: 'transactions',
      where: (Object.keys(where).length ? where : undefined) as import('payload').Where | undefined,
      sort: '-date',
      limit: 500,
      pagination: false,
      overrideAccess: true,
    })
    return (result.docs ?? []) as PayloadTransaction[]
  } catch {
    return []
  }
}

/** Busca transações (cache 30s para o dashboard; key inclui filtros). */
export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<PayloadTransaction[]> {
  const key = ['payload-transactions', filters.type ?? '', filters.from ?? '', filters.to ?? ''].join('-')
  return unstable_cache(
    () => getTransactionsUncached(filters),
    [key],
    { revalidate: 30 }
  )()
}
