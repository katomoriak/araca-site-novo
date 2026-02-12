/**
 * Gera template de .env para Supabase e abre os links do Dashboard para copiar as chaves.
 * Uso: node scripts/setup-supabase-env.mjs [--write]
 *
 * Se já tiver NEXT_PUBLIC_SUPABASE_URL no .env.local, usa o project ref para montar os links.
 * --write: grava o template em .env.supabase.template (copie para .env.local e preencha).
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv(path = '.env.local') {
  try {
    const envPath = resolve(process.cwd(), path)
    const content = readFileSync(envPath, 'utf-8')
    const env = {}
    for (const line of content.split(/\r?\n/)) {
      const idx = line.indexOf('=')
      if (idx <= 0 || line.startsWith('#')) continue
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1)
      env[key] = val
    }
    return env
  } catch {
    return {}
  }
}

const env = loadEnv('.env.local') || loadEnv('.env')
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || ''
const projectRef = supabaseUrl.match(/https:\/\/([a-z]+)\.supabase\.co/)?.[1] || null

const base = 'https://supabase.com/dashboard'
const linkApi = projectRef ? `${base}/project/${projectRef}/settings/api` : `${base}/projects`
const linkDb = projectRef ? `${base}/project/${projectRef}/settings/database` : `${base}/projects`
const linkStorage = projectRef ? `${base}/project/${projectRef}/storage/buckets` : `${base}/projects`

const template = `# Cole aqui os valores do Supabase (não commitar este arquivo)
# Onde copiar: Dashboard do projeto → Settings → API / Database

# 1) Settings → API: Project URL
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl || 'https://SEU_PROJECT_REF.supabase.co'}

# 2) Settings → API: anon / publishable key (opcional; só para scripts)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 3) Settings → API: service_role key (secret) — obrigatório para uploads
SUPABASE_SERVICE_ROLE_KEY=

# 4) Bucket da galeria de projetos (default: a_public)
NEXT_PUBLIC_SUPABASE_PROJETOS_BUCKET=a_public

# 5) Settings → Database: Connection string (Session mode, porta 6543)
DATABASE_URL=

# 6) Payload CMS (gere uma string de 32+ caracteres)
PAYLOAD_SECRET=

# Opcional: Storage S3 (Settings → Storage → S3) ou Vercel Blob
# S3_ENDPOINT=
# S3_ACCESS_KEY_ID=
# S3_SECRET_ACCESS_KEY=
# S3_BUCKET=media
# S3_REGION=auto
# BLOB_READ_WRITE_TOKEN=
`

const doWrite = process.argv.includes('--write')

console.log('')
console.log('=== Links do Supabase Dashboard (copie as chaves daqui) ===')
console.log('')
console.log('  API (URL, anon key, service_role key):')
console.log('  ' + linkApi)
console.log('')
console.log('  Database (connection string):')
console.log('  ' + linkDb)
console.log('')
console.log('  Storage (buckets a_public e media):')
console.log('  ' + linkStorage)
console.log('')

if (doWrite) {
  const outPath = resolve(process.cwd(), '.env.supabase.template')
  writeFileSync(outPath, template, 'utf-8')
  console.log('Template gravado em .env.supabase.template')
  console.log('Copie o conteúdo para .env.local e preencha os valores.')
  console.log('')
} else {
  console.log('=== Template para .env.local (copie e preencha) ===')
  console.log('')
  console.log(template)
  console.log('Dica: use --write para gravar o template em .env.supabase.template')
  console.log('')
}
