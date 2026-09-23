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
* **Título Padrão:** `Aracá Interiores | Design de Interiores em SP e ABC`
* **Template de Título:** `%s | Aracá Interiores`
* **Meta Description Geral:**  
  > *"Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC. Solicite sua proposta comercial."*
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
| `https://www.araca.arq.br/design-de-interiores-sao-paulo` (LP 1 - Capital) | `0.95` | Semanal |
| `https://www.araca.arq.br/design-de-interiores-santo-andre` (LP 2 - Local) | `0.95` | Semanal |
| `https://www.araca.arq.br/reforma-de-interiores-residencial` (LP 3 - Obra) | `0.95` | Mensal |
| `https://www.araca.arq.br/design-de-interiores-classico-neoclassico` (LP 4 - Nicho) | `0.90` | Mensal |
| `https://www.araca.arq.br/projetos` | `0.9` | Semanal |
| `https://www.araca.arq.br/servicos` | `0.9` | Mensal |
| `https://www.araca.arq.br/servicos/residencial` | `0.9` | Mensal |
| `https://www.araca.arq.br/servicos/residencial/casas` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/residencial/apartamentos` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/residencial/coberturas` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/residencial/reformas-retrofit` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/comercial-corporativo` | `0.9` | Mensal |
| `https://www.araca.arq.br/servicos/comercial-corporativo/escritorios` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/comercial-corporativo/clinicas-consultorios` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/comercial-corporativo/lojas-varejo` | `0.85` | Mensal |
| `https://www.araca.arq.br/servicos/gestao-acompanhamento-de-obra` | `0.9` | Mensal |
| `https://www.araca.arq.br/blog` | `0.9` | Semanal |
| `https://www.araca.arq.br/sobre` | `0.8` | Mensal |
| `https://www.araca.arq.br/contato` | `0.8` | Mensal |
| `https://www.araca.arq.br/politica-privacidade` | `0.5` | Mensal |
| `https://www.araca.arq.br/termos` | `0.5` | Mensal |

### 5.2. Páginas de SEO Local Secundárias (Cidades & Bairros)
* Prioridade: `0.85` | Frequência: Mensal
* URLs:
  * `https://www.araca.arq.br/arquitetura-interiores-sao-caetano`
  * `https://www.araca.arq.br/arquitetura-interiores-sao-bernardo`
  * `https://www.araca.arq.br/arquitetura-interiores-moema`
  * `https://www.araca.arq.br/arquitetura-interiores-brooklyn`
  * `https://www.araca.arq.br/arquitetura-interiores-pinheiros`
  * `https://www.araca.arq.br/arquitetura-interiores-zona-sul-sao-paulo`

*(Nota: Santo André e São Paulo possuem LPs prioritárias dedicadas acima; as antigas rotas `/arquitetura-interiores-santo-andre`, `/arquiteto-em-santo-andre` e `/arquitetura-interiores-sao-paulo` possuem redirecionamento 301 definitivo para suas respectivas novas LPs).*

### 5.3. Portfólio de Projetos & Blog Dinâmico
* `https://www.araca.arq.br/projetos/[id]` (Prioridade 0.7)
* `https://www.araca.arq.br/blog/[slug]` (Prioridade 0.7, atualizado com `updatedAt` real)
* `https://www.araca.arq.br/blog/categoria/[slug]` (Prioridade 0.7)
* `https://www.araca.arq.br/blog/autor/[id]` (Prioridade 0.6)

---

## 6. Tabela Completa de Páginas, Títulos e Meta Descriptions

