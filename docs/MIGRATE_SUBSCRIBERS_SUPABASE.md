# Tabela `subscribers` no Supabase (sem rodar `payload migrate`)

Quando o `payload migrate` falha no Node 24 (erro `ERR_REQUIRE_ASYNC_MODULE`), você pode criar a tabela de newsletter **direto no Supabase**, sem regredir o Node.

## Opção 1: Deixar o app criar (Drizzle Push em dev)

Em **desenvolvimento**, o Payload usa **Drizzle Push**: ao conectar no banco, ele cria/atualiza as tabelas.

1. Com `DATABASE_URL` no `.env.local` apontando para o **Supabase**:
2. Rode **`npm run dev`** (o erro que você viu é do CLI `payload migrate`, não do Next).
3. Abra o site (ex.: `http://localhost:3000`) ou o Admin (`/admin`) para o app conectar no banco.
4. Se o Push rodar, a tabela `subscribers` será criada automaticamente.

Se o dev subir e você acessar uma página que usa o Payload, vale conferir no **Supabase → Table Editor** se a tabela `subscribers` apareceu.

---

## Opção 2: Criar a tabela pelo Supabase (SQL)

Se preferir (ou se o Push não rodar), crie a tabela manualmente no **Supabase → SQL Editor** com o script abaixo.

### Script SQL (cole e execute no SQL Editor do Supabase)

```sql
-- Tabela de inscritos na newsletter (collection Payload "subscribers")
-- Compatível com o schema que o Payload 3 / Drizzle espera (id serial, timestamps).

CREATE TABLE IF NOT EXISTS "subscribers" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar NOT NULL,
  "status" varchar NOT NULL DEFAULT 'subscribed',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Índice único no e-mail (evita inscrição duplicada)
CREATE UNIQUE INDEX IF NOT EXISTS "subscribers_email_unique"
  ON "subscribers" ("email");

-- Comentário opcional
COMMENT ON TABLE "subscribers" IS 'Inscritos na newsletter (Payload collection subscribers)';
```

Depois de rodar:

- Os e-mails do formulário do footer passam a ser salvos nessa tabela.
- No **Admin do Payload** (`/admin`), a collection **Inscritos** lista os registros (desde que você esteja logado como admin).

---

## Resumo

| Método | Quando usar |
|--------|-------------|
| **Opção 1** – `npm run dev` + acessar site/admin | Se o dev sobe sem erro; o Push pode criar a tabela sozinho. |
| **Opção 2** – SQL no Supabase | Se quiser não depender do Push ou se o dev também falhar no Node 24. |

Nenhuma das opções exige regredir o Node.
