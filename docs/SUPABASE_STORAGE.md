# Supabase Storage — Bucket e Upload do Payload

O Payload CMS usa o **Supabase Storage** (API S3-compatível) para armazenar imagens e vídeos da collection `media`. Este guia descreve como criar o bucket e conectar o projeto.

## Pré-requisitos

- Projeto Supabase ativo
- Acesso ao Dashboard do Supabase

---

## 1. Criar o bucket no Supabase

### Opção A: Pelo Dashboard (recomendado)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto
2. No menu lateral, vá em **Storage**
3. Clique em **New bucket**
4. Preencha:
   - **Name:** `media` (ou o nome que definiu em `S3_BUCKET` no `.env`)
   - **Public bucket:** marque ✅ se quiser que os arquivos sejam acessíveis via URL pública (recomendado para imagens/vídeos do blog)
   - **File size limit:** opcional (ex.: 100 MB para vídeos)
   - **Allowed MIME types:** deixe vazio para aceitar imagens e vídeos, ou use `image/*,video/*`
5. Clique em **Create bucket**

### Opção B: Via SQL (Supabase SQL Editor)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  104857600,  -- 100 MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
);
```

---

## 2. Obter credenciais S3

O Supabase Storage expõe uma API S3-compatível. Para usá-la:

1. No Supabase Dashboard, vá em **Project Settings** (ícone de engrenagem)
2. No menu lateral, clique em **Storage**
3. Na seção **S3 Connection**, gere ou copie:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint** — formato: `https://[PROJECT-REF].storage.supabase.co/storage/v1/s3`
     - O `PROJECT-REF` está em **Project Settings → General → Reference ID**

> **Importante:** Essas credenciais dão acesso total ao Storage e ignoram RLS. Use apenas no servidor (Payload) e nunca exponha no client.

---

## 3. Configurar variáveis de ambiente

Adicione ao `.env` (ou `.env.local`):

```env
# Supabase Storage (S3-compatible)
S3_ENDPOINT=https://[SEU-PROJECT-REF].storage.supabase.co/storage/v1/s3
S3_ACCESS_KEY_ID=sua-access-key
S3_SECRET_ACCESS_KEY=sua-secret-key
S3_BUCKET=media
S3_REGION=auto
```

Substitua `[SEU-PROJECT-REF]` pelo Reference ID do seu projeto Supabase.

---

## 4. Políticas de acesso (RLS) — opcional

Se o bucket for **público** e você quiser controle fino:

- **Leitura pública:** não é necessário RLS para leitura em buckets públicos
- **Escrita:** o Payload usa as credenciais S3 (server-side), que contornam RLS

Se preferir bucket **privado** com URLs assinadas, o Payload já usa presigned URLs para vídeos `.mp4` automaticamente.

---

## 5. Testar o upload

1. Reinicie o servidor: `npm run dev`
2. Acesse `/admin` e faça login
3. Vá em **Media** → **Create New**
4. Envie uma imagem ou vídeo
5. No Supabase Dashboard → Storage → bucket `media`, confira se o arquivo apareceu

---

## Desenvolvimento local com Supabase CLI

Se estiver usando Supabase localmente:

```env
S3_ENDPOINT=http://127.0.0.1:54321/storage/v1/s3
S3_ACCESS_KEY_ID=625729a08b95bf1b7ff351a663f3a23c
S3_SECRET_ACCESS_KEY=850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
S3_BUCKET=media
S3_REGION=local
```

---

## Prioridade de storage

1. **Supabase S3** — se `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` e `S3_ENDPOINT` estiverem definidos
2. **Vercel Blob** — se `BLOB_READ_WRITE_TOKEN` estiver definido (e S3 não)
3. **Local** — fallback para pasta local quando nenhum storage em nuvem estiver configurado
