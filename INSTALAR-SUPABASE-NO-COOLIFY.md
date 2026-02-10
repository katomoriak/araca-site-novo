# Instalar Supabase no Coolify – passo a passo

Siga na ordem. O Supabase vai usar a **porta 8001** para não conflitar com o Coolify (8000).

---

## 1. Criar um projeto (se ainda não tiver)

- No Coolify, no menu lateral, clique em **Projects** / **Projetos**.
- Clique em **+ New Project** / **Novo projeto**.
- Nome: por exemplo **Supabase** → salve.

---

## 2. Adicionar um novo recurso (Resource)

- Entre no projeto que você criou (ex.: **Supabase**).
- Clique em **+ Add Resource** / **+ Novo recurso** / **Create new resource**.

---

## 3. Escolher a fonte: repositório público

- Onde pedir **fonte** ou **source**, escolha **Public Repository** / **Repositório público** (o Supabase no GitHub é público).
- **URL do repositório** (cole exatamente):
  ```
  https://github.com/supabase/supabase
  ```
- **Branch:** deixe **main** ou **master** (o que aparecer).
- Avance (Next / Continuar).

---

## 4. Escolher Docker Compose

- Onde pedir **Build Pack** / **Tipo de build**, **não** deixe Nixpacks.
- Selecione **Docker Compose** no menu.

---

## 5. Onde está o docker-compose

- **Base Directory** / **Pasta base:** use **`docker`**  
  (ou, se o Coolify pedir só “caminho do compose”, use **`docker-compose.yml`** com base em **`docker`**).
- **Docker Compose Location** / **Caminho do docker-compose:**  
  - Se for um único campo de “path”: **`docker-compose.yml`** (com Base Directory = **`docker`**),  
  - ou **`docker/docker-compose.yml`** (se a base for a raiz do repo).

Ou seja: o Coolify precisa usar o arquivo **docker/docker-compose.yml** do repositório. Ajuste Base Directory e o path do compose para que apontem para esse arquivo.

Avance.

---

## 6. Variáveis de ambiente (Environment Variables)

Procure a seção **Environment Variables** / **Variáveis de ambiente** e adicione as variáveis abaixo.  
(Pode ser um campo de texto “env” ou vários campos nome/valor.)

**Cole ou preencha uma por uma:**

```env
Error

Cloning into '.'...
warning: Could not find remote branch main to clone.
fatal: Remote branch main not found in upstream origin
```

**Importante:**  
- As chaves `ANON_KEY` e `SERVICE_ROLE_KEY` acima são de **exemplo/demo**. Para produção, troque `POSTGRES_PASSWORD`, `JWT_SECRET`, `DASHBOARD_PASSWORD` e gere novas chaves (veja documentação do Supabase self-hosted).  
- Se o Coolify aceitar só “nome” e “valor”, crie uma linha para cada variável (ex.: nome `KONG_HTTP_PORT`, valor `8001`).

---

## 7. Deploy

- Clique em **Deploy** / **Start** / **Save & Deploy**.
- O Coolify vai clonar o repositório, montar o compose e subir os containers. Pode levar vários minutos na primeira vez.

---

## 8. Acessar o Supabase

- **API / Studio:** abra no navegador: **http://76.13.236.240:8001**
- **Login do Studio:** usuário **supabase** e a senha que você colocou em **DASHBOARD_PASSWORD** (ex.: `senha-super-segura-dashboard-123`).

No Studio você cria tabelas, Auth, Storage, etc. O site (araca-site-novo) pode usar:

- **URL:** `http://76.13.236.240:8001`  
- **Anon key:** o valor que você colocou em **ANON_KEY**  
- **Service role key:** o valor de **SERVICE_ROLE_KEY** (só no backend, nunca no frontend).

---

## Resumo

| Passo | O quê |
|-------|--------|
| 1 | Projeto novo (ex.: Supabase) |
| 2 | Add Resource no projeto |
| 3 | Repo: `https://github.com/supabase/supabase` |
| 4 | Build pack: **Docker Compose** |
| 5 | Base: `docker`, compose: `docker-compose.yml` (ou path que aponte para esse arquivo) |
| 6 | Colar variáveis de ambiente (porta 8001, senhas, URLs) |
| 7 | Deploy |
| 8 | Acessar **http://76.13.236.240:8001** e fazer login no Studio |

Se em algum passo o Coolify mostrar nomes diferentes (em inglês), use este guia como referência e escolha a opção que for “repositório” → “Docker Compose” → “variáveis de ambiente” → “deploy”.
