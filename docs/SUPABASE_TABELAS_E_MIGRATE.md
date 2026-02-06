# Tabelas no Supabase, Migrate e Secrets

## Resposta direta

- **Tabelas no Supabase**: Depende de como você usou o projeto até agora.
  - Se você já rodou `npm run dev` com `DATABASE_URL` apontando para o **Supabase**, o Payload (em modo desenvolvimento) usa o **Drizzle Push**: ele **cria/atualiza as tabelas automaticamente** no primeiro acesso. Então as tabelas podem **já estar criadas** no Supabase.
  - Se você nunca conectou o app ao Supabase, ou só usou um Postgres local, então **não**: as tabelas ainda não existem no Supabase até você conectar e rodar dev (push) ou rodar as migrações.
- **Migrate**: Sim, para **produção** (ex.: Vercel) você **precisa** usar migrate. Em dev o Push cuida do schema; em produção o Payload não faz push, então é obrigatório rodar as migrações (gerar com `migrate:create` e aplicar com `migrate`).
- **Edge Functions do Supabase**: **Não** são necessárias para o Payload. O Payload roda no seu Next.js (ex.: na Vercel). O Supabase aqui é só o **banco Postgres**. Edge Functions seriam para lógica que roda *dentro* do Supabase.
- **Secrets**: Os segredos que importam para o Payload são os da **aplicação** (Vercel ou onde o Next.js estiver): `PAYLOAD_SECRET`, `DATABASE_URL`, etc. No Supabase você não precisa configurar “secrets” especiais para o Payload — só a connection string que você já coloca no `.env` / Vercel.

---

## Como o Payload cria/atualiza as tabelas

### Em desenvolvimento (`npm run dev`)

- O adapter Postgres usa **Drizzle Push** por padrão.
- Ao subir o app com `DATABASE_URL` apontando para um Postgres (incluindo Supabase), o Drizzle **compara** o schema do `payload.config.ts` com o banco e **aplica as diferenças** (cria tabelas, colunas, etc.).
- Ou seja: **não é obrigatório** rodar migrate em dev; as tabelas podem ter sido criadas/atualizadas só por rodar o dev contra o Supabase.

### Em produção (ex.: Vercel)

- **Push está desativado.** O schema do banco **precisa** estar alinhado via **migrações**.
- Fluxo recomendado:
  1. **Gerar** os arquivos de migração: `npm run payload migrate:create` (com `DATABASE_URL` definida, se quiser que o Payload compare com o banco atual).
  2. **Aplicar** as migrações antes do build: no deploy (Vercel), o comando de build deve rodar `payload migrate` e depois o build do Next (ex.: `npm run ci` que faz `payload migrate && next build`).

---

## O que fazer no seu projeto

### 1. Conferir se as tabelas já existem no Supabase

- No **Supabase**: Dashboard → **Table Editor** (ou SQL Editor).
- Verifique se existem tabelas como `users`, `posts`, `media` (e tabelas auxiliares que o Payload cria, ex. `_rels`, `_v`, etc.).
- Se existirem e o app já funcionou contra esse banco em dev, então elas foram criadas pelo **Push** em desenvolvimento.

### 2. Adicionar o script do Payload (já feito no package.json)

Para poder rodar migrate e migrate:create:

```json
"payload": "cross-env PAYLOAD_CONFIG_PATH=./payload.config.ts payload"
```

(ou o equivalente que foi adicionado no seu `package.json`)

### 3. Gerar a primeira migração (para produção)

Com `DATABASE_URL` no `.env` apontando para o **Supabase** (ou para um Postgres de staging):

```bash
npm run payload migrate:create
```

- Isso gera arquivos em `./migrations` (ou no diretório configurado no adapter).
- Se o Supabase já tiver as tabelas (por causa do Push), a migração pode sair “vazia” ou com poucas alterações; mesmo assim, é importante ter migrações para o fluxo de produção.

### 4. Rodar as migrações no deploy (Vercel)

- No **Build Command** da Vercel, use um script que:
  - Rode **primeiro** `payload migrate` (para aplicar migrações pendentes no banco de produção).
  - Depois rode o build do Next (ex.: `next build`).
- Exemplo de script no `package.json`:

```json
"ci": "payload migrate && next build"
```

E na Vercel: **Build Command** = `npm run ci` (e **Install Command** = `npm install`).

- Assim, a cada deploy, as migrações são aplicadas no banco (Supabase) antes de subir a nova versão.

### 5. Variáveis de ambiente (secrets) na Vercel

Para o Payload funcionar em produção, configure na Vercel (Settings → Environment Variables):

- `PAYLOAD_SECRET` — obrigatório, valor forte e único.
- `DATABASE_URL` — connection string do Supabase (Session mode / pooler, ex.: porta 6543).
- `BLOB_READ_WRITE_TOKEN` — se usar uploads no admin (Vercel Blob).

Nada disso é “Edge Function” nem “secret” do Supabase; são variáveis da **aplicação** que roda na Vercel.

---

## Resumo

| Pergunta | Resposta |
|----------|----------|
| As tabelas foram criadas no Supabase? | Podem ter sido, se você já rodou `npm run dev` com `DATABASE_URL` do Supabase (Push em dev). Confira no Table Editor. |
| Preciso rodar migrate? | Em **produção**, sim. Em dev o Push pode ter criado tudo; para deploy, use `migrate:create` e depois `migrate` no build. |
| Preciso de Edge Functions no Supabase? | Não, para o Payload. Supabase é só o Postgres. |
| Onde configuro os secrets? | Na **Vercel** (e no `.env` local): `PAYLOAD_SECRET`, `DATABASE_URL`, etc. |

Se quiser, no próximo passo podemos revisar juntos o `package.json` e o Build Command da Vercel para deixar o fluxo de migrate explícito e documentado no repositório.
