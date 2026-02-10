#!/bin/bash
# Gera valores seguros para o .env do Supabase (rode no servidor, dentro ou fora da pasta docker/)

echo "# Cole estas linhas no seu .env (substitua as atuais):"
echo ""

# POSTGRES_PASSWORD
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')"
echo ""

# JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# ANON_KEY e SERVICE_ROLE_KEY (gerados com Node via Docker, usando o JWT_SECRET acima)
docker run --rm -e JWT_SECRET="$JWT_SECRET" node:20-alpine node -e "
const crypto = require('crypto');
const secret = process.env.JWT_SECRET;
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const sig = (data) => crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const h = b64({alg:'HS256',typ:'JWT'});
const pAnon = b64({role:'anon',iss:'supabase-demo',iat:1641769200,exp:1799535600});
const pSvc = b64({role:'service_role',iss:'supabase-demo',iat:1641769200,exp:1799535600});
console.log('ANON_KEY=' + h + '.' + pAnon + '.' + sig(h + '.' + pAnon));
console.log('SERVICE_ROLE_KEY=' + h + '.' + pSvc + '.' + sig(h + '.' + pSvc));
"
echo ""

# VAULT_ENC_KEY (32 caracteres)
echo "VAULT_ENC_KEY=$(openssl rand -hex 16 | tr -d '\n')"
echo ""

# SECRET_KEY_BASE (usado pelo Studio/analytics)
echo "SECRET_KEY_BASE=$(openssl rand -base64 48 | tr -d '\n')"
echo ""

# LOGFLARE tokens (para analytics)
echo "LOGFLARE_PUBLIC_ACCESS_TOKEN=$(openssl rand -hex 24 | tr -d '\n')"
echo "LOGFLARE_PRIVATE_ACCESS_TOKEN=$(openssl rand -hex 24 | tr -d '\n')"
echo ""

echo "# Defina você mesmo (exemplos):"
echo "DASHBOARD_USERNAME=supabase"
echo "DASHBOARD_PASSWORD=escolha-uma-senha-forte-aqui"
echo "POOLER_TENANT_ID=tenant-default"
