# Checklist de Testes: Sistema de Blog

## Pré-requisitos

- [ ] Servidor de desenvolvimento rodando (`npm run dev`)
- [ ] Banco de dados conectado e acessível
- [ ] Usuário autenticado no dashboard

## 1. Criar Novo Post

### Passos:

1. Acessar `/dashboard/blog/posts`
2. Clicar em "Novo post"
3. Preencher formulário:
   - **Título**: "Post de Teste - [Data/Hora]"
   - **Slug**: Clicar em "Gerar" ou digitar manualmente
   - **Resumo**: "Este é um post de teste para validar o sistema de blog"
   - **Conteúdo**: Escrever no editor Lexical com:
     - Texto normal
     - **Negrito**
     - *Itálico*
     - Lista com bullets
     - Lista numerada
     - Link para site externo
     - Título H2
     - Título H3
   - **Categoria**: Selecionar uma categoria
   - **Autor**: Selecionar autor atual
   - **Status**: "Rascunho"

4. Clicar em "Criar post"

### Resultado Esperado:

- [ ] Post criado sem erros
- [ ] Redirecionado para lista de posts
- [ ] Post aparece na lista
- [ ] Mensagem de sucesso (se houver)

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 2. Editar Post Existente

### Passos:

1. Na lista de posts, clicar em "Editar" em um post
2. Modificar o conteúdo:
   - Adicionar novo parágrafo
   - Adicionar formatação (negrito, itálico)
   - Adicionar uma lista
3. Clicar em "Salvar alterações"

### Resultado Esperado:

- [ ] Post atualizado sem erros
- [ ] Alterações salvas no banco
- [ ] Mensagem de sucesso (se houver)

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 3. Inserir Imagem no Conteúdo

### Passos:

1. Criar ou editar um post
2. No editor de conteúdo, usar o plugin de imagem:
   - Digitar `/image` ou usar toolbar
   - Fazer upload de uma imagem
3. Salvar o post

### Resultado Esperado:

- [ ] Imagem inserida no editor
- [ ] Post salvo sem erros
- [ ] Imagem aparece no preview (se houver)

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 4. Visualizar Post no Frontend

### Passos:

1. Criar/editar um post com status "Publicado"
2. Definir data de publicação (passada ou presente)
3. Salvar o post
4. Acessar `/blog`
5. Clicar no post criado

### Resultado Esperado:

- [ ] Post aparece na listagem do blog
- [ ] Ao clicar, abre página individual do post
- [ ] Conteúdo renderizado corretamente:
  - [ ] Formatação preservada (negrito, itálico)
  - [ ] Listas aparecem corretamente
  - [ ] Links funcionam
  - [ ] Títulos com tamanho correto
  - [ ] Imagens aparecem (se houver)
- [ ] Metadados corretos (autor, data, categoria)

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 5. Testar Validação de Campos

### Passos:

1. Tentar criar post sem preencher campos obrigatórios:
   - Sem título
   - Sem slug
   - Sem resumo
   - Sem conteúdo
   - Sem autor

### Resultado Esperado:

- [ ] Formulário não envia
- [ ] Mensagens de erro aparecem nos campos obrigatórios
- [ ] Nenhum post criado no banco

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 6. Testar Slug Único

### Passos:

1. Criar um post com slug "teste-slug-unico"
2. Tentar criar outro post com o mesmo slug

### Resultado Esperado:

- [ ] Segundo post não é criado
- [ ] Mensagem de erro: "Slug já existe" ou similar
- [ ] Usuário pode corrigir o slug

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 7. Testar Rascunho vs Publicado

### Passos:

1. Criar post com status "Rascunho"
2. Acessar `/blog` (frontend)
3. Verificar se post NÃO aparece
4. Voltar ao dashboard e mudar status para "Publicado"
5. Acessar `/blog` novamente

### Resultado Esperado:

- [ ] Post em rascunho não aparece no frontend
- [ ] Post publicado aparece no frontend
- [ ] Transição funciona corretamente

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 8. Deletar Post

### Passos:

1. Na lista de posts, clicar em "Deletar" em um post de teste
2. Confirmar deleção (se houver confirmação)

### Resultado Esperado:

- [ ] Post deletado do banco
- [ ] Post removido da lista
- [ ] Mensagem de sucesso
- [ ] Ao acessar URL do post no frontend, retorna 404

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 9. Testar Payload Admin (Opcional)

### Passos:

1. Acessar `/admin`
2. Fazer login
3. Ir para "Posts"
4. Visualizar posts criados via dashboard
5. Tentar editar um post (será textarea simples)

### Resultado Esperado:

- [ ] Posts aparecem no Payload Admin
- [ ] Campo `content` aparece como textarea
- [ ] É possível visualizar HTML
- [ ] É possível editar (com cuidado)
- [ ] Salvar não quebra o post

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## 10. Testar Conteúdo Complexo

### Passos:

1. Criar post com conteúdo complexo:
   - Múltiplos parágrafos
   - Listas aninhadas
   - Links com texto formatado
   - Imagens intercaladas com texto
   - Citações (blockquote)
   - Código inline
   - Múltiplos níveis de títulos (H2, H3, H4)

2. Salvar e visualizar no frontend

### Resultado Esperado:

- [ ] Todo conteúdo salvo corretamente
- [ ] Renderização perfeita no frontend
- [ ] Sem perda de formatação
- [ ] Sem quebra de layout

### Resultado Obtido:

```
[Descrever o que aconteceu]
```

---

## Erros Conhecidos (Antes da Correção)

### ❌ Erro de Validação ao Salvar

**Erro:**
```
ValidationError: O campo a seguir está inválido: Conteúdo
```

**Causa:** Campo `content` era `richText` (Lexical JSON) mas recebia HTML string

**Status:** ✅ **CORRIGIDO** - Campo alterado para `textarea`

---

## Resumo dos Testes

| Teste | Status | Observações |
|-------|--------|-------------|
| 1. Criar novo post | ⬜ | |
| 2. Editar post | ⬜ | |
| 3. Inserir imagem | ⬜ | |
| 4. Visualizar no frontend | ⬜ | |
| 5. Validação de campos | ⬜ | |
| 6. Slug único | ⬜ | |
| 7. Rascunho vs Publicado | ⬜ | |
| 8. Deletar post | ⬜ | |
| 9. Payload Admin | ⬜ | |
| 10. Conteúdo complexo | ⬜ | |

**Legenda:**
- ⬜ Não testado
- ✅ Passou
- ❌ Falhou
- ⚠️ Passou com ressalvas

---

## Notas Adicionais

### Ambiente de Teste:

- **Data:** [Preencher]
- **Navegador:** [Preencher]
- **Node Version:** [Preencher]
- **Database:** [Preencher]

### Problemas Encontrados:

```
[Descrever problemas encontrados durante os testes]
```

### Melhorias Sugeridas:

```
[Sugestões de melhorias baseadas nos testes]
```

---

## Próximos Passos

Após todos os testes passarem:

- [ ] Fazer commit das alterações
- [ ] Atualizar documentação
- [ ] Notificar equipe sobre a correção
- [ ] Deploy em staging (se houver)
- [ ] Testes em staging
- [ ] Deploy em produção
