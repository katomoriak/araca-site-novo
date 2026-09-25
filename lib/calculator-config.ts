/**
 * CONFIGURAÇÃO CENTRALIZADA DA CALCULADORA DE CUSTO DE REFORMA
 * Aracá Interiores — São Paulo & Grande ABC
 *
 * Todos os valores base, fatores de multiplicação, ambientes, serviços
 * e faixas de preço por m² estão centralizados aqui para facilitar
 * ajustes futuros da tabela comercial pela equipe.
 */

export type FinishStandardId = 'essencial' | 'conforto' | 'medio' | 'alto' | 'basico'

export interface FinishStandard {
  id: FinishStandardId
  name: string
  subtitle: string
  baseCostPerM2: number // R$ por m² estimado em SP/ABC (base mediana)
  minCostPerM2: number
  maxCostPerM2: number
  description: string
  badge: string
  highlights: string[]
}

export type RoomTypeId =
  | 'sala'
  | 'quarto'
  | 'cozinha'
  | 'banheiro'
  | 'lavabo'
  | 'varanda'
  | 'lavanderia'
  | 'homeoffice'
  | 'salaEstar'
  | 'salaJantar'
  | 'areaGourmet'
  | 'miniVaranda'
  | 'closet'
  | 'quartoBebe'
  | 'quartoCrianca'
  | 'quartoAdolescente'
  | 'homeOffice'
  | 'despensa'
  | 'areaServico'
  | 'jardim'

export interface RoomPresetSize {
  name: 'Pequeno' | 'Médio' | 'Grande'
  area: number // m²
}

export interface RoomTypeConfig {
  id: RoomTypeId
  label: string
  category: 'Área Seca' | 'Área Molhada' | 'Área Mista'
  isWetArea: boolean
  costWeight: number // multiplicador sobre o m² base (ex.: banheiros e cozinhas concentram mais custo)
  defaultSize: number // m² padrão ao adicionar
  presetSizes: RoomPresetSize[]
  description: string
  iconName: string
}

export type ServiceId =
  | 'eletrica'
  | 'hidraulica'
  | 'pisos'
  | 'gesso'
  | 'pintura'
  | 'marmoraria'
  | 'marcenaria'
  | 'demolicao'

export interface ServiceCategoryShares {
  labor: number // fração de mão de obra
  materials: number // fração de materiais
  woodwork: number // fração de marcenaria
  stones: number // fração de marmoraria
}

export interface ServiceConfig {
  id: ServiceId
  label: string
  shortLabel: string
  description: string
  items: string[]
  weight: number // peso relativo no orçamento total de uma reforma 100% completa
  categoryShares: ServiceCategoryShares
  iconName: string
}

export interface CalculatorConfig {
  standards: Record<FinishStandardId, FinishStandard>
  roomTypes: Record<RoomTypeId, RoomTypeConfig>
  services: ServiceConfig[]
  margins: {
    minFactor: number // -12% na faixa mínima
    maxFactor: number // +18% na faixa máxima de contingência
  }
  breakdownBaseWeights: {
    labor: number // Mão de Obra
    materials: number // Materiais Brutos & Revestimentos
    woodwork: number // Marcenaria Sob Medida
    stones: number // Marmoraria & Metais
  }
  contact: {
    whatsappNumber: string // Formato internacional sem '+' ou hífens
    whatsappFormatted: string
    contactEmail: string
  }
}

