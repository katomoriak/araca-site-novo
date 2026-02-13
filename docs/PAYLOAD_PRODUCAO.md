# Payload CMS em produção (Vercel)

Se aparecer **"There was an error initializing Payload"** em produção, a inicialização do Payload falhou (geralmente banco ou variáveis de ambiente).

## Checklist na Vercel

1. **Variáveis de ambiente** (Settings → Environment Variables):
   - **`DATABASE_URL`** (obrigatório) – connection string do PostgreSQL.
   - **`PAYLOAD_SECRET`** (obrigatório) – segredo de 32+ caracteres (nunca use o valor de desenvolvimento).

2. **Supabase como banco**
   - Em **Project Settings → Database** use a connection string em **Connection pooling** (Session mode), porta **6543**.
   - Não use a conexão direta (porta 5432) na Vercel; pode dar `ENETUNREACH` (IPv6).
   - Exemplo de host: `aws-0-XX-region.pooler.supabase.com:6543`.
   - Inclua `?sslmode=require` (e opcionalmente `&pgbouncer=true`). O `payload.config.ts` adiciona `uselibpqcompat=true` para Supabase.

3. **Rede**
   - Se o deploy falha só em produção, confira se o IP da Vercel está permitido no Supabase (ou use “Allow all” em desenvolvimento).
   - Timeout: pool está limitado a 5 conexões e 10s no `payload.config.ts`; se o banco estiver lento, pode falhar na inicialização.

## Como ver o erro real

A mensagem genérica esconde o motivo. Para descobrir a causa:

1. **Logs da Vercel**
   - Deploy: **Deployments** → último deploy → **Building** / **Functions**.
   - Runtime: **Logs** (ou **Functions** → escolher a função que atende `/admin` ou a API do Payload).
   - Procure por `[Payload]`, `payloadInitError`, `ECONNREFUSED`, `ENETUNREACH`, `timeout`, `password authentication failed`.

2. **Erro na carga do config**
   - Se `DATABASE_URL` ou `PAYLOAD_SECRET` estiverem faltando ou inválidos em produção, o `payload.config.ts` passa a lançar um erro explícito ao carregar (ex.: “Em produção defina DATABASE_URL…”). Esse erro deve aparecer nos logs do build ou da função.

3. **Debug temporário** (só para diagnosticar)
   - Na Vercel, crie uma variável `DEBUG` ou use a opção de debug do Payload se existir no seu `payload.config.ts`.
   - Não deixe debug ativado em produção por muito tempo.

## Erros comuns

| Sintoma | Causa provável | Solução |
|--------|-----------------|--------|
| "There was an error initializing Payload" | `DATABASE_URL` ausente ou errada | Definir em Vercel com a connection string do pooler (6543). |
| Mesmo erro | `PAYLOAD_SECRET` ausente ou ainda o de dev | Definir um segredo forte só para produção. |
| ENETUNREACH / timeout | Conexão direta (5432) ou firewall | Usar pooler Supabase (6543) e checar restrições de IP. |
| password authentication failed | Senha/usuário errados | Conferir usuário e senha em Project Settings → Database. |
| Falha só no cold start | Timeout de conexão | Aumentar um pouco `connectionTimeoutMillis` no config (evite valores altos em serverless). |
| **POST /api/users/login → 500** | Payload não inicializa ou erro no login | Mesmo que acima: `DATABASE_URL` e `PAYLOAD_SECRET`. Ver logs da função que atende `/api/*`. |

## Outros erros nos logs (401, 404)

| Sintoma | Causa provável | Solução |
|--------|----------------|--------|
| **GET /logotipos/... → 401** (em preview deploy) | Proteção de deploy da Vercel (password/Vercel Auth) em *preview* | Normal em `*-xxx.vercel.app`. Em **Settings → Deployment Protection** desative para previews ou aceite que assets pedem auth nesse tipo de URL. Produção (domínio próprio) não costuma ter isso. |
| **GET /api/image-proxy → 404** | Rota existe; 404 pode vir da *origem* (Supabase/R2) | O proxy repassa o status da origem. Se a imagem não existir no storage, retorna 404. Confira a URL em `?url=` e se o arquivo existe no bucket. |
| **GET /_next/image → 404** | Otimização de imagem do Next: origem retornou erro ou URL não permitida | Verifique `images.remotePatterns` no `next.config.mjs` e se a URL da imagem (ou do proxy) está acessível e permitida. |

## Storage R2 e API de mídias

| Sintoma | Causa provável | Solução |
|--------|-----------------|--------|
| **GET /api/dashboard/projetos/media → 413** | Resposta JSON muito grande | A API limita a 100 itens por página. Use `limit`/`offset` menores. Ver `docs/STORAGE_R2.md`. |
| **Log: [storage-r2] listPrefix failed: &lt;slug&gt; Access Denied** | Token R2 sem permissão de listagem no bucket (ou política por prefixo) | Dar ao token R2 permissão "Object Read & Write" no bucket inteiro. Ver `docs/STORAGE_R2.md`. |

## Referências

- `.env.example` – lista de variáveis usadas pelo projeto.
- `docs/STORAGE_R2.md` – erros do R2 (Access Denied, 413).
- `docs/PAYLOAD_MIGRATE_NODE24.md` – migrate e Node 20.
- Supabase: [Connection pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler).
