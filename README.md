# Araça — Blog profissional

Blog com **Next.js 15**, **Payload CMS 3**, TypeScript (strict), Tailwind CSS, Framer Motion e Lucide React. Otimizado para Vercel, com Design System Lab completo.

## Stack

- **Next.js 15** — App Router
- **Payload CMS 3** — Headless CMS (admin em `/admin`)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **Vercel Postgres** — configurar depois
- **Vercel Blob Storage** — configurar depois

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

   - `PAYLOAD_SECRET` — string segura para sessões
   - `DATABASE_URL` — connection string do Postgres (ex.: Vercel Postgres)

   Opcional para uploads na nuvem:

   - `BLOB_READ_WRITE_TOKEN` — token do Vercel Blob

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

## Vercel

- Conecte o repositório no Vercel.
- Adicione **Vercel Postgres** e **Vercel Blob** (opcional) no projeto.
- Defina `PAYLOAD_SECRET` e use as variáveis de `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN` geradas pelo Vercel.

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