export const RAW_FINISH_STANDARDS: Record<'essencial' | 'conforto' | 'medio' | 'alto', FinishStandard> = {
  essencial: {
    id: 'essencial',
    name: 'Essencial / Revitalização',
    subtitle: 'Solução inteligente e expressa para pintura geral, pequenos reparos e iluminação pontual, sem quebra-quebra pesado.',
    baseCostPerM2: 1500,
    minCostPerM2: 1250,
    maxCostPerM2: 1800,
    badge: 'Mais Econômico',
    description:
      'Solução inteligente e expressa para pintura geral, pequenos reparos e iluminação pontual, sem quebra-quebra pesado.',
    highlights: [
      'Pintura látex acrílica com retoques',
      'Troca pontual de louças e metais',
      'Revisão elétrica e iluminação básica',
      'Sem demolições ou quebra-quebra pesado',
    ],
  },
  conforto: {
    id: 'conforto',
    name: 'Custo-Benefício Inteligente',
    subtitle: 'Reforma completa funcional com pisos resistentes, marcenaria pontual planejada e excelente controle orçamentário.',
    baseCostPerM2: 2450,
    minCostPerM2: 2050,
    maxCostPerM2: 2850,
    badge: 'Custo-Benefício',
    description:
      'Reforma completa funcional com pisos resistentes, marcenaria pontual planejada e excelente controle orçamentário.',
    highlights: [
      'Porcelanatos e pisos vinílicos até 84x84cm',
      'Pintura acrílica acetinada de boa cobertura',
      'Revisão completa e novos pontos de elétrica/hidráulica',
      'Bancadas em granitos nobres ou quartzo funcional',
      'Marcenaria sob medida funcional para pontos-chave',
    ],
  },
  medio: {
    id: 'medio',
    name: 'Médio Padrão',
    subtitle: 'Equilíbrio ideal entre durabilidade, forro de gesso trabalhado com luz cênica, bancadas nobres e marcenaria completa.',
    baseCostPerM2: 3650,
    minCostPerM2: 3100,
    maxCostPerM2: 4300,
    badge: 'Mais Escolhido',
    description:
      'Equilíbrio ideal entre durabilidade, forro de gesso trabalhado com luz cênica, bancadas nobres e marcenaria completa.',
    highlights: [
      'Porcelanatos retificados grandes (80x80 a 90x90)',
      'Forro de gesso com iluminação embutida e sancas',
      'Redistribuição de pontos elétricos e iluminação cênica',
      'Bancadas em Quartzo / Granitos nobres',
      'Marcenaria sob medida completa nos ambientes',
    ],
  },
  alto: {
    id: 'alto',
    name: 'Alto Padrão',
    subtitle: 'Projeto assinado com grandes lastras, marcenaria autoral com ferragens especiais, climatização e acabamentos nobres.',
    baseCostPerM2: 6200,
    minCostPerM2: 5200,
    maxCostPerM2: 7800,
    badge: 'Projeto Assinado',
    description:
      'Projeto assinado com grandes lastras, marcenaria autoral com ferragens especiais, climatização e acabamentos nobres.',
    highlights: [
      'Grandes lastras (120x120 ou 120x240) ou madeira natural',
      'Marcenaria autoral com vidros reflecta e ferragens importadas',
      'Automação residencial e climatização dutada/embutida',
      'Bancadas esculpidas em Dekton, Neolith ou Mármores Nobres',
    ],
  },
}

