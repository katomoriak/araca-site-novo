'use client'

import { useState } from 'react'
import {
  SimulationResult,
  SimulationState,
  formatCurrencyBRL,
  getWhatsAppSimulationUrl,
} from '@/lib/calculator-config'
import {
  X,
  Send,
  CheckCircle2,
  MessageCircle,
  Loader2,
  FileSpreadsheet,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  simulationState: SimulationState
  result: SimulationResult
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  simulationState,
  result,
}: LeadCaptureModalProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [tipoImovel, setTipoImovel] = useState('Apartamento')
  const [localizacao, setLocalizacao] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const servicesList = result.activeServices
        .map((s) => {
          const detail = result.serviceDetails?.[s.id]
          if (detail && !detail.isAllRooms) {
            return `${s.label} (${detail.roomsCount} amb. • ${detail.serviceArea} m²)`
          }
          return s.label
        })
        .join(', ')

      const simulationSummary = `[SIMULAÇÃO CALCULADORA DE REFORMA]
- Área: ${result.totalArea} m²
- Padrão: ${result.standard.name}
- Ambientes: ${simulationState.rooms?.length || 0} cômodos configurados
- Faixa Estimada: ${formatCurrencyBRL(result.minCost)} a ${formatCurrencyBRL(result.maxCost)} (Média: ${formatCurrencyBRL(result.averageCost)})
- Serviços: ${servicesList || 'Nenhum específico'}
- Tipo de Imóvel: ${tipoImovel}
- Localização/Bairro: ${localizacao || 'Não informado'}
- Obs do Cliente: ${observacoes || 'Sem observações'}`

      const payload = {
        nome,
        email,
        telefone,
        tipoConsulta: 'Calculadora de Reforma',
        mensagem: simulationSummary,
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Não foi possível enviar sua solicitação.')
      }

      setSuccess(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao enviar. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const whatsappUrl = getWhatsAppSimulationUrl(simulationState, result, nome)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--araca-creme)] border border-[var(--araca-bege-medio)] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="p-6 bg-white border-b border-[var(--araca-bege-medio)]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-medium text-[var(--araca-cafe-escuro)]">
                Solicitar Proposta Completa
              </h3>
              <p className="text-xs text-[var(--araca-chocolate-amargo)]/70">
                Receba nossa análise técnica com estimativa detalhada
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--araca-bege-claro)] hover:bg-[var(--araca-bege-medio)]/60 text-[var(--araca-cafe-escuro)] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-4">
          {success ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-3xl text-[var(--araca-cafe-escuro)]">
                Simulação Enviada com Sucesso!
              </h4>
              <p className="text-sm text-[var(--araca-chocolate-amargo)]/80 max-w-sm mx-auto">
                Nossos designers de interiores analisarão as informações de{' '}
                <strong>{nome}</strong> para elaborar um direcionamento personalizado.
              </p>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-medium text-sm hover:bg-[#20bd5a] transition-all shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Falar com os Designers de Interiores no WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Resumo da Simulação */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[var(--araca-bege-medio)]/50 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[var(--araca-chocolate-amargo)]/70 block">Simulação Atual:</span>
                  <strong className="text-[var(--araca-cafe-escuro)] font-medium">
                    {result.totalArea} m² • Padrão {result.standard.name}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[var(--araca-chocolate-amargo)]/70 block">Investimento Médio:</span>
                  <strong className="text-[var(--araca-mineral-green)] font-bold">
                    {formatCurrencyBRL(result.averageCost)}
                  </strong>
                </div>
              </div>

              {/* Erro */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                  />
                </div>
              </div>

              {/* WhatsApp e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                    WhatsApp com DDD *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Imóvel e Cidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={tipoImovel}
                    onChange={(e) => setTipoImovel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa / Sobrado">Casa / Sobrado</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Comercial / Escritório">Comercial / Escritório</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                    Cidade / Bairro
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[var(--araca-chocolate-amargo)]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={localizacao}
                      onChange={(e) => setLocalizacao(e.target.value)}
                      placeholder="Ex: Santo André / Jardins SP"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)]"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-semibold text-[var(--araca-cafe-escuro)] mb-1">
                  Observações ou Detalhes Especiais (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Imóvel na planta com entrega prevista para daqui 3 meses; foco em cozinha integrada e ar condicionado embutido."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--araca-bege-medio)]/60 bg-white text-xs text-[var(--araca-cafe-escuro)] focus:outline-none focus:ring-2 focus:ring-[var(--araca-mineral-green)] resize-none"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-medium text-sm transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando simulação...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar e Receber Proposta Detalhada</span>
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
