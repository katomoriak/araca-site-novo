import type { CollectionConfig } from 'payload'

/**
 * Collection para logs de auditoria de segurança.
 * Registra eventos importantes para análise e compliance.
 */
export const AuditLogs: CollectionConfig = {
  slug: 'audit_logs',
  labels: {
    singular: { en: 'Audit Log', pt: 'Log de Auditoria' },
    plural: { en: 'Audit Logs', pt: 'Logs de Auditoria' },
  },
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'userId', 'ip', 'createdAt'],
    group: { en: 'System', pt: 'Sistema' },
    description: {
      en: 'Security audit logs for monitoring and compliance',
      pt: 'Logs de auditoria de segurança para monitoramento e compliance',
    },
  },
  access: {
    // Apenas admins podem ler logs
    read: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // Sistema pode criar (overrideAccess será usado)
    create: () => true,
    // Logs são imutáveis
    update: () => false,
    delete: ({ req: { user } }) => {
      if (!user) return false
      // Apenas admins podem deletar (para limpeza de logs antigos)
      return user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'event',
      type: 'select',
      required: true,
      label: { en: 'Event Type', pt: 'Tipo de Evento' },
      options: [
        {
          label: { en: 'Login Success', pt: 'Login Bem-sucedido' },
          value: 'login_success',
        },
        {
          label: { en: 'Login Failed', pt: 'Login Falhou' },
          value: 'login_failed',
        },
        {
          label: { en: 'Logout', pt: 'Logout' },
          value: 'logout',
        },
        {
          label: { en: 'Access Denied', pt: 'Acesso Negado' },
          value: 'access_denied',
        },
        {
          label: { en: 'Data Created', pt: 'Dados Criados' },
          value: 'data_created',
        },
        {
          label: { en: 'Data Updated', pt: 'Dados Atualizados' },
          value: 'data_updated',
        },
        {
          label: { en: 'Data Deleted', pt: 'Dados Deletados' },
          value: 'data_deleted',
        },
        {
          label: { en: 'Rate Limit Exceeded', pt: 'Limite de Taxa Excedido' },
          value: 'rate_limit_exceeded',
        },
        {
          label: { en: 'Validation Error', pt: 'Erro de Validação' },
          value: 'validation_error',
        },
        {
          label: { en: 'Security Alert', pt: 'Alerta de Segurança' },
          value: 'security_alert',
        },
      ],
      admin: {
        description: {
          en: 'Type of security event',
          pt: 'Tipo de evento de segurança',
        },
      },
    },
    {
      name: 'userId',
      type: 'text',
      label: { en: 'User ID', pt: 'ID do Usuário' },
      admin: {
        description: {
          en: 'ID of the user who triggered the event (if authenticated)',
          pt: 'ID do usuário que disparou o evento (se autenticado)',
        },
      },
    },
    {
      name: 'userEmail',
      type: 'email',
      label: { en: 'User Email', pt: 'Email do Usuário' },
      admin: {
        description: {
          en: 'Email of the user (for easier identification)',
          pt: 'Email do usuário (para identificação mais fácil)',
        },
      },
    },
    {
      name: 'ip',
      type: 'text',
      label: { en: 'IP Address', pt: 'Endereço IP' },
      admin: {
        description: {
          en: 'IP address of the client',
          pt: 'Endereço IP do cliente',
        },
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: { en: 'User Agent', pt: 'User Agent' },
      admin: {
        description: {
          en: 'Browser/client user agent',
          pt: 'User agent do navegador/cliente',
        },
      },
    },
    {
      name: 'resource',
      type: 'text',
      label: { en: 'Resource', pt: 'Recurso' },
      admin: {
        description: {
          en: 'Resource being accessed (e.g., collection name, API route)',
          pt: 'Recurso sendo acessado (ex: nome da collection, rota da API)',
        },
      },
    },
    {
      name: 'resourceId',
      type: 'text',
      label: { en: 'Resource ID', pt: 'ID do Recurso' },
      admin: {
        description: {
          en: 'ID of the specific resource (if applicable)',
          pt: 'ID do recurso específico (se aplicável)',
        },
      },
    },
    {
      name: 'action',
      type: 'text',
      label: { en: 'Action', pt: 'Ação' },
      admin: {
        description: {
          en: 'Specific action performed (create, read, update, delete)',
          pt: 'Ação específica realizada (criar, ler, atualizar, deletar)',
        },
      },
    },
    {
      name: 'success',
      type: 'checkbox',
      label: { en: 'Success', pt: 'Sucesso' },
      defaultValue: true,
      admin: {
        description: {
          en: 'Whether the action was successful',
          pt: 'Se a ação foi bem-sucedida',
        },
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: { en: 'Message', pt: 'Mensagem' },
      admin: {
        description: {
          en: 'Additional details about the event',
          pt: 'Detalhes adicionais sobre o evento',
        },
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: { en: 'Metadata', pt: 'Metadados' },
      admin: {
        description: {
          en: 'Additional structured data (JSON)',
          pt: 'Dados estruturados adicionais (JSON)',
        },
      },
    },
  ],
  timestamps: true,
}
