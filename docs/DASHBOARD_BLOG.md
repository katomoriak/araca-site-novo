# Dashboard de Gestão do Blog

Este documento descreve as funcionalidades do dashboard para gerenciar o blog do site Aracá Interiores.

## Estrutura

### Collections Payload CMS

#### Categories (Nova)
- **Slug**: `categories`
- **Campos**:
  - `name`: Nome da categoria (obrigatório)
  - `slug`: URL amigável (obrigatório, único)
  - `description`: Descrição da categoria (opcional)
  - `color`: Cor em hexadecimal para identificação visual (opcional)
- **Acesso**: Mesmo controle de acesso dos Posts (editor e admin)

#### Posts (Atualizada)
- **Alteração**: Campo `category` agora é um `relationship` com a collection `categories`
- Anteriormente era um campo `select` com valores fixos
- Permite criar e gerenciar categorias dinamicamente

### Páginas do Dashboard

#### Gestão de Posts
- **Listagem**: `/dashboard/blog/posts`
  - Exibe todos os posts com preview da capa, título, resumo, status, categoria e autor
  - Botão para criar novo post
  - Link para editar cada post
  
- **Criar Post**: `/dashboard/blog/posts/novo`
  - Formulário completo para criar novo post
  - Campos: título, slug (com gerador automático), resumo, conteúdo, categoria, autor, status, data de publicação
  
- **Editar Post**: `/dashboard/blog/posts/[slug]`
  - Formulário para editar post existente
  - Slug não pode ser alterado após criação

#### Gestão de Categorias
- **Listagem**: `/dashboard/blog/categories`
  - Exibe todas as categorias em cards
  - Mostra nome, slug, cor e descrição
  - Botão para criar nova categoria
  - Link para editar cada categoria
  
- **Criar Categoria**: `/dashboard/blog/categories/novo`
  - Formulário para criar nova categoria
  - Campos: nome, slug (com gerador automático), descrição, cor
  
- **Editar Categoria**: `/dashboard/blog/categories/[slug]`
  - Formulário para editar categoria existente
  - Slug não pode ser alterado após criação

#### Gestão de Autores
- **Listagem**: `/dashboard/blog/authors`
  - Exibe todos os usuários do sistema que podem ser autores
  - Mostra nome, email e role
  - Link para o Payload Admin para gerenciar usuários

### APIs REST

Todas as APIs requerem autenticação via cookie `payload-token`.

#### Posts
- `GET /api/dashboard/blog/posts` - Listar todos os posts
- `POST /api/dashboard/blog/posts` - Criar novo post
- `PATCH /api/dashboard/blog/posts/[slug]` - Atualizar post
- `DELETE /api/dashboard/blog/posts/[slug]` - Deletar post

#### Categories
- `GET /api/dashboard/blog/categories` - Listar todas as categorias
- `POST /api/dashboard/blog/categories` - Criar nova categoria
- `PATCH /api/dashboard/blog/categories/[slug]` - Atualizar categoria
- `DELETE /api/dashboard/blog/categories/[slug]` - Deletar categoria

#### Authors
- `GET /api/dashboard/blog/authors` - Listar todos os usuários (autores)

### Sidebar do Dashboard

O menu lateral agora inclui um dropdown "Gestão do Blog" com três itens:
- Posts
- Categorias
- Autores

O dropdown se expande automaticamente quando o usuário está em qualquer página do blog.

## Componentes Criados

### Formulários
- `PostForm.tsx` - Formulário para criar/editar posts
- `CategoryForm.tsx` - Formulário para criar/editar categorias

### Editor Rico Profissional
- `RichTextEditor.tsx` - Editor rico baseado em Lexical (mesmo do Payload CMS)
- `ToolbarPlugin.tsx` - Barra de ferramentas completa com botões de formatação

**Plugins Avançados:**
- `ImagePlugin.tsx` - Upload e inserção de imagens com preview
- `LinkPlugin.tsx` - Inserir e editar links com interface visual
- `SlashCommandPlugin.tsx` - Menu de comandos rápidos com `/`

**Funcionalidades Completas:**
- ✅ **Formatação de texto**: negrito, itálico, sublinhado, tachado, código inline
- ✅ **Títulos**: H1, H2, H3 (via toolbar ou `/`)
- ✅ **Listas**: ordenadas e não ordenadas (via toolbar ou `/`)
- ✅ **Imagens**: Upload direto com botão ou comando `/imagem`
  - Preview em tempo real
  - Seleção e exclusão visual
  - Upload para collection Media do Payload
