# Revisão de segurança – Sistema de login do dashboard

## Resumo

O fluxo de login (Payload CMS + página `/dashboard/login` + middleware para `/admin`) foi revisado. **Uma correção foi aplicada** (open redirect). As demais práticas estão adequadas ou dependem do Payload; recomendações adicionais estão listadas abaixo.

---

## 1. Open redirect (corrigido)

**Risco:** O parâmetro `?redirect=` na página de login era usado sem validação. Um link como `/dashboard/login?redirect=https://evil.com` poderia redirecionar o usuário para um site externo após o login.

**Correção:** Foi adicionada a função `safeRedirectTarget()` em `app/(dashboard)/dashboard/login/page.tsx`, que:
- Aceita apenas valores que começam com `/` e não com `//`.
- Restringe destinos aos prefixos permitidos: `/dashboard` e `/admin`.

Assim, apenas redirecionamentos internos para o painel ou para o admin são aceitos.

---

## 2. Cookie de autenticação (Payload)

**Configuração atual** em `payload/collections/Users.ts`:
- `secure: process.env.NODE_ENV === 'production'` – cookie só em HTTPS em produção.
- `sameSite: 'Lax'` – adequado para uso same-site (dashboard no mesmo domínio).
- Payload define o cookie na resposta de `POST /api/users/login`; o nome é `payload-token` (padrão).

**Recomendações:**
- Confirmar no DevTools (Application → Cookies) se o cookie está com **HttpOnly** (o Payload costuma definir para cookies de auth; se a configuração expuser a opção, ativar explicitamente).
- Em produção, garantir que `NODE_ENV === 'production'` e que o site seja servido apenas por HTTPS.

---

## 3. Middleware (`/admin` → `/dashboard/login`)

- O middleware só verifica **presença** do cookie `payload-token` (não valida o JWT no edge). Isso é aceitável: a validação real ocorre no layout `(authenticated)` e nas APIs do Payload.
- O valor colocado em `?redirect=` é o **pathname** da requisição (`/admin` ou `/admin/...`), controlado pelo servidor, não por input do usuário – não há open redirect no middleware.
- **Matcher** restrito a `['/admin', '/admin/:path*']` – não afeta outras rotas.

Nenhuma alteração necessária no middleware do ponto de vista desta revisão.

---

## 4. Proteção das rotas (layout autenticado)

- O layout `app/(dashboard)/dashboard/(authenticated)/layout.tsx`:
  - Lê o cookie no servidor.
  - Chama `payload.auth()` para validar o token.
  - Verifica role `admin` ou `editor`.
  - Redireciona para `/dashboard/login` em caso de falha.

Fluxo adequado; não há bypass óbvio (acesso direto a `/dashboard` sem token válido resulta em redirect).

---

## 5. Brute force e rate limiting

- **Payload:** Em `Users.ts` estão definidos `maxLoginAttempts: 5` e `lockTime: 15 * 60 * 1000` (15 min). Isso mitiga tentativas repetidas por **usuário**.
- **Por IP:** Existe `lib/rate-limit.ts`, mas não está aplicado à rota de login. A rota de login é a API do Payload (`(payload)/api/[...slug]`), não uma rota customizada. Para limitar tentativas por IP no login seria necessário um middleware que conte requisições `POST` para algo como `/api/users/login` (e possivelmente integrar com o rate-limit existente) ou um proxy em frente ao Payload. **Recomendação:** considerar rate limit por IP no middleware para `POST /api/users/login` se houver preocupação com muitos IPs distintos tentando logins.

---

## 6. CSRF

- Login e logout usam `fetch(..., { credentials: 'include' })` no mesmo domínio.
- Cookie com `SameSite: 'Lax'` não é enviado em requisições cross-site POST a partir de outro site; isso reduz risco de CSRF clássico.
- Payload pode usar proteção CSRF própria; em cenários same-site com Lax, o risco costuma ser baixo. Se no futuro o login for usado em contexto cross-site, avaliar tokens CSRF ou SameSite mais restritivo.

---

## 7. Vazamento de informação (mensagens de erro)

- Na página de login, em falha é exibido: `data.errors?.[0]?.message ?? data.message ?? 'E-mail ou senha inválidos.'` – mensagem genérica como fallback, o que evita indicar se o e-mail existe ou não. Adequado.
- Em erro de rede: `'Erro de conexão. Tente novamente.'` – genérico. Adequado.
- No layout autenticado, falhas de auth são logadas no servidor (`console.error`) e o usuário só é redirecionado – sem expor detalhes ao cliente. Adequado.

---

## 8. Checklist rápido

| Item                         | Status |
|-----------------------------|--------|
| Open redirect em `?redirect=` | Corrigido (allowlist `/dashboard`, `/admin`) |
| Cookie secure em produção   | Configurado no Payload |
| Cookie SameSite             | Lax (adequado) |
| Validação de token no servidor | Sim, no layout (authenticated) |
| Restrição por role (admin/editor) | Sim |
| Limite de tentativas por usuário | Sim (Payload: 5 tentativas, 15 min lock) |
| Mensagens de erro genéricas | Sim |
| Middleware só para /admin   | Sim |

---

## Conclusão

O sistema está **seguro para uso típico** após a correção do open redirect. Mantenha:
- `PAYLOAD_SECRET` forte e exclusivo em produção.
- HTTPS e `NODE_ENV=production` em produção.
- Verificação no navegador de que o cookie de auth está HttpOnly (e Secure em produção).

Opcional: adicionar rate limit por IP na rota de login se quiser proteção extra contra tentativas distribuídas.
