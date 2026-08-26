# 🚀 Panorama Completo de SEO — Aracá Interiores

Este documento reúne **todas as configurações, metadados, arquivos técnicos e estratégias de SEO** implementadas no site da **Aracá Interiores**, incluindo o diagnóstico de indexação e soluções para o Google Search Console.

---

## 📑 Sumário

1. [Diagnóstico Crítico: Por que o Google indexava apenas 3 páginas?](#1-diagnóstico-crítico-por-que-o-google-indexava-apenas-3-páginas)
2. [Solução para o Subdomínio `img.araca.arq.br`](#2-solução-para-o-subdomínio-imgaracaarqbr)
3. [Configuração Global e Domínio Primário (`app/layout.tsx`)](#3-configuração-global-e-domínio-primário)
4. [Robots.txt (`app/robots.ts`)](#4-robotstxt)
5. [Sitemap XML Dinâmico (`app/sitemap.ts`)](#5-sitemap-xml-dinâmico)
6. [Tabela Completa de Páginas, Títulos e Meta Descriptions](#6-tabela-completa-de-páginas-títulos-e-meta-descriptions)
7. [Dados Estruturados (Schema.org / JSON-LD)](#7-dados-estruturados-schemaorg--json-ld)
8. [Estratégia de SEO Local (Local Landing Pages)](#8-estratégia-de-seo-local)
9. [Checklist de Ação no Google Search Console & Vercel](#9-checklist-de-ação-no-google-search-console--vercel)

---

## 1. Diagnóstico Crítico: Por que o Google indexava apenas 3 páginas?

### O Problema: Conflito de Redirecionamento Vercel vs Tag Canônica (Loop de Contradição)
1. **Configuração na Vercel:** O domínio `araca.arq.br` (sem www) possui redirecionamento 301 permanente para `www.araca.arq.br`.
2. **Configuração anterior no código:** As tags canônicas (`<link rel="canonical">`) e o `sitemap.xml` estavam apontando para `https://araca.arq.br` (sem www).
3. **O que acontecia com o Googlebot:**
   * O Google entrava em `https://www.araca.arq.br/sobre`.
   * Lia a tag canônica: *"Atenção Google, a página canônica oficial é `https://araca.arq.br/sobre`"*.
   * O Google tentava acessar `https://araca.arq.br/sobre`.
   * A Vercel respondia com **301 Moved Permanently** de volta para `https://www.araca.arq.br/sobre`.
   * **Resultado:** O Google identificava um conflito / ciclo de canonicidade e classificava as páginas como *"Página alternativa com tag canônica adequada (não indexada)"* ou *"Página com redirecionamento"*, descartando a indexação da maioria das páginas internas!

### A Correção Aplicada:
* Alinhamos **100% das tags canônicas, OpenGraph, sitemap.xml e robots.txt** para o domínio canônico oficial: **`https://www.araca.arq.br`**.
* Adicionamos a landing page de alta conversão `/arquiteto-em-santo-andre` diretamente ao `sitemap.xml`.

---

## 2. Solução para o Subdomínio `img.araca.arq.br`

O subdomínio `img.araca.arq.br` é conectado ao storage/CDN (Cloudflare R2) exclusivo para servir arquivos de imagem (`.webp`, `.png`, `.jpg`). 

### Por que o Google tenta ler e dá erro?
O Googlebot varre a web em busca de páginas HTML. Ao encontrar imagens do site hospedadas em `img.araca.arq.br`, o crawler do Google tenta acessar a raiz `https://img.araca.arq.br/` ou ler `https://img.araca.arq.br/robots.txt`. Como o bucket R2 não é um site web HTML, ele retorna erro XML (`AccessDenied`), 403 ou 404. O Search Console então alerta como erro de rastreamento de página.

### Como bloquear o rastreamento de páginas no subdomínio de imagens:

#### Opção 1: Upload de `robots.txt` no Bucket R2 (Recomendado e Imediato)
Suba um arquivo simples chamado `robots.txt` na **raiz do bucket R2** (`https://img.araca.arq.br/robots.txt`) com o seguinte conteúdo:

```txt
User-agent: *
Allow: /*.webp$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.svg$
Disallow: /
```
> **O que isso faz:** Permite que o Google Imagens encontre e indexe suas fotos nos resultados de imagem, mas proíbe terminantemente o Googlebot de tentar rastrear o subdomínio como se fosse um site de páginas HTML.

#### Opção 2: Regra de Cabeçalho / Redirect na Cloudflare
Se o domínio estiver na Cloudflare:
1. Em **Rules > Transform Rules > Modify Response Header**, crie uma regra para `Hostname equals img.araca.arq.br`:
   * Adicionar header: `X-Robots-Tag` com valor `noindex, nofollow, noarchive` (apenas para requisições que não forem extensões de imagem).
2. Em **Rules > Redirect Rules**, se `Hostname equals img.araca.arq.br` e `URI Path equals /`:
   * Redirecionar (301) para `https://www.araca.arq.br/`.

---

## 3. Configuração Global e Domínio Primário

Arquivo: [`app/layout.tsx`](file:///c:/Users/Marco/Desktop/projetos/araca-site-novo/app/layout.tsx)

* **Domínio Base (`metadataBase`):** `https://www.araca.arq.br`
* **Título Padrão:** `Aracá Interiores | Escritório de Arquitetura e Design de Interiores em Santo André e SP`
* **Template de Título:** `%s | Aracá Interiores`
* **Meta Description Geral:**  
  > *"A Aracá Interiores é um escritório de arquitetura e design de interiores em Santo André e SP focado em arquitetura de interiores com modelo flexível."*
* **Palavras-chave Globais (`keywords`):**
  * `aracá interiores`
  * `escritório aracá interiores santo andré`
  * `arquitetos em santo andré`
  * `arquitetura de interiores são paulo sp`
  * `arquitetura e design de interiores`
  * `design de interiores santo andré`
  * `projeto de interiores sp`
* **OpenGraph / Redes Sociais:** Tipo `website`, `pt_BR`, imagem `/hero-interiores.jpg` (1200x630).
* **Robots Globais:** `index: true`, `follow: true`, `googleBot: { index: true, follow: true }`.

---

## 4. Robots.txt

Arquivo: [`app/robots.ts`](file:///c:/Users/Marco/Desktop/projetos/araca-site-novo/app/robots.ts)  
Acessível na web em: `https://www.araca.arq.br/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /login/
Disallow: /design-system

Sitemap: https://www.araca.arq.br/sitemap.xml
```

---

## 5. Sitemap XML Dinâmico

Arquivo: [`app/sitemap.ts`](file:///c:/Users/Marco/Desktop/projetos/araca-site-novo/app/sitemap.ts)  
Acessível na web em: `https://www.araca.arq.br/sitemap.xml`

Todas as URLs agora estão padronizadas no domínio canônico com prioridades adequadas:

### 5.1. Páginas Institucionais e Serviços
| URL | Prioridade | Frequência |
| :--- | :---: | :---: |
| `https://www.araca.arq.br` (Home) | `1.0` | Semanal |
| `https://www.araca.arq.br/projetos` | `0.9` | Semanal |
| `https://www.araca.arq.br/servicos/residencial` | `0.9` | Mensal |
| `https://www.araca.arq.br/servicos/comercial` | `0.9` | Mensal |
| `https://www.araca.arq.br/blog` | `0.9` | Semanal |
| `https://www.araca.arq.br/arquiteto-em-santo-andre` | `0.9` | Mensal |
| `https://www.araca.arq.br/sobre` | `0.8` | Mensal |
| `https://www.araca.arq.br/contato` | `0.8` | Mensal |
| `https://www.araca.arq.br/politica-privacidade` | `0.5` | Mensal |
| `https://www.araca.arq.br/termos` | `0.5` | Mensal |

### 5.2. Páginas de SEO Local (Cidades & Bairros)
* Prioridade: `0.85` | Frequência: Mensal
* URLs:
  * `https://www.araca.arq.br/arquitetura-interiores-santo-andre`
  * `https://www.araca.arq.br/arquitetura-interiores-sao-caetano`
  * `https://www.araca.arq.br/arquitetura-interiores-sao-bernardo`
  * `https://www.araca.arq.br/arquitetura-interiores-sao-paulo`
  * `https://www.araca.arq.br/arquitetura-interiores-moema`
  * `https://www.araca.arq.br/arquitetura-interiores-brooklyn`
  * `https://www.araca.arq.br/arquitetura-interiores-pinheiros`
  * `https://www.araca.arq.br/arquitetura-interiores-zona-sul-sao-paulo`

### 5.3. Portfólio de Projetos & Blog Dinâmico
* `https://www.araca.arq.br/projetos/[id]` (Prioridade 0.7)
* `https://www.araca.arq.br/blog/[slug]` (Prioridade 0.7, atualizado com `updatedAt` real)
* `https://www.araca.arq.br/blog/categoria/[slug]` (Prioridade 0.7)
* `https://www.araca.arq.br/blog/autor/[id]` (Prioridade 0.6)

---

## 6. Tabela Completa de Páginas, Títulos e Meta Descriptions

| Rota / Página | Tag Title Final | Meta Description | Canonical URL |
| :--- | :--- | :--- | :--- |
| `/` (Home) | `Aracá Interiores \| Escritório de Arquitetura e Design de Interiores em Santo André e SP` | *A Aracá Interiores é um escritório de arquitetura e design de interiores em Santo André e SP focado em arquitetura de interiores com modelo flexível.* | `https://www.araca.arq.br` |
| `/sobre` | `Sobre a Aracá Interiores \| Arquitetos em Santo André \| Aracá Interiores` | *Conheça a Aracá Interiores, seu escritório de arquitetura e designer de interiores em Santo André e São Paulo SP. Especialistas em projetos residenciais e comerciais sob medida.* | `https://www.araca.arq.br/sobre` |
| `/projetos` | `Projetos \| Aracá Interiores` | *Projetos de interiores residenciais e comerciais da Aracá. Do conceito ao acabamento.* | `https://www.araca.arq.br/projetos` |
| `/projetos/[slug]` | `[Título do Projeto] \| Aracá Interiores` | *Descrição específica cadastrada no projeto.* | `https://www.araca.arq.br/projetos/[slug]` |
| `/servicos/residencial` | `Arquitetura Residencial \| Aracá Interiores` | *Projetos de interiores residenciais sob medida em Santo André e SP. Transformamos seu apartamento ou casa em um refúgio funcional com alma e estilo.* | `https://www.araca.arq.br/servicos/residencial` |
| `/servicos/comercial` | `Arquitetura Comercial e Corporativa \| Aracá Interiores` | *Projetos de arquitetura comercial e corporativa em Santo André e SP. Espaços estratégicos que geram conversão, produtividade e valorizam sua marca.* | `https://www.araca.arq.br/servicos/comercial` |
| `/contato` | `Contato \| Aracá Interiores` | *Entre em contato com a Aracá Interiores. Envie sua mensagem ou fale por e-mail e WhatsApp. Projetos de interiores residenciais e comerciais.* | `https://www.araca.arq.br/contato` |
| `/blog` | `Blog \| Aracá Interiores` | *Blog da Aracá Interiores: design de interiores, projetos residenciais e comerciais, dicas e inspirações.* | `https://www.araca.arq.br/blog` |
| `/blog/[slug]` | `[Título do Artigo] \| Aracá Interiores` | *Meta description personalizada do artigo ou resumo (excerpt).* | `https://www.araca.arq.br/blog/[slug]` |
| `/blog/categoria/[slug]` | `[Nome da Categoria] \| Blog \| Aracá Interiores` | *Posts da categoria [Categoria] no blog da Aracá Interiores.* | `https://www.araca.arq.br/blog/categoria/[slug]` |
| `/blog/autor/[id]` | `[Nome do Autor] \| Blog \| Aracá Interiores` | *Bio do autor ou "Posts de [Nome] no blog."* | `https://www.araca.arq.br/blog/autor/[id]` |
| `/arquiteto-em-santo-andre` | `Arquiteto em Santo André \| Aracá Interiores — Design Biofílico` | *Aracá Interiores atua em Santo André com projetos de design de interiores, arquitetura biofílica e sustentável. Residencial, comercial, reforma e construção. Solicite seu orçamento.* | `https://www.araca.arq.br/arquiteto-em-santo-andre` |
| `/arquitetura-interiores-[city]` | `Arquiteto de Interiores em [Cidade] \| Aracá Interiores` | *Projetos de arquitetura e design de interiores em [Cidade]. Especialistas em alto padrão e apartamentos. Agende sua consultoria com a Aracá Interiores.* | `https://www.araca.arq.br/arquitetura-interiores-[city]` |
| `/politica-privacidade` | `Política de Privacidade \| Aracá Interiores` | *Saiba como a Aracá Interiores coleta e protege seus dados de acordo com a LGPD.* | `https://www.araca.arq.br/politica-privacidade` |
| `/termos` | `Termos de Uso \| Aracá Interiores` | *Leia os termos de uso do site da Aracá Interiores.* | `https://www.araca.arq.br/termos` |
| `/cv/[slug]` | `[Nome do Membro] \| Aracá Interiores` | *Cartão de Visitas Virtual - [Nome], [Cargo] na Aracá Interiores.* | `https://www.araca.arq.br/cv/[slug]` |

---

## 7. Dados Estruturados (Schema.org / JSON-LD)

1. **`Organization` e `WebSite` (Global):** Reconhecimento de marca e logotipo nos buscadores.
2. **`InteriorDesigner` / `LocalBusiness`:** Configurado nas páginas de cidades e `/arquiteto-em-santo-andre` com telefone `+5511997458464`, endereço, área atendida e redes sociais.
3. **`FAQPage` (`/arquiteto-em-santo-andre`):** 5 perguntas e respostas para gerar Rich Snippets sanfonados nos resultados do Google.
4. **`BlogPosting` & `BreadcrumbList`:** Em todos os artigos do blog com autor, datas e navegação estruturada.

---

## 8. Estratégia de SEO Local

* Palavras-chave de fundo de funil regional nos títulos (`H1` semântico) e parágrafos de abertura.
* Seção de linkagem interna cruzada entre as cidades no rodapé das páginas locais para acelerar a indexação mútua.

---

## 9. Checklist de Ação no Google Search Console & Vercel

1. **Na Vercel (Variáveis de Ambiente):**
   * Verifique se `NEXT_PUBLIC_SITE_URL` está configurada como: `https://www.araca.arq.br`
2. **No Google Search Console:**
   * Certifique-se de usar a propriedade **`https://www.araca.arq.br/`** (ou a Propriedade de Domínio `araca.arq.br`).
   * Vá em **Sitemaps** e envie: `https://www.araca.arq.br/sitemap.xml` (ou reenvie para forçar leitura).
   * Use a ferramenta **Inspeção de URL** na Home (`https://www.araca.arq.br/`), em `/sobre`, em `/projetos` e em `/arquiteto-em-santo-andre`, e clique em **"Solicitar indexação"**.
3. **No R2 / CDN (`img.araca.arq.br`):**
   * Suba o arquivo `robots.txt` no bucket R2 para silenciar os erros de rastreamento de páginas no subdomínio.
