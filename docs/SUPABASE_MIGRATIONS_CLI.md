# Migrations com Supabase CLI

Este projeto usa **Supabase** como banco Postgres. Há dois fluxos de migração:

| Fluxo | Uso | Comandos |
|-------|-----|----------|
| **Payload CMS** | Tabelas do CMS (users, posts, media, subscribers) | `npm run payload migrate:create` e `payload migrate` (no deploy: `npm run ci`) |
| **Supabase CLI** | Migrações SQL versionadas no Supabase (RLS, policies, funções, tabelas extras) | `supabase migration new` e `supabase db push` |

Use o **Supabase CLI** quando quiser alterações que vivem só no banco (ex.: Row Level Security, triggers, tabelas que não são do Payload). As tabelas do Payload continuam sendo geridas pelo Payload.

---

## Configuração (uma vez)

### 1. Instalar o Supabase CLI

Se ainda não tiver instalado:

```bash
# npm (global)
npm install -g supabase

# ou com npx (sem instalar global)
npx supabase --version
```

### 2. Inicializar o projeto (se ainda não tiver pasta `supabase/`)

```bash
supabase init
```

Isso cria `supabase/config.toml` e a pasta `supabase/migrations/`.

### 3. Vincular ao projeto remoto

```bash
supabase login
supabase link --project-ref trghyjzhxfyjgoitzfzh
```

O `project-ref` é o ID do projeto no dashboard do Supabase (também aparece na URL: `.../project/trghyjzhxfyjgoitzfzh`).

---

## Fluxo de trabalho com migrations

### Criar uma nova migração

```bash
supabase migration new nome_da_migracao
```

Cria um arquivo em `supabase/migrations/` com timestamp, ex.:  
`supabase/migrations/20250210120000_nome_da_migracao.sql`.

Edite o `.sql` com o que precisar (CREATE TABLE, RLS, etc.).

### Aplicar todas as migrações no projeto remoto

```bash
supabase db push
```

Envia e aplica as migrações pendentes no banco do Supabase.

---

## Resumo dos comandos

```bash
# Vincular (uma vez)
supabase link --project-ref trghyjzhxfyjgoitzfzh

# Nova migração
supabase migration new nome_da_migracao

# Aplicar migrações
supabase db push
```

---

## Relação com o Payload

- **Build/deploy (Vercel):** o script `npm run ci` roda `payload migrate && next build`. Isso aplica as **migrações do Payload** no mesmo banco.
- As migrações do **Supabase** (`supabase/migrations/*.sql`) são aplicadas manualmente ou em CI com `supabase db push`.
- Evite criar no Supabase migrations tabelas que o Payload já gerencia (users, posts, media, subscribers, etc.); use Supabase para coisas adicionais (RLS, funções, tabelas auxiliares).
