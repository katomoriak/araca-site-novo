# Auditoria SEO do Blog — Aracá Interiores

**Data:** 12/02/2025  
**Objetivo:** Verificar se as postagens e a estrutura do blog estão preparadas para performar bem em busca e servir como referência de conteúdo.

---

## 1. Resumo executivo

| Área              | Status   | Observação |
|-------------------|----------|------------|
| Metadados por post| ✅ Bom   | Title, description, OG, Twitter; falta canonical e dateModified correto |
| Schema (JSON-LD)  | ✅ Bom   | BlogPosting + BreadcrumbList presentes |
| Página listagem   | ⚠️ Parcial | Falta OG/Twitter e imagem; descrição genérica |
| Sitemap           | ⚠️ Parcial | Posts incluídos; categorias e autores não |
| Robots            | ✅ OK    | Allow /, disallow admin/dashboard, sitemap referenciado |
| Estrutura de conteúdo | ✅ | H1 por página; headings no conteúdo (H2/H3) |
| Imagens           | ⚠️ Parcial | Capa com alt; imagens no conteúdo dependem do editor |
| Categorias/Autor  | ✅ Bom   | Metadata e breadcrumbs; sem JSON-LD específico |

---

## 2. O que já está correto

### 2.1 Post individual (`/blog/[slug]`)

- **Title e description:** `generateMetadata` usa `post.title` e `post.excerpt` (meta description).
- **Open Graph:** `type: 'article'`, `url`, `title`, `description`, `images` (capa 1200x630, alt).
- **Twitter Card:** `summary_large_image`, title, description, image.
- **Schema.org:** `BlogPosting` com headline, description, url, datePublished, dateModified, author (Person com url quando há id), publisher (Organization + logo), image.
- **BreadcrumbList:** Blog → Nome do post.
- **Estrutura:** H1 único (título), categoria, autor, data; capa com `ProgressiveImage` e `alt`.
- **URLs:** Slugs amigáveis; `revalidate = 60` (ISR).

### 2.2 Listagem do blog (`/blog`)

- Metadata básica: title "Blog", description com palavras-chave (design, projetos, dicas).
- Hero com último post; grid com `PostGrid` e links para post e autor.

### 2.3 Categoria (`/blog/categoria/[slug]`)

- `generateMetadata`: title "Categoria | Blog", description por categoria.
- Breadcrumbs visuais: Home > Blog > Categoria.
- `generateStaticParams` para design, dev, tutorial, news.

### 2.4 Autor (`/blog/autor/[id]`)

- Metadata: title "Autor | Blog", description com bio ou fallback.
- Avatar com alt; lista de posts do autor.

### 2.5 Site global

- `app/layout.tsx`: metadataBase, title template, description, keywords, OG, Twitter, robots, manifest, canonical na raiz, JSON-LD Organization e WebSite.
- `robots.ts`: allow /, disallow /admin/, /api/, /dashboard/, /login/, /design-system; sitemap.
- `sitemap.ts`: home, sobre, projetos, contato, blog; posts do Payload com lastModified e priority.

### 2.6 Conteúdo e imagens

- `PostContent`: suporta Lexical e HTML; DOMPurify; `transformImageUrls` (proxy Supabase) e `transformLinks` (target/rel em links externos).
- Tags permitidas incluem h1–h6, img com alt; imagens do conteúdo podem ter alt se preenchido no editor.

---

## 3. Lacunas e melhorias recomendadas

### 3.1 Quick wins (implementados ou sugeridos)

