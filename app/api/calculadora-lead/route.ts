import { NextResponse } from 'next/server'
import { createErpLead } from '@/lib/erp-supabase'
import { sendPayloadToGoogleAppsScript, resolveGoogleAppsScriptUrl } from '@/lib/gas-webhook'

export const dynamic = 'force-dynamic'

/**
 * POST /api/calculadora-lead
 * Registra o lead que gerou o PDF ou solicitou orçamento da Calculadora de Obra.
 * 1. Integra com o Google Apps Script / Google Sheets (quando configurado no .env).
 * 2. Cria o contato + deal no ERP da Aracá (Supabase).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const {
      nome,
      email,
      telefone,
      origem = 'Download de PDF - Calculadora Obra',
      simulationData,
    } = body

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { ok: false, error: 'Nome, e-mail e telefone são obrigatórios.' },
        { status: 400 }
      )
    }

    const dataHoraIso = new Date().toISOString()
    const dataHoraFormatada = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium',
    })

    // Monta resumo textual para mensagem do CRM
    const totalArea = simulationData?.totalArea ? `${simulationData.totalArea} m²` : 'N/D'
    const padrao = simulationData?.standard?.name || 'N/D'
    const custoMedio = simulationData?.averageCostFormatted || simulationData?.averageCost || 'N/D'
    const faixaEstimada = simulationData?.minCostFormatted && simulationData?.maxCostFormatted
      ? `${simulationData.minCostFormatted} a ${simulationData.maxCostFormatted}`
      : 'N/D'
    const servicos = Array.isArray(simulationData?.services)
      ? simulationData.services.join(', ')
      : simulationData?.services || 'Nenhum'

    const mensagemCompleta = `[LEAD CALCULADORA DE OBRA - ${origem.toUpperCase()}]
Data/Hora: ${dataHoraFormatada}
Nome: ${nome}
E-mail: ${email}
Telefone/WhatsApp: ${telefone}
Área Total: ${totalArea}
Padrão de Acabamento: ${padrao}
Investimento Médio Estimado: ${custoMedio}
Faixa Estimada: ${faixaEstimada}
Serviços Selecionados: ${servicos}`

    // 1. Envio para o Google Apps Script (Google Sheets Webhook)
    const gasPayload = {
      tipo: 'calculadora_obra',
      dataHora: dataHoraFormatada,
      timestamp: dataHoraIso,
      nome,
      email,
      telefone,
      origem,
      area: totalArea,
      padrao,
      custoMedio,
      faixaEstimada,
      servicos,
      detalhes: simulationData,
    }

    const gasResult = await sendPayloadToGoogleAppsScript(gasPayload)
    const googleSheetsSuccess = gasResult.success

    // 2. Registro no CRM / ERP Aracá (Supabase)
    try {
      await createErpLead({
        nome,
        email,
        telefone,
        tipoConsulta: `Calculadora Obra (${origem})`,
        mensagem: mensagemCompleta,
      })
    } catch (erpErr) {
      console.warn('[calculadora-lead] Aviso ao registrar no ERP Supabase:', erpErr)
    }

    return NextResponse.json({
      ok: true,
      message: 'Lead registrado com sucesso.',
      googleSheetsIntegrated: Boolean(gasResult.urlUsed),
      googleSheetsSuccess,
    })
  } catch (error: any) {
    console.error('[calculadora-lead] Erro geral:', error)
    return NextResponse.json(
      { ok: false, error: 'Ocorreu um erro ao processar seus dados.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const url = resolveGoogleAppsScriptUrl()
  return NextResponse.json({
    status: 'online',
    service: 'Aracá Interiores Calculadora Obra Webhook Relay',
    googleAppsScriptConfigured: Boolean(url),
    targetUrl: url ? `${url.substring(0, 45)}...` : null,
  })
}
