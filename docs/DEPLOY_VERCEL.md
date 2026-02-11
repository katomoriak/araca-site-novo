# Deploy na Vercel

Este projeto usa **Vercel** (serverless) + **Supabase Cloud**. Não há Docker, Coolify nem VPS.

## Primeiro deploy (conectar ao GitHub)

1. Acesse [vercel.com](https://vercel.com) e faça login (use “Continue with GitHub” se o repositório estiver no GitHub).
2. **Add New** → **Project** → importe o repositório `katomoriak/araca-site-novo` (ou o seu fork).
3. A Vercel detecta Next.js e usa o `vercel.json` do projeto (build: `npm install --legacy-peer-deps && next build --webpack`).
4. Em **Environment Variables** adicione as variáveis obrigatórias (veja tabela abaixo) para **Production** (e **Preview** se quiser).
5. Clique em **Deploy**. O build **não** roda `payload migrate` (evita erro de ambiente com undici na Vercel); aplique migrações separadamente (veja seção *Migrações* abaixo).

Depois disso, cada **push na branch conectada** (ex.: `master`) gera um deploy automático.

## Build

- **Build command**: `npm install --legacy-peer-deps && next build --webpack`  
  O build na Vercel **não** executa `payload migrate` para evitar o erro `TypeError: Illegal constructor` (undici/CacheStorage no ambiente de build). As migrações devem ser aplicadas separadamente (veja *Migrações*).
- **Node**: 20.x (definido em `engines` e `.nvmrc`).

## Migrações

As migrações do Payload **não** rodam durante o build na Vercel. Aplique-as assim:

1. **Antes do primeiro deploy** (ou após alterar collections): no seu ambiente local, defina `DATABASE_URL` com a connection string do **Supabase Cloud** (produção) e execute:
   ```bash
   npx payload migrate
   ```
2. Ou use o script do projeto: `npm run payload migrate` (com `DATABASE_URL` no `.env.local` apontando para o banco de produção).
3. Depois disso, faça o deploy na Vercel; o site usará o schema já migrado.

## Variáveis de ambiente obrigatórias

Configure no painel da Vercel (Settings → Environment Variables) para **Production** (e Preview se quiser):

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `PAYLOAD_SECRET` | Sim | Segredo para sessões Payload. Use um valor aleatório longo (32+ caracteres). Nunca commitar. |
| `DATABASE_URL` | Sim | Connection string do Postgres (Supabase Cloud). Em Project Settings → Database use **Session mode** (porta **6543**). Ex.: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require` |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL base do site em produção (ex.: `https://aracainteriores.com.br`). Usado em metadata, sitemap, links de e-mail. |

## Upload de mídia (admin Payload)

Escolha **uma** das opções:

### Opção A: Supabase Storage (S3-compatible)

No Supabase: Project Settings → Storage → S3 Connection. Crie o bucket `media` no Studio.

| Variável | Valor |
|----------|--------|
| `S3_ENDPOINT` | URL S3 do Supabase (ex.: `https://[PROJECT-REF].supabase.co/storage/v1/s3`) |
| `S3_ACCESS_KEY_ID` | Access key do S3 |
| `S3_SECRET_ACCESS_KEY` | Secret key do S3 |
| `S3_BUCKET` | `media` |
| `S3_REGION` | `auto` (ou o indicado pelo Supabase) |

### Opção B: Vercel Blob

| Variável | Valor |
|----------|--------|
| `BLOB_READ_WRITE_TOKEN` | Token em Vercel → Storage → Blob. Deixe S3_* vazias. |

## Variáveis opcionais

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend: galeria de projetos (imagens) e vídeo na home. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Se usar Supabase Client no frontend. |
| `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET` | Nome do bucket de projetos (padrão: `a_public`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor: upload de imagens no blog, URLs assinadas. Nunca expor no frontend. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` | Envio de e-mails (newsletter). Sem SMTP, o envio fica desativado. |

## Checklist antes do primeiro deploy

1. [ ] Criar projeto no [Supabase Cloud](https://supabase.com) e obter `DATABASE_URL` (Session mode, porta 6543).
2. [ ] Aplicar migrações no Supabase **localmente** (veja seção *Migrações*); o build na Vercel não roda `payload migrate`.
3. [ ] Definir `PAYLOAD_SECRET` e `NEXT_PUBLIC_SITE_URL` na Vercel.
4. [ ] Configurar upload: S3 (Supabase) ou `BLOB_READ_WRITE_TOKEN` (Vercel Blob).
5. [ ] Não commitar `.env` nem `.env.local`; usar apenas o painel da Vercel (ou CLI) para valores reais.

## Referências

- `.env.example` — lista de variáveis e comentários.
- `payload.config.ts` — validação de `PAYLOAD_SECRET` e `DATABASE_URL` em produção.