export const CALCULATOR_CONFIG: CalculatorConfig = {
  standards: Object.defineProperty({ ...RAW_FINISH_STANDARDS }, 'basico', {
    get() {
      return RAW_FINISH_STANDARDS.conforto
    },
    enumerable: false,
    configurable: true,
  }) as Record<FinishStandardId, FinishStandard>,

  roomTypes: {
    salaEstar: {
      id: 'salaEstar',
      label: 'Sala de Estar',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.0,
      defaultSize: 20,
      presetSizes: [
        { name: 'Pequeno', area: 14 },
        { name: 'Médio', area: 20 },
        { name: 'Grande', area: 36 },
      ],
      description: 'Living com sofá, painel de TV, circulação e iluminação cênica.',
      iconName: 'Sofa',
    },
    salaJantar: {
      id: 'salaJantar',
      label: 'Sala de Jantar',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 0.95,
      defaultSize: 12,
      presetSizes: [
        { name: 'Pequeno', area: 8 },
        { name: 'Médio', area: 12 },
        { name: 'Grande', area: 20 },
      ],
      description: 'Espaço de refeições com mesa de jantar, pendente e buffet.',
      iconName: 'UtensilsCrossed',
    },
    cozinha: {
      id: 'cozinha',
      label: 'Cozinha',
      category: 'Área Molhada',
      isWetArea: true,
      costWeight: 1.75,
      defaultSize: 10,
      presetSizes: [
        { name: 'Pequeno', area: 6 },
        { name: 'Médio', area: 10 },
        { name: 'Grande', area: 18 },
      ],
      description: 'Bancadas em pedra, encanamentos de água quente/gás, revestimentos e marcenaria pesada.',
      iconName: 'Utensils',
    },
    areaGourmet: {
      id: 'areaGourmet',
      label: 'Área Gourmet / Varanda',
      category: 'Área Mista',
      isWetArea: true,
      costWeight: 1.40,
      defaultSize: 10,
      presetSizes: [
        { name: 'Pequeno', area: 6 },
        { name: 'Médio', area: 10 },
        { name: 'Grande', area: 22 },
      ],
      description: 'Nivelamento com o living, churrasqueira, ponto de água e bancada de apoio gourmet.',
      iconName: 'Flame',
    },
    miniVaranda: {
      id: 'miniVaranda',
      label: 'Mini Varanda',
      category: 'Área Mista',
      isWetArea: true,
      costWeight: 1.15,
      defaultSize: 4,
      presetSizes: [
        { name: 'Pequeno', area: 2.5 },
        { name: 'Médio', area: 4 },
        { name: 'Grande', area: 6 },
      ],
      description: 'Varanda compacta com piso nivelado, tomada e iluminação.',
      iconName: 'Sun',
    },
    banheiro: {
      id: 'banheiro',
      label: 'Banheiro Social / Suíte',
      category: 'Área Molhada',
      isWetArea: true,
      costWeight: 2.35,
      defaultSize: 4.5,
      presetSizes: [
        { name: 'Pequeno', area: 3 },
        { name: 'Médio', area: 4.5 },
        { name: 'Grande', area: 8 },
      ],
      description: 'Impermeabilização rigorosa, revestimento de paredes, nichos, box e bancada esculpida.',
      iconName: 'Bath',
    },
    lavabo: {
      id: 'lavabo',
      label: 'Lavabo Social',
      category: 'Área Mista',
      isWetArea: true,
      costWeight: 1.85,
      defaultSize: 2.5,
      presetSizes: [
        { name: 'Pequeno', area: 1.8 },
        { name: 'Médio', area: 2.5 },
        { name: 'Grande', area: 4 },
      ],
      description: 'Bancada esculpida de impacto visual, metais nobres, papel de parede e espelho iluminado.',
      iconName: 'Droplets',
    },
    quarto: {
      id: 'quarto',
      label: 'Quarto / Suíte Principal',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.05,
      defaultSize: 14,
      presetSizes: [
        { name: 'Pequeno', area: 10 },
        { name: 'Médio', area: 14 },
        { name: 'Grande', area: 24 },
      ],
      description: 'Quarto com armários planejados, cabeceira iluminada e pisos confortáveis.',
      iconName: 'BedDouble',
    },
    closet: {
      id: 'closet',
      label: 'Closet',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.30,
      defaultSize: 6,
      presetSizes: [
        { name: 'Pequeno', area: 3.5 },
        { name: 'Médio', area: 6 },
        { name: 'Grande', area: 14 },
      ],
      description: 'Marcenaria sob medida completa com divisórias, sapateiras e iluminação LED.',
      iconName: 'Shirt',
    },
    quartoBebe: {
      id: 'quartoBebe',
      label: 'Quarto de Bebê',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.05,
      defaultSize: 11,
      presetSizes: [
        { name: 'Pequeno', area: 8 },
        { name: 'Médio', area: 11 },
        { name: 'Grande', area: 16 },
      ],
      description: 'Berço, trocador, marcenaria acolhedora e iluminação suave dimerizável.',
      iconName: 'Baby',
    },
    quartoCrianca: {
      id: 'quartoCrianca',
      label: 'Quarto de Criança',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.05,
      defaultSize: 11,
      presetSizes: [
        { name: 'Pequeno', area: 8 },
        { name: 'Médio', area: 11 },
        { name: 'Grande', area: 16 },
      ],
      description: 'Espaço lúdico, cama baixa/beliche, nichos para brinquedos e mesa de estudo.',
      iconName: 'Sparkles',
    },
    quartoAdolescente: {
      id: 'quartoAdolescente',
      label: 'Quarto de Adolescente',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.10,
      defaultSize: 12,
      presetSizes: [
        { name: 'Pequeno', area: 9 },
        { name: 'Médio', area: 12 },
        { name: 'Grande', area: 18 },
      ],
      description: 'Bancada de estudos/gamer, cama espaçosa, armários modernos e tomada USB.',
      iconName: 'Headphones',
    },
    homeOffice: {
      id: 'homeOffice',
      label: 'Home Office',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.15,
      defaultSize: 8,
      presetSizes: [
        { name: 'Pequeno', area: 5 },
        { name: 'Médio', area: 8 },
        { name: 'Grande', area: 15 },
      ],
      description: 'Estante sob medida, bancada ergonômica, fiação embutida e luz focada.',
      iconName: 'Laptop',
    },
    despensa: {
      id: 'despensa',
      label: 'Despensa',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 0.90,
      defaultSize: 3.5,
      presetSizes: [
        { name: 'Pequeno', area: 2 },
        { name: 'Médio', area: 3.5 },
        { name: 'Grande', area: 6 },
      ],
      description: 'Prateleiras reforçadas para mantimentos, eletroportáteis e organização.',
      iconName: 'Package',
    },
    lavanderia: {
      id: 'lavanderia',
      label: 'Lavanderia',
      category: 'Área Molhada',
      isWetArea: true,
      costWeight: 1.45,
      defaultSize: 4.5,
      presetSizes: [
        { name: 'Pequeno', area: 3 },
        { name: 'Médio', area: 4.5 },
        { name: 'Grande', area: 8 },
      ],
      description: 'Tanque embutido, revestimento de zonas de respingo, pontos para máquina e armários.',
      iconName: 'Droplets',
    },
    areaServico: {
      id: 'areaServico',
      label: 'Área de Serviço',
      category: 'Área Molhada',
      isWetArea: true,
      costWeight: 1.35,
      defaultSize: 4,
      presetSizes: [
        { name: 'Pequeno', area: 2.5 },
        { name: 'Médio', area: 4 },
        { name: 'Grande', area: 7 },
      ],
      description: 'Varal retrátil, bancada auxiliar, tanque e guarda de utilidades.',
      iconName: 'Layers',
    },
    jardim: {
      id: 'jardim',
      label: 'Jardim / Área Externa',
      category: 'Área Mista',
      isWetArea: false,
      costWeight: 0.85,
      defaultSize: 12,
      presetSizes: [
        { name: 'Pequeno', area: 6 },
        { name: 'Médio', area: 12 },
        { name: 'Grande', area: 30 },
      ],
      description: 'Paisagismo, piso externo drenante, iluminação e pontos de torneira.',
      iconName: 'Leaf',
    },
    // Aliases para compatibilidade total com presets e simulações
    sala: {
      id: 'sala',
      label: 'Sala de Estar / Jantar',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.0,
      defaultSize: 24,
      presetSizes: [
        { name: 'Pequeno', area: 15 },
        { name: 'Médio', area: 24 },
        { name: 'Grande', area: 42 },
      ],
      description: 'Living integrado, iluminação de destaque, painéis de TV e circulação ampla.',
      iconName: 'Sofa',
    },
    varanda: {
      id: 'varanda',
      label: 'Área Gourmet / Varanda',
      category: 'Área Mista',
      isWetArea: true,
      costWeight: 1.40,
      defaultSize: 10,
      presetSizes: [
        { name: 'Pequeno', area: 5 },
        { name: 'Médio', area: 10 },
        { name: 'Grande', area: 22 },
      ],
      description: 'Nivelamento com o living, churrasqueira, ponto de água e bancada de apoio gourmet.',
      iconName: 'Flame',
    },
    homeoffice: {
      id: 'homeoffice',
      label: 'Home Office',
      category: 'Área Seca',
      isWetArea: false,
      costWeight: 1.15,
      defaultSize: 8,
      presetSizes: [
        { name: 'Pequeno', area: 5 },
        { name: 'Médio', area: 8 },
        { name: 'Grande', area: 15 },
      ],
      description: 'Estante sob medida, bancada ergonômica, fiação embutida e iluminação focada.',
      iconName: 'Laptop',
    },
  },

  services: [
    {
      id: 'demolicao',
      label: 'Demolição / Alvenaria',
      shortLabel: 'Demolição & Drywall',
      description: 'Abertura de vãos, quebra-quebra, caçambas de entulho e novas divisórias de alvenaria ou drywall.',
      items: [
        'Remoção de paredes e abertura de vãos',
        'Retirada de pisos e revestimentos antigos',
        'Descarte ecológico com caçambas homologadas',
        'Construção de novas paredes em alvenaria ou drywall acústico',
      ],
      weight: 0.10, // 10%
      categoryShares: {
        labor: 0.075, // 75% mão de obra
        materials: 0.025, // 25% caçambas, ensaque e descarte
        woodwork: 0,
        stones: 0,
      },
      iconName: 'Hammer',
    },
    {
      id: 'eletrica',
      label: 'Elétrica & Iluminação',
      shortLabel: 'Elétrica & LED',
      description: 'Quadro de disjuntores novo, fiação completa, novos pontos de tomadas e automação.',
      items: [
        'Substituição e modernização do quadro de força (disjuntores DR/DPS)',
        'Passagem de nova fiação antichama dimensionada para ar-condicionado',
        'Criação de novos pontos de tomadas, interruptores e rede de internet',
        'Instalação de perfis de LED, trilhos e pendentes de design',
      ],
      weight: 0.12, // 12%
      categoryShares: {
        labor: 0.066, // 55% mão de obra
        materials: 0.054, // 45% cabos, quadros, disjuntores e módulos
        woodwork: 0,
        stones: 0,
      },
      iconName: 'Zap',
    },
    {
      id: 'hidraulica',
      label: 'Hidráulica & Esgoto',
      shortLabel: 'Hidráulica',
      description: 'Troca de tubulações de água fria/quente, ralos lineares ocultos e registros.',
      items: [
        'Substituição de ramais antigos de ferro ou PVC ressecado',
        'Novas prumadas e conexões de água fria e água quente (PPR/PEX)',
        'Instalação de ralos lineares com grelha oculta e sifões anti-odor',
        'Troca de registros gerais e de pressão com acabamentos de design',
      ],
      weight: 0.10, // 10%
      categoryShares: {
        labor: 0.055, // 55% mão de obra
        materials: 0.045, // 45% tubos PPR/PEX, conexões e registros
        woodwork: 0,
        stones: 0,
      },
      iconName: 'Droplets',
    },
    {
      id: 'pisos',
      label: 'Pisos e Revestimentos',
      shortLabel: 'Pisos & Azulejos',
      description: 'Regularização de contrapiso, impermeabilização e assentamento de porcelanatos.',
      items: [
        'Nivelamento e execução de contrapiso autonivelante',
        'Impermeabilização termoplástica bi-componente em áreas molhadas',
        'Paginação milimétrica com niveladores profissionais',
        'Rejuntamento acrílico ou epóxi de altíssima durabilidade',
      ],
      weight: 0.18, // 18%
      categoryShares: {
        labor: 0.081, // 45% mão de obra de assentamento
        materials: 0.099, // 55% porcelanatos, argamassas e rejuntes
        woodwork: 0,
        stones: 0,
      },
      iconName: 'Grid3X3',
    },
    {
      id: 'gesso',
      label: 'Forro de Gesso & Drywall',
      shortLabel: 'Forro de Gesso',
      description: 'Forro rebaixado em drywall estruturado (F530 tabicado), cortineiros iluminados, sancas e rasgos de luz.',
      items: [
        'Forro liso tabicado em gesso acartonado (drywall estruturado F530 com fita e massa)',
        'Execução de cortineiros embutidos e sancas com iluminação indireta',
        'Reforços para luminárias pesadas e nichos para perfis de LED de sobrepor ou embutir',
        'Acabamento com junta de dilatação perimetral contra trincas estruturais',
      ],
      weight: 0.04, // 4% (~R$ 80 a 140/m² de teto)
      categoryShares: {
        labor: 0.024, // 60% gesseiro especializado
        materials: 0.016, // 40% placas drywall, perfis F530, tabicas e massa
        woodwork: 0,
        stones: 0,
      },
      iconName: 'PanelTop',
    },
    {
      id: 'pintura',
      label: 'Pintura & Emassamento',
      shortLabel: 'Pintura Premium',
      description: 'Preparação completa com selador, emassamento fino, lixamento técnico e pintura acrílica/látex.',
      items: [
        'Fundo preparador / selador acrílico sobre paredes e forro de gesso',
        'Aplicação de massa corrida/acrílica com correção de imperfeições',
        'Lixamento técnico aspirado para acabamento ultra-liso',
        'Pintura em 2 a 3 demãos de tinta acrílica premium (Suvinil ou Coral)',
      ],
      weight: 0.06, // 6% (~R$ 20 a 55/m² de área de parede/teto com insumos)
      categoryShares: {
        labor: 0.039, // 65% pintor profissional
        materials: 0.021, // 35% tintas, massa, selador, lixas e fitas
        woodwork: 0,
        stones: 0,
      },
      iconName: 'Paintbrush',
    },
    {
      id: 'marmoraria',
      label: 'Marmoraria & Pedras Nobres',
      shortLabel: 'Marmoraria',
      description: 'Bancadas de cozinha, lavatórios esculpidos, ilhas gourmet, soleiras e nichos.',
      items: [
        'Bancadas de cozinha com frontão alto e cuba embutida ou de sobrepor',
        'Lavatórios esculpidos na própria pedra ou com cubas esculpidas',
        'Nichos embutidos para shampoo e saboneteira nos banheiros',
        'Soleiras, peitoris e pingadeiras com acabamento 45 graus (meia-esquadria)',
      ],
      weight: 0.14, // 14%
      categoryShares: {
        labor: 0,
        materials: 0,
        woodwork: 0,
        stones: 0.14, // 100% alocado na categoria Marmoraria & Pedras
      },
      iconName: 'Sparkles',
    },
    {
      id: 'marcenaria',
      label: 'Marcenaria Sob Medida',
      shortLabel: 'Marcenaria',
      description: 'Cozinha planejada, armários de quartos, gabinetes, painéis e closets completos.',
      items: [
        'Cozinha completa 100% MDF naval/hidrófugo com corrediças ocultas',
        'Guarda-roupas e closets planejados com divisórias inteligentes e LED',
        'Painéis de TV ripados, portas mimetizadas e painéis de parede',
        'Gabinetes de banheiro e área de serviço sob medida',
      ],
      weight: 0.26, // 26%
      categoryShares: {
        labor: 0,
        materials: 0,
        woodwork: 0.26, // 100% alocado na categoria Marcenaria Sob Medida
        stones: 0,
      },
      iconName: 'Layers',
    },
  ],

  margins: {
    minFactor: 0.88, // -12% na faixa mínima
    maxFactor: 1.18, // +18% na faixa máxima (margem de contingência/materiais)
  },

  breakdownBaseWeights: {
    labor: 0.34, // 34% mão de obra técnica especializada
    materials: 0.29, // 29% materiais básicos e revestimentos
    woodwork: 0.23, // 23% marcenaria sob medida
    stones: 0.14, // 14% marmoraria e louças/metais
  },

  contact: {
    whatsappNumber: '5511939155979',
    whatsappFormatted: '(11) 93915-5979',
    contactEmail: 'contato@araca.arq.br',
  },
}

