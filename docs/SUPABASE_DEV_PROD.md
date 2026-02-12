# Dois Supabase: produção e desenvolvimento

Usar um projeto Supabase para **produção** e outro para **desenvolvimento** separa egress, custos e dados entre ambientes. O código já usa apenas variáveis de ambiente; não é necessário alterar código.

## Por que usar dois projetos

- **Egress separado:** tráfego de dev não consome a cota mensal do Supabase de produção.
- **Dados isolados:** testes, uploads e mudanças no dashboard não afetam produção.
- **Segurança:** chaves de dev podem ser recriadas sem impacto em prod.

## Variáveis por ambiente

Todas estas devem apontar para o projeto correto em cada ambiente:

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto (Storage público, frontend) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon (frontend) |
| `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET` | Bucket da galeria de projetos (ex.: `a_public`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Uploads, signed URLs, server-side |
| `DATABASE_URL` | Postgres usado pelo Payload (mesmo projeto Supabase) |
| `S3_ENDPOINT` | Opcional; Storage via S3 para Payload |

- **Desenvolvimento:** use os valores do projeto **dev** no `.env.local`.
- **Produção:** use os valores do projeto **prod** nas variáveis de ambiente do Vercel.

## Passos

### 1. Criar o projeto de desenvolvimento no Supabase

1. Acesse o [Dashboard Supabase](https://supabase.com/dashboard).
2. **New project** (ex.: nome `araca-dev`).
3. Anote: **Project URL**, **anon key**, **service_role key** (Project Settings → API).
4. Em **Storage**, crie os mesmos buckets que em prod:
   - `a_public` (galeria de projetos) — público.
   - `media` (imagens do blog) — público, se usar.
5. Ajuste políticas de acesso dos buckets conforme necessário (ex.: leitura pública para esses buckets).

### 2. Configurar desenvolvimento (local)

1. Copie `.env.example` para `.env.local` se ainda não tiver.
2. No `.env.local`, defina **todas** as variáveis da tabela acima com os valores do projeto **dev** (URL, anon key, service_role key, `DATABASE_URL` do projeto dev, `S3_ENDPOINT` do projeto dev se usar).
3. Ao rodar `npm run dev`, o app usará apenas o Supabase de desenvolvimento.

### 3. Configurar produção (Vercel)

1. Vercel → seu projeto → **Settings** → **Environment Variables**.
2. Defina as mesmas variáveis com os valores do projeto **prod**.
3. Aplique ao ambiente **Production** (e a **Preview** se quiser que deploys de branch também usem prod).
4. Faça um redeploy para carregar as variáveis.

### 4. Resumo

- **`.env.local`** = sempre projeto Supabase **dev** (só para desenvolvimento local).
- **Vercel (Production)** = sempre projeto Supabase **prod**.

Nenhuma alteração em `lib/supabase-server.ts`, `lib/projetos-server.ts` ou nas API routes é necessária; elas já leem as variáveis de ambiente.

## Observações

- **Database (Payload):** O projeto dev tem seu próprio Postgres. Rode migrações no dev quando precisar; prod continua com os dados reais.
- **Conteúdo em dev:** Imagens e arquivos de prod não aparecem em dev. Para testes realistas, copie dados ou faça uploads manuais no bucket de dev.
