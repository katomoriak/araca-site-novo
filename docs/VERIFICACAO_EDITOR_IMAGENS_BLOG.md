# Verificação: editor e upload de imagens no conteúdo dos posts do blog

**Data da análise:** 2026-02-11  
**Escopo:** Funcionamento do editor ao subir imagens no conteúdo dos posts do blog.

---

## 1. Fluxo analisado (código)

### 1.1 Abertura do diálogo de imagem

- **Toolbar** (`ToolbarPlugin.tsx`): botão com `aria-label="Inserir imagem"` chama `openImageDialog?.()` do `ImageDialogContext`.
- **Contexto** (`ImageDialogContext.tsx`): `ImageDialogProvider` expõe `openDialog` e renderiza `ImageUploadDialog` com `onInsert` que dispara `INSERT_IMAGE_COMMAND` no Lexical com `{ src: url, altText }`.

### 1.2 Upload de imagem

- **Diálogo** (`ImageUploadDialog.tsx`):
  - Modo **Enviar arquivo**: usuário escolhe/arrasta arquivo → preview + campo “Texto alternativo (alt)” → botão “Inserir imagem” chama `uploadBlogImage(file)` e depois `onInsert(url, alt)`.
  - Modo **Banco de mídias**: `MediaPicker` lista mídias; ao selecionar, `onInsert(url, alt)` é chamado (URL absoluta se vier relativa).
- **Upload** (`lib/blog-image-upload.ts`):
  1. Tenta **signed URL**: `POST /api/upload/signed-url` com `{ filename }` → retorna `signedUrl` e `publicUrl` → cliente faz `PUT` no `signedUrl` com o arquivo → em sucesso retorna `{ url: publicUrl, alt }`.
  2. **Fallback**: `POST /api/upload` com `FormData` (limite 4 MB); 401 → “Não autenticado”; 503 + arquivo > 4 MB → mensagem para configurar Supabase.

### 1.3 APIs de upload

- **`POST /api/upload/signed-url`** (`app/api/upload/signed-url/route.ts`):
  - Exige `getDashboardUser()` (401 se não autenticado).
  - Body: `{ filename: string }`.
  - Chama `createSignedUploadUrlForBlog(filename)` em `lib/supabase-server.ts`.
  - Retorna 503 se Supabase não estiver configurado; 200 com `signedUrl` e `publicUrl`.

- **`POST /api/upload`** (`app/api/upload/route.ts`):
  - Exige `getDashboardUser()` (401 se não autenticado).
  - FormData com `file` (imagem, máx. 4 MB).
  - Se Supabase configurado: upload para bucket `media`, path `blog/{timestamp}-{random}.{ext}`, retorna `publicUrl`.
  - Senão: fallback Payload `media` (se existir).

### 1.4 Inserção no editor

- **ImagePlugin** (`components/dashboard/plugins/ImagePlugin.tsx`):
  - Escuta `INSERT_IMAGE_COMMAND` com payload `{ src, altText }`.
  - Cria `ImageNode` e insere no editor (ou no fim da raiz se não houver seleção).
- **ImageNode**: `exportDOM()` gera `<img src="..." alt="...">`; `importDOM()` reconhece `<img>` ao carregar HTML existente.

### 1.5 Persistência e exibição no site

- **PostForm**: `RichTextEditor` usa `onChange` com HTML gerado pelo Lexical (`$generateHtmlFromNodes`); o estado do formulário guarda esse HTML e envia no save do post.
- **Frontend** (`PostContent.tsx`): recebe `content` (HTML string ou estado Lexical); se HTML, sanitiza com DOMPurify (inclui `img`, `src`, `alt`) e aplica `transformImageUrls()`.
- **transform-content-images**: URLs do Supabase Storage no HTML são reescritas para `/api/image-proxy?url=...` para evitar mixed content e CORS.

---

## 2. Checklist de verificação manual

Use este checklist com o app rodando (`npm run dev`) e logado no dashboard.

- [ ] **2.1** Acessar `/dashboard/blog/posts/novo` (ou editar um post existente).
- [ ] **2.2** Clicar no botão “Inserir imagem” na barra do editor (ícone de imagem).
- [ ] **2.3** Verificar que o diálogo “Inserir imagem” abre, com abas “Enviar arquivo” e “Banco de mídias”.
- [ ] **2.4** **Modo Enviar arquivo:** selecionar uma imagem (JPG/PNG/GIF/WebP); ver preview e campo “Texto alternativo (alt)”; clicar “Inserir imagem”.
  - [ ] Upload conclui sem erro (mensagem de “Enviando…” e fechamento do diálogo).
  - [ ] A imagem aparece no conteúdo do editor.
- [ ] **2.5** **Modo Banco de mídias:** alternar para “Banco de mídias”, selecionar uma imagem da lista.
  - [ ] O diálogo fecha e a imagem aparece no conteúdo do editor.
- [ ] **2.6** Salvar o post (criar ou atualizar).
  - [ ] Salvamento conclui sem erro.
- [ ] **2.7** Abrir o post no frontend (ex.: `/blog/[slug]`).
  - [ ] As imagens inseridas aparecem no artigo (e, se forem do Supabase, via proxy sem mixed content/CORS).

---

## 3. Possíveis falhas e onde olhar

| Sintoma | Onde verificar |
|--------|-----------------|
| Botão “Inserir imagem” não abre o diálogo | `ImageDialogProvider` envolvendo o editor; `useImageDialog()` em `ToolbarPlugin`. |
| Upload falha com “Não autenticado” | Login no dashboard; cookies/sessão; `getDashboardUser()` em `/api/upload` e `/api/upload/signed-url`. |
| Upload falha com “Supabase não configurado” | `.env`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; bucket `media` no Storage. |
| Imagem sobe mas não aparece no editor | Console do navegador; `INSERT_IMAGE_COMMAND` e `ImagePlugin`; URL retornada pelo upload (absoluta e acessível). |
| Imagem some ao recarregar o post no dashboard | Conteúdo salvo no banco (campo HTML com `<img src="...">`); `LoadInitialContentPlugin` e `importDOM` do `ImageNode`. |
| Imagem não aparece na página pública do blog | `PostContent` e `transformImageUrls`; `/api/image-proxy`; CORS/mixed content no Supabase. |

---

## 4. Conclusão da análise estática

- O fluxo **abertura do diálogo → upload (signed URL ou FormData) → onInsert → INSERT_IMAGE_COMMAND → ImageNode** está implementado e coerente.
- A persistência do conteúdo em HTML e a exibição no frontend com sanitização e proxy de imagens estão alinhadas com o uso de imagens no conteúdo dos posts.

Recomenda-se executar o **checklist manual (secção 2)** com um usuário logado e, se possível, com Supabase configurado e bucket `media` criado, para validar ponta a ponta o comportamento do editor ao subir imagens no conteúdo dos posts.