export interface AddedRoom {
  id: string
  typeId: RoomTypeId
  name: string
  sizePreset: 'Pequeno' | 'Médio' | 'Grande' | 'Personalizado'
  area: number // em m²
  isWetArea: boolean
}

export interface ServiceExecutionDetail {
  id: ServiceId
  label: string
  shortLabel: string
  weight: number
  serviceArea: number
  serviceAreaRatio: number
  serviceCost: number
  roomsCount: number
  totalRoomsCount: number
  roomNames: string[]
  isAllRooms: boolean
}

export interface SimulationState {
  mode: 'total-area' | 'by-rooms'
  totalArea: number // m² para modo total
  standardId: FinishStandardId
  rooms: AddedRoom[]
  selectedServices: ServiceId[]
  serviceRooms?: Record<ServiceId, string[]> // Map de serviço -> IDs dos cômodos onde será executado
}

export interface SimulationResult {
  totalArea: number
  totalWetArea: number
  wetAreaRatio: number
  standard: FinishStandard
  activeServices: ServiceConfig[]
  serviceDetails?: Record<ServiceId, ServiceExecutionDetail>
  servicesScopeRatio: number // de 0 a 1
  baseCost: number
  minCost: number
  averageCost: number
  maxCost: number
  costPerM2: number
  breakdown: {
    labor: number
    materials: number
    woodwork: number
    stones: number
  }
}

