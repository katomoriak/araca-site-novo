/**
 * Rate Limiting em Memória (Simples)
 * 
 * Implementação básica de rate limiting usando Map em memória.
 * Adequado para aplicações serverless com tráfego moderado.
 * 
 * Limitações:
 * - Estado não compartilhado entre múltiplas instâncias/workers
 * - Memória perdida ao reiniciar a aplicação
 * - Para aplicações com muito tráfego ou múltiplas instâncias, considere Redis (Upstash)
 */

interface RateLimitEntry {
  timestamps: number[]
}

// Map para armazenar requisições por identificador (IP, email, etc.)
const requests = new Map<string, RateLimitEntry>()

// Intervalo de limpeza automática (5 minutos)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

/**
 * Verifica se um identificador excedeu o limite de requisições.
 * 
 * @param identifier - Identificador único (IP, email, user ID, etc.)
 * @param maxRequests - Número máximo de requisições permitidas
 * @param windowMs - Janela de tempo em milissegundos (padrão: 60000 = 1 minuto)
 * @returns Objeto com sucesso (se permitido) e informações adicionais
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): {
  success: boolean
  remaining: number
  resetAt?: Date
} {
  const now = Date.now()
  
  // Obter ou criar entrada para este identificador
  let entry = requests.get(identifier)
  if (!entry) {
    entry = { timestamps: [] }
    requests.set(identifier, entry)
  }
  
  // Filtrar apenas timestamps dentro da janela de tempo
  const recentTimestamps = entry.timestamps.filter(t => now - t < windowMs)
  
  // Verificar se excedeu o limite
  if (recentTimestamps.length >= maxRequests) {
    // Calcular quando o limite será resetado (timestamp mais antigo + janela)
    const oldestTimestamp = Math.min(...recentTimestamps)
    const resetAt = new Date(oldestTimestamp + windowMs)
    
    return {
      success: false,
      remaining: 0,
      resetAt,
    }
  }
  
  // Adicionar timestamp atual
  recentTimestamps.push(now)
  entry.timestamps = recentTimestamps
  
  // Limpeza periódica (executar a cada CLEANUP_INTERVAL)
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupOldEntries(windowMs)
    lastCleanup = now
  }
  
  return {
    success: true,
    remaining: maxRequests - recentTimestamps.length,
  }
}

/**
 * Remove entradas antigas do Map para liberar memória.
 * Chamado automaticamente pelo checkRateLimit periodicamente.
 * 
 * @param windowMs - Janela de tempo considerada "recente"
 */
function cleanupOldEntries(windowMs: number): void {
  const now = Date.now()
  let cleanedCount = 0
  
  for (const [key, entry] of requests.entries()) {
    // Filtrar timestamps recentes
    const recentTimestamps = entry.timestamps.filter(t => now - t < windowMs)
    
    if (recentTimestamps.length === 0) {
      // Nenhum timestamp recente - remover entrada
      requests.delete(key)
      cleanedCount++
    } else {
      // Atualizar com apenas timestamps recentes
      entry.timestamps = recentTimestamps
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`[rate-limit] Limpeza: ${cleanedCount} entradas removidas`)
  }
}

/**
 * Obtém o identificador do cliente da requisição (IP).
 * Tenta extrair o IP real de headers de proxy (x-forwarded-for, x-real-ip).
 * 
 * @param request - Request do Next.js
 * @returns IP do cliente ou 'anonymous' se não disponível
 */
export function getClientIdentifier(request: Request): string {
  // Tentar obter IP de headers de proxy (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for pode conter múltiplos IPs separados por vírgula
    // O primeiro é o IP original do cliente
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  
  // Fallback para 'anonymous' se não conseguir determinar IP
  return 'anonymous'
}

/**
 * Limpa manualmente todas as entradas de rate limiting.
 * Útil para testes ou reset manual.
 */
export function clearRateLimits(): void {
  requests.clear()
  console.log('[rate-limit] Todas as entradas foram limpas')
}

/**
 * Obtém estatísticas do rate limiter (para debug/monitoramento).
 * 
 * @returns Objeto com total de identificadores rastreados
 */
export function getRateLimitStats(): {
  totalIdentifiers: number
  entries: Array<{ identifier: string; requestCount: number }>
} {
  const entries = Array.from(requests.entries()).map(([identifier, entry]) => ({
    identifier,
    requestCount: entry.timestamps.length,
  }))
  
  return {
    totalIdentifiers: requests.size,
    entries,
  }
}
