# Guia de Uso do Editor Rico

Este guia descreve como usar o editor de conteúdo profissional do blog.

## 🎯 Visão Geral

O editor é baseado no **Lexical** (mesmo editor usado pelo Facebook/Meta) e oferece uma experiência de edição moderna e poderosa.

## 🎨 Barra de Ferramentas

### Estilos de Parágrafo
Use o dropdown à esquerda para escolher:
- **Normal**: Parágrafo comum
- **Título 1**: Título principal (H1)
- **Título 2**: Subtítulo (H2)
- **Título 3**: Título menor (H3)
- **Citação**: Bloco de citação estilizado

### Formatação de Texto
Botões de formatação inline:
- **B** (Negrito): `Ctrl+B`
- **I** (Itálico): `Ctrl+I`
- **U** (Sublinhado): `Ctrl+U`
- **S** (Tachado): Texto riscado
- **</>** (Código): Código inline com fundo cinza

### Listas
- **•** (Lista): Lista com marcadores
- **1.** (Lista Numerada): Lista ordenada

### Inserir Conteúdo
- **🖼️ Imagem**: Clique para fazer upload de uma imagem
- **🔗 Link**: Inserir ou editar link no texto selecionado

### Histórico
- **↶ Desfazer**: `Ctrl+Z`
- **↷ Refazer**: `Ctrl+Shift+Z` ou `Ctrl+Y`

## ⚡ Slash Commands (Comandos Rápidos)

Digite `/` em qualquer lugar do texto para abrir o menu de comandos:

### Como Usar
1. Digite `/` no editor
2. Um menu aparecerá com opções disponíveis
3. Use as **setas ↑↓** para navegar
4. Pressione **Enter** para selecionar
5. Ou clique diretamente na opção desejada
6. Pressione **Esc** para cancelar

### Comandos Disponíveis

#### `/titulo1` ou `/h1`
Transforma o parágrafo em Título 1 (grande)

#### `/titulo2` ou `/h2`
Transforma o parágrafo em Título 2 (médio)

#### `/titulo3` ou `/h3`
Transforma o parágrafo em Título 3 (pequeno)

#### `/lista`
Cria uma lista com marcadores

#### `/numerada`
Cria uma lista numerada

#### `/imagem`
Abre o seletor de arquivo para fazer upload de uma imagem

### Busca Inteligente
O menu filtra comandos conforme você digita:
- `/tit` → mostra todos os títulos
- `/lis` → mostra listas
- `/img` → mostra opção de imagem

## 🖼️ Trabalhando com Imagens

### Inserir Imagem

**Método 1: Botão na Toolbar**
1. Clique no botão **🖼️** na barra de ferramentas
2. Selecione uma imagem do seu computador
3. A imagem será enviada e inserida automaticamente

**Método 2: Slash Command**
1. Digite `/imagem` no editor
2. Pressione Enter
3. Selecione uma imagem do seu computador

### Gerenciar Imagens
- **Selecionar**: Clique na imagem para selecioná-la (aparece borda azul)
- **Excluir**: Com a imagem selecionada, clique no botão **X** vermelho no canto superior direito
- **Redimensionar**: As imagens são responsivas e se ajustam automaticamente

### Formatos Suportados
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

### Onde as Imagens são Salvas?
As imagens são enviadas para a **collection Media** do Payload CMS e armazenadas no:
- **Supabase Storage** (se configurado)
- **Vercel Blob Storage** (fallback)

## 🔗 Trabalhando com Links

### Inserir Link

1. **Selecione o texto** que deseja transformar em link
2. Clique no botão **🔗** na barra de ferramentas
3. Digite a URL no campo que aparece
4. Pressione **Enter** ou clique em **Inserir**

### Editar Link Existente

1. Clique no texto com link (ou posicione o cursor nele)
2. O botão de link ficará destacado
3. Clique no botão **🔗**
4. Edite a URL
5. Clique em **Atualizar**

### Remover Link

1. Clique no texto com link
2. Clique no botão **🔗**
3. Clique em **Remover**

### Dicas de Links
- Use URLs completas: `https://exemplo.com`
- Links externos abrem em nova aba automaticamente
- Links internos: `/blog/meu-post`

