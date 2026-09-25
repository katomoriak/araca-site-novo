import { NextResponse } from 'next/server'
import { createErpLead } from '@/lib/erp-supabase'
import { sendPayloadToGoogleAppsScript, resolveGoogleAppsScriptUrl } from '@/lib/gas-webhook'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cotacao-webhook
 * Recebe os dados da cotação de Projeto & Reforma:
 * 1. Dispara o Webhook do Google Apps Script (Google Sheets) via servidor (sem problemas de CORS).
 * 2. Registra o lead no ERP Aracá (Supabase) quando disponível.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null)

    if (!payload || !payload.nome || !payload.whatsapp || !payload.email) {
      return NextResponse.json(
        { ok: false, error: 'Nome, WhatsApp e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    const {
      dataHora,
      nome,
      whatsapp,
      email,
      endereco,
      tipoImovel,
      statusImovel,
      metragem,
      padrao,
      rrt,
      demolicao,
      servicos,
      ambientes,
      moradores,
      pets,
      estilo,
      estimativaProjetoMin,
      estimativaProjetoMax,
      estimativaObraMin,
      estimativaObraMax,
      totalMin,
      totalMax,
      customWebhookUrl,
    } = payload

    // 1. Webhook Google Apps Script
    const gasPayload = {
      tipo: 'calculadora_projeto',
      dataHora: dataHora || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      nome,
      whatsapp,
      email,
      endereco: endereco || 'Não informado',
      tipoImovel: tipoImovel || 'Não informado',
      statusImovel,
      metragem,
      padrao,
      rrt: rrt || 'Não informado',
      demolicao,
      servicos: Array.isArray(servicos) ? servicos : [],
      ambientes: typeof ambientes === 'object' && ambientes !== null ? ambientes : {},
      moradores: moradores || 'Não informado',
      pets: pets || 'Não informado',
      estilo,
      estimativaProjetoMin,
      estimativaProjetoMax,
      estimativaObraMin,
      estimativaObraMax,
      totalMin,
      totalMax,
    }

    const gasResult = await sendPayloadToGoogleAppsScript(gasPayload, customWebhookUrl)
    const googleSheetsOk = gasResult.success
    const googleSheetsError = gasResult.error || null

    // 2. Registro no ERP Aracá (Supabase)
    try {
      const ambientesTexto = Object.entries(ambientes || {})
        .filter(([_, q]) => Number(q) > 0)
        .map(([k, q]) => `${k} (${q})`)
        .join(', ')

      const mensagemErp = `[COTAÇÃO SITE - PROJETO & REFORMA]
Data/Hora: ${dataHora}
Nome: ${nome}
WhatsApp: ${whatsapp}
E-mail: ${email}
Endereço/Região: ${endereco || 'Não informado'}
Tipo do Imóvel: ${tipoImovel || 'Não informado'}
Status Imóvel: ${statusImovel}
Área: ${metragem} m²
Padrão: ${padrao}
Precisa de RRT: ${rrt || 'Não informado'}
Demolição: ${demolicao}
Moradores: ${moradores || 'Não informado'}
Pets: ${pets || 'Não informado'}
Intervenções: ${Array.isArray(servicos) ? servicos.join(', ') : 'Nenhuma'}
Ambientes: ${ambientesTexto || 'Nenhum'}
Estilo: ${estilo}

Estimativas Geradas:
• Projeto: R$ ${Number(estimativaProjetoMin).toLocaleString('pt-BR')} a R$ ${Number(estimativaProjetoMax).toLocaleString('pt-BR')}
• Obra Civil: R$ ${Number(estimativaObraMin).toLocaleString('pt-BR')} a R$ ${Number(estimativaObraMax).toLocaleString('pt-BR')}
• Investimento Total: R$ ${Number(totalMin).toLocaleString('pt-BR')} a R$ ${Number(totalMax).toLocaleString('pt-BR')}`

      await createErpLead({
        nome,
        email,
        telefone: whatsapp,
        tipoConsulta: `Cotação Projeto & Reforma (${padrao})`,
        mensagem: mensagemErp,
      })
    } catch (erpErr) {
      console.warn('[cotacao-webhook] Aviso ao registrar no ERP Supabase:', erpErr)
    }

    return NextResponse.json({
      ok: true,
      message: 'Cotação registrada com sucesso!',
      googleSheetsOk,
      googleSheetsError,
    })
  } catch (error: any) {
    console.error('[cotacao-webhook] Erro geral:', error)
    return NextResponse.json(
      { ok: false, error: 'Ocorreu um erro ao processar a cotação.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const url = resolveGoogleAppsScriptUrl()
  return NextResponse.json({
    status: 'online',
    service: 'Aracá Interiores Webhook Relay',
    googleAppsScriptConfigured: Boolean(url),
    targetUrl: url ? `${url.substring(0, 45)}...` : null,
  })
}
