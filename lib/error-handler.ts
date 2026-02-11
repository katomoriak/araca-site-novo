import { NextResponse } from 'next/server'

/**
 * Tipos de erro para categorização e logging
 */
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  DATABASE = 'database',
  EXTERNAL_API = 'external_api',
  INTERNAL = 'internal',
}

/**
 * Interface para detalhes do erro (apenas para logging interno)
 */
interface ErrorDetails {
  type: ErrorType
  message: string
  context?: string
  userId?: string
  ip?: string
  stack?: string
  originalError?: unknown
}

/**
 * Loga erro internamente sem expor detalhes sensíveis.
 * 
 * @param details - Detalhes do erro para logging
 */
function logError(details: ErrorDetails): void {
  const timestamp = new Date().toISOString()
  
  // Log estruturado para facilitar análise
  console.error(`[${timestamp}] [${details.type}] ${details.context || 'API Error'}`, {
    message: details.message,
    userId: details.userId,
    ip: details.ip,
    // Stack trace apenas em desenvolvimento
    ...(process.env.NODE_ENV === 'development' && details.stack ? { stack: details.stack } : {}),
  })
  
  // Log do erro original apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development' && details.originalError) {
    console.error('Original error:', details.originalError)
  }
}

/**
 * Manipula erros de API de forma padronizada.
 * Loga detalhes internamente e retorna mensagem genérica ao cliente.
 * 
 * @param error - Erro capturado
 * @param context - Contexto onde o erro ocorreu (ex: 'api/transactions')
 * @param type - Tipo do erro (padrão: INTERNAL)
 * @returns NextResponse com mensagem de erro apropriada
 */
export function handleApiError(
  error: unknown,
  context: string,
  type: ErrorType = ErrorType.INTERNAL
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined
  
  // Log interno detalhado
  logError({
    type,
    message: errorMessage,
    context,
    stack: errorStack,
    originalError: error,
  })
  
  // Mensagem genérica para o cliente (não expõe detalhes internos)
  return NextResponse.json(
    { error: 'Erro ao processar requisição.' },
    { status: 500 }
  )
}

/**
 * Retorna erro de validação (400 Bad Request).
 * 
 * @param message - Mensagem de erro para o cliente
 * @param errors - Array de erros detalhados (opcional)
 * @param context - Contexto para logging
 * @returns NextResponse com erro de validação
 */
export function validationError(
  message: string,
  errors?: string[],
  context?: string
): NextResponse {
  if (context) {
    logError({
      type: ErrorType.VALIDATION,
      message: `Validation failed: ${message}`,
      context,
    })
  }
  
  return NextResponse.json(
    {
      error: message,
      ...(errors && { errors }),
    },
    { status: 400 }
  )
}

/**
 * Retorna erro de autenticação (401 Unauthorized).
 * 
 * @param message - Mensagem de erro (padrão: "Não autorizado.")
 * @param context - Contexto para logging
 * @returns NextResponse com erro de autenticação
 */
export function authenticationError(
  message: string = 'Não autorizado.',
  context?: string
): NextResponse {
  if (context) {
    logError({
      type: ErrorType.AUTHENTICATION,
      message: 'Authentication failed',
      context,
    })
  }
  
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Retorna erro de autorização (403 Forbidden).
 * 
 * @param message - Mensagem de erro (padrão: "Acesso negado.")
 * @param context - Contexto para logging
 * @returns NextResponse com erro de autorização
 */
export function authorizationError(
  message: string = 'Acesso negado.',
  context?: string
): NextResponse {
  if (context) {
    logError({
      type: ErrorType.AUTHORIZATION,
      message: 'Authorization failed',
      context,
    })
  }
  
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

/**
 * Retorna erro de recurso não encontrado (404 Not Found).
 * 
 * @param message - Mensagem de erro (padrão: "Recurso não encontrado.")
 * @param context - Contexto para logging
 * @returns NextResponse com erro 404
 */
export function notFoundError(
  message: string = 'Recurso não encontrado.',
  context?: string
): NextResponse {
  if (context) {
    logError({
      type: ErrorType.NOT_FOUND,
      message: 'Resource not found',
      context,
    })
  }
  
  return NextResponse.json(
    { error: message },
    { status: 404 }
  )
}

/**
 * Retorna erro de rate limit (429 Too Many Requests).
 * 
 * @param message - Mensagem de erro
 * @param retryAfter - Segundos até poder tentar novamente
 * @param context - Contexto para logging
 * @returns NextResponse com erro de rate limit
 */
export function rateLimitError(
  message: string = 'Muitas requisições. Tente novamente em alguns instantes.',
  retryAfter: number = 60,
  context?: string
): NextResponse {
  if (context) {
    logError({
      type: ErrorType.RATE_LIMIT,
      message: 'Rate limit exceeded',
      context,
    })
  }
  
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

/**
 * Retorna resposta de sucesso padronizada.
 * 
 * @param data - Dados a retornar
 * @param status - Status HTTP (padrão: 200)
 * @returns NextResponse com dados
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Sanitiza mensagem de erro para não expor informações sensíveis.
 * Remove paths de arquivos, stack traces, e outras informações internas.
 * 
 * @param message - Mensagem de erro original
 * @returns Mensagem sanitizada
 */
export function sanitizeErrorMessage(message: string): string {
  // Remover paths de arquivos (ex: /home/user/project/file.ts)
  let sanitized = message.replace(/\/[\w\-/.]+\.(ts|js|tsx|jsx)/g, '[file]')
  
  // Remover stack traces
  sanitized = sanitized.replace(/at\s+[\w.<>]+\s+\([^)]+\)/g, '')
  
  // Remover números de linha
  sanitized = sanitized.replace(/:\d+:\d+/g, '')
  
  // Remover informações de banco de dados
  sanitized = sanitized.replace(/postgres:\/\/[^\s]+/g, '[database]')
  sanitized = sanitized.replace(/mongodb:\/\/[^\s]+/g, '[database]')
  
  return sanitized.trim()
}
