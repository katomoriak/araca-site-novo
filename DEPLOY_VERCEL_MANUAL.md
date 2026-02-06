# Deploy Manual no Vercel - Guia Rápido

## 🎯 Passos para Deploy via Dashboard do Vercel

### 1. Acessar o Vercel
1. Acesse: https://vercel.com/login
2. Faça login com sua conta (GitHub, GitLab, Bitbucket ou Email)

### 2. Importar Projeto do GitHub
1. No Dashboard, clique em **"Add New..."** → **"Project"**
2. Se for a primeira vez, autorize o Vercel a acessar sua conta do GitHub
3. Procure pelo repositório: **`katomoriak/araca-site-novo`**
4. Clique em **"Import"**

### 3. Configurar o Projeto

#### Build Settings
O Vercel vai detectar automaticamente o Next.js, mas verifique:
- **Framework Preset:** Next.js
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Output Directory:** `.next` (padrão)
- **Install Command:** `npm install --legacy-peer-deps`

#### Environment Variables (IMPORTANTE)
Antes de fazer deploy, adicione:

**PAYLOAD_SECRET** (obrigatório)
```
c850e358cdcecc632853a035554281918e413d77582bdd221d66c5449ab725a9
```

Clique em "Add" para cada variável.

### 4. Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 2-5 minutos)
3. Quando terminar, você receberá a URL do site!

### 5. Configurar Banco de Dados (Após primeiro deploy)

#### Adicionar Vercel Postgres
1. No Dashboard do projeto, vá em **"Storage"** ou **"Stores"**
2. Clique em **"Create Database"**
3. Escolha **"Postgres"**
4. Clique em **"Continue"**
5. A variável `DATABASE_URL` será adicionada automaticamente
6. Clique em **"Redeploy"** para usar o banco

#### Adicionar Vercel Blob (Opcional - para uploads)
1. Na mesma página de Storage
2. Clique em **"Create"** → **"Blob Storage"**
3. A variável `BLOB_READ_WRITE_TOKEN` será adicionada automaticamente

## 📋 Checklist Rápido

- [ ] Login no Vercel
- [ ] Importar repositório `katomoriak/araca-site-novo`
- [ ] Adicionar `PAYLOAD_SECRET` nas variáveis de ambiente
- [ ] Configurar Build Command: `npm install --legacy-peer-deps && npm run build`
- [ ] Fazer primeiro deploy
- [ ] Adicionar Vercel Postgres
- [ ] Redeploy após adicionar banco
- [ ] (Opcional) Adicionar Vercel Blob Storage

## 🔑 Variáveis de Ambiente

### PAYLOAD_SECRET
```
c850e358cdcecc632853a035554281918e413d77582bdd221d66c5449ab725a9
```

### DATABASE_URL
Será criada automaticamente quando você adicionar o Vercel Postgres.

### BLOB_READ_WRITE_TOKEN
Será criada automaticamente quando você adicionar o Vercel Blob Storage.

## 🚀 Após Deploy Bem-Sucedido

1. Acesse o painel admin: `https://seu-site.vercel.app/admin`
2. Crie seu primeiro usuário admin
3. Comece a criar posts!

## 📝 Links Úteis

- **GitHub:** https://github.com/katomoriak/araca-site-novo
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação Payload CMS:** https://payloadcms.com/docs

## ⚠️ Importante

O arquivo de vídeo grande (`FJO__VIDEOFACHADA_01_R00.mp4`) foi removido do repositório porque excede 100MB. Você deve fazer upload dele para:
- Vercel Blob Storage (após configurar)
- YouTube/Vimeo com embed
- Outro serviço de CDN

## 🆘 Se der Erro no Build

**Erro comum:** `npm install` falha
**Solução:** Certifique-se de que o Build Command está usando `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps && npm run build
```

**Erro comum:** Missing environment variables
**Solução:** Adicione todas as variáveis necessárias (principalmente `PAYLOAD_SECRET`)
