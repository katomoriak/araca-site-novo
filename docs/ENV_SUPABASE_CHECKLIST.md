# Checklist: .env para Supabase (puxar dados + upload)

## Puxar tudo de uma vez (links + template)

Rode no terminal:

```bash
npm run env:supabase
```

Isso mostra os **links diretos** do Supabase Dashboard (API e Database) do seu projeto e um **template** com todas as variáveis. Se já tiver `NEXT_PUBLIC_SUPABASE_URL` no `.env.local`, os links usam o project ref automaticamente.

Para gravar o template em arquivo e depois copiar para `.env.local`:

```bash
npm run env:supabase:write
```

O Supabase não expõe as chaves via API por segurança; você ainda precisa copiar da Dashboard e colar no `.env.local`. O script só centraliza os links e o modelo de variáveis.

---

## O que o código usa

| Variável | Onde é usada | Necessidade |
|----------|----------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URLs públicas do Storage, image-proxy, projetos, blog media, vídeo home | **Obrigatória** para “puxar” assets e para upload |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-server.ts`, `app/api/upload/route.ts`, `app/api/dashboard/blog/media/route.ts`, upload de projetos | **Obrigatória** para qualquer upload (blog, projetos, signed URLs) |
| `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET` | Galeria de projetos (home) | Opcional; default `a_public` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Só no script `scripts/list-supabase-storage.mjs` | Opcional para o app; necessária só se rodar esse script |
| `DATABASE_URL` | Payload CMS (Postgres) | **Obrigatória** para o dashboard e coleções do Payload |
| `PAYLOAD_SECRET` | Payload CMS | **Obrigatória** (32+ caracteres) |
| `S3_ENDPOINT` + `S3_ACCESS_KEY_ID` + `S3_SECRET_ACCESS_KEY` + `S3_BUCKET` | Payload storage (uploads da collection Media no admin) | Opcional se você usa só Supabase para blog/projetos; necessário se quiser upload via Payload Media para Supabase S3 |
| `BLOB_READ_WRITE_TOKEN` | Payload storage (fallback se S3_* não estiverem definidas) | Uma das duas: S3_* ou BLOB_* para o Payload não falhar em uploads de mídia no admin |

## Para “puxar” dados do Supabase (leitura)

- **Basta:** `NEXT_PUBLIC_SUPABASE_URL` (e, se o bucket for outro, `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET`).
- As URLs públicas do Storage não usam `ANON_KEY` no app; o script `list-supabase-storage.mjs` é que usa `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Para fazer upload (blog, projetos, signed URLs)

- **Obrigatório:** `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- Sem `SUPABASE_SERVICE_ROLE_KEY`, `getSupabaseServer()` retorna `null` e todas as rotas de upload/Supabase no servidor ficam desativadas.

## Nome da chave “publishable”

- O código e o `.env.example` usam **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**.
- Se no dashboard do Supabase aparecer só “Publishable” ou “Default key”, use esse valor em `NEXT_PUBLIC_SUPABASE_ANON_KEY` (e opcionalmente em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` se algum script usar).
- O app principal **não** usa a anon/publishable key para Storage público; só o script de listagem usa.

## Resumo: mínimo para puxar + upload via Supabase

No `.env.local` (dev) ou nas env vars do Vercel (prod):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...   # Project Settings → API → service_role (secret)
```

Para o Payload e o site funcionarem:

```
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=alguma-string-com-32-caracteres-no-minimo
```

Opcional: `NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET=a_public`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` (para o script), e S3_* ou BLOB_* conforme uso do admin.
