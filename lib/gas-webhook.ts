/**
 * lib/gas-webhook.ts
 * Utilitário robusto para envio de dados ao Webhook do Google Apps Script (Google Sheets).
 * Trata normalização de IDs, remoção de aspas, redirecionamentos e suporte a CORS.
 */

export function resolveGoogleAppsScriptUrl(customUrl?: string): string | null {
  const candidates = [
    process.env.GOOGLE_APPS_SCRIPT_URL,
    process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL,
    process.env.GOOGLE_SHEETS_WEBHOOK_URL,
    customUrl,
  ]

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'string') continue
    const trimmed = candidate.trim().replace(/^['"]|['"]$/g, '')
    
    // Ignora placeholders padrão
    if (trimmed.includes('SUA_URL_GOOGLE_APPS_SCRIPT_AQUI')) continue
    if (trimmed.length < 10) continue

    // Se já é uma URL completa do Google Apps Script
    if (trimmed.startsWith('https://script.google.com/macros/s/')) {
      return trimmed.endsWith('/exec') ? trimmed : `${trimmed.replace(/\/$/, '')}/exec`
    }

    // Se o usuário colou apenas o ID de implantação do Apps Script (ex: AKfycby...)
    if (trimmed.startsWith('AKfycb')) {
      return `https://script.google.com/macros/s/${trimmed}/exec`
    }
  }

  return null
}

export async function sendPayloadToGoogleAppsScript(
  payload: Record<string, any>,
  customUrl?: string
): Promise<{ success: boolean; urlUsed: string | null; error?: string }> {
  const url = resolveGoogleAppsScriptUrl(customUrl)

  if (!url) {
    console.warn('[GoogleAppsScript] Nenhuma URL válida encontrada no .env ou payload.')
    return { success: false, urlUsed: null, error: 'URL do Google Apps Script não configurada.' }
  }

  try {
    console.log('[GoogleAppsScript] Enviando payload para:', url)

    // Usamos text/plain;charset=utf-8 pois o Google Apps Script lê e.postData.contents
    // e evita bloqueios ou problemas de preflight CORS
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // Timeout seguro de 10s
    })

    const responseText = await response.text().catch(() => '')
    console.log('[GoogleAppsScript] Resposta recebida (HTTP ' + response.status + '):', responseText)

    if (response.ok || response.status === 302) {
      return { success: true, urlUsed: url }
    } else {
      return { 
        success: false, 
        urlUsed: url, 
        error: `HTTP ${response.status}: ${responseText}` 
      }
    }
  } catch (err: any) {
    console.error('[GoogleAppsScript] Falha na requisição fetch:', err)
    return { 
      success: false, 
      urlUsed: url, 
      error: err?.message || 'Falha de conexão com Google Apps Script' 
    }
  }
}