/**
 * Redistribui proporcionalmente a metragem dos cômodos para somar exatamente uma nova área total
 */
export function scaleRoomsToTotalArea(rooms: AddedRoom[], targetArea: number): AddedRoom[] {
  if (!rooms || rooms.length === 0) return []
  const safeTarget = Math.max(15, Math.min(600, Math.round(targetArea * 10) / 10))
  const currentSum = rooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0)
  if (currentSum <= 0) return rooms

  const scale = safeTarget / currentSum
  let runningSum = 0

  return rooms.map((r, index) => {
    if (index < rooms.length - 1) {
      const area = Math.max(1, Math.round(r.area * scale * 10) / 10)
      runningSum += area
      return { ...r, area }
    } else {
      const remainder = Math.max(1, Math.round((safeTarget - runningSum) * 10) / 10)
      return { ...r, area: remainder }
    }
  })
}

/**
 * Motor reativo de cálculo de reforma
 */
export function calculateRenovationEstimate(state: SimulationState): SimulationResult {
  const stdKey = state.standardId === 'basico' ? 'conforto' : state.standardId
  const standard = CALCULATOR_CONFIG.standards[stdKey] || CALCULATOR_CONFIG.standards.conforto || CALCULATOR_CONFIG.standards.medio

  // 1. Determinação da área e lista de ambientes base
  const effectiveArea = Math.max(15, Number(state.totalArea) || 60)
  let totalWetArea = 0
  let weightedRoomMultiplierSum = 0
  let activeRoomsList: AddedRoom[] = []

  const rawSum = state.rooms?.reduce((acc, r) => acc + (Number(r.area) || 0), 0) || 75.5
  const scale = effectiveArea / (rawSum > 0 ? rawSum : 75.5)

  activeRoomsList = (state.rooms && state.rooms.length > 0 ? state.rooms : []).map((r) => {
    const scaledArea = Math.round(r.area * scale * 10) / 10
    const roomConfig = CALCULATOR_CONFIG.roomTypes[r.typeId]
    if (r.isWetArea || (roomConfig && roomConfig.isWetArea)) {
      totalWetArea += scaledArea
    }
    const weight = roomConfig ? roomConfig.costWeight : 1.0
    weightedRoomMultiplierSum += scaledArea * weight
    return {
      ...r,
      area: scaledArea,
    }
  })

  const wetAreaRatio = effectiveArea > 0 ? totalWetArea / effectiveArea : 0.25

  // 2. Fator de custo base por metro quadrado ponderado pelos ambientes
  const roomWeightFactor =
    effectiveArea > 0 && weightedRoomMultiplierSum > 0
      ? weightedRoomMultiplierSum / effectiveArea
      : 1.0 + (wetAreaRatio - 0.25) * 0.5

  const baseM2Cost = standard.baseCostPerM2 * Math.max(0.85, Math.min(1.45, roomWeightFactor))

  // 3. Fator de Escopo / Serviços com Ambientes Específicos
  // Cada serviço tem seu peso no orçamento total
  const allServices = CALCULATOR_CONFIG.services
  const selectedServiceConfigs = allServices.filter((s) => state.selectedServices.includes(s.id))
  const totalPossibleWeight = allServices.reduce((acc, s) => acc + s.weight, 0)

  // Custo integral chave-na-mão para 100% dos serviços em 100% da área
  const fullTurnkeyCost = effectiveArea * baseM2Cost

  const serviceDetails: Record<ServiceId, ServiceExecutionDetail> = {} as any
  let totalActiveWeightedCost = 0
  let activeLaborWeight = 0
  let activeMaterialsWeight = 0
  let activeWoodworkWeight = 0
  let activeStonesWeight = 0
  let activeWeight = 0

  selectedServiceConfigs.forEach((s) => {
    // Ambientes selecionados para este serviço específico
    const serviceRoomIds = state.serviceRooms?.[s.id]
    const effectiveServiceRooms =
      serviceRoomIds !== undefined
        ? activeRoomsList.filter((r) => serviceRoomIds.includes(r.id))
        : activeRoomsList

    const serviceArea =
      serviceRoomIds !== undefined
        ? effectiveServiceRooms.reduce((acc, r) => acc + (Number(r.area) || 0), 0)
        : effectiveArea

    const serviceAreaRatio = effectiveArea > 0 ? Math.min(2.0, serviceArea / effectiveArea) : 1
    const serviceCost = Math.round(fullTurnkeyCost * s.weight * serviceAreaRatio)
    const isAllRooms =
      activeRoomsList.length === 0 ||
      serviceRoomIds === undefined ||
      effectiveServiceRooms.length === activeRoomsList.length

    serviceDetails[s.id] = {
      id: s.id,
      label: s.label,
      shortLabel: s.shortLabel,
      weight: s.weight,
      serviceArea: Math.round(serviceArea * 10) / 10,
      serviceAreaRatio,
      serviceCost,
      roomsCount: effectiveServiceRooms.length,
      totalRoomsCount: activeRoomsList.length,
      roomNames: effectiveServiceRooms.map((r) => r.name),
      isAllRooms,
    }

    const effectiveWeightForService = s.weight * serviceAreaRatio
    activeWeight += effectiveWeightForService
    totalActiveWeightedCost += serviceCost

    activeLaborWeight += s.categoryShares.labor * serviceAreaRatio
    activeMaterialsWeight += s.categoryShares.materials * serviceAreaRatio
    activeWoodworkWeight += s.categoryShares.woodwork * serviceAreaRatio
    activeStonesWeight += s.categoryShares.stones * serviceAreaRatio
  })

  // Se nenhum serviço estiver selecionado ou peso ativo for zero, todos os custos zeram
  if (selectedServiceConfigs.length === 0 || activeWeight === 0) {
    return {
      totalArea: Math.round(effectiveArea),
      totalWetArea: Math.round(totalWetArea),
      wetAreaRatio,
      standard,
      activeServices: [],
      serviceDetails: {} as Record<ServiceId, ServiceExecutionDetail>,
      servicesScopeRatio: 0,
      baseCost: 0,
      minCost: 0,
      averageCost: 0,
      maxCost: 0,
      costPerM2: 0,
      breakdown: {
        labor: 0,
        materials: 0,
        woodwork: 0,
        stones: 0,
      },
    }
  }

  const scopeRatio = activeWeight / totalPossibleWeight

  // 4. Custo total médio
  const averageCost = Math.round(totalActiveWeightedCost)

  // 5. Faixa Mínima e Máxima
  const minCost = Math.round(averageCost * CALCULATOR_CONFIG.margins.minFactor)
  const maxCost = Math.round(averageCost * CALCULATOR_CONFIG.margins.maxFactor)
  const costPerM2 = effectiveArea > 0 ? Math.round(averageCost / effectiveArea) : 0

  // 6. Distribuição / Breakdown dinâmico derivado exclusivamente dos serviços ATIVOS
  let labor = activeLaborWeight > 0 ? Math.round((activeLaborWeight / activeWeight) * averageCost) : 0
  let materials = activeMaterialsWeight > 0 ? Math.round((activeMaterialsWeight / activeWeight) * averageCost) : 0
  let woodwork = activeWoodworkWeight > 0 ? Math.round((activeWoodworkWeight / activeWeight) * averageCost) : 0
  let stones = activeStonesWeight > 0 ? Math.round((activeStonesWeight / activeWeight) * averageCost) : 0

  // Ajuste fino de arredondamento para a soma ser rigorosamente idêntica a averageCost
  const currentSum = labor + materials + woodwork + stones
  const diff = averageCost - currentSum
  if (diff !== 0) {
    if (stones > 0) {
      stones += diff
    } else if (woodwork > 0) {
      woodwork += diff
    } else if (materials > 0) {
      materials += diff
    } else if (labor > 0) {
      labor += diff
    }
  }

  return {
    totalArea: Math.round(effectiveArea),
    totalWetArea: Math.round(totalWetArea),
    wetAreaRatio,
    standard,
    activeServices: selectedServiceConfigs,
    serviceDetails,
    servicesScopeRatio: scopeRatio,
    baseCost: averageCost,
    minCost,
    averageCost,
    maxCost,
    costPerM2,
    breakdown: {
      labor,
      materials,
      woodwork,
      stones: Math.max(0, stones),
    },
  }
}

