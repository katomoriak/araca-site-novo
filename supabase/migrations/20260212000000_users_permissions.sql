-- Adiciona colunas permissions e show_as_public_author à tabela users (Payload CMS)
-- Para usuários existentes com role 'editor', popular permissions com ['blog'] para manter comportamento anterior

-- Payload postgres usa snake_case para colunas
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS show_as_public_author boolean DEFAULT false;

-- Migração: editors existentes recebem permissão blog
UPDATE users
SET permissions = '["blog"]'::jsonb
WHERE role = 'editor'
  AND (permissions IS NULL OR permissions = '[]'::jsonb);

COMMENT ON COLUMN users.permissions IS 'Array de permissões: blog, finance, crm, projetos, users';
COMMENT ON COLUMN users.show_as_public_author IS 'Se true, usuário aparece como autor nos posts e na página de perfil do blog';
