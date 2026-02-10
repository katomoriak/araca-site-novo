# Erro: ALTER TABLE "posts_tags" ALTER COLUMN "tag" SET NOT NULL

## Causa

O Payload tenta sincronizar o schema com o Postgres e definir a coluna `posts_tags.tag` como `NOT NULL` (porque o campo `tag` está com `required: true` na collection Posts). O Postgres só aceita isso se **não existir nenhuma linha com `tag` NULL**. Se já existirem linhas com `tag` NULL (por exemplo, de uma migração antiga ou dados importados), o `ALTER TABLE` falha.

Esse erro **não foi causado** pelas alterações no campo Autor ou no CSS do admin; é um problema de dados existentes na tabela `posts_tags`.

## Solução (uma vez)

Execute o SQL abaixo no banco que você usa (Supabase: **SQL Editor**; local: `psql` ou cliente de sua preferência), usando a mesma `DATABASE_URL` do projeto.

```sql
-- Corrige linhas onde tag está NULL (atribui um placeholder para permitir NOT NULL)
UPDATE posts_tags
SET tag = COALESCE(NULLIF(trim(tag), ''), '(vazio)')
WHERE tag IS NULL OR trim(tag) = '';
```

Depois:

1. Reinicie o servidor de desenvolvimento (`npm run dev`) ou faça um novo deploy.
2. O Payload deve conseguir aplicar o schema (incluindo `ALTER COLUMN "tag" SET NOT NULL`) na próxima subida.

## Evitar no futuro

- Ao criar ou editar posts, preencha sempre o nome da tag em cada item do array de tags.
- Se fizer importação em massa, garanta que nenhum item em `tags` fique com `tag` vazio ou null.
