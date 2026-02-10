# Implementação Payload CMS 3 – Revisão e checklist

Revisão alinhada à [documentação oficial](https://payloadcms.com/docs) (instalação, admin, customização CSS).

---

## Estrutura do projeto (conforme doc)

| Item | Doc | Este projeto | Status |
|------|-----|--------------|--------|
| Next.js 15+ | Obrigatório | Next 16 | OK |
| `app/(payload)/` | Route group Payload | `app/(payload)/` | OK |
| `app/(payload)/layout.tsx` | Layout com RootLayout, importMap, serverFunction | Implementado com fontes custom | OK |
| `app/(payload)/admin/[[...segments]]/page.tsx` | RootPage + generatePageMetadata | Implementado | OK |
| `app/(payload)/admin/[[...segments]]/not-found.tsx` | 404 do admin | Adicionado (NotFoundPage) | OK |
| `app/(payload)/admin/importMap.js` | Map de componentes custom | Lexical + Aracá (Icon, Logo, etc.) | OK |
| `app/(payload)/api/[...slug]/route.ts` | REST API | REST_GET/POST/DELETE/PATCH/PUT/OPTIONS | OK |
| `app/(payload)/custom.scss` | Estilos globais do admin | Tema Aracá em `@layer payload` | OK |
| `payload.config.ts` | Config na raiz | Na raiz, tsconfig path `@payload-config` | OK |
| `next.config` | withPayload(nextConfig), experimental.reactCompiler: false | withPayload + reactCompiler em experimental | OK |
| `tsconfig.json` | paths["@payload-config"] | Configurado | OK |

Rotas GraphQL (`/graphql`, `/graphql-playground`) não são obrigatórias; o projeto usa apenas REST.

---

## Configuração Payload (payload.config.ts)

- **editor:** lexicalEditor()
- **db:** postgresAdapter (Supabase)
- **collections:** getter lazy (Posts, Media, Users, Subscribers)
- **admin:** meta (título, ícone), components.graphics (Icon, Logo), autoLogin em dev
- **i18n:** pt, en (fallback pt)
- **plugins:** S3 (Supabase Storage) ou Vercel Blob
- **secret:** PAYLOAD_SECRET (obrigatório em produção)

Nenhuma alteração necessária para seguir a doc.

---

## Estilização do admin (custom.scss)

- **Escopo:** `html:has(body[data-payload-admin])` para afetar só o admin.
- **Variáveis:** Override de `--theme-elevation-*`, `--theme-bg`, `--theme-text`, `--theme-border-color`, `--theme-success-*` conforme [Customizing CSS](https://payloadcms.com/docs/admin/customizing-css).
- **Layer:** Todo o SCSS está em `@layer payload` para aplicar depois dos estilos padrão do Payload.
- **Dark mode:** Tema atual é só light; dark mode do usuário não está customizado (usa padrão do Payload).
- **BEM:** Payload usa BEM; seletores como `[class*='field-label']` e `.react-select__*` seguem a doc. Evitar regras que escondam valor/label (ex.: `opacity: 0`, `font-size: 0`).

Se campos ou labels sumirem, isolar o problema: comentar trechos do `custom.scss` ou usar temporariamente o select padrão nos campos (ex.: category/status em Posts) para testar.

---

## Collections

| Collection | Auth | Uso |
|------------|------|-----|
| **users** | Sim (cookies) | Admin + campo Author em Posts; roles admin/editor |
| **posts** | Acesso por role (editorAccess) | Blog; richText Lexical, relationship author, upload coverImage |
| **media** | editorAccess | Upload S3/Blob; imageSizes (thumbnail, card, hero) |
| **subscribers** | create público; read/update/delete admin | Newsletter |

Posts: category e status usam **select padrão** do Payload (sem Field custom) para evitar bugs de exibição. Para reativar CategorySelectField, descomentar `admin.components.Field` em `payload/collections/Posts.ts`.

---

## Checklist pós-revisão

- [x] next.config: `withPayload(nextConfig)`, `experimental.reactCompiler: false`
- [x] Layout (payload): RootLayout com config (Promise), importMap, serverFunction
- [x] Admin: page.tsx (RootPage) + not-found.tsx (NotFoundPage)
- [x] API REST: route.ts com REST_* handlers
- [x] custom.scss: tema Aracá em `@layer payload`; comentário sobre dark mode
- [x] payload.config: collections, admin, db, secret, i18n
- [ ] **Variáveis de ambiente:** DATABASE_URL, PAYLOAD_SECRET; em produção S3_* ou BLOB_READ_WRITE_TOKEN

---

## Ajustes feitos na revisão

- **next.config.mjs:** `reactCompiler: false` no nível raiz (Next 16 não usa mais em `experimental`).
- **custom.scss:** Conteúdo envolvido em `@layer payload`; comentário sobre dark mode e doc.
- **app/(payload)/admin/[[...segments]]/not-found.tsx:** Adicionada; usa `NotFoundPage` do Payload.
- **Componentes admin (TypeScript):** Em `AuthorField`, `AuthorSelectField` e `CategorySelectField` foi removido o uso de `validate` em `useField` (incompatibilidade de tipos com Payload 3) e corrigido `required` (vir de `field`, não de `field.admin`). Em `CategorySelectField`, `onChangeFromProps` passa `newValue ?? ''` para satisfazer `string | string[]`.

---

## Referências

- [Installation](https://payloadcms.com/docs/getting-started/installation)
- [The Admin Panel](https://payloadcms.com/docs/admin/overview)
- [Customizing CSS & SCSS](https://payloadcms.com/docs/admin/customizing-css)
- [Configuration](https://payloadcms.com/docs/configuration/overview)
