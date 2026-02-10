# Deploy do site Araça no Coolify

Este guia leva você a publicar a aplicação **araca-site-novo** (Next.js + Payload CMS) no seu servidor usando o Coolify, usando o Supabase que já está rodando no mesmo VPS.

---

## Pré-requisitos

- **Coolify** já instalado e acessível no servidor (ex.: `http://76.13.236.240:8000`).
- **Supabase** rodando no mesmo VPS (ex.: porta 8001, Postgres na 6543).
- Código do projeto em um repositório Git que o Coolify consiga clonar (GitHub, GitLab ou seu próprio Git no servidor).

Se o projeto ainda estiver só na sua máquina, crie um repositório no GitHub/GitLab e faça o push:

```bash
git remote add origin https://github.com/SEU_USUARIO/araca-site-novo.git
git push -u origin master
```

---

## 1. Criar o recurso no Coolify

1. No Coolify, vá em **Projects** → escolha um projeto (ou crie um, ex.: "Araça").
2. Clique em **+ Add Resource** / **Create new resource**.
3. Escolha **Application** (não Docker Compose).

---

## 2. Fonte do código (Source)

- **Fonte:** **Public Repository** ou **Private Repository** (conforme onde estiver o código).
- **URL do repositório:**  
  `https://github.com/SEU_USUARIO/araca-site-novo`  
  (ou a URL do seu GitLab / outro Git).
- **Branch:** `master` (ou a branch que você usa).
- **Base Directory:** deixe em branco (raiz do repositório).

Avance (Next / Continue).

---

## 3. Build Pack e porta

- **Build Pack:**  
  - **Opção A (recomendada):** **Dockerfile** — use o Dockerfile que está na raiz do projeto.  
  - **Opção B:** **Nixpacks** — o Coolify detecta Node.js sozinho.
- **Ports Exposes:** **3000** (obrigatório para o Coolify encaminhar o tráfego).

Se usar **Dockerfile**:
- Certifique-se de que o arquivo **Dockerfile** está na raiz do repositório (já incluído neste projeto).
- O Coolify vai usar esse Dockerfile para build e subir o container.

Se usar **Nixpacks**:
- Não precisa de Dockerfile.
- **Build Command:** deixe o padrão ou use: `npm ci && npm run build`
- **Start Command:** `npm start`
- **Install Command:** pode deixar em branco (Nixpacks usa `npm install` por padrão).

---

## 4. Variáveis de ambiente (Environment Variables)

No Coolify, na tela da aplicação, abra **Environment Variables** / **Variáveis de ambiente** e adicione as variáveis abaixo. Use os valores reais do seu Supabase (servidor).

| Nome | Valor | Obrigatório |
|------|--------|-------------|
| `PAYLOAD_SECRET` | Uma string secreta com pelo menos 32 caracteres (ex.: gere com `openssl rand -base64 32`) | Sim |
| `DATABASE_URL` | `postgresql://postgres:[SENHA]@76.13.236.240:6543/postgres?sslmode=disable` — troque `[SENHA]` pela `POSTGRES_PASSWORD` do `.env` do Supabase no servidor | Sim |
| `NEXT_PUBLIC_SUPABASE_URL` | `http://76.13.236.240:8001` (ou `https://seu-dominio.com` se tiver proxy na 8001) | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Valor de `ANON_KEY` do `.env` do Supabase no servidor | Sim |
| `NODE_ENV` | `production` | Recomendado |

Opcionais (Storage S3 do Supabase para uploads no /admin):

| Nome | Valor |
|------|--------|
| `S3_ENDPOINT` | `http://76.13.236.240:8001/storage/v1/s3` |
| `S3_ACCESS_KEY_ID` | (do Supabase self-hosted, se tiver) |
| `S3_SECRET_ACCESS_KEY` | (do Supabase self-hosted, se tiver) |
| `S3_BUCKET` | `media` |
| `S3_REGION` | `auto` |

Se não preencher as variáveis S3, o Payload pode usar armazenamento local dentro do container (arquivos podem se perder ao recriar o container) ou você pode configurar Vercel Blob depois com `BLOB_READ_WRITE_TOKEN`.

Para pegar **POSTGRES_PASSWORD** e **ANON_KEY** no servidor (Supabase instalado direto com Docker):

```bash
# No servidor, via SSH
grep -E '^POSTGRES_PASSWORD=|^ANON_KEY=' /opt/supabase/docker/.env
```

(Se o Supabase estiver em outro caminho, ajuste o path. Ex.: onde estiver o `.env` do Supabase.)

---

## 5. Deploy

1. Salve as variáveis.
2. Clique em **Deploy** / **Start** / **Save & Deploy**.
3. O Coolify vai:
   - Clonar o repositório
   - Fazer o build (Dockerfile ou Nixpacks)
   - Subir o container na porta 3000

O primeiro build pode levar alguns minutos (install + `next build`).

---

## 6. Acessar a aplicação

- **Domínio:** o Coolify mostra a URL do recurso (ex.: `http://76.13.236.240:PORTA` ou um domínio que você configurou).
- Se não tiver domínio, use o **IP do servidor** e a **porta** que o Coolify expõe para esta aplicação (ex.: 3000 ou outra que o Coolify mapeou).
- **Site:** `http://SEU_IP_OU_DOMINIO:PORTA`
- **Admin Payload:** `http://SEU_IP_OU_DOMINIO:PORTA/admin`

No primeiro acesso ao `/admin`, crie o primeiro usuário admin (o Payload pede para criar se não existir nenhum).

---

## 7. Banco de dados (tabelas)

- Se o banco do Supabase ainda estiver vazio, o Payload (com `@payloadcms/db-postgres`) pode criar as tabelas no primeiro start (comportamento de “push” em desenvolvimento). Em produção é melhor ter migrações; veja `docs/SUPABASE_TABELAS_E_MIGRATE.md`.
- Se você já rodou o projeto em dev apontando para o mesmo `DATABASE_URL`, as tabelas já podem existir; nesse caso o deploy só usa o banco já existente.

---

## 8. Resumo rápido

| Passo | O quê |
|-------|--------|
| 1 | Repo no GitHub/GitLab (ou acessível pelo Coolify) |
| 2 | Coolify → New Resource → Application → apontar para o repo |
| 3 | Build Pack: **Dockerfile** (ou Nixpacks); Porta **3000** |
| 4 | Variáveis: `PAYLOAD_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 5 | Deploy → acessar pelo IP/porta ou domínio configurado |

Se algo falhar no build ou no start, confira os **logs** do deploy no Coolify (aba de logs do recurso) e as variáveis de ambiente (principalmente `DATABASE_URL` e as chaves do Supabase).

---

## 9. Testar o build com Docker na sua máquina (opcional)

Para validar o Dockerfile antes de subir no Coolify:

```bash
# Na raiz do projeto (onde está o Dockerfile)
docker build -t araca-site .
docker run -p 3000:3000 \
  -e PAYLOAD_SECRET=teste-min-32-chars \
  -e DATABASE_URL="postgresql://..." \
  -e NEXT_PUBLIC_SUPABASE_URL=http://76.13.236.240:8001 \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  araca-site
```

Depois acesse `http://localhost:3000`. Se o build ou o `node server.js` falhar (por exemplo por módulo não encontrado), use no Coolify o **Build Pack Nixpacks** em vez do Dockerfile: aí o Coolify faz `npm run build` e `npm start` sem usar o output standalone.
