# Araça — Blog profissional

Blog com **Next.js 15**, **Payload CMS 3**, TypeScript (strict), Tailwind CSS, Framer Motion e Lucide React. Otimizado para Vercel, com Design System Lab completo.

## Stack

- **Next.js 15** — App Router
- **Payload CMS 3** — Headless CMS (admin em `/admin`)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **Supabase (Postgres)** — banco de dados
- **Supabase Storage (S3-compatible)** — opcional, para uploads de imagens/vídeos no admin
- **Vercel Blob Storage** — fallback alternativo para uploads

## Estrutura

```
app/
  (frontend)/     — Layout com Header/Footer, Home, Blog, Sobre, Design System
  (payload)/      — Admin Payload e API REST
components/
  ui/             — Button, Card, Input, Badge
  layout/          — Header, Footer, Container, ScrollIndicator
  blog/            — PostCard, PostGrid, PostContent
  design-system/   — Lab (cores, tipografia, ícones, etc.)
payload/
  collections/    — Posts, Media, Users
  access/         — isAdmin
lib/
  utils.ts        — cn(), formatDate()
  design-tokens.ts
  blog-mock.ts    — Mock de posts para desenvolvimento
```

## Começar

1. **Instalar dependências**

   ```bash
   pnpm install
   # ou, em caso de conflito de peer deps (ex.: React 19):
   npm install --legacy-peer-deps
   ```

2. **Variáveis de ambiente**

   Copie `.env.example` para `.env` e preencha:

   - `PAYLOAD_SECRET` — string segura para sessões (gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `DATABASE_URL` — connection string do **Supabase**: Project Settings → Database → Connection string (URI). Use **Session mode** (porta 6543) para deploy na Vercel.

   Opcional para uploads na nuvem (ver `docs/SUPABASE_STORAGE.md`):

   - **Supabase Storage:** `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION`
   - **Vercel Blob** (fallback): `BLOB_READ_WRITE_TOKEN`

3. **Rodar em desenvolvimento**

   ```bash
   pnpm dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Blog: [http://localhost:3000/blog](http://localhost:3000/blog)
   - Design System Lab: [http://localhost:3000/design-system](http://localhost:3000/design-system)
   - Admin Payload: [http://localhost:3000/admin](http://localhost:3000/admin) (criar primeiro usuário)

4. **Build**

   ```bash
   pnpm build
   pnpm start
   ```

## Deploy (Vercel)

- Conecte o repositório no Vercel.
- **Banco:** use **Supabase**. Crie um projeto em [supabase.com](https://supabase.com), pegue a connection string (Session mode, porta 6543) e defina `DATABASE_URL` nas variáveis de ambiente do Vercel.
- Defina `PAYLOAD_SECRET` (obrigatório).
- Opcional: configure **Supabase Storage** (S3) ou **Vercel Blob** para uploads no admin. Ver `docs/SUPABASE_STORAGE.md`.

## Design System Lab

A rota `/design-system` reúne:

- **Cores** — paleta primary com copy to clipboard
- **Gradientes** — swatches copiáveis
- **Tipografia** — Inter, Playfair Display, Space Grotesk, JetBrains Mono
- **Type scale** — xs a 4xl
- **Botões** — variantes e tamanhos
- **Cards** — default, glass, glassmorphism
- **Liquid Glass** — efeito baseado na linguagem visual da Apple (WWDC 2025)
- **Ícones** — galeria Lucide com busca e filtros (80+ ícones), copy import
- **Menu** — exemplo de navegação
- **Scroll** — indicador animado
- **Bloco de código** — com botão copiar

Navegação lateral sticky para ir direto a cada seção.

### Liquid Glass Design System

Este projeto implementa o **Liquid Glass**, um meta-material digital desenvolvido pela Apple que usa efeitos de vidro translúcido, refração de luz e comportamento fluido para criar interfaces modernas.

**Documentação completa:**
- [Guia de Implementação](./.cursor/rules/liquid-glass.md) - Regras e diretrizes rápidas
- [Documentação Técnica](./docs/LIQUID_GLASS.md) - Especificações completas e exemplos

**Características principais:**
- **Lensing Effect** — luz dobrada e concentrada (não apenas espalhada)
- **Adaptivity** — adapta-se ao conteúdo e ambiente dinamicamente
- **Dynamics** — resposta fluida à interação com comportamento gel-like
- **Variantes** — Regular (versátil) e Clear (transparente)

**Implementado em:**
- Menu principal de navegação
- Componentes flutuantes
- Controles sobre mídia rica

## Licença

MIT
