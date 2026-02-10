import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { PayloadRequest } from 'payload'
import type { SerializedEditorState } from 'lexical'

/** Template Lexical base para newsletter de post do blog (placeholder editável). */
const LEXICAL_BLOG_TEMPLATE = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'heading',
        tag: 'h2',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text: 'Título da postagem', format: '', mode: 'normal', style: '', detail: 0, version: 1 }],
      },
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text: 'Resumo ou destaque da postagem. Substitua pelo conteúdo desejado.', format: '', mode: 'normal', style: '', detail: 0, version: 1 }],
      },
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text: 'Leia mais em: [cole o link do post aqui]', format: '', mode: 'normal', style: '', detail: 0, version: 1 }],
      },
    ],
  },
} as unknown as SerializedEditorState

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  labels: {
    singular: { en: 'Newsletter', pt: 'Newsletter' },
    plural: { en: 'Newsletters', pt: 'Newsletters' },
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation !== 'create' || !data) return data
        const baseTemplate = (data as { baseTemplate?: string }).baseTemplate
        const body = (data as { body?: unknown }).body
        const bodyEmpty = body == null || (typeof body === 'object' && (!('root' in body) || !(body as { root?: { children?: unknown[] } }).root?.children?.length))
        if (baseTemplate === 'blog' && bodyEmpty) {
          return { ...data, body: LEXICAL_BLOG_TEMPLATE }
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'baseTemplate', 'status', 'sentAt', 'updatedAt'],
    description: {
      pt: 'Crie newsletters e envie para inscritos. Use o botão Enviar no topo da tela de edição.',
    },
    components: {
      views: {
        edit: {
          default: {
            Component: '/components/admin/NewsletterEditView#NewsletterEditView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'baseTemplate',
      type: 'select',
      label: { en: 'Base template', pt: 'Modelo base' },
      options: [
        { label: { en: 'None', pt: 'Nenhum' }, value: 'none' },
        { label: { en: 'Blog post', pt: 'Post do blog' }, value: 'blog' },
      ],
      defaultValue: 'none',
      admin: {
        description: { pt: 'Ao criar nova newsletter, escolha "Post do blog" e salve para preencher o corpo com um modelo editável (título, resumo, link).' },
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: { en: 'Subject', pt: 'Assunto' },
      admin: {
        description: { pt: 'Assunto do e-mail que os inscritos receberão.' },
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: { en: 'Body', pt: 'Corpo' },
      admin: {
        description: { pt: 'Conteúdo da newsletter (rich text). Será convertido em HTML no envio. Rodapé com link de desinscrever é adicionado automaticamente.' },
      },
    },
    {
      name: 'sendToTags',
      type: 'array',
      label: { en: 'Send only to tags', pt: 'Enviar apenas para tags' },
      admin: {
        description: { pt: 'Deixe vazio para enviar a todos. Preencha para enviar só a inscritos que tenham pelo menos uma dessas tags.' },
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
      name: 'status',
      type: 'select',
      label: { en: 'Status', pt: 'Status' },
      options: [
        { label: { en: 'Draft', pt: 'Rascunho' }, value: 'draft' },
        { label: { en: 'Sent', pt: 'Enviada' }, value: 'sent' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        description: { pt: 'Só é possível enviar quando estiver em Rascunho.' },
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: { en: 'Sent at', pt: 'Enviada em' },
      admin: {
        description: { pt: 'Preenchido automaticamente ao enviar.' },
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: "d 'de' MMM 'de' yyyy, HH:mm",
        },
        readOnly: true,
      },
    },
  ],
  endpoints: [
    {
      method: 'post',
      path: ':id/send',
      handler: sendNewsletterHandler,
    },
  ],
}

async function sendNewsletterHandler(req: PayloadRequest): Promise<Response> {
  const user = req.user
  if (!user || (user as { role?: string })?.role !== 'admin') {
    return Response.json(
      { error: 'Apenas administradores podem enviar newsletters.' },
      { status: 403 },
    )
  }

  const id = req.routeParams?.id as string | undefined
  if (!id) {
    return Response.json(
      { error: 'ID da newsletter não informado.' },
      { status: 400 },
    )
  }

  const payload = req.payload

  const doc = await payload.findByID({
    collection: 'newsletters',
    id,
    req,
  }).catch(() => null)

  if (!doc) {
    return Response.json(
      { error: 'Newsletter não encontrada.' },
      { status: 404 },
    )
  }

  const status = (doc as { status?: string }).status
  if (status !== 'draft') {
    return Response.json(
      { error: 'Só é possível enviar newsletters em rascunho.' },
      { status: 400 },
    )
  }

  const subject = (doc as { subject?: string }).subject ?? ''
  const bodyState = (doc as { body?: unknown }).body
  let html = ''
  if (bodyState && typeof bodyState === 'object' && bodyState !== null && 'root' in bodyState) {
    html = convertLexicalToHTML({
      data: bodyState as SerializedEditorState,
      disableContainer: true,
    })
  }
  if (!html) {
    html = '<p>Conteúdo da newsletter.</p>'
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || (req.url ? new URL(req.url).origin : '')
  const desinscreverUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/desinscrever` : '/desinscrever'
  const emailFooter = `
<div style="margin-top:2em;padding-top:1em;border-top:1px solid #eee;font-size:12px;color:#666;">
  Você recebeu este e-mail porque está inscrito na nossa newsletter.
  <br />
  <a href="${desinscreverUrl}" style="color:#666;">Cancelar inscrição</a>
</div>`
  html = html.trim() + emailFooter

  const sendToTagsRaw = (doc as { sendToTags?: { tag?: string }[] }).sendToTags
  const sendToTags: string[] = Array.isArray(sendToTagsRaw)
    ? sendToTagsRaw.map((t) => t?.tag).filter((t): t is string => typeof t === 'string' && t.length > 0)
    : []

  const subscribersResult = await payload.find({
    collection: 'subscribers',
    where: {
      and: [
        { cancelado: { not_equals: true } },
        { status: { equals: 'subscribed' } },
      ],
    },
    limit: 10_000,
    pagination: false,
    req,
  })
  let subscribers = subscribersResult.docs ?? []
  if (sendToTags.length > 0) {
    subscribers = subscribers.filter((s) => {
      const tags = (s as { tags?: { tag?: string }[] }).tags ?? []
      return tags.some((t) => typeof t?.tag === 'string' && sendToTags.includes(t.tag))
    })
  }
  const emails = subscribers
    .map((s) => (s as { email?: string }).email)
    .filter((e): e is string => typeof e === 'string' && e.length > 0)

  if (emails.length === 0) {
    const msg =
      sendToTags.length > 0
        ? 'Nenhum inscrito ativo com as tags selecionadas. Verifique "Enviar apenas para tags" ou deixe vazio para enviar a todos.'
        : 'Nenhum inscrito ativo (sem cancelado e status Inscrito) para enviar.'
    return Response.json({ error: msg }, { status: 400 })
  }

  let sent = 0
  const errors: string[] = []

  for (const to of emails) {
    try {
      await payload.sendEmail({
        to,
        subject,
        html,
      })
      sent++
    } catch (err) {
      errors.push(`${to}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (sent > 0) {
    await payload.update({
      collection: 'newsletters',
      id,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
      req,
    })
  }

  return Response.json({
    sent,
    total: emails.length,
    errors: errors.length > 0 ? errors.slice(0, 20) : undefined,
    message:
      errors.length > 0
        ? `Enviado para ${sent} de ${emails.length} inscritos. Alguns envios falharam.`
        : `Newsletter enviada para ${sent} inscrito(s).`,
  })
}
