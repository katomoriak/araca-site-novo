import { getPayloadClient } from './payload'

/**
 * Tipos de eventos de auditoria
 */
export type AuditEventType =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'access_denied'
  | 'data_created'
  | 'data_updated'
  | 'data_deleted'
  | 'rate_limit_exceeded'
  | 'validation_error'
  | 'security_alert'

/**
 * Interface para evento de auditoria
 */
export interface AuditEvent {
  event: AuditEventType
  userId?: string
  userEmail?: string
  ip?: string
  userAgent?: string
  resource?: string
  resourceId?: string
  action?: string
  success?: boolean
  message?: string
  metadata?: Record<string, unknown>
}

/**
 * Registra um evento de auditoria no banco de dados.
 * 
 * @param event - Dados do evento de auditoria
 * @returns Promise que resolve quando o log é criado
 * 
 * @example
 * ```typescript
 * await logAuditEvent({
 *   event: 'login_success',
 *   userId: user.id,
 *   userEmail: user.email,
 *   ip: request.headers.get('x-forwarded-for'),
 *   success: true,
 * })
 * ```
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const payload = await getPayloadClient()
    
    await payload.create({
      collection: 'audit_logs',
      data: {
        event: event.event,
        userId: event.userId,
        userEmail: event.userEmail,
        ip: event.ip,
        userAgent: event.userAgent,
        resource: event.resource,
        resourceId: event.resourceId,
        action: event.action,
        success: event.success ?? true,
        message: event.message,
        metadata: event.metadata,
      },
      // overrideAccess necessário: sistema precisa logar eventos sempre
      // independente de permissões do usuário
      overrideAccess: true,
    })
  } catch (error) {
    // Não falhar a operação principal se o log falhar
    // Apenas logar o erro internamente
    console.error('[audit-log] Falha ao registrar evento:', error)
  }
}

/**
 * Registra evento de login bem-sucedido.
 * 
 * @param userId - ID do usuário
 * @param userEmail - Email do usuário
 * @param ip - IP do cliente
 * @param userAgent - User agent do navegador
 */
export async function logLoginSuccess(
  userId: string,
  userEmail: string,
  ip?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    event: 'login_success',
    userId,
    userEmail,
    ip,
    userAgent,
    success: true,
    message: 'Usuário autenticado com sucesso',
  })
}

/**
 * Registra tentativa de login falhada.
 * 
 * @param email - Email tentado
 * @param ip - IP do cliente
 * @param userAgent - User agent do navegador
 * @param reason - Motivo da falha
 */
export async function logLoginFailed(
  email: string,
  ip?: string,
  userAgent?: string,
  reason?: string
): Promise<void> {
  await logAuditEvent({
    event: 'login_failed',
    userEmail: email,
    ip,
    userAgent,
    success: false,
    message: reason || 'Tentativa de login falhou',
  })
}

/**
 * Registra acesso negado.
 * 
 * @param resource - Recurso que foi negado acesso
 * @param userId - ID do usuário (se autenticado)
 * @param ip - IP do cliente
 * @param reason - Motivo da negação
 */
export async function logAccessDenied(
  resource: string,
  userId?: string,
  ip?: string,
  reason?: string
): Promise<void> {
  await logAuditEvent({
    event: 'access_denied',
    userId,
    ip,
    resource,
    success: false,
    message: reason || 'Acesso negado ao recurso',
  })
}

/**
 * Registra criação de dados sensíveis.
 * 
 * @param resource - Tipo de recurso criado
 * @param resourceId - ID do recurso
 * @param userId - ID do usuário
 */
export async function logDataCreated(
  resource: string,
  resourceId: string,
  userId?: string
): Promise<void> {
  await logAuditEvent({
    event: 'data_created',
    userId,
    resource,
    resourceId,
    action: 'create',
    success: true,
    message: `${resource} criado`,
  })
}

/**
 * Registra atualização de dados sensíveis.
 * 
 * @param resource - Tipo de recurso atualizado
 * @param resourceId - ID do recurso
 * @param userId - ID do usuário
 * @param changes - Campos alterados (opcional)
 */
export async function logDataUpdated(
  resource: string,
  resourceId: string,
  userId?: string,
  changes?: string[]
): Promise<void> {
  await logAuditEvent({
    event: 'data_updated',
    userId,
    resource,
    resourceId,
    action: 'update',
    success: true,
    message: `${resource} atualizado`,
    metadata: changes ? { changes } : undefined,
  })
}

/**
 * Registra deleção de dados sensíveis.
 * 
 * @param resource - Tipo de recurso deletado
 * @param resourceId - ID do recurso
 * @param userId - ID do usuário
 */
export async function logDataDeleted(
  resource: string,
  resourceId: string,
  userId?: string
): Promise<void> {
  await logAuditEvent({
    event: 'data_deleted',
    userId,
    resource,
    resourceId,
    action: 'delete',
    success: true,
    message: `${resource} deletado`,
  })
}

/**
 * Registra excesso de rate limit.
 * 
 * @param resource - Recurso que foi rate limited
 * @param ip - IP do cliente
 */
export async function logRateLimitExceeded(
  resource: string,
  ip?: string
): Promise<void> {
  await logAuditEvent({
    event: 'rate_limit_exceeded',
    ip,
    resource,
    success: false,
    message: 'Limite de requisições excedido',
  })
}

/**
 * Registra alerta de segurança.
 * 
 * @param message - Descrição do alerta
 * @param ip - IP do cliente
 * @param metadata - Dados adicionais
 */
export async function logSecurityAlert(
  message: string,
  ip?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    event: 'security_alert',
    ip,
    success: false,
    message,
    metadata,
  })
}
