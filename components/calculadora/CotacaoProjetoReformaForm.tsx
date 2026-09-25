'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Home,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  Calculator,
  Compass,
  Hammer,
  ShieldCheck,
  Sliders,
  Paintbrush,
  Droplets,
  Zap,
  Grid3X3,
  Maximize2,
  Box,
  Sofa,
  UtensilsCrossed,
  Utensils,
  Flame,
  Bath,
  BedDouble,
  Laptop,
  Shirt,
  Info,
  Loader2,
  BadgeCheck,
  Lock,
  Unlock,
  Baby,
  Headphones,
  Package,
  Sun,
  Leaf,
  MapPin,
  Users,
  FileText,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PROJETO_SLIDER_MIN = 15
const PROJETO_SLIDER_MAX = 400

const PROJETO_SLIDER_MILESTONES = [
  { area: 15, label: '15 m²', sublabel: 'Studio' },
  { area: 100, label: '100 m²', sublabel: '2 a 3 Qts' },
  { area: 200, label: '200 m²', sublabel: 'Alto Padrão' },
  { area: 300, label: '300 m²', sublabel: 'Cobertura' },
  { area: 400, label: '400 m²', sublabel: 'Mansão' },
]

/* ==========================================================================
   3. CONFIGURAÇÕES & MANUTENÇÃO DO FORMULÁRIO DE COTAÇÃO
   ========================================================================== */

export const CUSTO_CONFIG = {
  // Constantes de preço por m² de Projeto de Interiores/Arquitetura
  projeto: {
    minPorM2: 40,
    maxPorM2: 80,
    notaExplicativa:
      'Valor final validado pela nossa equipe conforme a complexidade do projeto.',
  },

  padroesObra: Object.defineProperty(
    {
      essencial: {
        id: 'essencial',
        titulo: 'Essencial / Revitalização',
        badge: 'Mais Econômico',
        precoBasePorM2: 1500,
        minPorM2: 1250,
        maxPorM2: 1800,
        projetoMinPorM2: 35,
        projetoMaxPorM2: 50,
        descricao:
          'Solução expressa para pintura geral, pequenos reparos e iluminação pontual, sem quebra-quebra pesado.',
        destaques: [
          'Pintura látex acrílica com retoques',
          'Troca pontual de louças e metais',
          'Revisão elétrica e iluminação básica',
          'Sem demolições ou quebra-quebra pesado',
        ],
      },
      conforto: {
        id: 'conforto',
        titulo: 'Custo-Benefício Inteligente',
        badge: 'Custo-Benefício',
        precoBasePorM2: 2450,
        minPorM2: 2050,
        maxPorM2: 2850,
        projetoMinPorM2: 45,
        projetoMaxPorM2: 65,
        descricao:
          'Reforma completa funcional com pisos resistentes, marcenaria pontual bem planejada e controle financeiro.',
        destaques: [
          'Porcelanatos e pisos até 84x84cm ou vinílico',
          'Pintura acrílica acetinada de boa cobertura',
          'Novos pontos elétricos e hidráulicos',
          'Bancadas em granitos nobres ou quartzo',
        ],
      },
      medio: {
        id: 'medio',
        titulo: 'Médio Padrão',
        badge: 'Mais Escolhido',
        destaque: true,
        precoBasePorM2: 3650,
        minPorM2: 3100,
        maxPorM2: 4300,
        projetoMinPorM2: 55,
        projetoMaxPorM2: 75,
        descricao:
          'Equilíbrio entre excelente durabilidade, forro de gesso trabalhado com luz cênica, bancadas nobres e marcenaria.',
        destaques: [
          'Porcelanatos retificados grandes (80x80 a 90x90)',
          'Forro de gesso com iluminação embutida e sancas',
          'Redistribuição de pontos elétricos e iluminação cênica',
          'Bancadas em Quartzo / Granitos nobres',
        ],
      },
      alto: {
        id: 'alto',
        titulo: 'Alto Padrão',
        badge: 'Projeto Assinado',
        precoBasePorM2: 6200,
        minPorM2: 5200,
        maxPorM2: 7800,
        projetoMinPorM2: 70,
        projetoMaxPorM2: 90,
        descricao:
          'Projeto altamente exclusivo, grandes lastras, marcenaria autoral com ferragens especiais e sofisticação.',
        destaques: [
          'Grandes lastras (120x120 ou 120x240) ou madeira natural',
          'Marcenaria autoral com vidros reflecta e ferragens importadas',
          'Automação residencial e climatização dutada/embutida',
          'Bancadas esculpidas em Dekton, Neolith ou Mármores Nobres',
        ],
      },
    },
    'economico',
    {
      get() {
        return this.conforto
      },
      enumerable: false,
      configurable: true,
    }
  ) as Record<PadraoAcabamentoId, {
    id: string; titulo: string; badge: string; precoBasePorM2: number;
    minPorM2: number; maxPorM2: number; projetoMinPorM2: number;
    projetoMaxPorM2: number; descricao: string; destaques: string[];
    destaque?: boolean;
  }>,

  // Número de WhatsApp de destino (DDI + DDD + Número sem caracteres especiais)
  whatsappNumero:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511939155979',

  // URL do Webhook do Google Apps Script (Google Sheets)
  endpointGoogleSheets:
    process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbz_SUA_URL_GOOGLE_APPS_SCRIPT_AQUI/exec',
}

/* ==========================================================================
   TIPOS & DADOS ESTÁTICOS DAS ETAPAS
   ========================================================================== */

export type TipoImovelId = 'apartamento' | 'casa' | 'comercial'
export type StatusImovelId = 'novo' | 'usado' | 'comercial'
export type PadraoAcabamentoId = 'essencial' | 'conforto' | 'medio' | 'alto' | 'economico'
export type DemolicaoId = 'demolir' | 'manter' | 'duvida'
export type RrtOpcaoId = 'sim' | 'nao' | 'duvida'

interface TipoImovelOption {
  id: TipoImovelId
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
}

const TIPO_IMOVEL_OPTIONS: TipoImovelOption[] = [
  {
    id: 'apartamento',
    label: 'Apartamento',
    sublabel: 'Em edifício residencial ou condomínio vertical.',
    icon: Building2,
  },
  {
    id: 'casa',
    label: 'Casa / Sobrado',
    sublabel: 'Casa térrea, sobrado ou condomínio fechado.',
    icon: Home,
  },
  {
    id: 'comercial',
    label: 'Imóvel Comercial',
    sublabel: 'Consultórios, escritórios, lojas ou clínicas.',
    icon: Briefcase,
  },
]

interface RrtOption {
  id: RrtOpcaoId
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
}

const RRT_OPTIONS: RrtOption[] = [
  {
    id: 'sim',
    label: 'Sim, preciso de RRT/ART',
    sublabel: 'Exigência do condomínio para liberação da obra com segurança técnica.',
    icon: FileText,
  },
  {
    id: 'nao',
    label: 'Não preciso',
    sublabel: 'Casa de rua ou imóvel sem exigência de documento condominial.',
    icon: ShieldCheck,
  },
  {
    id: 'duvida',
    label: 'Não sei ainda / Quero orientação',
    sublabel: 'Nossa equipe técnica verifica as normas e regimento do seu espaço.',
    icon: HelpCircle,
  },
]

interface StatusImovelOption {
  id: StatusImovelId
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
}

const STATUS_IMOVEL_OPTIONS: StatusImovelOption[] = [
  {
    id: 'novo',
    label: 'Imóvel novo (na planta / recém-entregue)',
    sublabel: 'Ideal para projeto completo do zero sem necessidade de demolições estruturais pesadas.',
    icon: Building2,
  },
  {
    id: 'usado',
    label: 'Imóvel usado / antigo (precisa de reforma)',
    sublabel: 'Modernização completa de infraestrutura, revestimentos, paginação e marcenaria.',
    icon: Home,
  },
  {
    id: 'comercial',
    label: 'Imóvel comercial',
    sublabel: 'Consultórios, escritórios ou lojas com foco em fluxo, identidade visual e ergonomia.',
    icon: Briefcase,
  },
]

