/**
 * Lista arquivos do bucket a_public no Supabase Storage.
 * Uso: node scripts/list-supabase-storage.mjs
 * Requer .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
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

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !anonKey) {
  console.error('Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local')
  process.exit(1)
}

async function listFolder(prefix) {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/list/a_public`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefix, limit: 500 }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || JSON.stringify(data))
  return data
}

// Lista raiz do bucket para ver estrutura
const root = await listFolder('')
console.log('Raiz do bucket (primeiros itens):', JSON.stringify(root.slice(0, 5), null, 2))

const [aintima, areasocial] = await Promise.all([
  listFolder('aintima_residencianinhoverde/'),
  listFolder('areasocial_residencia-ninhoverce/'),
])

// API pode retornar array de objetos com .name ou strings
const names = (arr) => (Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x : x?.name)).filter(Boolean).sort() : [])

console.log('\n=== aintima_residencianinhoverde ===')
console.log(names(aintima).length ? names(aintima).join('\n') : '(vazio - raw: ' + JSON.stringify(aintima).slice(0, 200) + ')')
console.log('\n=== areasocial_residencia-ninhoverce ===')
console.log(names(areasocial).length ? names(areasocial).join('\n') : '(vazio - raw: ' + JSON.stringify(areasocial).slice(0, 200) + ')')
