# Análise de dependências — fev/2025

Resumo da análise do subagente de dependências: vulnerabilidades, pacotes desatualizados e ações recomendadas.

**Plano de atualização (com revisão de segurança):** [docs/PLANO_ATUALIZACAO_DEPENDENCIAS_REVISADO.md](PLANO_ATUALIZACAO_DEPENDENCIAS_REVISADO.md) — inclui baseline de segurança, ordem de execução, mitigações opcionais (overrides para esbuild/undici) e checklist pós-atualização.

## 1. Vulnerabilidades (`npm audit`)

**Total: 8 moderadas** — todas em dependências transitivas; **nenhum fix disponível** via `npm audit fix`.

### 1.1 esbuild (moderada)

- **Cadeia:** `@payloadcms/db-postgres` → `drizzle-kit` → `@esbuild-kit/esm-loader` → `@esbuild-kit/core-utils` → **esbuild** ≤0.24.2  
- **Advisory:** [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) — esbuild permite que qualquer site envie requisições ao servidor de desenvolvimento e leia a resposta.  
- **Impacto:** Principalmente em ambiente de **desenvolvimento** (dev server).  
- **Ação:** Acompanhar atualizações do Payload/drizzle-kit. Não há pacote alternativo recomendado no contexto atual.

### 1.2 undici (moderada)

- **Cadeia:** `@payloadcms/storage-vercel-blob` → `@vercel/blob` → **undici** &lt;6.23.0  
- **Advisory:** [GHSA-g9mf-h72j-4rw9](https://github.com/advisories/GHSA-g9mf-h72j-4rw9) — descompressão sem limite em respostas HTTP (Content-Encoding) pode levar a esgotamento de recursos.  
- **Contexto:** O projeto já documenta uso de undici/Node em [docs/ERRO_PAYLOAD_UNDICI.md](ERRO_PAYLOAD_UNDICI.md) e [docs/PAYLOAD_MIGRATE_NODE24.md](PAYLOAD_MIGRATE_NODE24.md).  
- **Ação:** Acompanhar atualizações de `@payloadcms/storage-vercel-blob` e `@vercel/blob`. Em produção, risco mitigado pelo ambiente controlado (Vercel/serverless).

---

## 2. Pacotes desatualizados (`npm outdated`)

### Atualizações aplicadas (fev/2025 — plano gradual)

| Pacote | Versão aplicada | Nota |
|--------|------------------|------|
| **payload** + **@payloadcms/\*** | ^3.76.0 | Fase 1; ajuste de tipo em `lib/payload.ts` (Where) |
| **@types/react** | ^19.2.14 | Fase 1 |
| **sharp** | ^0.34.0 | Fase 2 |
| **lucide-react** | ^0.563.0 | Fase 2 |
| **tailwind-merge** | ^3.4.0 | Fase 3 |
| **date-fns** | ^4.1.0 | Fase 3 |
| **framer-motion** | ^12.0.0 | Fase 3 |

### Revertidos (breaking / falha de build)

| Pacote | Mantido em | Motivo |
|--------|------------|--------|
| **recharts** | ^2.15.4 | v3 altera API do Tooltip (ex.: `payload` em `components/ui/chart.tsx`). |
| **swiper** | ^11.1.14 | v12 alterou dependências (ex.: Zod); build falhou em `lib/validation-schemas.ts`. |
| **tailwindcss** | ^3.4.0 | v4 exige `@tailwindcss/postcss` e setup CSS-first; não aplicado. |

### Ajustes de código realizados

- **lib/payload.ts:** `where` em `payload.find()` tipado como `import('payload').Where \| undefined` (compatível Payload 3.76).
- **lib/validation-schemas.ts:** compatibilidade com **Zod 4** (`message` em vez de `errorMap`/`invalid_type_error`; `result.error.issues` em vez de `result.error.errors`).

### Manter versão (alinhado ao projeto)

- **@types/node**: Manter `^20` (projeto usa Node 20; `.nvmrc`, `engines`).

---

## 3. Comandos sugeridos

### Instalação (sempre com legacy-peer-deps)

```bash
npm install --legacy-peer-deps
```

### Atualizar só Payload + tipos (baixo risco)

```bash
npm install payload@^3.76.0 @payloadcms/db-postgres@^3.76.0 @payloadcms/email-nodemailer@^3.76.0 @payloadcms/next@^3.76.0 @payloadcms/richtext-lexical@^3.76.0 @payloadcms/storage-s3@^3.76.0 @payloadcms/storage-vercel-blob@^3.76.0 @types/react@^19.2.14 --legacy-peer-deps
```

Ou ajustar manualmente as versões no `package.json` para `^3.76.0` e `@types/react` para `^19.2.14`, depois:

```bash
npm install --legacy-peer-deps
```

### Verificar vulnerabilidades e desatualizados

```bash
npm audit
npm outdated
```

**Nota:** `npm audit fix` não resolve as vulnerabilidades atuais (são transitivas e sem fix disponível).

---

## 4. Riscos e observações

- **Breaking changes:** Atualizações **major** de date-fns, framer-motion, recharts, swiper, tailwind-merge e tailwindcss podem exigir mudanças de código e testes. Recomendado revisar changelog e guias de migração antes.
- **Regressão:** Após qualquer atualização, rodar `npm run build` e testes manuais (admin Payload, blog, dashboard).
- **Node:** Manter Node 20 (ver [PAYLOAD_MIGRATE_NODE24.md](PAYLOAD_MIGRATE_NODE24.md)); não subir para Node 24 para o migrate sem revisar compatibilidade Payload/Lexical.
- **Supabase:** O projeto usa `@supabase/supabase-js`; em atualizações futuras, checar changelog do Supabase antes de major.