interface DemolicaoOption {
  id: DemolicaoId
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
  fatorCusto: number
}

const DEMOLICAO_OPTIONS: DemolicaoOption[] = [
  {
    id: 'demolir',
    label: 'Precisa demolir/abrir paredes',
    sublabel: 'Integração de sala, varanda, cozinha ou abertura de novos vãos de passagem.',
    icon: Hammer,
    fatorCusto: 1.07, // +7% pelo custo de quebra, caçambas e reforço
  },
  {
    id: 'manter',
    label: 'Manter estrutura e paredes como estão',
    sublabel: 'Sem intervenções estruturais ou demolição de alvenarias existentes.',
    icon: ShieldCheck,
    fatorCusto: 1.0,
  },
  {
    id: 'duvida',
    label: 'Não sei ainda, quero ideias e sugestões de layout',
    sublabel: 'Nossos designers de interiores avaliarão o melhor aproveitamento do seu espaço.',
    icon: HelpCircle,
    fatorCusto: 1.03, // contingência leve
  },
]

interface ServicoOption {
  id: string
  label: string
  descricao: string
  peso: number // peso relativo no orçamento total
  icon: React.ComponentType<{ className?: string }>
}

const SERVICOS_OPTIONS: ServicoOption[] = [
  {
    id: 'marmoraria',
    label: 'Troca ou instalação de Bancadas e Pedras (Marmoraria)',
    descricao: 'Bancadas de cozinha, ilha, cubas esculpidas em banheiros e soleiras.',
    peso: 0.16,
    icon: Sparkles,
  },
  {
    id: 'marcenaria',
    label: 'Marcenaria planejada (sob medida)',
    descricao: 'Armários planejados, painéis ripados, nichos, closet e estantes autorais.',
    peso: 0.26,
    icon: Box,
  },
  {
    id: 'eletrica',
    label: 'Reforma de Elétrica e Iluminação',
    descricao: 'Novos circuitos, fiação, quadro geral, automação e projeto luminotécnico.',
    peso: 0.15,
    icon: Zap,
  },
  {
    id: 'hidraulica',
    label: 'Reforma Hidráulica',
    descricao: 'Prumadas, água quente/fria, registros, drenos de ar e novos pontos de esgoto.',
    peso: 0.12,
    icon: Droplets,
  },
  {
    id: 'pisos',
    label: 'Pisos e Porcelanatos novos',
    descricao: 'Remoção, contrapiso e assentamento de porcelanatos, réguas vinílicas ou madeira.',
    peso: 0.17,
    icon: Grid3X3,
  },
  {
    id: 'pintura',
    label: 'Pintura e Teto de Gesso',
    descricao: 'Forro rebaixado com tabica/cortineiro, massa corrida e pintura premium.',
    peso: 0.13,
    icon: Paintbrush,
  },
  {
    id: 'portas',
    label: 'Portas / Esquadrias',
    descricao: 'Substituição de portas internas, ferragens, fechaduras e esquadrias de alumínio.',
    peso: 0.08,
    icon: Maximize2,
  },
]

interface AmbienteConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const AMBIENTES_CONFIG: AmbienteConfig[] = [
  { id: 'salaEstar', label: 'Sala de Estar', icon: Sofa },
  { id: 'salaJantar', label: 'Sala de Jantar', icon: UtensilsCrossed },
  { id: 'cozinha', label: 'Cozinha', icon: Utensils },
  { id: 'areaGourmet', label: 'Área Gourmet / Varanda', icon: Flame },
  { id: 'miniVaranda', label: 'Mini Varanda', icon: Sun },
  { id: 'banheiro', label: 'Banheiro Social / Lavabo', icon: Bath },
  { id: 'quarto', label: 'Quarto / Suíte Principal', icon: BedDouble },
  { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'quartoBebe', label: 'Quarto de Bebê', icon: Baby },
  { id: 'quartoCrianca', label: 'Quarto de Criança', icon: Sparkles },
  { id: 'quartoAdolescente', label: 'Quarto de Adolescente', icon: Headphones },
  { id: 'homeOffice', label: 'Home Office', icon: Laptop },
  { id: 'despensa', label: 'Despensa', icon: Package },
  { id: 'lavanderia', label: 'Lavanderia', icon: Droplets },
  { id: 'areaServico', label: 'Área de Serviço', icon: Layers },
  { id: 'jardim', label: 'Jardim / Área Externa', icon: Leaf },
]

interface EstiloVisualOption {
  id: string
  label: string
  sublabel: string
  tag: string
}

const ESTILOS_OPTIONS: EstiloVisualOption[] = [
  {
    id: 'Moderno',
    label: 'Moderno',
    sublabel: 'Linhas retas, iluminação linear e integração funcional dos ambientes.',
    tag: 'Clean & Urbano',
  },
  {
    id: 'Contemporâneo',
    label: 'Contemporâneo',
    sublabel: 'Tendências atuais, texturas aconchegantes, design orgânico e conforto.',
    tag: 'Em Alta',
  },
  {
    id: 'Minimalista',
    label: 'Minimalista',
    sublabel: 'Menos é mais: paleta sóbria, formas puras e sensação de paz e amplitude.',
    tag: 'Atemporal',
  },
  {
    id: 'Industrial',
    label: 'Industrial',
    sublabel: 'Concreto aparente, estruturas metálicas pretas, tijolinhos e tubulações cênicas.',
    tag: 'Autêntico',
  },
  {
    id: 'Clássico',
    label: 'Clássico',
    sublabel: 'Molduras boiserie, simetria elegante, mármores e requinte tradicional.',
    tag: 'Sofisticação Nobre',
  },
  {
    id: 'Sofisticado',
    label: 'Sofisticado',
    sublabel: 'Paleta nobre, iluminação difusa marcante, texturas requintadas e detalhes em dourado/bronze.',
    tag: 'Alto Padrão',
  },
  {
    id: 'Rústico',
    label: 'Rústico',
    sublabel: 'Madeiras de demolição, fibras naturais, pedras orgânicas e calor humano.',
    tag: 'Acolhedor',
  },
  {
    id: 'Boho',
    label: 'Boho',
    sublabel: 'Descontração elegante, muitas plantas, artesanato nobre e atmosfera relaxante.',
    tag: 'Natural & Leve',
  },
  {
    id: 'Maximalista',
    label: 'Maximalista',
    sublabel: 'Personalidade marcante, mix ousado de estampas, cores vivas e obras de arte.',
    tag: 'Expressivo',
  },
  {
    id: 'Preciso de consultoria / Ainda não sei',
    label: 'Preciso de consultoria / Ainda não sei',
    sublabel: 'Deixe nossos designers de interiores entenderem seu perfil e apresentarem a melhor direção.',
    tag: 'Consultoria Aracá',
  },
]

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