| Item | Situação | Ação |
|------|----------|------|
| **Canonical no post** | Não havia | Adicionar `alternates.canonical` em `generateMetadata` do post. |
| **dateModified** | Usava só `publishedAt` | Usar `updatedAt` quando disponível (Payload retorna); melhora freshness no Google. |
| **Meta description tamanho** | Excerpt livre | Orientar no CMS: 150–160 caracteres para snippet ideal. |
| **Blog listagem OG/Twitter** | Só title/description | Adicionar openGraph e twitter (imagem padrão do site ou do último post). |
| **Sitemap sem posts** | Se DB falha, blogUrls = [] | Fallback com slugs do MOCK_POSTS em build sem DB. |
| **Sitemap categorias** | Não incluídas | Incluir `/blog/categoria/design`, etc., para indexação. |

### 3.2 Melhorias de médio prazo

- **Campo meta description no CMS:** Opcional por post (override do excerpt) para snippet específico em busca.
- **Páginas de autor no sitemap:** Incluir URLs de autores que têm posts (evitar páginas vazias).
- **BreadcrumbList em categoria e autor:** JSON-LD BreadcrumbList em `/blog/categoria/[slug]` e `/blog/autor/[id]`.
- **Article:published_time / modified_time:** Next.js já gera meta a partir do metadata; garantir que dateModified esteja correto no JSON-LD (já coberto com updatedAt).
- **Imagens no conteúdo:** Garantir que o editor Lexical/dashboard incentive alt em toda imagem; validação opcional no backend.

### 3.3 Blog de referência (longo prazo)

- **Tempo de leitura:** Calcular (ex.: ~200 palavras/min) e exibir no post; pode ir no JSON-LD (optional).
- **Índice (TOC):** Para posts longos, extrair H2/H3 do conteúdo e exibir links âncora no topo.
- **Compartilhamento:** Botões “Compartilhar” (Twitter, LinkedIn, WhatsApp) com URL e title.
- **Posts relacionados:** Por categoria ou tags, no final do post; melhora links internos e tempo na página.
- **RSS/Atom:** Feed do blog para assinantes e syndication.
- **Core Web Vitals:** Já há imagens progressivas e proxy; manter lazy load e tamanhos responsivos (sizes).
- **Internacionalização (i18n):** Se no roadmap, considerar hreflang para eventual versão em outro idioma.

---

## 4. Checklist por post (para autores/editores)

- [ ] Título claro e com palavra-chave principal.
- [ ] Resumo (excerpt) entre 150–160 caracteres para meta description.
- [ ] Imagem de capa com alt descritivo (não apenas “imagem do post”).
- [ ] Conteúdo com pelo menos um H2; H3 quando fizer sentido (hierarquia clara).
- [ ] Imagens no corpo com alt preenchido.
- [ ] Slug curto e legível (ex.: `dicas-para-sala-de-estar`).
- [ ] Categoria e autor preenchidos.

---

## 5. Arquivos relevantes

- `app/(frontend)/blog/[slug]/page.tsx` — metadata e JSON-LD do post.
- `app/(frontend)/blog/page.tsx` — metadata da listagem.
- `app/(frontend)/blog/categoria/[slug]/page.tsx` — metadata e breadcrumb categoria.
- `app/(frontend)/blog/autor/[id]/page.tsx` — metadata autor.
- `app/sitemap.ts` — URLs estáticas e dinâmicas.
- `app/robots.ts` — regras de crawl.
- `app/layout.tsx` — metadata e JSON-LD globais.
- `lib/payload.ts` — dados dos posts (incl. updatedAt).
- `components/blog/PostContent.tsx` — renderização e sanitização do conteúdo.
- `payload/collections/Posts.ts` — campos do post (excerpt, coverImage, etc.).

---

## 6. Conclusão

O blog já tem base sólida para SEO: metadados por post, Open Graph, Twitter Card, schema BlogPosting e BreadcrumbList, sitemap com posts e robots configurado. As melhorias aplicadas (canonical, dateModified, OG na listagem, sitemap com categorias e fallback) elevam a consistência e a qualidade para um blog de ponta. Com os itens de médio e longo prazo (TOC, tempo de leitura, relacionados, RSS), o site se aproxima de uma referência de conteúdo e melhora ainda mais a performance em busca.
