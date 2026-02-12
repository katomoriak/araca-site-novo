#!/usr/bin/env node
/**
 * Cria o primeiro usuário admin via API.
 * Requer o servidor rodando (npm run dev).
 *
 * Uso: node scripts/seed-first-user.mjs
 *
 * Variáveis de ambiente: SEED_USER_EMAIL, SEED_USER_PASSWORD, SEED_USER_NAME (opcional)
 */
const email = process.env.SEED_USER_EMAIL
const password = process.env.SEED_USER_PASSWORD
const name = process.env.SEED_USER_NAME || 'Admin'
const baseUrl = process.env.SEED_BASE_URL || 'http://localhost:3000'

if (!email || !password) {
  console.error('')
  console.error('Erro: defina SEED_USER_EMAIL e SEED_USER_PASSWORD.')
  console.error('')
  console.error('Exemplo:')
  console.error('  SEED_USER_EMAIL=admin@example.com SEED_USER_PASSWORD=suaSenha123 node scripts/seed-first-user.mjs')
  console.error('')
  process.exit(1)
}

async function main() {
  const res = await fetch(`${baseUrl}/api/seed-first-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.ok) {
    console.log('')
    console.log('✓', data.message || 'Primeiro usuário admin criado.')
    console.log('  E-mail:', data.email || email)
    console.log('')
    console.log('Faça login em /dashboard/login ou /admin')
    console.log('')
  } else {
    console.error('Erro:', data.error || res.statusText)
    if (res.status === 500) console.error(data)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Erro:', err.message)
  console.error('Certifique-se de que o servidor está rodando (npm run dev).')
  process.exit(1)
})
