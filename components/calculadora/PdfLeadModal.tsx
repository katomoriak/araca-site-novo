'use client'

import { useState } from 'react'
import {
  SimulationResult,
  SimulationState,
  formatCurrencyBRL,
  getWhatsAppSimulationUrl,
} from '@/lib/calculator-config'
import { generateSimulationPdf } from '@/lib/generate-simulation-pdf'
import {
  X,
  FileDown,
  CheckCircle2,
  MessageCircle,
  Loader2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react'

interface PdfLeadModalProps {
  isOpen: boolean
  onClose: () => void
  simulationState: SimulationState
  result: SimulationResult
}

export function PdfLeadModal({
  isOpen,
  onClose,
  simulationState,
  result,
}: PdfLeadModalProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleGeneratePdf = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      if (!acceptedTerms) {
        throw new Error('É necessário confirmar a ciência de que esta simulação não constitui proposta vinculante.')
      }

      if (!nome.trim() || !email.trim() || !telefone.trim()) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.')
      }

      // 1. Envia os dados para a API (registra no Google Sheets / Apps Script e CRM)
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        origem: 'Download de PDF com Estimativa',
        simulationData: {
          totalArea: result.totalArea,
          standard: {
            id: result.standard.id,
            name: result.standard.name,
          },
          costPerM2: result.costPerM2,
          minCost: result.minCost,
          maxCost: result.maxCost,
          averageCost: result.averageCost,
          minCostFormatted: formatCurrencyBRL(result.minCost),
          maxCostFormatted: formatCurrencyBRL(result.maxCost),
          averageCostFormatted: formatCurrencyBRL(result.averageCost),
          breakdown: result.breakdown,
          services: result.activeServices.map((s) => s.label),
          mode: simulationState.mode,
        },
      }

      // Fazemos o POST para nossa rota com timeout
      try {
        await fetch('/api/calculadora-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch (errApi) {
        console.warn('Registro de lead concluído com aviso de rede, gerando PDF localmente...', errApi)
      }

      // 2. Gera o PDF em client-side e faz o download instantâneo
      generateSimulationPdf(simulationState, result, {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
      })

      setSuccess(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao gerar seu PDF. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAgain = () => {
    generateSimulationPdf(simulationState, result, {
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
    })
  }

  const whatsappUrl = getWhatsAppSimulationUrl(simulationState, result, nome)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--araca-creme)] border border-[var(--araca-bege-medio)] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 bg-white/80 border-b border-[var(--araca-bege-medio)]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--araca-laranja-queimado)]/10 text-[var(--araca-laranja-queimado)] flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl text-[var(--araca-cafe-escuro)] font-medium">
                Gerar Relatório em PDF
              </h3>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
                Receba o resumo completo com valores e breakdown por disciplina
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--araca-creme)] hover:bg-[var(--araca-bege-medio)]/50 text-[var(--araca-cafe-escuro)] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo / Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="space-y-5 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display text-2xl text-[var(--araca-cafe-escuro)] font-medium mb-1">
                  Download Concluído!
                </h4>
                <p className="text-sm text-[var(--araca-chocolate-amargo)]/80 leading-relaxed max-w-sm mx-auto">
                  O documento em PDF foi gerado e baixado no seu dispositivo. Caso o download não tenha iniciado, clique no botão abaixo.
                </p>
              </div>

              {/* Box de Reforço do Aviso Técnico */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Aviso Importante:</span>
                </div>
                <p>
                  Os valores do relatório são médias paramétricas de referência. Para um orçamento 100% preciso e executivo sem surpresas na obra, o próximo passo é elaborar o <strong>Projeto de Design de Interiores</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadAgain}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--araca-bege-medio)] hover:bg-white text-xs font-semibold text-[var(--araca-cafe-escuro)] transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Baixar o PDF Novamente</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Falar com Nossos Designers de Interiores no WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGeneratePdf} className="space-y-4">
              {/* Resumo da Simulação */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[var(--araca-chocolate-amargo)]/70 block">Estimativa Média:</span>
                  <span className="font-bold text-sm text-[var(--araca-cafe-escuro)]">
                    {formatCurrencyBRL(result.averageCost)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[var(--araca-chocolate-amargo)]/70 block">Área & Padrão:</span>
                  <span className="font-medium text-[var(--araca-cafe-escuro)]">
                    {result.totalArea} m² • {result.standard.name}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Campo Nome */}
              <div>
                <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Mariana Silva"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[var(--araca-bege-medio)] text-sm text-[var(--araca-cafe-escuro)] placeholder:text-[var(--araca-chocolate-amargo)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                  />
                </div>
              </div>

              {/* Campo E-mail */}
              <div>
                <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                  Seu E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mariana@exemplo.com.br"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[var(--araca-bege-medio)] text-sm text-[var(--araca-cafe-escuro)] placeholder:text-[var(--araca-chocolate-amargo)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                  />
                </div>
              </div>

              {/* Campo Telefone */}
              <div>
                <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                  Telefone / WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[var(--araca-bege-medio)] text-sm text-[var(--araca-cafe-escuro)] placeholder:text-[var(--araca-chocolate-amargo)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                  />
                </div>
              </div>

              {/* Termo e Alerta Técnico de Não Vinculação */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Aviso Legal de Estimativa Preliminar (Não Vinculante)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Os valores apresentados constituem uma <strong>simulação preliminar meramente informativa</strong>, baseada em médias genéricas de mercado de São Paulo e Grande ABC, não representando proposta comercial vinculante, orçamento executivo ou garantia de preço. A Aracá Interiores atua em design de interiores e decoração, viabilizando ART/RRT para condomínio em parceria com engenheiros e arquitetos credenciados.
                </p>
              </div>

              {/* Checkbox de Aceite Obrigatório */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[var(--araca-bege-medio)]/80 hover:border-[var(--araca-mineral-green)] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[var(--araca-bege-medio)] text-[var(--araca-mineral-green)] focus:ring-[var(--araca-mineral-green)] cursor-pointer shrink-0 accent-[var(--araca-mineral-green)]"
                />
                <span className="text-xs text-[var(--araca-cafe-escuro)] leading-snug">
                  Compreendo e aceito que esta ferramenta fornece apenas uma <strong>estimativa indicativa preliminar</strong> e não substitui um orçamento técnico formal nem constitui proposta comercial vinculante.
                </span>
              </label>

              {/* Proteção de Dados LGPD */}
              <div className="flex items-start gap-2 text-[11px] text-[var(--araca-chocolate-amargo)]/70 px-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  Seus dados estão protegidos nos termos da <strong>LGPD (Lei nº 13.709/2018)</strong> exclusivamente para envio da estimativa técnica e contato de nossos designers de interiores.{' '}
                  <a href="/politica-privacidade" target="_blank" className="underline hover:text-[var(--araca-cafe-escuro)]">
                    Política de Privacidade
                  </a>.
                </p>
              </div>

              {/* Botão de Submissão */}
              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-sm transition-all duration-200 shadow-md shadow-[var(--araca-mineral-green)]/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando e gerando PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Baixar Estimativa em PDF Agora</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
