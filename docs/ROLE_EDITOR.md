# Roles Admin e Editor

O Payload possui duas roles na collection `users`: **Admin** e **Editor**, com acessos separados.

## Resumo das permissões

| Recurso   | Admin | Editor |
|-----------|--------|--------|
| **Usuários** | ✅ Ver todos, criar, editar e deletar | ❌ Não acessa (menu oculto no admin) |
| **Posts**  | ✅ Ver todos, criar, editar e deletar qualquer | ✅ Ver **apenas os próprios**, criar (como autor), editar e deletar só os próprios |
| **Media**  | ✅ Ver todos, criar, editar e deletar qualquer | ✅ Ver **apenas os que fez upload**, criar, editar e deletar só os próprios |

- No **site público** (blog), todos podem ver todos os posts e mídias publicados (leitura sem login).
- No **painel admin** (`/admin`), o que cada role vê e pode fazer é o da tabela acima.

## Admin

- Gerencia **usuários** (a collection **Users** aparece no menu só para admin).
- Vê e gerencia **todos** os posts e todas as mídias.

## Editor

- **Não gerencia usuários**: a collection Users fica oculta no menu (`admin.hidden` quando `role !== 'admin'`).
- **Posts**: no admin só vê a lista dos próprios posts (onde `author` é ele); pode criar (autor definido automaticamente), editar e deletar só esses.
- **Media**: no admin só vê as mídias que ele fez upload (`createdBy`); pode criar, editar e deletar só essas.

## Implementação

1. **Users** (`payload/collections/Users.ts`)
   - `create` / `update` / `delete`: apenas admin (`isAdmin`).
   - `read`: admin vê todos; editor só o próprio perfil (`id === user.id`).
   - `admin.hidden`: `true` para não-admin → editores não veem o menu **Users**.

2. **Posts** (`payload/access/editorAccess.ts` + `payload/collections/Posts.ts`)
   - Leitura sem login: `true` (site público).
   - Leitura logado: admin vê todos; editor vê só onde `author === user.id`.
   - Create: admin e editor (no create do editor, `author` é preenchido por hook).

3. **Media** (`payload/access/editorAccess.ts` + `payload/collections/Media.ts`)
   - Leitura sem login: `true` (exibir imagens dos posts no site).
   - Leitura logado: admin vê todos; editor vê só onde `createdBy === user.id`.
   - Campo `createdBy` preenchido no create por hook.

## Arquivos envolvidos

- `payload/access/isAdmin.ts` — acesso exclusivo de admin.
- `payload/access/editorAccess.ts` — regras de create/read/update/delete para Posts e Media (admin vs editor).
- `payload/collections/Users.ts` — acesso só admin para gestão + `admin.hidden` para editor.
- `payload/collections/Posts.ts` — `postsEditorAccess` + hook que define `author` para editor.
- `payload/collections/Media.ts` — `mediaEditorAccess`, campo `createdBy` e hook no create.

## Mídia antiga (sem `createdBy`)

Mídias criadas antes do campo `createdBy` ficam com esse campo nulo. Apenas **admin** pode editá-las ou deletá-las; editores não as veem na lista nem podem gerenciá-las.