export function CotacaoProjetoReformaForm() {
  // Estado das Etapas (1 a 5)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Passo 1: Imóvel & Padrão
  const [tipoImovel, setTipoImovel] = useState<TipoImovelId>('apartamento')
  const [statusImovel, setStatusImovel] = useState<StatusImovelId>('novo')
  const [metragem, setMetragem] = useState<number>(75)
  const [padrao, setPadrao] = useState<PadraoAcabamentoId>('medio')

  // Percentual exato do slider de projetos (15 a 400 m²) para preenchimento e indicador flutuante
  const projSliderPercentage = Math.min(
    100,
    Math.max(
      0,
      ((Math.min(PROJETO_SLIDER_MAX, Math.max(PROJETO_SLIDER_MIN, metragem)) - PROJETO_SLIDER_MIN) /
        (PROJETO_SLIDER_MAX - PROJETO_SLIDER_MIN)) *
        100
    )
  )

  // Passo 2: Demolição, RRT & Serviços
  const [demolicao, setDemolicao] = useState<DemolicaoId>('demolir')
  const [rrt, setRrt] = useState<RrtOpcaoId>('sim')
  const [servicos, setServicos] = useState<string[]>([
    'marmoraria',
    'marcenaria',
    'eletrica',
    'hidraulica',
    'pisos',
    'pintura',
  ])

  // Passo 3: Ambientes, Moradores & Pets
  const [ambientes, setAmbientes] = useState<Record<string, number>>({
    salaEstar: 1,
    salaJantar: 1,
    cozinha: 1,
    areaGourmet: 1,
    miniVaranda: 0,
    banheiro: 2,
    quarto: 1,
    closet: 1,
    quartoBebe: 0,
    quartoCrianca: 0,
    quartoAdolescente: 0,
    homeOffice: 0,
    despensa: 0,
    lavanderia: 1,
    areaServico: 0,
    jardim: 0,
  })
  const [moradoresAdultos, setMoradoresAdultos] = useState<number>(2)
  const [moradoresCriancas, setMoradoresCriancas] = useState<number>(0)
  const [pets, setPets] = useState<string[]>(['Não temos pets'])
  const [outrosPetsTexto, setOutrosPetsTexto] = useState('')

  // Passo 4: Estilo Visual
  const [estilosSelecionados, setEstilosSelecionados] = useState<string[]>([
    'Contemporâneo',
  ])

  // Passo 5: Contato & Localização
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [concordaTermos, setConcordaTermos] = useState(true)
  const [isEstimativaRevelada, setIsEstimativaRevelada] = useState(false)

  // Estados de Validação e Envio
  const [errors, setErrors] = useState<{
    nome?: string
    whatsapp?: string
    email?: string
    endereco?: string
    geral?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRevelando, setIsRevelando] = useState(false)
  const [leadEnviado, setLeadEnviado] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [whatsappDirectUrl, setWhatsappDirectUrl] = useState<string | null>(null)

  // Manipulador de contador de cômodos
  const handleUpdateAmbiente = (id: string, delta: number) => {
    setAmbientes((prev) => {
      const atual = prev[id] || 0
      const novo = Math.max(0, Math.min(10, atual + delta))
      return { ...prev, [id]: novo }
    })
  }

  // Manipulador de seleção de pets
  const handleTogglePet = (petName: string) => {
    if (petName === 'Não temos pets') {
      setPets(['Não temos pets'])
      setOutrosPetsTexto('')
      return
    }

    setPets((prev) => {
      const semNenhum = prev.filter((p) => p !== 'Não temos pets')
      if (semNenhum.includes(petName)) {
        const filtered = semNenhum.filter((p) => p !== petName)
        return filtered.length === 0 ? ['Não temos pets'] : filtered
      } else {
        return [...semNenhum, petName]
      }
    })
  }

  // Manipulador de seleção de serviços (múltipla escolha)
  const handleToggleServico = (id: string) => {
    setServicos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Manipulador de estilos (múltipla escolha com lógica de consultoria)
  const handleToggleEstilo = (label: string) => {
    const consultoriaLabel = 'Preciso de consultoria / Ainda não sei'
    if (label === consultoriaLabel) {
      setEstilosSelecionados([consultoriaLabel])
      return
    }

    setEstilosSelecionados((prev) => {
      const semConsultoria = prev.filter((item) => item !== consultoriaLabel)
      if (semConsultoria.includes(label)) {
        const filtrado = semConsultoria.filter((item) => item !== label)
        return filtrado.length === 0 ? [consultoriaLabel] : filtrado
      } else {
        return [...semConsultoria, label]
      }
    })
  }

  // Máscara e formatação de telefone celular (Brasil: (99) 99999-9999)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    let formatted = raw
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
    }
    setWhatsapp(formatted)
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }))
  }

  /* ==========================================================================
     CÁLCULO DAS ESTIMATIVAS EM TEMPO REAL
     ========================================================================== */

  const calculos = useMemo(() => {
    const area = Math.max(1, metragem || 1)
    const padraoConfig = CUSTO_CONFIG.padroesObra[padrao]

    // 1. Projeto de Interiores/Arquitetura: baseado no padrão
    const projMinRate = padraoConfig.projetoMinPorM2 || CUSTO_CONFIG.projeto.minPorM2
    const projMaxRate = padraoConfig.projetoMaxPorM2 || CUSTO_CONFIG.projeto.maxPorM2
    const projetoMin = Math.round(area * projMinRate)
    const projetoMax = Math.round(area * projMaxRate)

    // 2. Estimativa de Obra Civil
    const demolicaoConfig =
      DEMOLICAO_OPTIONS.find((d) => d.id === demolicao) || DEMOLICAO_OPTIONS[0]

    // Cálculo do peso relativo dos serviços marcados
    // Se todos marcados = 1.0. Se nenhum marcado = peso mínimo base de 0.35 para não zerar.
    const pesoServicosTotal = SERVICOS_OPTIONS.reduce((acc, s) => {
      return servicos.includes(s.id) ? acc + s.peso : acc
    }, 0)
    const fatorServicos = servicos.length === 0 ? 0.35 : Math.min(1.15, Math.max(0.35, pesoServicosTotal / 0.95))

    const fatorDemolicao = demolicaoConfig.fatorCusto

    // Obra mínima e máxima ajustadas
    const obraMin = Math.round(
      area * padraoConfig.minPorM2 * fatorServicos * fatorDemolicao
    )
    const obraMax = Math.round(
      area * padraoConfig.maxPorM2 * fatorServicos * fatorDemolicao
    )

    // 3. Previsão Total (Obra + Projeto)
    const totalMin = projetoMin + obraMin
    const totalMax = projetoMax + obraMax

    return {
      area,
      projetoMin,
      projetoMax,
      projMinRate,
      projMaxRate,
      obraMin,
      obraMax,
      totalMin,
      totalMax,
      padraoNome: padraoConfig.titulo,
    }
  }, [metragem, padrao, demolicao, servicos])

  /* ==========================================================================
     VALIDAÇÕES DO FORMULÁRIO
     ========================================================================== */

  const validateStep5 = () => {
    const newErrors: { nome?: string; whatsapp?: string; email?: string } = {}

    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Por favor, informe seu nome completo.'
    }

    const cleanPhone = whatsapp.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.whatsapp = 'Informe um número de WhatsApp válido com DDD.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ==========================================================================
     GERADORES DE PAYLOAD E WHATSAPP
     ========================================================================== */

  const buildLeadPayload = () => {
    const tipoImovelLabel =
      TIPO_IMOVEL_OPTIONS.find((t) => t.id === tipoImovel)?.label || tipoImovel
    const statusImovelLabel =
      STATUS_IMOVEL_OPTIONS.find((s) => s.id === statusImovel)?.label || statusImovel
    const rrtLabel =
      RRT_OPTIONS.find((r) => r.id === rrt)?.label || rrt
    const demolicaoLabel =
      DEMOLICAO_OPTIONS.find((d) => d.id === demolicao)?.label || demolicao
    const servicosLabels = SERVICOS_OPTIONS.filter((s) =>
      servicos.includes(s.id)
    ).map((s) => s.label)

    const ambientesMapeados: Record<string, number> = {}
    AMBIENTES_CONFIG.forEach((amb) => {
      const qtd = ambientes[amb.id] || 0
      if (qtd > 0) {
        ambientesMapeados[amb.label] = qtd
      }
    })

    const estiloFormatado = estilosSelecionados.join(', ') || 'Consultoria Aracá'

    const moradoresResumo = `${moradoresAdultos} ${moradoresAdultos === 1 ? 'adulto' : 'adultos'}${
      moradoresCriancas > 0 ? `, ${moradoresCriancas} ${moradoresCriancas === 1 ? 'criança' : 'crianças'}` : ''
    }`

    const petsResumo = pets.includes('Não temos pets')
      ? 'Não temos pets'
      : pets
          .map((p) => (p === 'Outros' && outrosPetsTexto.trim() ? `Outros (${outrosPetsTexto.trim()})` : p))
          .join(', ') || 'Não temos pets'

    const dataHoraAtual = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium',
    })

    return {
      tipo: 'calculadora_projeto',
      dataHora: dataHoraAtual,
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim().toLowerCase(),
      endereco: endereco.trim() || 'Não informado',
      tipoImovel: tipoImovelLabel,
      statusImovel: statusImovelLabel,
      metragem: calculos.area,
      padrao: calculos.padraoNome,
      rrt: rrtLabel,
      demolicao: demolicaoLabel,
      servicos: servicosLabels,
      ambientes: ambientesMapeados,
      moradores: moradoresResumo,
      pets: petsResumo,
      estilo: estiloFormatado,
      estimativaProjetoMin: calculos.projetoMin,
      estimativaProjetoMax: calculos.projetoMax,
      estimativaObraMin: calculos.obraMin,
      estimativaObraMax: calculos.obraMax,
      totalMin: calculos.totalMin,
      totalMax: calculos.totalMax,
      customWebhookUrl: CUSTO_CONFIG.endpointGoogleSheets,
    }
  }

  const buildWhatsappUrl = () => {
    const tipoImovelLabel =
      TIPO_IMOVEL_OPTIONS.find((t) => t.id === tipoImovel)?.label || tipoImovel
    const statusImovelLabel =
      STATUS_IMOVEL_OPTIONS.find((s) => s.id === statusImovel)?.label || statusImovel
    const rrtLabel =
      RRT_OPTIONS.find((r) => r.id === rrt)?.label || rrt
    const servicosLabels = SERVICOS_OPTIONS.filter((s) =>
      servicos.includes(s.id)
    ).map((s) => s.label)

    const ambientesMapeados: Record<string, number> = {}
    AMBIENTES_CONFIG.forEach((amb) => {
      const qtd = ambientes[amb.id] || 0
      if (qtd > 0) {
        ambientesMapeados[amb.label] = qtd
      }
    })

    const estiloFormatado = estilosSelecionados.join(', ') || 'Consultoria Aracá'
    const moradoresResumo = `${moradoresAdultos} ${moradoresAdultos === 1 ? 'adulto' : 'adultos'}${
      moradoresCriancas > 0 ? `, ${moradoresCriancas} ${moradoresCriancas === 1 ? 'criança' : 'crianças'}` : ''
    }`
    const petsResumo = pets.includes('Não temos pets')
      ? 'Não temos pets'
      : pets
          .map((p) => (p === 'Outros' && outrosPetsTexto.trim() ? `Outros (${outrosPetsTexto.trim()})` : p))
          .join(', ') || 'Não temos pets'

    const ambientesTexto =
      Object.entries(ambientesMapeados)
        .map(([amb, qtd]) => `${amb} (${qtd})`)
        .join(', ') || 'A definir com a equipe'

    const servicosTexto =
      servicosLabels.length > 0
        ? servicosLabels.join(', ')
        : 'Reforma geral / A definir'

    const formatMoney = (val: number) =>
      val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

    const whatsappMessage = `Olá! Acabei de calcular a estimativa de projeto e obra no site da Aracá Interiores:
👤 *Nome:* ${nome.trim()}
${endereco.trim() ? `📍 *Endereço/Região:* ${endereco.trim()}\n` : ''}🏠 *Imóvel:* ${tipoImovelLabel} (${statusImovelLabel}) - ${calculos.area} m²
📋 *Precisa de ART/RRT:* ${rrtLabel}
👥 *Moradores:* ${moradoresResumo} | *Pets:* ${petsResumo}
🏆 *Padrão:* ${calculos.padraoNome}
🛋️ *Ambientes:* ${ambientesTexto}
🛠️ *Intervenções:* ${servicosTexto}
🎨 *Estilo:* ${estiloFormatado}

📊 *Estimativas geradas:*
• Projeto de Interiores: ${formatMoney(calculos.projetoMin)} a ${formatMoney(calculos.projetoMax)}
• Obra de Reforma: ${formatMoney(calculos.obraMin)} a ${formatMoney(calculos.obraMax)}
• Investimento Total: ${formatMoney(calculos.totalMin)} a ${formatMoney(calculos.totalMax)}

Gostaria de agendar uma conversa com os designers de interiores da Aracá!`

    return `https://wa.me/${CUSTO_CONFIG.whatsappNumero}?text=${encodeURIComponent(
      whatsappMessage
    )}`
  }

  const sendLeadToBackend = async (payload: any) => {
    try {
      const internalRelayPromise = fetch('/api/cotacao-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn('Aviso no envio interno cotacao-webhook:', err)
        return null
      })

      const directGasPromise =
        CUSTO_CONFIG.endpointGoogleSheets &&
        !CUSTO_CONFIG.endpointGoogleSheets.includes('SUA_URL_GOOGLE_APPS_SCRIPT_AQUI')
          ? fetch(CUSTO_CONFIG.endpointGoogleSheets, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              mode: 'no-cors',
              body: JSON.stringify(payload),
            }).catch((err) => {
              console.warn('Aviso no fetch direto Google Apps Script:', err)
              return null
            })
          : Promise.resolve(null)

      // Aguarda até 1.5s para não travar a experiência do usuário
      await Promise.race([
        Promise.all([internalRelayPromise, directGasPromise]),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ])
      return true
    } catch (err) {
      console.error('Erro no envio do lead:', err)
      return false
    }
  }

  /* ==========================================================================
     REVELAR ESTIMATIVA: ENVIA DADOS PARA O GOOGLE SHEETS / CRM E DESBLOQUEIA
     ========================================================================== */

  const handleRevelarEstimativa = async () => {
    if (!validateStep5()) {
      const formEl = document.getElementById('contato-lead-form')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsRevelando(true)
    const payload = buildLeadPayload()
    const waUrl = buildWhatsappUrl()
    setWhatsappDirectUrl(waUrl)

    // Envia os dados para a planilha / ERP
    await sendLeadToBackend(payload)

    setLeadEnviado(true)
    setIsEstimativaRevelada(true)
    setIsRevelando(false)

    setTimeout(() => {
      const panel = document.getElementById('painel-estimativa')
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 100)
  }

  /* ==========================================================================
     SUBMISSÃO FINAL: WHATSAPP FORMATADO + CONFIRMAÇÃO DE ENVIO
     ========================================================================== */

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateStep5()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const payload = buildLeadPayload()
    const waUrl = buildWhatsappUrl()
    setWhatsappDirectUrl(waUrl)

    // Garante sincronização dos dados no backend
    await sendLeadToBackend(payload)

    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Abertura do WhatsApp em nova aba
    window.open(waUrl, '_blank')
  }

  // Progresso visual da barra
  const progressPercentage = (currentStep / 5) * 100

  // Total de cômodos selecionados no Passo 3
  const totalComodos = Object.values(ambientes).reduce((a, b) => a + b, 0)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ====================================================================
          CARD PRINCIPAL DO FORMULÁRIO COM DESIGN ELEGANTE & LUXO
          ==================================================================== */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[var(--araca-bege-medio)]/80 shadow-2xl overflow-hidden transition-all duration-300">
        {/* TOPO: BARRA DE PROGRESSO & IDENTIFICADOR DE ETAPAS */}
        <div className="bg-[var(--araca-creme)]/80 border-b border-[var(--araca-bege-medio)]/60 px-5 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)]/10 px-3 py-1 rounded-full border border-[var(--araca-mineral-green)]/20">
                Etapa {currentStep} de 5
              </span>
              <h2 className="text-lg sm:text-xl font-display font-medium text-[var(--araca-cafe-escuro)] mt-1.5">
                {currentStep === 1 && 'Dados do Imóvel & Padrão Desejado'}
                {currentStep === 2 && 'Demolição e Serviços Necessários'}
                {currentStep === 3 && 'Ambientes Contemplados'}
                {currentStep === 4 && 'Estilo Visual Preferido'}
                {currentStep === 5 && 'Contato & Resumo Estimado'}
              </h2>
            </div>

            {/* Stepper Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {[1, 2, 3, 4, 5].map((step) => {
                const isPassed = step < currentStep
                const isCurrent = step === currentStep
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (step < currentStep) setCurrentStep(step)
                    }}
                    disabled={step > currentStep}
                    className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[var(--araca-mineral-green)] text-white shadow-sm ring-2 ring-[var(--araca-mineral-green)]/30 scale-105'
                        : isPassed
                        ? 'bg-[var(--araca-mineral-green)]/20 text-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green)]/30 cursor-pointer'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                    title={`Ir para etapa ${step}`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Barra de Progresso Animada */}
          <div className="w-full bg-neutral-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--araca-mineral-green)] via-[var(--araca-verde-medio)] to-[var(--araca-laranja-queimado)] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div className="p-6 sm:p-10">
          {/* ================================================================
              PASSO 1: DADOS DO IMÓVEL & PADRÃO DESEJADO
              ================================================================ */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              {/* 1.1 Tipo do Imóvel */}
              <div className="space-y-3">
                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                  1. Qual é o tipo do imóvel?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {TIPO_IMOVEL_OPTIONS.map((item) => {
                    const Icon = item.icon
                    const isSelected = tipoImovel === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => setTipoImovel(item.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-md ring-1 ring-[var(--araca-mineral-green)]/30'
                            : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isSelected
                                ? 'bg-[var(--araca-mineral-green)] text-white'
                                : 'bg-neutral-100 text-[var(--araca-chocolate-amargo)]'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] leading-snug">
                            {item.label}
                          </h4>
                          <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1.5 leading-relaxed">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 1.2 Status do Imóvel */}
              <div className="space-y-3 pt-4 border-t border-[var(--araca-bege-medio)]/40">
                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                  2. Qual é o status atual da sua obra ou imóvel?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {STATUS_IMOVEL_OPTIONS.map((item) => {
                    const Icon = item.icon
                    const isSelected = statusImovel === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => setStatusImovel(item.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-md ring-1 ring-[var(--araca-mineral-green)]/30'
                            : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isSelected
                                ? 'bg-[var(--araca-mineral-green)] text-white'
                                : 'bg-neutral-100 text-[var(--araca-chocolate-amargo)]'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)] leading-snug">
                            {item.label}
                          </h4>
                          <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1.5 leading-relaxed">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 1.3 Metragem Aproximada (m²) */}
              <div className="space-y-4 pt-4 border-t border-[var(--araca-bege-medio)]/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--araca-mineral-green)]" />
                    <span>3. Metragem aproximada do imóvel:</span>
                  </label>

                  {/* Input Numérico com Unidade */}
                  <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[var(--araca-bege-medio)] shadow-sm">
                    <input
                      type="number"
                      min={15}
                      max={1200}
                      value={metragem || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        setMetragem(isNaN(val) ? 0 : val)
                      }}
                      className="w-20 text-right font-display text-xl font-bold text-[var(--araca-cafe-escuro)] outline-none bg-transparent"
                    />
                    <span className="font-semibold text-sm text-[var(--araca-chocolate-amargo)]/70">
                      m²
                    </span>
                  </div>
                </div>

                {/* Slider Interativo de Alta Precisão */}
                <div className="space-y-3 pt-1">
                  <div className="relative pt-7 pb-1">
                    {/* Indicador Flutuante Dinâmico que acompanha o cursor */}
                    <div
                      className="absolute top-0 pointer-events-none transition-[left] duration-75 -translate-x-1/2 z-20"
                      style={{ left: `${projSliderPercentage}%` }}
                    >
                      <div className="px-2.5 py-0.5 rounded-full bg-[var(--araca-cafe-escuro)] text-white text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/20">
                        <span>{metragem} m²</span>
                      </div>
                      <div className="w-1.5 h-1.5 bg-[var(--araca-cafe-escuro)] rotate-45 mx-auto -mt-0.5 border-r border-b border-white/20" />
                    </div>

                    {/* Input range com preenchimento verde dinâmico */}
                    <input
                      type="range"
                      min={PROJETO_SLIDER_MIN}
                      max={PROJETO_SLIDER_MAX}
                      step={1}
                      value={Math.min(PROJETO_SLIDER_MAX, Math.max(PROJETO_SLIDER_MIN, metragem))}
                      onChange={(e) => setMetragem(parseInt(e.target.value, 10))}
                      style={{
                        background: `linear-gradient(to right, var(--araca-mineral-green) 0%, var(--araca-mineral-green) ${projSliderPercentage}%, var(--araca-bege-medio) ${projSliderPercentage}%, var(--araca-bege-medio) 100%)`,
                      }}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[var(--araca-mineral-green)] focus:outline-none transition-all shadow-inner"
                      aria-label="Metragem aproximada do imóvel em metros quadrados"
                    />
                  </div>

                  {/* Escala Numérica Proporcional com Pontos Exatos (100% Sincronizada) */}
                  <div className="relative w-full h-11 select-none">
                    {PROJETO_SLIDER_MILESTONES.map((m, idx) => {
                      const pct =
                        ((m.area - PROJETO_SLIDER_MIN) / (PROJETO_SLIDER_MAX - PROJETO_SLIDER_MIN)) * 100
                      const isPast = metragem >= m.area
                      const isExact = Math.abs(metragem - m.area) <= 8

                      const alignClass =
                        idx === 0
                          ? 'translate-x-0 text-left items-start'
                          : idx === PROJETO_SLIDER_MILESTONES.length - 1
                          ? '-translate-x-full text-right items-end'
                          : '-translate-x-1/2 text-center items-center'

                      return (
                        <button
                          key={m.area}
                          type="button"
                          onClick={() => setMetragem(m.area)}
                          className={cn(
                            'absolute top-0 flex flex-col cursor-pointer transition-all duration-150 group',
                            alignClass
                          )}
                          style={{ left: `${pct}%` }}
                          title={`Clique para selecionar ${m.area} m²`}
                        >
                          {/* Marcador no track */}
                          <div
                            className={cn(
                              'w-1.5 h-2 rounded-full mb-1 transition-all',
                              isExact
                                ? 'bg-[var(--araca-mineral-green)] h-3 scale-125 ring-2 ring-[var(--araca-mineral-green)]/30'
                                : isPast
                                ? 'bg-[var(--araca-mineral-green)]'
                                : 'bg-[var(--araca-bege-medio)] group-hover:bg-[var(--araca-mineral-green)]'
                            )}
                          />
                          <span
                            className={cn(
                              'text-xs font-bold leading-tight transition-colors whitespace-nowrap',
                              isExact
                                ? 'text-[var(--araca-mineral-green)]'
                                : isPast
                                ? 'text-[var(--araca-cafe-escuro)]'
                                : 'text-[var(--araca-chocolate-amargo)]/60 group-hover:text-[var(--araca-cafe-escuro)]'
                            )}
                          >
                            {m.label}
                          </span>
                          <span className="text-[10px] text-[var(--araca-chocolate-amargo)]/50 hidden sm:block leading-tight font-medium whitespace-nowrap">
                            {m.sublabel}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Chips de Atalhos Rápidos */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">
                    Sugestões rápidas:
                  </span>
                  {[45, 70, 90, 120, 160, 220].map((areaPreset) => (
                    <button
                      key={areaPreset}
                      type="button"
                      onClick={() => setMetragem(areaPreset)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                        metragem === areaPreset
                          ? 'bg-[var(--araca-mineral-green)] text-white border-[var(--araca-mineral-green)] font-semibold shadow-sm'
                          : 'bg-white hover:bg-[var(--araca-creme)] border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                      }`}
                    >
                      {areaPreset} m²
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.4 Padrão de Acabamento & Obra */}
              <div className="space-y-4 pt-4 border-t border-[var(--araca-bege-medio)]/40">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                    4. Qual padrão de acabamento você deseja para a obra?
                  </label>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    O padrão define a especificação dos materiais (porcelanatos, pedras, marcenaria e iluminação).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.keys(CUSTO_CONFIG.padroesObra) as PadraoAcabamentoId[]).map(
                    (key) => {
                      const item = CUSTO_CONFIG.padroesObra[key]
                      const isSelected = padrao === key
                      return (
                        <div
                          key={key}
                          onClick={() => setPadrao(key)}
                          className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
                            isSelected
                              ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-lg ring-2 ring-[var(--araca-mineral-green)]/40 scale-[1.01]'
                              : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                          }`}
                        >
                          {/* Badge Superior */}
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  isSelected
                                    ? 'bg-[var(--araca-mineral-green)] text-white'
                                    : key === 'alto'
                                    ? 'bg-[var(--araca-dourado-ocre)]/15 text-[var(--araca-laranja-queimado)]'
                                    : key === 'medio'
                                    ? 'bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]'
                                    : key === 'conforto'
                                    ? 'bg-[var(--araca-bege-claro)] text-[var(--araca-cafe-escuro)]'
                                    : 'bg-emerald-50 text-emerald-800'
                                }`}
                              >
                                {item.badge}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                                    : 'border-neutral-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="font-display font-semibold text-base sm:text-lg text-[var(--araca-cafe-escuro)]">
                                {item.titulo}
                              </h4>
                              <p className="text-xs text-[var(--araca-chocolate-amargo)]/80 leading-relaxed">
                                {item.descricao}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              PASSO 2: DEMOLIÇÃO E SERVIÇOS NECESSÁRIOS
              ================================================================ */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              {/* 2.1 Demolição / Layout */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                    1. Intervenção de Paredes / Alteração de Layout
                  </label>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Haverá quebra de alvenaria, integração de ambientes ou você deseja manter a planta original?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {DEMOLICAO_OPTIONS.map((item) => {
                    const Icon = item.icon
                    const isSelected = demolicao === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => setDemolicao(item.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-md ring-1 ring-[var(--araca-mineral-green)]/30'
                            : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? 'bg-[var(--araca-mineral-green)] text-white'
                                : 'bg-neutral-100 text-[var(--araca-chocolate-amargo)]'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                            {item.label}
                          </h4>
                          <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 2.2 Precisa de RRT */}
              <div className="space-y-4 pt-4 border-t border-[var(--araca-bege-medio)]/40">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                    2. Sua obra precisa de emissão de RRT / ART?
                  </label>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Documento de responsabilidade técnica perante o CAU/CREA exigido por condomínios e seguradoras.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {RRT_OPTIONS.map((item) => {
                    const Icon = item.icon
                    const isSelected = rrt === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => setRrt(item.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-md ring-1 ring-[var(--araca-mineral-green)]/30'
                            : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? 'bg-[var(--araca-mineral-green)] text-white'
                                : 'bg-neutral-100 text-[var(--araca-chocolate-amargo)]'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                            {item.label}
                          </h4>
                          <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Box Explicativo sobre ART / RRT */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>O que é ART / RRT e por que ela importa?</strong> A <em>Anotação de Responsabilidade Técnica</em> (ART - CREA) ou <em>Registro de Responsabilidade Técnica</em> (RRT - CAU), conforme a norma ABNT NBR 16.280, é exigida por condomínios para autorizar obras. A Aracá Interiores atua em design de interiores e decoração e viabiliza a emissão de ART/RRT em parceria com engenheiros e arquitetos credenciados, garantindo total conformidade legal e tranquilidade.
                  </div>
                </div>
              </div>

              {/* 2.3 O que será necessário fazer? (Seleção múltipla) */}
              <div className="space-y-4 pt-4 border-t border-[var(--araca-bege-medio)]/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                      3. O que será necessário fazer?
                    </label>
                    <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                      Selecione todos os serviços e disciplinas previstos para o seu espaço:
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setServicos(SERVICOS_OPTIONS.map((s) => s.id))}
                      className="text-xs font-semibold text-[var(--araca-mineral-green)] hover:underline px-2 py-1"
                    >
                      Selecionar todos
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={() => setServicos([])}
                      className="text-xs font-semibold text-[var(--araca-chocolate-amargo)]/70 hover:underline px-2 py-1"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICOS_OPTIONS.map((servico) => {
                    const Icon = servico.icon
                    const isChecked = servicos.includes(servico.id)
                    return (
                      <div
                        key={servico.id}
                        onClick={() => handleToggleServico(servico.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3.5 select-none ${
                          isChecked
                            ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-sm'
                            : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isChecked
                                  ? 'text-[var(--araca-mineral-green)]'
                                  : 'text-[var(--araca-chocolate-amargo)]/60'
                              }`}
                            />
                            <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                              {servico.label}
                            </h4>
                          </div>
                          <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                            {servico.descricao}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              PASSO 3: AMBIENTES CONTEMPLADOS
              ================================================================ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                    Quais cômodos fazem parte da sua reforma e projeto?
                  </label>
                  <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                    Utilize os botões (+) e (-) para ajustar a quantidade de cada cômodo:
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-[var(--araca-mineral-green)]/15 border border-[var(--araca-mineral-green)]/30 text-[var(--araca-mineral-green)] px-3 py-1.5 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Total de cômodos: {totalComodos}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {AMBIENTES_CONFIG.map((item) => {
                  const Icon = item.icon
                  const count = ambientes[item.id] || 0
                  const hasUnits = count > 0

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        hasUnits
                          ? 'bg-[var(--araca-creme)]/70 border-[var(--araca-mineral-green)] shadow-sm'
                          : 'bg-white border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-4">
                        <div
                          className={`p-2 rounded-xl ${
                            hasUnits
                              ? 'bg-[var(--araca-mineral-green)] text-white'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4
                          className={`font-semibold text-sm leading-tight ${
                            hasUnits
                              ? 'text-[var(--araca-cafe-escuro)]'
                              : 'text-[var(--araca-chocolate-amargo)]/80'
                          }`}
                        >
                          {item.label}
                        </h4>
                      </div>

                      {/* Contador +/- */}
                      <div className="flex items-center justify-between bg-white rounded-xl border border-[var(--araca-bege-medio)]/80 p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateAmbiente(item.id, -1)}
                          disabled={count === 0}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base transition-colors hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent text-[var(--araca-cafe-escuro)]"
                          aria-label={`Diminuir ${item.label}`}
                        >
                          -
                        </button>

                        <span
                          className={`font-display font-bold text-base ${
                            hasUnits
                              ? 'text-[var(--araca-cafe-escuro)]'
                              : 'text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateAmbiente(item.id, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base transition-colors hover:bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]"
                          aria-label={`Aumentar ${item.label}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Perfil dos Moradores & Pets */}
              <div className="pt-6 border-t border-[var(--araca-bege-medio)]/40 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Quantas pessoas moram */}
                <div className="p-5 rounded-2xl bg-white border border-[var(--araca-bege-medio)]/80 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                        Quantas pessoas vão morar no imóvel?
                      </h4>
                      <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                        Ajuda nossa equipe a prever circulação, armazenamento e ergonomia.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Adultos */}
                    <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/50">
                      <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] block mb-1.5">
                        Adultos
                      </span>
                      <div className="flex items-center justify-between bg-white rounded-lg border border-[var(--araca-bege-medio)] p-1">
                        <button
                          type="button"
                          onClick={() => setMoradoresAdultos((p) => Math.max(1, p - 1))}
                          className="w-7 h-7 rounded flex items-center justify-center font-bold hover:bg-neutral-100 text-xs text-[var(--araca-cafe-escuro)]"
                          aria-label="Diminuir adultos"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm text-[var(--araca-cafe-escuro)]">
                          {moradoresAdultos}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMoradoresAdultos((p) => Math.min(10, p + 1))}
                          className="w-7 h-7 rounded flex items-center justify-center font-bold hover:bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] text-xs"
                          aria-label="Aumentar adultos"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Crianças / Bebês */}
                    <div className="p-3 rounded-xl bg-[var(--araca-creme)]/60 border border-[var(--araca-bege-medio)]/50">
                      <span className="text-xs font-semibold text-[var(--araca-cafe-escuro)] block mb-1.5">
                        Crianças / Bebês
                      </span>
                      <div className="flex items-center justify-between bg-white rounded-lg border border-[var(--araca-bege-medio)] p-1">
                        <button
                          type="button"
                          onClick={() => setMoradoresCriancas((p) => Math.max(0, p - 1))}
                          className="w-7 h-7 rounded flex items-center justify-center font-bold hover:bg-neutral-100 text-xs text-[var(--araca-cafe-escuro)]"
                          aria-label="Diminuir crianças"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm text-[var(--araca-cafe-escuro)]">
                          {moradoresCriancas}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMoradoresCriancas((p) => Math.min(10, p + 1))}
                          className="w-7 h-7 rounded flex items-center justify-center font-bold hover:bg-[var(--araca-mineral-green)]/15 text-[var(--araca-mineral-green)] text-xs"
                          aria-label="Aumentar crianças"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Tem Pet? */}
                <div className="p-5 rounded-2xl bg-white border border-[var(--araca-bege-medio)]/80 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[var(--araca-laranja-queimado)]/15 text-[var(--araca-laranja-queimado)]">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                        Tem pets na família?
                      </h4>
                      <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                        Para prever tecidos resistentes a arranhões, cantinho de comedouros e higiene.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { id: 'Cão', label: '🐶 Cão' },
                      { id: 'Gato', label: '🐱 Gato' },
                      { id: 'Outros', label: '🐾 Outros' },
                      { id: 'Não temos pets', label: '🚫 Não temos pets' },
                    ].map((petOption) => {
                      const isSelected = pets.includes(petOption.id)
                      return (
                        <button
                          key={petOption.id}
                          type="button"
                          onClick={() => handleTogglePet(petOption.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[var(--araca-mineral-green)] text-white border-[var(--araca-mineral-green)] shadow-sm'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-[var(--araca-chocolate-amargo)] border-[var(--araca-bege-medio)]'
                          }`}
                        >
                          {petOption.label}
                        </button>
                      )
                    })}
                  </div>

                  {pets.includes('Outros') && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Quais pets? (ex.: pássaros, coelho, peixes...)"
                        value={outrosPetsTexto}
                        onChange={(e) => setOutrosPetsTexto(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--araca-bege-medio)] text-xs text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none focus:border-[var(--araca-mineral-green)] focus:ring-1 focus:ring-[var(--araca-mineral-green)]/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              PASSO 4: ESTILO VISUAL PREFERIDO
              ================================================================ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                  Qual é o seu estilo visual preferido?
                </label>
                <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                  Selecione um ou mais estilos que traduzem a atmosfera que você busca para o seu lar ou empresa:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ESTILOS_OPTIONS.map((estilo) => {
                  const isSelected = estilosSelecionados.includes(estilo.label)
                  return (
                    <div
                      key={estilo.id}
                      onClick={() => handleToggleEstilo(estilo.label)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[var(--araca-mineral-green)]/10 border-[var(--araca-mineral-green)] shadow-md ring-1 ring-[var(--araca-mineral-green)]/30'
                          : 'bg-white hover:bg-[var(--araca-creme)]/40 border-[var(--araca-bege-medio)]/80 text-[var(--araca-chocolate-amargo)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-[var(--araca-mineral-green)] text-white'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {estilo.tag}
                        </span>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)] text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-display font-semibold text-base text-[var(--araca-cafe-escuro)]">
                          {estilo.label}
                        </h4>
                        <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-1 leading-relaxed">
                          {estilo.sublabel}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              PASSO 5: CONTATO & RESUMO ESTIMADO
              ================================================================ */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* COLUNA ESQUERDA: FORMULÁRIO DE CONTATO (5 Colunas) */}
                <div id="contato-lead-form" className="lg:col-span-5 space-y-4">
                  <div className="border-b border-[var(--araca-bege-medio)]/60 pb-3">
                    <h3 className="font-display text-lg font-semibold text-[var(--araca-cafe-escuro)]">
                      Seus Dados para Envio
                    </h3>
                    <p className="text-xs text-[var(--araca-chocolate-amargo)]/70 mt-0.5">
                      Receba o detalhamento com a assessoria direta de um designer de interiores Aracá.
                    </p>
                  </div>

                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex.: Mariana Fernandes"
                        value={nome}
                        onChange={(e) => {
                          setNome(e.target.value)
                          if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }))
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none transition-all ${
                          errors.nome
                            ? 'border-red-500 ring-1 ring-red-500/30'
                            : 'border-[var(--araca-bege-medio)] focus:border-[var(--araca-mineral-green)] focus:ring-2 focus:ring-[var(--araca-mineral-green)]/20'
                        }`}
                      />
                    </div>
                    {errors.nome && (
                      <span className="text-[11px] font-medium text-red-600">
                        {errors.nome}
                      </span>
                    )}
                  </div>

                  {/* WhatsApp / Telefone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                      WhatsApp / Celular *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={handlePhoneChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none transition-all ${
                          errors.whatsapp
                            ? 'border-red-500 ring-1 ring-red-500/30'
                            : 'border-[var(--araca-bege-medio)] focus:border-[var(--araca-mineral-green)] focus:ring-2 focus:ring-[var(--araca-mineral-green)]/20'
                        }`}
                      />
                    </div>
                    {errors.whatsapp && (
                      <span className="text-[11px] font-medium text-red-600">
                        {errors.whatsapp}
                      </span>
                    )}
                  </div>

                  {/* E-mail */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                      E-mail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="mariana@exemplo.com.br"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                        }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none transition-all ${
                          errors.email
                            ? 'border-red-500 ring-1 ring-red-500/30'
                            : 'border-[var(--araca-bege-medio)] focus:border-[var(--araca-mineral-green)] focus:ring-2 focus:ring-[var(--araca-mineral-green)]/20'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[11px] font-medium text-red-600">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Endereço / Localização do Imóvel */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--araca-cafe-escuro)]">
                      Endereço ou Região do Imóvel
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex.: Rua Oscar Freire - Jardins, SP (ou condomínio)"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--araca-bege-medio)] bg-white text-sm text-[var(--araca-cafe-escuro)] placeholder-neutral-400 outline-none focus:border-[var(--araca-mineral-green)] focus:ring-2 focus:ring-[var(--araca-mineral-green)]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Checkbox Termos / LGPD */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--araca-chocolate-amargo)]/80 select-none">
                      <input
                        type="checkbox"
                        checked={concordaTermos}
                        onChange={(e) => setConcordaTermos(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 text-[var(--araca-mineral-green)] focus:ring-[var(--araca-mineral-green)]"
                      />
                      <span>
                        Concordo em receber o resumo da simulação e contato exclusivo da Aracá Interiores por WhatsApp e e-mail.
                      </span>
                    </label>
                  </div>

                  {/* Botão de Ação na Coluna de Contato */}
                  <div className="pt-2">
                    {!isEstimativaRevelada ? (
                      <button
                        type="button"
                        onClick={handleRevelarEstimativa}
                        disabled={isRevelando}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-semibold text-sm transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                      >
                        {isRevelando ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Enviando dados e liberando...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Revelar Minha Estimativa</span>
                            <ArrowRight className="w-4 h-4 ml-0.5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dados enviados com sucesso! Sua estimativa está liberada ao lado.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUNA DIREITA: PAINEL DE ESTIMATIVA EM TEMPO REAL (7 Colunas) */}
                {!isEstimativaRevelada ? (
                  /* ESTADO BLOQUEADO (Antes de preencher nome, whatsapp e email) */
                  <div
                    id="painel-estimativa"
                    className="lg:col-span-7 space-y-5 bg-gradient-to-br from-white via-[var(--araca-creme)]/40 to-[var(--araca-creme)]/70 p-6 sm:p-8 rounded-3xl border border-[var(--araca-bege-medio)] shadow-md text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[var(--araca-mineral-green)]/10 text-[var(--araca-mineral-green)] flex items-center justify-center mx-auto shadow-sm ring-4 ring-[var(--araca-mineral-green)]/5">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Estimativa Pronta para {calculos.area} m²</span>
                      </div>

                      <h3 className="font-display font-semibold text-xl sm:text-2xl text-[var(--araca-cafe-escuro)]">
                        Preencha seus dados para revelar os valores
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--araca-chocolate-amargo)]/75 leading-relaxed">
                        A previsão de investimento para o padrão <strong>{calculos.padraoNome}</strong> já foi calculada com base nas suas escolhas. Preencha seu <strong>nome, WhatsApp e e-mail</strong> ao lado para liberar a faixa de valores de Projeto e Obra.
                      </p>
                    </div>

                    {/* Teaser Borrado com Visual Nobre */}
                    <div className="space-y-3 p-4 rounded-2xl bg-white/70 border border-[var(--araca-bege-medio)]/60 relative overflow-hidden">
                      <div className="filter blur-[6px] select-none pointer-events-none opacity-40 space-y-3">
                        <div className="flex justify-between items-center p-3 bg-neutral-100 rounded-xl">
                          <span className="text-xs font-semibold">Projeto de Interiores</span>
                          <span className="font-display font-bold text-base">R$ 3.800 a R$ 7.600</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-neutral-100 rounded-xl">
                          <span className="text-xs font-semibold">Estimativa de Obra Civil</span>
                          <span className="font-display font-bold text-base">R$ 180.000 a R$ 240.000</span>
                        </div>
                        <div className="p-4 bg-[var(--araca-mineral-green)] text-white rounded-xl">
                          <span className="text-xs font-bold uppercase">Previsão Total de Investimento</span>
                          <div className="font-display text-2xl font-bold">R$ 183.800 a R$ 247.600</div>
                        </div>
                      </div>

                      {/* Overlay com botão e cadeado */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] p-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full border border-[var(--araca-bege-medio)] shadow-md text-xs font-bold text-[var(--araca-cafe-escuro)] mb-2">
                          <Lock className="w-3.5 h-3.5 text-[var(--araca-mineral-green)]" />
                          <span>Valores Protegidos</span>
                        </div>
                        <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/70 max-w-xs">
                          Basta preencher seu contato ao lado e clicar em <strong>"Revelar Minha Estimativa"</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRevelarEstimativa}
                      disabled={isRevelando}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                    >
                      {isRevelando ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Liberando estimativa...</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Liberar Estimativa Completa</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* ESTADO REVELADO (Painel completo com Projeto, Obra e Total) */
                  <div
                    id="painel-estimativa"
                    className="lg:col-span-7 space-y-4 bg-gradient-to-br from-white via-[var(--araca-creme)]/50 to-[var(--araca-creme)]/80 p-5 sm:p-7 rounded-3xl border border-[var(--araca-bege-medio)] shadow-lg animate-fadeIn"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--araca-bege-medio)]/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-[var(--araca-mineral-green)]" />
                        <h3 className="font-display font-semibold text-lg text-[var(--araca-cafe-escuro)]">
                          Painel de Estimativa Preliminar
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[var(--araca-mineral-green)] bg-[var(--araca-mineral-green)]/15 px-3 py-1 rounded-full border border-[var(--araca-mineral-green)]/30">
                        {calculos.area} m² • {calculos.padraoNome}
                      </span>
                    </div>

                    {/* 1. Projeto de Design de Interiores & Decoração */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-[var(--araca-mineral-green)]" />
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                            Projeto de Design de Interiores & Decoração
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-[var(--araca-mineral-green)]">
                          R$ {calculos.projMinRate} a R$ {calculos.projMaxRate}/m²
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">
                          Investimento em Projeto:
                        </span>
                        <span className="font-display text-lg sm:text-xl font-bold text-[var(--araca-cafe-escuro)]">
                          R$ {calculos.projetoMin.toLocaleString('pt-BR')} a R${' '}
                          {calculos.projetoMax.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 pt-1 text-[11px] text-[var(--araca-chocolate-amargo)]/70">
                        <Info className="w-3.5 h-3.5 shrink-0 text-[var(--araca-mineral-green)] mt-0.5" />
                        <span>{CUSTO_CONFIG.projeto.notaExplicativa}</span>
                      </div>
                    </div>

                    {/* 2. Estimativa de Execução de Obra Civil */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-[var(--araca-bege-medio)]/70 shadow-sm space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Hammer className="w-4 h-4 text-[var(--araca-mineral-green)]" />
                          <h4 className="font-semibold text-sm text-[var(--araca-cafe-escuro)]">
                            Estimativa de Execução de Obra Civil
                          </h4>
                        </div>
                        <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">
                          {servicos.length} intervenções marcadas
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xs text-[var(--araca-chocolate-amargo)]/70 font-medium">
                          Materiais + Mão de Obra:
                        </span>
                        <span className="font-display text-lg sm:text-xl font-bold text-[var(--araca-cafe-escuro)]">
                          R$ {calculos.obraMin.toLocaleString('pt-BR')} a R${' '}
                          {calculos.obraMax.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--araca-chocolate-amargo)]/65">
                        Baseada no padrão {calculos.padraoNome}, {calculos.area} m² e nos serviços selecionados.
                      </p>
                    </div>

                    {/* 3. Previsão Total de Investimento (Obra + Projeto) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--araca-mineral-green)] to-[var(--araca-verde-pinho-escuro)] text-white shadow-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-bold text-white/90">
                          Previsão Total de Investimento
                        </span>
                        <span className="text-[10px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                          Obra + Projeto
                        </span>
                      </div>

                      <div className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white">
                        R$ {calculos.totalMin.toLocaleString('pt-BR')} a R${' '}
                        {calculos.totalMax.toLocaleString('pt-BR')}
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed pt-1">
                        Faixa orçamentária paramétrica para planejamento inicial completo do seu imóvel.
                      </p>
                    </div>

                    {/* Callout Estratégico: Ficou fora do orçamento ou quer detalhar cômodo por cômodo? */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/95 border border-amber-300/80 shadow-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-950">
                          Preço de obra estimado preliminarmente
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-amber-950/90 leading-relaxed">
                        <p className="font-semibold text-amber-900">
                          Ficou fora do seu orçamento ou quer uma estimativa com mais detalhes?
                        </p>
                        <p className="text-[11.5px] text-amber-900/80">
                          Detalhe melhor para a gente exatamente quais ambientes serão executados (sala, suíte, cozinha, banheiros) e escolha os serviços pontuais para ter uma ideia mais precisa na nossa calculadora exclusiva de reforma e obra de interiores.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold text-amber-800 hidden sm:inline-block">
                          Simulação personalizada por ambiente
                        </span>
                        <Link
                          href="/quanto-custa-reformar"
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white text-xs font-bold transition-all shadow-sm active:scale-95 ml-auto group"
                        >
                          <span>Calcular Reforma por Ambiente</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* BOTÃO CTA PRINCIPAL */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !concordaTermos}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-[#25D366]/25 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-center cursor-pointer group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processando e gerando estimativa...</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                            <span>Gerar Estimativa e Falar no WhatsApp</span>
                            <ArrowRight className="w-4 h-4 shrink-0 opacity-80 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Feedback e Fallback caso a janela seja bloqueada */}
                      {submitSuccess && whatsappDirectUrl && (
                        <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-200 text-center space-y-1">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-green-800">
                            <BadgeCheck className="w-4 h-4 text-green-600" />
                            <span>Estimativa registrada com sucesso!</span>
                          </div>
                          <p className="text-[11px] text-green-700">
                            Se o WhatsApp não abriu automaticamente,{' '}
                            <a
                              href={whatsappDirectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline hover:text-green-900"
                            >
                              clique aqui para abrir a conversa
                            </a>
                            .
                          </p>
                        </div>
                      )}

                      <p className="text-[11px] text-center text-[var(--araca-chocolate-amargo)]/60 pt-2">
                        🔒 Seus dados estão seguros e são protegidos pela LGPD. Sem spam.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              RODAPÉ: BOTÕES DE NAVEGAÇÃO (VOLTAR / AVANÇAR)
              ================================================================ */}
          <div className="mt-8 pt-6 border-t border-[var(--araca-bege-medio)]/60 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--araca-bege-medio)] text-xs font-semibold text-[var(--araca-chocolate-amargo)] hover:bg-neutral-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar etapa</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--araca-mineral-green)] hover:bg-[var(--araca-mineral-green-hover)] text-white text-sm font-semibold transition-all shadow-md active:scale-95 ml-auto"
              >
                <span>Próxima etapa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
