# Instruções de Deploy - Araça Site

## ✅ Git e GitHub - COMPLETO
- Repositório criado: https://github.com/katomoriak/araca-site-novo
- Commits enviados com sucesso

## 🚀 Vercel - Configuração Necessária

### Status Atual
- Projeto criado no Vercel: `denialofkatos-projects/araca-site-novo`
- Aguardando configuração de variáveis de ambiente

### Variáveis de Ambiente Necessárias

#### 1. PAYLOAD_SECRET (obrigatório)
```
c850e358cdcecc632853a035554281918e413d77582bdd221d66c5449ab725a9
```

**Como adicionar:**
1. Acesse: https://vercel.com/denialofkatos-projects/araca-site-novo/settings/environment-variables
2. Clique em "Add New"
3. Name: `PAYLOAD_SECRET`
4. Value: copie o código acima
5. Selecione todos os ambientes (Production, Preview, Development)
6. Salve

#### 2. DATABASE_URL (obrigatório)
**Como adicionar Vercel Postgres:**
1. Acesse: https://vercel.com/denialofkatos-projects/araca-site-novo/stores
2. Clique em "Create Database" ou "Create"
3. Escolha "Postgres"
4. Clique em "Continue"
5. A variável `DATABASE_URL` será criada automaticamente

#### 3. BLOB_READ_WRITE_TOKEN (opcional - para uploads)
**Como adicionar Vercel Blob Storage:**
1. Na mesma página de Stores
2. Crie um "Blob Storage"
3. A variável será criada automaticamente

### Após Configurar
O Vercel fará o redeploy automaticamente quando você salvar as variáveis de ambiente.

### Links Úteis
- **Dashboard:** https://vercel.com/denialofkatos-projects/araca-site-novo
- **Settings:** https://vercel.com/denialofkatos-projects/araca-site-novo/settings
- **Logs:** https://vercel.com/denialofkatos-projects/araca-site-novo/deployments

### Comandos para Redeploy Manual (se necessário)
```bash
vercel --prod
```

## 📝 Notas Importantes

### Vídeo Grande Removido
O arquivo `FJO__VIDEOFACHADA_01_R00.mp4` (110MB) foi removido porque excede:
- Limite do GitHub: 100MB
- Limite do Vercel: 100MB

**Recomendação:** Faça upload do vídeo para:
- Vercel Blob Storage (após configurar)
- YouTube/Vimeo
- Outro CDN

### Arquivos de Configuração Criados
- `.gitignore` - ignora node_modules, .env, etc.
- `.vercelignore` - ignora arquivos grandes no deploy
- `vercel.json` - configuração de build com `--legacy-peer-deps`
- `.env.example` - template de variáveis de ambiente

## 🎯 Próxima Ação
1. Configure as variáveis de ambiente no Vercel
2. Aguarde o build automático
3. Acesse seu site no ar!