| Rota / Página | Tag Title Final | Meta Description | Canonical URL |
| :--- | :--- | :--- | :--- |
| `/` (Home) | `Aracá Interiores \| Design de Interiores em SP e ABC` | *Projetos autorais de design de interiores e reformas residenciais de alto padrão em SP e ABC. Solicite sua proposta comercial.* | `https://www.araca.arq.br` |
| `/design-de-interiores-sao-paulo` (LP 1) | `Designer de Interiores em São Paulo SP \| Aracá Interiores` | *Escritório de design de interiores em São Paulo. Projetos residenciais de alto padrão e reformas executivas nos Jardins, Moema, Pinheiros e Itaim. Fale conosco.* | `https://www.araca.arq.br/design-de-interiores-sao-paulo` |
| `/design-de-interiores-santo-andre` (LP 2) | `Design de Interiores em Santo André e ABC \| Aracá Interiores` | *Escritório de design de interiores em Santo André. Projetos residenciais biofílicos e reformas de alto padrão no Bairro Jardim, Campestre e ABC. Fale conosco.* | `https://www.araca.arq.br/design-de-interiores-santo-andre` |
| `/reforma-de-interiores-residencial` (LP 3) | `Reforma de Interiores Residencial de Alto Padrão \| Aracá Interiores` | *Reforma completa de apartamentos e casas com projeto executivo detalhado e acompanhamento de obra. Gestão total sem estresse ou atrasos em SP e ABC.* | `https://www.araca.arq.br/reforma-de-interiores-residencial` |
| `/design-de-interiores-classico-neoclassico` (LP 4) | `Design de Interiores Clássico e Neoclássico \| Aracá Interiores` | *Especialistas em design de interiores clássico e neoclássico contemporâneo em SP. Boiserie, marcenaria tradicional refinada, proporções elegantes e alto luxo.* | `https://www.araca.arq.br/design-de-interiores-classico-neoclassico` |
| `/sobre` | `Sobre a Aracá Interiores \| Decoradores e Designers de Interiores no Grande ABC e em São Paulo \| Aracá Interiores` | *Conheça a Aracá Interiores, seu escritório de Decoração e Design de Interiores no Grande ABC e em São Paulo. Especialistas em projetos residenciais e comerciais sob medida.* | `https://www.araca.arq.br/sobre` |
| `/projetos` | `Projetos \| Aracá Interiores` | *Projetos de interiores residenciais e comerciais da Aracá. Do conceito ao acabamento.* | `https://www.araca.arq.br/projetos` |
| `/projetos/[slug]` | `[Título do Projeto] \| Aracá Interiores` | *Descrição específica cadastrada no projeto.* | `https://www.araca.arq.br/projetos/[slug]` |
| `/servicos` | `Serviços de Interiores no ABC e SP \| Aracá Interiores` | *Projetos de interiores residenciais, comerciais e gestão de obra no Grande ABC e São Paulo. Conheça nossos serviços sob medida.* | `https://www.araca.arq.br/servicos` |
| `/servicos/residencial` | `Design de Interiores Residencial \| Aracá Interiores` | *Projetos de interiores para casas e apartamentos no Grande ABC e SP. Ambientes acolhedores, funcionais e sob medida para seu lar.* | `https://www.araca.arq.br/servicos/residencial` |
| `/servicos/residencial/casas` | `Design de Interiores para Casas no ABC e SP \| Aracá Interiores` | *Projetos de interiores para casas e sobrados de alto padrão em SP e Grande ABC. Ambientes integrados, espaço gourmet, suítes e marcenaria sob medida.* | `https://www.araca.arq.br/servicos/residencial/casas` |
| `/servicos/residencial/apartamentos` | `Design de Interiores para Apartamentos em SP e ABC \| Aracá Interiores` | *Projetos de interiores para apartamentos novos e na planta em SP e Grande ABC. Integração de varanda gourmet, marcenaria milimétrica e layout inteligente.* | `https://www.araca.arq.br/servicos/residencial/apartamentos` |
| `/servicos/residencial/coberturas` | `Design de Interiores para Coberturas e Penthouses \| Aracá Interiores` | *Projetos exclusivos para coberturas duplex e penthouses em SP e ABC. Áreas externas com piscina privativa, espaço gourmet e livings integrados.* | `https://www.araca.arq.br/servicos/residencial/coberturas` |
| `/servicos/residencial/reformas-retrofit` | `Reforma e Retrofit de Interiores Residencial \| Aracá Interiores` | *Projetos de reforma completa e retrofit para casas e apartamentos no ABC e SP. Modernização estrutural, acabamentos nobres e gestão sem imprevistos.* | `https://www.araca.arq.br/servicos/residencial/reformas-retrofit` |
| `/servicos/comercial-corporativo` | `Design de Interiores Comercial \| Aracá Interiores` | *Projetos de interiores para escritórios, clínicas e lojas no ABC e SP. Espaços corporativos que valorizam a sua marca.* | `https://www.araca.arq.br/servicos/comercial-corporativo` |
| `/servicos/comercial-corporativo/escritorios` | `Design de Interiores para Escritórios e Sedes \| Aracá Interiores` | *Projetos corporativos para escritórios e sedes empresariais no ABC e SP. Ergonomia NR-17, acústica, salas de reunião e open space integrado.* | `https://www.araca.arq.br/servicos/comercial-corporativo/escritorios` |
| `/servicos/comercial-corporativo/clinicas-consultorios` | `Design de Interiores para Clínicas e Consultórios \| Aracá Interiores` | *Arquitetura de interiores para clínicas médicas e consultórios em SP e ABC. Conformidade total com normas da ANVISA, acolhimento e requinte.* | `https://www.araca.arq.br/servicos/comercial-corporativo/clinicas-consultorios` |
| `/servicos/comercial-corporativo/lojas-varejo` | `Design de Interiores para Lojas e Showrooms \| Aracá Interiores` | *Arquitetura comercial e retail design para lojas e showrooms em SP e ABC. Visual merchandising, fluxo de clientes e experiência de compra.* | `https://www.araca.arq.br/servicos/comercial-corporativo/lojas-varejo` |
| `/servicos/gestao-acompanhamento-de-obra` | `Gestão e Acompanhamento de Obra \| Aracá Interiores` | *Acompanhamento presencial e gestão técnica de obras no ABC e SP. Controle de prazos, acabamentos e fidelidade ao projeto.* | `https://www.araca.arq.br/servicos/gestao-acompanhamento-de-obra` |
| `/contato` | `Contato \| Aracá Interiores` | *Entre em contato com a Aracá Interiores. Envie sua mensagem ou fale por e-mail e WhatsApp. Projetos de interiores residenciais e comerciais.* | `https://www.araca.arq.br/contato` |
| `/blog` | `Blog \| Aracá Interiores` | *Blog da Aracá Interiores: design de interiores, projetos residenciais e comerciais, dicas e inspirações.* | `https://www.araca.arq.br/blog` |
| `/blog/[slug]` | `[Título do Artigo] \| Aracá Interiores` | *Meta description personalizada do artigo ou resumo (excerpt).* | `https://www.araca.arq.br/blog/[slug]` |
| `/blog/categoria/[slug]` | `[Nome da Categoria] \| Blog \| Aracá Interiores` | *Posts da categoria [Categoria] no blog da Aracá Interiores.* | `https://www.araca.arq.br/blog/categoria/[slug]` |
| `/blog/autor/[id]` | `[Nome do Autor] \| Blog \| Aracá Interiores` | *Bio do autor ou "Posts de [Nome] no blog."* | `https://www.araca.arq.br/blog/autor/[id]` |
| `/arquitetura-interiores-[city]` | `Arquiteto de Interiores em [Cidade] \| Aracá Interiores` | *Projetos de arquitetura e design de interiores em [Cidade]. Especialistas em alto padrão e apartamentos. Agende sua consultoria com a Aracá Interiores.* | `https://www.araca.arq.br/arquitetura-interiores-[city]` |
| `/politica-privacidade` | `Política de Privacidade \| Aracá Interiores` | *Saiba como a Aracá Interiores coleta e protege seus dados de acordo com a LGPD.* | `https://www.araca.arq.br/politica-privacidade` |
| `/termos` | `Termos de Uso \| Aracá Interiores` | *Leia os termos de uso do site da Aracá Interiores.* | `https://www.araca.arq.br/termos` |
| `/cv/[slug]` | `[Nome do Membro] \| Aracá Interiores` | *Cartão de Visitas Virtual - [Nome], [Cargo] na Aracá Interiores.* | `https://www.araca.arq.br/cv/[slug]` |