## ⌨️ Atalhos de Teclado

### Formatação
- `Ctrl+B` → Negrito
- `Ctrl+I` → Itálico
- `Ctrl+U` → Sublinhado
- `Ctrl+K` → Inserir link (em breve)

### Histórico
- `Ctrl+Z` → Desfazer
- `Ctrl+Shift+Z` → Refazer
- `Ctrl+Y` → Refazer (alternativo)

### Navegação
- `Enter` → Nova linha
- `Shift+Enter` → Quebra de linha (sem novo parágrafo)
- `Tab` → Aumentar indentação (em listas)
- `Shift+Tab` → Diminuir indentação (em listas)

### Comandos Rápidos
- `/` → Abrir menu de comandos
- `↑` `↓` → Navegar no menu
- `Enter` → Selecionar comando
- `Esc` → Fechar menu

## 📝 Dicas de Uso

### Estrutura de Post Recomendada

```
[Título 1] Título Principal do Post

[Normal] Parágrafo introdutório com resumo do conteúdo...

[Título 2] Primeiro Subtítulo

[Normal] Conteúdo explicativo...

[Imagem] Imagem ilustrativa

[Normal] Mais conteúdo...

[Lista]
• Ponto 1
• Ponto 2
• Ponto 3

[Título 2] Segundo Subtítulo

[Normal] Continuação do conteúdo...

[Citação] "Uma citação importante ou destaque"

[Título 2] Conclusão

[Normal] Parágrafo final...
```

### Boas Práticas

1. **Use títulos hierárquicos**: H1 → H2 → H3 (não pule níveis)
2. **Imagens descritivas**: Use nomes de arquivo significativos
3. **Links contextuais**: O texto do link deve descrever o destino
4. **Listas para organização**: Use listas para pontos múltiplos
5. **Parágrafos curtos**: Facilita a leitura online
6. **Citações para destaque**: Use para frases importantes
7. **Código inline**: Use para comandos, variáveis, etc.

### Otimização de Imagens

Antes de fazer upload:
- Redimensione para largura máxima de 1200px
- Comprima para reduzir tamanho do arquivo
- Use formato WebP quando possível (melhor compressão)
- Evite imagens muito grandes (>1MB)

### Acessibilidade

- **Imagens**: O nome do arquivo é usado como texto alternativo
- **Links**: Use texto descritivo (não "clique aqui")
- **Títulos**: Mantenha hierarquia correta
- **Contraste**: Evite texto colorido sem contraste

## 🐛 Solução de Problemas

### A imagem não aparece
- Verifique se o arquivo é uma imagem válida
- Tente um arquivo menor (<5MB)
- Verifique sua conexão com internet

### O link não funciona
- Certifique-se de incluir `https://` na URL
- Verifique se a URL está correta
- Links internos devem começar com `/`

### Perdi meu conteúdo
- Use Ctrl+Z para desfazer
- O conteúdo é salvo apenas ao clicar em "Salvar"
- Considere copiar conteúdo longo para backup

### O menu de comandos não aparece
- Certifique-se de digitar `/` (barra)
- Tente em uma nova linha
- Recarregue a página se necessário

## 🚀 Recursos Futuros

Em breve:
- ✅ Tabelas
- ✅ Blocos de código com syntax highlighting
- ✅ Embeds (YouTube, Twitter, etc.)
- ✅ Arrastar e soltar imagens
- ✅ Redimensionar imagens
- ✅ Mais opções de formatação
- ✅ Colaboração em tempo real
- ✅ Comentários e sugestões

## 💡 Dicas Avançadas

### Workflow Eficiente

1. **Escreva primeiro, formate depois**: Foque no conteúdo
2. **Use slash commands**: Mais rápido que a toolbar
3. **Atalhos de teclado**: Memorize os principais
4. **Preview frequente**: Salve e visualize regularmente
5. **Organize com títulos**: Estruture antes de escrever

### Produtividade

- Digite `/` e comece a escrever o comando
- Use `Ctrl+Z` sem medo (histórico ilimitado)
- Selecione texto e clique em formatação (aplica instantaneamente)
- Copie/cole de outros editores (mantém formatação básica)

---

**Precisa de ajuda?** Entre em contato com o suporte técnico.
