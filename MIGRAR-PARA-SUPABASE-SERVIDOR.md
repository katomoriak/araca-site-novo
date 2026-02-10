# Migrar o projeto para o Supabase do seu servidor

Este guia explica como apontar o **araca-site-novo** para o Supabase que está rodando no seu VPS (**http://76.13.236.240:8001**).

---

## 1. Pegar as chaves no servidor

No seu VPS, as variáveis estão em `/opt/supabase/docker/.env`. Você precisa delas no seu `.env.local`:

- **POSTGRES_PASSWORD** — senha do Postgres (para `DATABASE_URL`)
- **ANON_KEY** — chave pública (para `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

No servidor (SSH):

```bash
grep -E '^POSTGRES_PASSWORD=|^ANON_KEY=' /opt/supabase/docker/.env
```

Copie os valores (sem colar em lugar público). Se preferir, abra o arquivo com `nano /opt/supabase/docker/.env` e anote só essas duas linhas.

---

## 2. Criar o `.env.local` no projeto

Na raiz do projeto **araca-site-novo**, crie (ou edite) o arquivo **`.env.local`** com o seguinte. Substitua `[SUA_POSTGRES_PASSWORD]` e `[SUA_ANON_KEY]` pelos valores reais do servidor:

```env
# ========== Payload ==========
PAYLOAD_SECRET=um-texto-secreto-forte-com-pelo-menos-32-caracteres

# ========== Banco — Supabase self-hosted (seu VPS) ==========
# Troque [SUA_POSTGRES_PASSWORD] pela POSTGRES_PASSWORD do .env do servidor
DATABASE_URL=postgresql://postgres:[SUA_POSTGRES_PASSWORD]@76.13.236.240:6543/postgres?sslmode=disable

# ========== Supabase — URL e chave pública (frontend + vídeo da home) ==========
# Troque [SUA_ANON_KEY] pela ANON_KEY do .env do servidor
NEXT_PUBLIC_SUPABASE_URL=http://76.13.236.240:8001
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
```

- **6543** é a porta do pooler do Supabase no seu servidor; o Payload usa ela para conectar ao Postgres.
- **76.13.236.240** é o IP do seu VPS; se no futuro você usar domínio, troque para `https://seu-dominio.com` (e ajuste a porta se necessário).

---

## 3. Storage (vídeo e uploads no /admin)

O vídeo da home usa a URL pública do Storage. Duas opções:

### Opção A: Criar o bucket no seu Supabase e subir o vídeo

1. Acesse **http://76.13.236.240:8001** e faça login no Studio.
2. Vá em **Storage** → **New bucket** → nome: **media** → marque **Public** → Create.
3. Abra o bucket **media** → **Upload file** e envie o vídeo `FJO__VIDEOFACHADA_01_R00.mp4` (ou o que você usa na home).
4. Se o nome do arquivo for outro, ajuste no código da página ou use o mesmo nome.

Com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` já configurados, o frontend passa a usar o Storage do seu servidor.

### Opção B: Usar só o banco por enquanto (Payload sem S3)

Se não configurar Storage (S3) no `.env.local`, o Payload pode usar **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) ou armazenamento local. O vídeo da home continuará usando a URL que estiver em `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/media/...` — por isso, se quiser o vídeo no seu servidor, use a Opção A.

### Storage S3 no self-hosted (opcional)

Se o seu Supabase self-hosted tiver API S3 configurada, você pode preencher no `.env.local`:

```env
S3_ENDPOINT=http://76.13.236.240:8001/storage/v1/s3
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=media
S3_REGION=auto
```

As chaves S3 (se existirem) costumam vir do Studio ou da documentação do Supabase self-hosted. Se não tiver, deixe em branco e use Blob ou local.

---

## 4. Rodar o projeto

```bash
npm install
npm run dev
```

- O Payload vai conectar ao Postgres do seu servidor (porta 6543).
- Na primeira execução, o adapter pode criar/atualizar as tabelas (Push em dev).
- A home usará o vídeo do Storage em `NEXT_PUBLIC_SUPABASE_URL`; se o bucket **media** ainda estiver vazio, suba o vídeo pelo Studio (Opção A acima).

Acesse:

- **Site:** http://localhost:3000  
- **Admin Payload:** http://localhost:3000/admin  

---

## 5. Resumo do que foi alterado no projeto

- **`.env.example`** — Exemplo com Supabase self-hosted (IP, porta 6543, `sslmode=disable`, `NEXT_PUBLIC_SUPABASE_URL`).
- **`app/(frontend)/page.tsx`** — Vídeo da home usa `process.env.NEXT_PUBLIC_SUPABASE_URL`; se não existir, cai no Supabase Cloud antigo.
- **`MIGRAR-PARA-SUPABASE-SERVIDOR.md`** — Este guia.

Nada foi removido: você só passa a usar o Supabase do servidor quando preencher `.env.local` com a URL e as chaves acima.

---

## 6. Deploy (ex.: Vercel)

No painel da Vercel (ou outro host), defina as mesmas variáveis:

- `PAYLOAD_SECRET`
- `DATABASE_URL` (postgresql://postgres:...@76.13.236.240:6543/postgres?sslmode=disable)
- `NEXT_PUBLIC_SUPABASE_URL` (http://76.13.236.240:8001)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Assim o build e o site em produção também usam o Supabase do seu servidor.
