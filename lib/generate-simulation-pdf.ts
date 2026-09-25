import { jsPDF } from 'jspdf'
import {
  SimulationResult,
  SimulationState,
  formatCurrencyBRL,
} from './calculator-config'

export interface ClientDataForPdf {
  nome: string
  email: string
  telefone: string
}

export function generateSimulationPdf(
  simulationState: SimulationState,
  result: SimulationResult,
  clientData: ClientDataForPdf
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageWidth - margin * 2

  // Paleta Aracá em RGB
  const cCafe = [48, 22, 12] as const // #30160C
  const cMineral = [62, 94, 82] as const // #3E5E52
  const cTerracota = [196, 92, 53] as const // #C45C35
  const cBegeClaro = [248, 244, 237] as const
  const cBegeBorda = [228, 218, 203] as const
  const cCinzaTexto = [95, 78, 70] as const

  let y = 16

  // 1. CABEÇALHO / HEADER ARACÁ
  // Faixa superior decorativa
  doc.setFillColor(cTerracota[0], cTerracota[1], cTerracota[2])
  doc.rect(margin, y, contentWidth, 2, 'F')
  y += 7

  // Nome da Empresa
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('ARACÁ INTERIORES', margin, y)

  // Data de Emissão (alinhada à direita)
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])
  doc.text(`Emissão: ${dataHoje}`, pageWidth - margin, y, { align: 'right' })

  y += 5
  doc.setFontSize(9.5)
  doc.setTextColor(cMineral[0], cMineral[1], cMineral[2])
  doc.text('Arquitetura & Design de Interiores • São Paulo e ABC', margin, y)

  y += 4
  doc.setDrawColor(cBegeBorda[0], cBegeBorda[1], cBegeBorda[2])
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageWidth - margin, y)
  y += 7

  // 2. TÍTULO DO DOCUMENTO
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('ESTIMATIVA PARAMÉTRICA DE CUSTOS DE REFORMA', margin, y)
  y += 4.5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])
  doc.text('Simulação preliminar de referência mercadológica para planejamento financeiro de obra.', margin, y)
  y += 7

  // 3. DADOS DO CLIENTE & PARÂMETROS DA SIMULAÇÃO (BOX)
  doc.setFillColor(cBegeClaro[0], cBegeClaro[1], cBegeClaro[2])
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F')
  doc.setDrawColor(cBegeBorda[0], cBegeBorda[1], cBegeBorda[2])
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'S')

  const boxY = y + 5.5
  const col1 = margin + 5
  const col2 = margin + (contentWidth / 2) + 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('SOLICITANTE:', col1, boxY)
  doc.setFont('helvetica', 'normal')
  doc.text(clientData.nome || 'Não informado', col1 + 25, boxY)

  doc.setFont('helvetica', 'bold')
  doc.text('CONTATO:', col1, boxY + 6.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`${clientData.telefone || ''}  |  ${clientData.email || ''}`, col1 + 25, boxY + 6.5)

  doc.setFont('helvetica', 'bold')
  doc.text('ÁREA CONSIDERADA:', col2, boxY)
  doc.setFont('helvetica', 'normal')
  doc.text(`${result.totalArea} m² (${simulationState.rooms.length} Ambientes)`, col2 + 37, boxY)

  doc.setFont('helvetica', 'bold')
  doc.text('PADRÃO ESCOLHIDO:', col2, boxY + 6.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`${result.standard.name} (${result.standard.subtitle || ''})`, col2 + 37, boxY + 6.5)

  y += 31

  // 4. QUADRO PRINCIPAL DE VALORES
  doc.setFillColor(cMineral[0], cMineral[1], cMineral[2])
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('INVESTIMENTO MÉDIO ESTIMADO DA REFORMA', margin + 6, y + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text(formatCurrencyBRL(result.averageCost), margin + 6, y + 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Média de ${formatCurrencyBRL(result.costPerM2)} por m²`, margin + 6, y + 23)

  // Faixa Mínima e Máxima no lado direito do quadro
  const fMinX = pageWidth - margin - 60
  doc.setFontSize(8)
  doc.setTextColor(240, 240, 240)
  doc.text('CENÁRIO MÍNIMO PREVISTO:', fMinX, y + 9)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(formatCurrencyBRL(result.minCost), fMinX, y + 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('CENÁRIO MÁXIMO PREVISTO:', fMinX, y + 19)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(formatCurrencyBRL(result.maxCost), fMinX, y + 24)

  y += 33

  // 5. DETALHAMENTO DE DISTRIBUIÇÃO DOS CUSTOS (TABELA COMPACTA)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('Composição Estimada por Disciplina:', margin, y)
  y += 4

  const totalCost = result.averageCost
  const pctLabor = totalCost > 0 && result.breakdown.labor > 0 ? Math.round((result.breakdown.labor / totalCost) * 100) : 0
  const pctMaterials = totalCost > 0 && result.breakdown.materials > 0 ? Math.round((result.breakdown.materials / totalCost) * 100) : 0
  const pctWoodwork = totalCost > 0 && result.breakdown.woodwork > 0 ? Math.round((result.breakdown.woodwork / totalCost) * 100) : 0
  const pctStones = totalCost > 0 && result.breakdown.stones > 0 ? Math.round((result.breakdown.stones / totalCost) * 100) : 0

  const breakdownRows = [
    { label: 'Mão de Obra Técnica Especializada', val: result.breakdown.labor, pct: pctLabor },
    { label: 'Materiais Básicos e Revestimentos', val: result.breakdown.materials, pct: pctMaterials },
    { label: 'Marcenaria Sob Medida (Mobiliário Fixo)', val: result.breakdown.woodwork, pct: pctWoodwork },
    { label: 'Marmoraria & Metais Sanitários', val: result.breakdown.stones, pct: pctStones },
  ]

  breakdownRows.forEach((row, i) => {
    const isEven = i % 2 === 0
    if (isEven) {
      doc.setFillColor(250, 248, 245)
      doc.rect(margin, y, contentWidth, 7, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
    doc.text(row.label, margin + 4, y + 4.8)

    doc.setFont('helvetica', 'bold')
    const valText = formatCurrencyBRL(row.val)
    doc.text(valText, margin + 115, y + 4.8)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])
    const pctLabel = row.val > 0 ? `~${row.pct}%` : 'Não inclusa'
    doc.text(pctLabel, pageWidth - margin - 4, y + 4.8, { align: 'right' })

    y += 7
  })

  y += 3

  // 6. ESCOPO DE SERVIÇOS CONSIDERADOS
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('Escopo de Serviços Selecionados na Simulação:', margin, y)
  y += 4.5

  const servicesList = result.activeServices.map((s) => {
    const detail = result.serviceDetails?.[s.id]
    if (detail && !detail.isAllRooms) {
      return `${s.label} (${detail.roomsCount} amb. • ${detail.serviceArea} m²)`
    }
    return s.label
  })
  if (servicesList.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])
    doc.text('Nenhum serviço individual selecionado (cálculo de referência base).', margin, y)
    y += 6
  } else {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])

    // Exibe em 2 colunas
    const mid = Math.ceil(servicesList.length / 2)
    const colA = servicesList.slice(0, mid)
    const colB = servicesList.slice(mid)

    const initialY = y
    colA.forEach((svc, idx) => {
      doc.text(`• ${svc}`, margin + 3, initialY + idx * 4.2)
    })
    colB.forEach((svc, idx) => {
      doc.text(`• ${svc}`, margin + (contentWidth / 2) + 3, initialY + idx * 4.2)
    })
    y = initialY + Math.max(colA.length, colB.length) * 4.2 + 3
  }

  y += 2

  // 7. TERMO OBRIGATÓRIO DE ISENÇÃO DE RESPONSABILIDADE & AVISO LEGAL (DISCLAIMER)
  const disclaimerHeight = 44
  doc.setFillColor(254, 243, 199) // amber-100 suave
  doc.roundedRect(margin, y, contentWidth, disclaimerHeight, 2.5, 2.5, 'F')
  doc.setDrawColor(217, 119, 6) // amber-600
  doc.setLineWidth(0.6)
  doc.roundedRect(margin, y, contentWidth, disclaimerHeight, 2.5, 2.5, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(146, 64, 14) // amber-900
  doc.text('AVISO LEGAL & TERMO DE ISENÇÃO DE RESPONSABILIDADE (NÃO VINCULANTE)', margin + 4, y + 4.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(120, 53, 15) // amber-950

  const disclaimerText =
    '• NÃO VINCULAÇÃO DE PREÇO (ARTS. 30 E 35 DO CDC E ARTS. 186/927 DO CÓDIGO CIVIL): Os valores apresentados constituem uma simulação preliminar meramente informativa e paramétrica, baseada em médias genéricas de mercado (CUB/SINAPI e histórico regional), NÃO representando proposta comercial vinculante, orçamento executivo ou garantia de preço para execução direta pela Aracá Interiores ou por terceiros. Decisões financeiras, contratações ou compras de imóveis não devem ser tomadas com base exclusiva nesta estimativa preliminar.\n\n' +
    '• ATRIBUIÇÃO TÉCNICA E EXIGÊNCIA DE RRT (LEIS FEDERAIS Nº 12.378/2010 E Nº 5.194/1966): A elaboração de orçamento técnico formal executivo é atividade regulamentada que exige projeto de arquitetura e executivo completo, levantamento métrico in loco, vistoria técnica presencial e emissão de Registro de Responsabilidade Técnica (RRT/CAU). Os custos reais variam conforme especificações de projeto, estado do imóvel, condomínio e flutuações do mercado.\n\n' +
    '• DATA-BASE E ABRANGÊNCIA GEOGRÁFICA: Custos médios estimados com base na praça da Região Metropolitana de São Paulo e Grande ABC — referência atualizada 2025/2026.'

  const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth - 8)
  doc.text(splitDisclaimer, margin + 4, y + 9)

  y += disclaimerHeight + 3

  // 8. PRÓXIMOS PASSOS & CONTATO ARACÁ
  doc.setFillColor(cBegeClaro[0], cBegeClaro[1], cBegeClaro[2])
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(cCafe[0], cCafe[1], cCafe[2])
  doc.text('Deseja transformar esta estimativa em realidade com precisão e economia?', margin + 4, y + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(cCinzaTexto[0], cCinzaTexto[1], cCinzaTexto[2])
  doc.text('Solicite seu Projeto de Interiores ou agende uma reunião com a equipe Aracá:', margin + 4, y + 10)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(cMineral[0], cMineral[1], cMineral[2])
  doc.text('WhatsApp: (11) 91465-9204  •  E-mail: contato@araca.arq.br  •  Site: www.araca.arq.br', margin + 4, y + 14.5)

  // Salva e faz download
  const sanitizedName = (clientData.nome || 'Cliente')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 30)
  const filename = `Estimativa-Reforma-Araca-${sanitizedName}.pdf`
  doc.save(filename)
}