/**
 * Formata valores para moeda brasileira (BRL)
 */
export function formatCurrencyBRL(value: number): string {
  if (isNaN(value)) return 'R$ 0'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Gera mensagem codificada para o WhatsApp com todos os dados da simulação
 */
export function generateRenovationWhatsAppMessage(
  state: SimulationState,
  result: SimulationResult,
  leadName?: string
): string {
  const standardName = result.standard.name
  const area = `${result.totalArea} m²`
  const minVal = formatCurrencyBRL(result.minCost)
  const maxVal = formatCurrencyBRL(result.maxCost)
  const avgVal = formatCurrencyBRL(result.averageCost)

  const servicesList =
    result.activeServices.length > 0
      ? result.activeServices
          .map((s) => {
            const detail = result.serviceDetails?.[s.id]
            if (detail && !detail.isAllRooms) {
              return `• ${s.label} (${detail.roomsCount} amb. • ${detail.serviceArea} m²)`
            }
            return `• ${s.label}`
          })
          .join('\n')
      : '• Nenhum serviço específico marcado'

  const greeting = leadName ? `Olá, meu nome é *${leadName.trim()}* e` : 'Olá, equipe da Aracá Interiores!'

  const text = `${greeting} acabei de fazer uma simulação na *Calculadora de Custo de Reforma* do site:

📐 *Metragem & Ambientes:* ${area} (${state.rooms?.length || 0} cômodos configurados)
⭐ *Padrão de Acabamento:* ${standardName}

📋 *Serviços Selecionados:*
${servicesList}

💰 *Estimativa de Investimento:*
• Faixa Estimada: *${minVal} a ${maxVal}*
• Média Prevista: *${avgVal}* (~${formatCurrencyBRL(result.costPerM2)}/m²)

Gostaria de agendar uma conversa técnica ou solicitar uma proposta executiva detalhada para o meu imóvel. Como podemos proceder?`

  return encodeURIComponent(text)
}

/**
 * Cria a URL pronta para abrir o WhatsApp
 */
export function getWhatsAppSimulationUrl(
  state: SimulationState,
  result: SimulationResult,
  leadName?: string
): string {
  const message = generateRenovationWhatsAppMessage(state, result, leadName)
  return `https://wa.me/${CALCULATOR_CONFIG.contact.whatsappNumber}?text=${message}`
}
