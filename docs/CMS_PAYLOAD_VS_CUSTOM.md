# Payload CMS: problemas atuais e opções (corrigir vs CMS do zero)

## Situação atual

1. **Projeto lento** – Payload 3 + Lexical + Postgres + Next carregam muito na primeira requisição do `/admin`; em dev a compilação on-demand piora.
2. **Tudo no seu DB** – Dados e mídia (se não usar S3/Blob) ficam no Postgres; você sente que um sistema enxuto poderia ser tão eficiente.
3. **CRÍTICO: interface bugada** – Campos e labels não exibem corretamente ao preencher (ficam vazios), e após tentativas de correção a interface piorou.

---

## Diagnóstico dos campos/labels vazios

Possíveis causas (podem coexistir):

### A) Componentes customizados + importMap

- Você usa **CategorySelectField** e **ArrayRowLabel** registrados no `importMap.js`.
- No Payload 3 há [bugs conhecidos](https://github.com/payloadcms/payload/discussions/6154) com labels em campos custom e com `admin.components` vazios em runtime.
- Se o componente quebra ou não recebe `path`/`value` corretos, o slot pode renderizar vazio.

**Teste rápido:** usar temporariamente o select **padrão** do Payload (sem `admin.components.Field`) em `category` e `status` em `payload/collections/Posts.ts`. Se os valores e labels voltarem a aparecer, o problema está nos custom components ou no importMap.

### B) CSS (custom.scss)

- O `custom.scss` do admin é bem agressivo (muitos `!important`, seletores amplos como `[class*='field']`, `[class*='input']`).
- Se algum elemento que contém o **valor** ou o **label** receber `color` igual ao fundo, ou `opacity: 0`, ou `font-size: 0`, tudo some.
- Payload 3 pode usar classes diferentes (ex.: `field_type` em vez de `field-type`); um seletor genérico pode acertar o elemento errado.

**Teste rápido:** comentar ou renomear temporariamente o `custom.scss` no layout do Payload (em `app/(payload)/layout.tsx`) e recarregar o admin. Se os campos/labels aparecerem, o problema é CSS.

### C) Rich Text (Lexical) + RSC

- O campo `content` usa Lexical (RSC). Problemas de hidratação ou de versão podem fazer o bloco do editor aparecer vazio mesmo com dados salvos.
- Isso não explica sozinho labels vazios em **todos** os campos, mas pode contribuir para a sensação de “tudo bugado”.

### D) Relationship (autor)

- O campo `author` usa o Relationship nativo. Os hooks em `Posts.ts` normalizam `author` para `{ relationTo, value }` no `afterRead` e para `id` no `beforeValidate`.
- Se a API ou o componente Relationship não receberem esse formato, o valor selecionado pode não ser resolvido e o campo aparece vazio.

---

## Caminho 1: Corrigir e manter o Payload

Ordem sugerida:

1. **Remover custom Field de category e status** (só para teste) em `payload/collections/Posts.ts`:
   - Em `category` e `status`, apagar o bloco `admin.components: { Field: '...' }`.
   - Rodar o admin e ver se os valores/labels aparecem. Se sim, o próximo passo é ajustar o CategorySelectField/importMap ou esperar correções do Payload.

2. **Isolar o CSS do admin**:
   - Comentar a importação de `custom.scss` no layout do Payload.
   - Se a interface voltar ao normal, ir reativando partes do SCSS em blocos (ex.: só variáveis, depois só botões, depois só inputs) até achar a regra que esconde texto.

3. **Simplificar o tema**:
   - Manter só variáveis de cor e tipografia e evitar sobrescrever elementos internos do Payload (evitar seletores muito genéricos em inputs/labels).

4. **Performance**:
   - Manter `getCollections()` lazy (já está).
   - Considerar `next dev --turbopack` quando estável.
   - Em produção, o build já compila tudo; o maior custo costuma ser a primeira carga do admin.

Se depois disso os campos padrão funcionarem e você quiser manter os custom, vale acompanhar [payloadcms/payload](https://github.com/payloadcms/payload) (issues sobre labels, custom components, Rich Text).

---

## Caminho 2: CMS “do zero” (mais enxuto)

Você já tem:

- Next (App Router)
- Postgres (Supabase)
- Modelo de dados: Posts, Media, Users, Subscribers

Um CMS mínimo poderia ser:

- **API:** rotas em `app/api/` (ou Route Handlers) para CRUD de posts, mídia, usuários, inscritos.
- **Banco:** mesmo Postgres; tabelas simples (posts, media, users, subscribers) com apenas os campos que você usa.
- **Admin:** uma ou mais páginas em `/admin` (protegidas por auth) com formulários React (ou server-rendered) que chamam essa API. Sem Lexical: textarea ou editor simples (ex.: Markdown) já reduz complexidade e bundle.
- **Upload:** endpoint que grava arquivos no Supabase Storage (ou Vercel Blob) e guarda só a URL no DB.

Vantagens: controle total, menos dependências, admin leve, mesmo DB. Desvantagens: você implementa auth do admin, validação, listagens e filtros; sem UI pronta de CMS (você desenha telas e campos).

Se quiser seguir esse caminho, o próximo passo é listar exatamente quais campos cada coleção precisa e desenhar as tabelas e os endpoints.

---

## Resumo

| Problema        | Curto prazo (manter Payload)                    | Alternativa (CMS do zero)     |
|----------------|--------------------------------------------------|-------------------------------|
| Campos vazios  | Testar sem custom Field; isolar/afrouxar CSS    | Não se aplica                 |
| Lentidão       | Turbopack quando estável; aceitar custo do admin| Admin leve, sem Lexical       |
| Tudo no DB     | Já usa S3/Vercel Blob para mídia; Postgres é normal para CMS | Mesmo Postgres, esquema mínimo |

Recomendação: fazer primeiro os **testes de diagnóstico** (sem custom Field, sem custom.scss) para confirmar se o problema é Payload + customizações. Se mesmo assim a experiência continuar ruim, aí vale avaliar o CMS mínimo com a mesma stack (Next + Postgres).
