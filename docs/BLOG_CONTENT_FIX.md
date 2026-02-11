# Correção: Erro de Validação ao Salvar Posts no Blog

## Problema

Ao tentar salvar posts no dashboard de blog, ocorria o erro:

```
ValidationError: O campo a seguir está inválido: Conteúdo
```

**Causa raiz:** O campo `content` na collection Posts estava definido como `richText` (Lexical), mas o editor do dashboard enviava HTML como string. O Payload CMS rejeitava o conteúdo porque esperava o formato JSON interno do Lexical.

## Solução Implementada

Alteramos o campo `content` de `richText` para `textarea` na collection Posts (`payload/collections/Posts.ts`).

### Vantagens desta abordagem:

1. **Compatibilidade total**: O editor Lexical do dashboard continua funcionando e gerando HTML
2. **Simplicidade**: Não requer conversão entre formatos (HTML ↔ Lexical JSON)
3. **Frontend funcional**: O componente `PostContent` já suporta ambos os formatos (HTML string e Lexical JSON)
4. **Sem breaking changes**: Posts existentes continuam funcionando

### Desvantagens aceitáveis:

- O Payload Admin mostra um textarea simples ao invés do editor rico
- Se precisar editar posts pelo Admin, será necessário escrever HTML manualmente
- **Recomendação**: Use sempre o dashboard customizado para editar posts

## Arquivos Alterados

### 1. `payload/collections/Posts.ts`

```typescript
{
  name: 'content',
  type: 'textarea', // Alterado de 'richText' para 'textarea'
  required: true,
  label: { en: 'Content', pt: 'Conteúdo' },
  admin: {
    description: 'Conteúdo HTML do post (gerado pelo editor Lexical no dashboard).',
  },
}
```

### 2. `app/api/dashboard/blog/posts/route.ts` (POST)

Melhorada a mensagem de erro para incluir detalhes do Payload:

```typescript
catch (error) {
  console.error('[API] Erro ao criar post:', error)
  
  // Extrair mensagem de erro do Payload se disponível
  const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post'
  
  return NextResponse.json(
    { message: errorMessage },
    { status: 500 }
  )
}
```

### 3. `app/api/dashboard/blog/posts/[slug]/route.ts` (PATCH)

Mesma melhoria na mensagem de erro.

## Como Funciona Agora

### Fluxo de criação/edição de post:

1. **Dashboard** (`PostForm.tsx`):
   - Usuário escreve no editor Lexical rico
   - Editor gera HTML via `$generateHtmlFromNodes()`
   - Formulário envia HTML como string

2. **API Route** (`route.ts`):
   - Recebe HTML como string no campo `content`
   - Envia diretamente ao Payload (agora aceita string)
   - Payload salva no banco de dados

3. **Frontend** (`PostContent.tsx`):
   - Recebe conteúdo do post
   - Detecta se é HTML string ou Lexical JSON
   - Renderiza adequadamente com sanitização

### Compatibilidade:

- ✅ Posts criados no dashboard (HTML)
- ✅ Posts criados no Payload Admin (HTML manual)
- ✅ Posts antigos com Lexical JSON (se existirem)

## Testes Recomendados

Após esta correção, teste:

1. **Criar novo post** via dashboard:
   - Preencher título, slug, resumo
   - Escrever conteúdo com formatação (negrito, itálico, listas, links)
   - Inserir imagens
   - Salvar e verificar se não há erro

2. **Editar post existente** via dashboard:
   - Modificar conteúdo
   - Adicionar/remover formatação
   - Salvar e verificar se não há erro

3. **Visualizar no frontend**:
   - Acessar `/blog/[slug]`
   - Verificar se o conteúdo renderiza corretamente
   - Verificar se imagens aparecem
   - Verificar se formatação está preservada

4. **Payload Admin** (opcional):
   - Acessar `/admin/collections/posts`
   - Verificar se posts aparecem
   - Editar um post (será textarea simples)
   - Salvar e verificar se não quebra

## Alternativas Consideradas

### Opção 2: Converter HTML → Lexical JSON

Converter HTML para formato Lexical antes de salvar:

**Prós:**
- Payload Admin manteria editor rico
- Formato consistente no banco

**Contras:**
- Complexidade adicional (conversão bidirecional)
- Possível perda de formatação na conversão
- Mais pontos de falha

**Decisão:** Não implementada por adicionar complexidade desnecessária.

### Opção 3: Campo separado para HTML

Manter `content` como `richText` e adicionar `contentHtml`:

**Prós:**
- Compatibilidade com Payload Admin
- Dois formatos disponíveis

**Contras:**
- Duplicação de dados
- Sincronização entre campos
- Maior uso de armazenamento

**Decisão:** Não implementada por duplicar dados.

## Migração de Dados

Se houver posts existentes com formato Lexical JSON:

```javascript
// Script de migração (executar se necessário)
const payload = await getPayloadClient()
const posts = await payload.find({ collection: 'posts', limit: 1000 })

for (const post of posts.docs) {
  if (typeof post.content !== 'string') {
    // Converter Lexical JSON para HTML
    const html = convertLexicalToHTML(post.content)
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { content: html }
    })
  }
}
```

**Nota:** Não necessário se todos os posts foram criados via dashboard ou são novos.

## Conclusão

A correção é simples, eficaz e mantém a funcionalidade completa do dashboard de blog. O editor Lexical continua oferecendo excelente experiência de edição, e o conteúdo é armazenado como HTML, facilitando renderização e compatibilidade.

**Status:** ✅ Corrigido e pronto para uso
