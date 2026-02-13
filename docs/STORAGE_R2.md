# Storage R2 (Cloudflare) – erros comuns

O projeto usa Cloudflare R2 (compatível S3) para mídias do blog e dos projetos. As variáveis `S3_*` e `NEXT_PUBLIC_R2_PUBLIC_URL` devem estar configuradas em produção.

## Erro: S3ServiceException 403 "UnknownError"

**Causa:** O R2 (ou um proxy) devolve 403 Forbidden e o AWS SDK não consegue deserializar a resposta (por exemplo, HTML em vez de XML), então mostra "UnknownError" em vez de "Access Denied". O **403 quase sempre indica problema de autenticação ou permissão**.

**O que verificar (em produção, ex.: Vercel):**

1. **`S3_ENDPOINT`**  
   Deve ser exatamente: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`  
   - Sem barra no final.  
   - Substituir `<ACCOUNT_ID>` pelo ID da conta Cloudflare (em R2 → Overview ou na URL do dashboard).

2. **`S3_ACCESS_KEY_ID` e `S3_SECRET_ACCESS_KEY`**  
   Devem ser o **Access Key** e o **Secret** do token R2 (Cloudflare Dashboard → R2 → Manage R2 API Tokens), não de outro serviço.

3. **Nome do bucket**  
   `S3_BUCKET` deve ser o nome exato do bucket R2 (como aparece no dashboard).

4. **Permissões do token**  
   O token usado em produção deve ter **Object Read & Write** (ou pelo menos leitura + listagem + escrita) no **bucket inteiro**, sem restrição só a um prefixo.

5. **Ambiente (Lambda/Vercel)**  
   Confirmar que as variáveis de ambiente estão definidas no ambiente onde o código roda (Production, etc.) e que não há typo nos nomes (`S3_ACCESS_KEY_ID`, não `AWS_ACCESS_KEY_ID`).

Depois de corrigir, fazer novo deploy ou reiniciar a função.

## Erro: `[storage-r2] listPrefix failed: <slug> Access Denied`

**Causa:** O token de API do R2 (credenciais S3 em produção) não tem permissão para **listar** objetos no bucket, ou a política do bucket restringe por prefixo.

**O que acontece:** A API lista mídias em dois tipos de prefixo:
- `midias/` (pasta geral e subpastas por projeto, ex.: `midias/resindencia_feijo/`)
- `<slug>/` (prefixo por slug de projeto, ex.: `resindencia_feijo/`)

Se o R2 negar acesso em algum prefixo (ex.: `resindencia_feijo`), o log mostra "Access Denied" e a listagem desse prefixo retorna vazia. A página de mídias pode carregar com 200, mas com menos arquivos do que o esperado.

**Solução:**

1. **Cloudflare Dashboard** → R2 → seu bucket → **Settings** → **API Tokens** (ou use um token de conta com R2).
2. O token usado em produção (`S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`) deve ter permissão **Object Read & Write** (ou pelo menos leitura + listagem) no **bucket inteiro**.
3. Não restrinja o token apenas a um prefixo (ex.: só `midias/`), pois a aplicação também lista prefixos por slug de projeto (`<slug>/`).
4. Se usar **Custom Domain** ou **Bucket Policy**, verifique se não há regra que bloqueie `ListBucket` ou `GetObject` para certos prefixos.

Depois de ajustar o token ou a política, faça um novo deploy ou reinicie a função para garantir que as credenciais em uso estão atualizadas.

## Erro: GET `/api/dashboard/projetos/media` retorna 413

**Causa:** Resposta da API muito grande (muitos itens de mídia com URLs longas). Alguns proxies ou limites de resposta (ex.: tamanho máximo de body) devolvem 413 (Payload Too Large).

**Solução:**

- A API já limita a resposta a **no máximo 100 itens** por requisição (e padrão 50). Use paginação no frontend (`offset` / `limit`).
- Se ainda ocorrer 413, reduza o `limit` na chamada (ex.: `limit=50`) ou verifique limites do proxy/CDN em frente ao app (ex.: Vercel, Cloudflare).

## Variáveis necessárias

| Variável | Uso |
|----------|-----|
| `S3_ENDPOINT` | URL do endpoint S3 do R2 (ex.: `https://<account_id>.r2.cloudflarestorage.com`) |
| `S3_ACCESS_KEY_ID` | Access Key do token R2 |
| `S3_SECRET_ACCESS_KEY` | Secret Key do token R2 |
| `S3_BUCKET` | Nome do bucket |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | URL pública do bucket (domínio customizado ou `https://pub-xxx.r2.dev`) |

Ver também `.env.example` e `docs/PAYLOAD_PRODUCAO.md`.
