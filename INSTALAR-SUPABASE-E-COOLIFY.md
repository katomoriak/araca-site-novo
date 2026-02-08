# Instalar Supabase + Coolify no mesmo VPS

## Dá para instalar os dois?

**Sim.** Os dois rodam no mesmo servidor (IP: `76.13.236.240`). Só é preciso evitar conflito de porta:

- **Coolify** usa a porta **8000** (painel na web).
- **Supabase** também costuma usar a **8000** para a API.
- Solução: deixar o Coolify na **8000** e o Supabase na **8001** (e 8444 para HTTPS).

Seu VPS tem **8 GB de RAM** e **2 CPUs**. É suficiente para os dois, mas o uso de memória fica mais alto; para desenvolvimento e uso pequeno costuma ser tranquilo.

---

## Ordem recomendada

1. **Coolify** primeiro (painel para gerenciar tudo).
2. **Supabase** depois (pode ser manual por SSH ou como “projeto” no Coolify).

Assim você usa o Coolify para ver e gerenciar o Supabase e outros projetos no futuro.

---

# Parte 1: Instalar o Coolify

Faça tudo isso **depois de já estar conectado no VPS por SSH** (como no guia `COMO-ACESSAR-O-VPS.md`).

### 1. Conectar no VPS

No PowerShell do Windows:

```bash
ssh root@76.13.236.240
```

Digite a senha quando pedir. Quando aparecer algo como `root@srv1346098:~#`, você está dentro do servidor.

### 2. Instalar o Coolify (um comando)

Copie e cole este comando no terminal (e pressione Enter):

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

O script vai:

- Verificar/instalar o que for preciso (Docker, etc.)
- Instalar e subir o Coolify
- Demorar alguns minutos

### 3. Abrir o Coolify no navegador

Quando terminar (sem erro), abra no navegador:

```
http://76.13.236.240:8000
```

Na primeira vez o Coolify deve pedir para você criar um usuário/senha de administrador. Crie e guarde.

**Coolify está na porta 8000.** Por isso o Supabase vamos configurar para usar a **8001**.

---

# Parte 2: Instalar o Supabase

Você pode fazer de dois jeitos: **pelo Coolify** (mais visual) ou **por SSH** (mais controle). Os dois podem conviver; escolha um.

---

## Opção A: Instalar o Supabase pelo Coolify (recomendado)

Assim o Supabase vira um “projeto” dentro do Coolify e você gerencia por lá.

### 1. Entrar no Coolify

- Acesse: `http://76.13.236.240:8000`
- Faça login com o usuário que você criou.

### 2. Adicionar um novo “Docker Compose”

- No Coolify, procure algo como **“Add Resource”** / **“Novo recurso”** ou **“Docker Compose”**.
- Escolha **criar um projeto com Docker Compose** (por exemplo “Compose” ou “New Compose”).

### 3. Conectar o repositório do Supabase

- Onde pedir **fonte** ou **source**, use o repositório:
  - **Git**: `https://github.com/supabase/supabase`
- Defina o **caminho do compose** (se o Coolify pedir):
  - **Compose path:** `docker/docker-compose.yml`
- Assim o Coolify usa o `docker-compose` correto do Supabase.

### 4. Variáveis de ambiente (importante)

O Coolify deve ter um lugar para **Environment Variables** / **Variáveis de ambiente**. Crie um arquivo `.env` ou preencha as variáveis. No mínimo, ajuste estas para **não bater com a porta do Coolify** e para o seu servidor:

```env
# Portas (Supabase na 8001 para não conflitar com Coolify na 8000)
KONG_HTTP_PORT=8001
KONG_HTTPS_PORT=8444

# URLs do seu servidor (troque pelo seu IP ou domínio)
SITE_URL=http://76.13.236.240:3000
API_EXTERNAL_URL=http://76.13.236.240:8001
SUPABASE_PUBLIC_URL=http://76.13.236.240:8001

# Senhas e chaves (TROQUE por valores seguros!)
POSTGRES_PASSWORD=uma-senha-muito-forte-e-longa-aqui
JWT_SECRET=outro-texto-secreto-com-pelo-menos-32-caracteres
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=senha-forte-do-dashboard
```

Para **ANON_KEY** e **SERVICE_ROLE_KEY** o Supabase costuma ter um script ou documentação para gerar; você pode gerar e colar nessas variáveis no Coolify.

### 5. Deploy

- Salve e dê **Deploy** / **Start**. O Coolify vai clonar o repo, usar o `docker/docker-compose.yml` e subir os containers do Supabase.

Depois do deploy:

- **API Supabase:** `http://76.13.236.240:8001`
- **Studio (painel):** normalmente em `http://76.13.236.240:8001` (rota `/` ou conforme a doc do Supabase).

---

## Opção B: Instalar o Supabase por SSH (manual)

Se preferir instalar direto no servidor, sem usar o Coolify para o Supabase:

### 1. Conectar no VPS

```bash
ssh root@76.13.236.240
```

### 2. Clonar o Supabase (só a pasta docker)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/supabase/supabase
cd supabase && git sparse-checkout set docker && cd docker
```

### 3. Arquivo de configuração (.env)

```bash
cp .env.example .env
nano .env
```

No `.env`, altere pelo menos:

- `KONG_HTTP_PORT=8001` e `KONG_HTTPS_PORT=8444` (para não conflitar com Coolify na 8000).
- `SITE_URL`, `API_EXTERNAL_URL` e `SUPABASE_PUBLIC_URL` para `http://76.13.236.240:3000` e `http://76.13.236.240:8001`.
- `POSTGRES_PASSWORD`, `JWT_SECRET`, `DASHBOARD_PASSWORD` (e gerar ANON_KEY / SERVICE_ROLE_KEY conforme a doc do Supabase).

Salve no nano: **Ctrl+O**, Enter, depois **Ctrl+X** para sair.

### 4. Subir o Supabase

```bash
docker compose up -d
```

Quando terminar:

- **API:** `http://76.13.236.240:8001`
- **Studio:** normalmente em `http://76.13.236.240:8001` (login com o usuário/senha do dashboard que você colocou no `.env`).

---

## Resumo rápido

| O quê        | Porta  | URL (exemplo)                    |
|------------|--------|-----------------------------------|
| Coolify    | 8000   | http://76.13.236.240:8000        |
| Supabase   | 8001   | http://76.13.236.240:8001        |

- **Sim**, dá para instalar Supabase e Coolify no mesmo VPS.
- **Ordem:** Coolify primeiro (script de instalação), depois Supabase (pelo Coolify ou por SSH).
- **Conflito de porta:** Coolify 8000, Supabase 8001 (e 8444 para HTTPS).
- Quando estiver com os dois rodando, você pode pedir o próximo passo (por exemplo conectar o site araca-site-novo no Supabase).