- ✅ **Links**: Interface visual para inserir/editar/remover links
  - Popup com campo de URL
  - Atualização de links existentes
- ✅ **Slash Commands** (`/`): Menu contextual com comandos rápidos
  - Busca inteligente por nome/descrição
  - Navegação com teclado (↑↓ Enter Esc)
  - Comandos disponíveis: títulos, listas, imagens
- ✅ **Citações**: Blocos de citação estilizados
- ✅ **Histórico**: Desfazer/Refazer (Ctrl+Z / Ctrl+Shift+Z)
- ✅ **Conversão HTML**: Salva e carrega conteúdo HTML automaticamente

### UI Components (Novos)
- `components/ui/collapsible.tsx` - Componente para dropdown colapsável
- `components/ui/select.tsx` - Componente para select/dropdown
- `components/ui/badge.tsx` - Componente para badges/tags

## Fluxo de Trabalho

### Criar um Post
1. Acessar `/dashboard/blog/posts`
2. Clicar em "Novo post"
3. Preencher título (obrigatório)
4. Clicar em "Gerar" para criar slug automaticamente ou digitar manualmente
5. Preencher resumo (obrigatório)
6. Escrever conteúdo usando o **Editor Rico Lexical** (obrigatório)
   - Formatação: negrito, itálico, sublinhado, tachado, código inline
   - Títulos: H1, H2, H3
   - Listas: ordenadas e não ordenadas
   - Citações
   - Desfazer/Refazer
7. Selecionar categoria (opcional)
8. Selecionar autor (obrigatório)
9. Escolher status: Rascunho ou Publicado
10. Definir data de publicação (opcional)
11. Clicar em "Criar post"

### Criar uma Categoria
1. Acessar `/dashboard/blog/categories`
2. Clicar em "Nova categoria"
3. Preencher nome (obrigatório)
4. Clicar em "Gerar" para criar slug automaticamente ou digitar manualmente
5. Adicionar descrição (opcional)
6. Escolher cor (padrão: #3B82F6)
7. Clicar em "Criar categoria"

## Próximos Passos

### Melhorias Sugeridas
1. **Upload de Imagem de Capa**: Integrar com a collection Media do Payload para upload de imagens de capa dos posts
2. ~~**Editor Rico**~~ ✅ **IMPLEMENTADO** - Editor Lexical profissional integrado
3. ~~**Imagens no Conteúdo**~~ ✅ **IMPLEMENTADO** - Plugin de imagens com upload
4. ~~**Links**~~ ✅ **IMPLEMENTADO** - Plugin de links com interface visual
5. ~~**Slash Commands**~~ ✅ **IMPLEMENTADO** - Menu de comandos com `/`
6. **Tabelas**: Adicionar suporte para criar e editar tabelas
7. **Blocos de Código**: Syntax highlighting para diferentes linguagens
8. **Embeds**: YouTube, Twitter, CodePen, etc.
9. **Preview**: Adicionar preview do post antes de publicar
10. **Tags**: Implementar sistema de tags além de categorias
11. **Busca e Filtros**: Adicionar busca e filtros na listagem de posts
12. **Paginação**: Implementar paginação para listas grandes
13. **Estatísticas**: Dashboard com estatísticas de posts, visualizações, etc.
14. **SEO**: Campos adicionais para meta description, keywords, Open Graph, etc.
15. **Agendamento**: Permitir agendar publicação de posts para data futura
16. **Rascunhos Automáticos**: Salvar rascunhos automaticamente enquanto o usuário digita
17. **Colaboração**: Múltiplos autores editando simultaneamente
18. **Versionamento**: Histórico de versões do post

### Migração de Dados
Se você já tem posts com categorias antigas (select), será necessário:
1. Criar as categorias correspondentes na nova collection
2. Atualizar os posts para referenciar as novas categorias
3. Executar migration no Payload CMS

## Segurança

- Todas as rotas do dashboard requerem autenticação
- Validação de token JWT em cada requisição
- Apenas usuários com role `admin` ou `editor` podem acessar
- Validação de dados no servidor antes de salvar
- Proteção contra CSRF via cookies httpOnly

## Tecnologias Utilizadas

- **Next.js 16**: Framework React com App Router
- **Payload CMS 3**: Headless CMS para gerenciar conteúdo
- **Radix UI**: Componentes acessíveis para UI
- **Tailwind CSS**: Estilização
- **TypeScript**: Type safety
- **PostgreSQL**: Banco de dados (via Supabase)
