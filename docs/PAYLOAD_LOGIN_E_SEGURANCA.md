# Sistema de login do Payload e segurança

## Como funciona o login

### Onde os dados dos usuários ficam

- **Banco de dados**: Os usuários são armazenados no **PostgreSQL** (no seu caso, Supabase), via `DATABASE_URL` no `payload.config.ts`.
- A coleção `users` vira uma tabela no Postgres (Payload usa o adapter `@payloadcms/db-postgres`). Cada usuário tem:
  - `id`, `email`, **senha hasheada** (Payload usa bcrypt por padrão), `name`, `role`, timestamps, etc.
- **Nunca** é armazenada a senha em texto puro; apenas o hash.

### Fluxo de autenticação

1. **Login**: O usuário envia email + senha para a API do Payload (ex.: `POST /api/users/login`).
2. **Validação**: Payload confere a senha contra o hash no banco.
3. **Token/Cookie**: Payload emite um **JWT** e pode setar um **cookie HTTP-only** (configurável). O `PAYLOAD_SECRET` é usado para assinar o JWT.
4. **Requisições seguintes**: O cliente envia o JWT (header `Authorization`) ou o cookie; Payload valida e anexa o `user` em `req.user`, usado nas regras de `access`.

### Onde está configurado no projeto

| O quê | Onde |
|-------|------|
| Coleção de usuários (auth) | `payload/collections/Users.ts` — `auth: true` (ou objeto com opções) |
| Chave para JWT/cookies | `payload.config.ts` — `secret: process.env.PAYLOAD_SECRET` |
| Banco (onde ficam os usuários) | `payload.config.ts` — `db: postgresAdapter({ connectionString: DATABASE_URL })` |
| API que recebe login e CRUD | `app/(payload)/api/[...slug]/route.ts` — repassa para as rotas REST do Payload |
| Auto-preenchimento de login no admin | `payload.config.ts` — `admin.autoLogin` (apenas em `NODE_ENV === 'development'`) |

---

## O que foi feito para deixar mais seguro

### 1. Configuração de auth na coleção Users

Em `payload/collections/Users.ts` foi configurado:

- **`tokenExpiration`**: 7 dias — tempo de vida do JWT e do cookie.
- **`maxLoginAttempts`**: 5 — após 5 tentativas erradas, o usuário é bloqueado.
- **`lockTime`**: 15 minutos — duração do bloqueio após exceder as tentativas.
- **`cookies`**: `secure: true` em produção, `sameSite: 'lax'` — reduz risco de roubo de cookie.

### 2. Controle de acesso (access)

- **Posts e Media**: só **admin** pode criar, atualizar e deletar; leitura continua pública onde fizer sentido.
- **Users**:
  - Leitura: **admin** vê todos; usuário comum só vê o **próprio** documento.
  - Criar/atualizar/deletar outros usuários: só **admin** (via `isAdmin` em `payload/access/isAdmin.ts`).

### 3. AutoLogin só em desenvolvimento

No `payload.config.ts`, `admin.autoLogin` já está condicionado a `NODE_ENV === 'development'`, então em produção ninguém entra sem senha.

---

## Checklist de segurança (o que você deve garantir)

1. **`PAYLOAD_SECRET`**
   - Use um valor **forte e único** em produção (ex.: 32+ caracteres aleatórios).
   - **Nunca** use o valor padrão `development-secret-please-change-in-production` em produção.
   - Se trocar o secret, todos os JWTs atuais deixam de ser válidos (usuários terão de logar de novo).

2. **`DATABASE_URL`**
   - Mantenha a connection string **fora do código** (só em `.env` / variáveis de ambiente da Vercel).
   - Em produção, use SSL (ex.: `sslmode=require` ou `verify-full` conforme o provedor).

3. **`.env` e `.env.local`**
   - Não commitar nunca; garantir que estão no `.gitignore`.
   - Na Vercel, configurar todas as variáveis no painel (Environment Variables).

4. **HTTPS**
   - Em produção, o site e o admin devem ser servidos só por HTTPS (a Vercel já faz isso).

5. **Senhas dos usuários**
   - Payload já hasheia com bcrypt; não é preciso fazer nada extra no código.
   - Oriente os usuários a usarem senhas fortes e, se quiser, ative no futuro **verificação de email** (`auth.verify`) ou **forgot password** em `Users.ts`.

6. **API Keys (opcional)**
   - Se precisar de acesso por serviço (ex.: script, outro backend), pode ativar `useAPIKey: true` na coleção Users; as chaves são criptografadas no banco. Se mudar `PAYLOAD_SECRET`, será preciso regenerar as API keys.

---

## Resumo

- **Dados dos usuários**: tabela da coleção `users` no **PostgreSQL** (Supabase), com senha sempre hasheada.
- **Login**: email + senha → Payload valida → emite JWT (e opcionalmente cookie) assinado com `PAYLOAD_SECRET`.
- **Segurança**: limite de tentativas de login, cookie seguro em produção, acesso restrito por role (admin vs editor) e autoLogin apenas em dev já foram aplicados; o que falta é garantir `PAYLOAD_SECRET` forte e envs bem protegidos em produção.