---

## 7. Dados Estruturados (Schema.org / JSON-LD)

A arquitetura de dados estruturados segue a padronização canônica unificada via `@graph`:

1. **Unificação via `@graph`:** Cada página do site renderiza apenas **um único bloco `<script type="application/ld+json">`**, consolidando as entidades dentro de um array `@graph` para evitar fragmentação e duplicidades nos validadores do Google.
2. **Entidade Canônica Única (`#organization`):**
   - `@id`: `"https://www.araca.arq.br/#organization"`
   - `url`: `"https://www.araca.arq.br/"` (sempre apontando para a raiz)
3. **Tipagem Híbrida do Negócio:**
   - `@type`: `["HomeAndConstructionBusiness", "ProfessionalService"]` (abrangendo reforma/execução e projeto de interiores).
4. **Contexto por Página:**
   - **Home (`/`):** Declara `WebSite` e a entidade central `#organization`.
   - **Sobre Nós (`/sobre`):** Declara `WebSite`, `AboutPage` (com `isPartOf: #website` e `about: #organization`) e `#organization` com fundadores (`founder`), área atendida e catálogo de serviços (`hasOfferCatalog`).
   - **Portfólio (`/projetos/...`):** Declara `CreativeWork` ou `VisualArtwork` com criador apontando para `#organization`.
   - **Contato (`/contato`):** Declara `ContactPage`.
   - **Landing Pages Regionais:** Declaram serviços locais integrados ao grafo institucional.
   - **Blog (`/blog/[slug]`):** Declara `BlogPosting` & `BreadcrumbList`.

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
