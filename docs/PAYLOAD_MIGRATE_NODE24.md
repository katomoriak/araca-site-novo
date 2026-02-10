# Payload migrate com Node 24

## Forma mais simples: não use o migrate em dev

O adapter **@payloadcms/db-postgres** faz **push do schema em desenvolvimento**: ao rodar `npm run dev`, as tabelas (incluindo as novas `leads` e `transactions`) são criadas/atualizadas automaticamente. Você **não precisa** rodar `payload migrate` no dia a dia.

- **Local:** rode `npm run dev` com `DATABASE_URL` no `.env.local`; as tabelas são criadas na primeira conexão.
- **Produção (Vercel):** o `package.json` já tem `"engines": { "node": "20.x" }`. Use `npm run build` no deploy; se as tabelas ainda não existirem no banco de prod, rode uma vez `npm run dev` apontando `DATABASE_URL` para o banco de produção (ou use o script `npm run migrate` abaixo).

**Resumo:** para ter as tabelas de Leads e Transactions (e quaisquer outras novas collections), basta subir o app em dev com o banco conectado: `npm run dev`. Nenhum comando `payload migrate` é obrigatório em desenvolvimento.

---

## Quando você realmente precisa do CLI `payload migrate`

Só se quiser **gerar arquivos de migração** (histórico versionado de mudanças no schema) ou rodar migrações em produção de forma explícita.

## O problema (Node 24)

O Payload CLI (`payload migrate`) falha no **Node 24** com erros como:

- `ERR_REQUIRE_ASYNC_MODULE` — Lexical (editor rico) usa top-level await
- `Cannot find module` / interop ESM/CJS

## Por que não “adaptar” para Node 24?

O **Lexical** usa **top-level await**. O Payload exige um editor quando há campos richText. Por isso o CLI do migrate continua precisando de Node 20.

## Soluções (quando for usar o migrate)

### 1. Usar Node 20 para migrate

**Windows (nvm-windows) — se `nvm use 20` volta para o Node 24:**

- Use o script que **localiza o Node 20 do nvm e executa o migrate** (recomendado):
  ```cmd
  npm run migrate
  ```
  O script `scripts/migrate-with-node20.cjs` procura o Node 20 em `NVM_HOME` ou `%APPDATA%\nvm` e roda o migrate com esse executável, sem depender do `nvm use` no terminal.
- Se o script não achar Node 20, instale com `nvm install 20` e rode `npm run migrate` de novo.

**Linux/Mac (nvm) ou fnm:**

```bash
# Na pasta do projeto existe .nvmrc com "20" — pode usar só:
nvm use
# ou
nvm use 20
npx payload migrate
```

### 2. Forçar Node 20 na Vercel

No `package.json`:

```json
"engines": {
  "node": "20.x"
}
```

Assim o build na Vercel usará Node 20 e o `payload migrate` (se incluído no `ci`) deve funcionar.

### 3. Em dev: não precisa de migrate

Com `lockDocuments: false` nas collections, o erro de "Failed query" some. O **Drizzle Push** em desenvolvimento cria/atualiza as tabelas automaticamente ao rodar `npm run dev`. Migrate só é necessário para **produção** (antes do build).

### 4. Se o deploy já funciona

Se o site já está no ar e as tabelas foram criadas (por um Push em dev contra o banco de prod, ou por um migrate anterior), você pode **pular o migrate** no build: use `npm run build` em vez de `npm run ci` no `vercel.json`.

---

## Blob vs Supabase — esclarecimento

- **Supabase (PostgreSQL)** = banco de dados (posts, usuários, inscritos, metadados)
- **Vercel Blob** = armazenamento de arquivos (imagens, vídeos enviados)

São complementares. O Payload precisa de um banco (Postgres, SQLite, MongoDB). O Blob é opcional para uploads. Não dá para trocar Supabase por Blob — o Blob não substitui um banco.

---

## Resumo

| Situação                    | Ação                                          |
|----------------------------|-----------------------------------------------|
| Rodar migrate localmente   | Use Node 20 (`nvm use 20`)                    |
| Deploy na Vercel           | Adicione `"node": "20.x"` em `engines`       |
| App em dev                 | `lockDocuments: false` + Drizzle Push bastam |
| Tabelas já existem em prod | Pode usar só `npm run build` no deploy       |
