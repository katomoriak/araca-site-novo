/**
 * Dados editoriais e técnicos enriquecidos para os projetos Aracá Interiores.
 * Fornece fichas técnicas, conceitos aprofundados, desafios, soluções,
 * destaques arquitetônicos, aspas autorais, status de obra e categorização de ambientes.
 * Otimizado estrategicamente para termos de busca locais e temáticos:
 * - Apto. Elysée: Clássico, Neoclássico, Boiseries, Santo André, Bairro Jardim.
 * - Cozinha Oxalá: Rústico, Ladrilho Português, Conceito Aberto, São Paulo.
 * - Casa Alinho: Gatificação, Pet-Friendly, Marcenaria sob medida, Parque João Ramalho.
 */

export interface ProjectTechnicalSpec {
  localizacao: string
  area: string
  ano: string
  tipo: string
  escopo: string
  status?: string // 'Em execução de obra' | 'Concluído' | 'Em execução'
}

export interface ProjectQuote {
  text: string
  author: string
  role: string
}

export interface EnvironmentCategory {
  id: string
  label: string
  keywords: string[]
}

export interface ProjectRichData {
  slug: string
  title: string
  subtitle: string
  tag: string
  seoKeywords: string[]
  specs: ProjectTechnicalSpec
  conceito: string
  desafio: string
  solucao: string
  destaques: string[]
  quote: ProjectQuote
  ambienteCategorias: EnvironmentCategory[]
}

export const PROJECTS_RICH_DATA: Record<string, ProjectRichData> = {
  apto_elysee: {
    slug: 'apto_elysee',
    title: 'Apto. Elysée',
    subtitle:
      'Design clássico e neoclássico de 210 m² no Bairro Jardim, Santo André. Boiseries com proporção áurea, molduras e requinte atemporal.',
    tag: 'Design de Interiores Clássico & Neoclássico',
    seoKeywords: [
      'design de interiores clássico',
      'design de interiores neoclássico',
      'arquitetura clássica de interiores',
      'apartamento clássico santo andré',
      'apartamento neoclássico bairro jardim',
      'boiserie e molduras clássicas',
      'decoração neoclássica de alto padrão',
      'bairro jardim santo andré',
      'aracá interiores clássico',
    ],
    specs: {
      localizacao: 'Bairro Jardim — Santo André — SP',
      area: '210 m²',
      ano: '2026',
      status: 'Em execução de obra',
      tipo: 'Apartamento de Alto Padrão Clássico e Neoclássico',
      escopo: 'Design de Interiores Clássico e Neoclássico Integral, Boiserie, Marcenaria Usinada e Gestão de Obra',
    },
    conceito:
      'O Apartamento Elysée, situado no nobre Bairro Jardim em Santo André, é a máxima materialização do design de interiores clássico e neoclássico elevado ao mais alto padrão. Atualmente em execução de obra em 2026 para um casal de advogados que aguarda a chegada do primeiro filho, o projeto de aproximadamente 210 m² preserva e enaltece a imponência arquitetônica do edifício tradicional. Boiseries com proporções áureas vestem as paredes emoldurando sancas com iluminação quente (2700K), enquanto a marcenaria clássica sob medida traz molduras usinadas, puxadores em latão e acabamento impecável em laca. A linguagem neoclássica equilibra a suntuosidade das molduras com a serenidade contemporânea de uma paleta neutra e acolhedora.',
    desafio:
      'Aplicar o estilo clássico e neoclássico em uma metragem de aproximadamente 210 m² mantendo a leveza visual, a sofisticação atemporal e a ergonomia moderna, evitando qualquer excesso ornamentado que pudesse pesar visualmente.',
    solucao:
      'Adotamos uma paleta neoclássica "tone-on-tone" em beges seda, off-whites e toques dourados foscos, alternando os requadros de boiserie com superfícies limpas e espelhos bisotados. O projeto contempla hall privativo monumental clássico, living e sala de jantar formal neoclássica para recepções, sala de almoço informal, escritório executivo clássico para o casal, suíte master com closet walk-in de múltiplos módulos usinados e uma suíte infantil com boiserie suave em tons doces.',
    destaques: [
      'Design de Interiores Clássico e Neoclássico com Proporções Áureas',
      'Boiseries em Poliuretano de Alta Densidade com Enquadramentos Milimétricos',
      'Hall Privativo Monumental com Molduras Neoclássicas e Iluminação Cênica',
      'Living e Sala de Jantar Formal com Sancas Iluminadas e Lustre Nobre',
      'Suíte Master com Closet Walk-in Completo em Múltiplos Módulos e Penteadeira',
      'Escritório Executivo em Marcenaria Clássica Escura para Casal de Advogados',
      'Quarto do Bebê com Boiseries Suaves em Tons Pastel e Conforto Acústico',
      'Sala de Almoço Integrada e Deck Externo de Convivência',
    ],
    quote: {
      text: 'O clássico e o neoclássico autênticos nunca saem de moda porque se apoiam na harmonia eterna das proporções. No Elysée, cada moldura e requadro foi milimetricamente desenhado para criar uma atmosfera de solidez, serenidade e nobreza.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'social',
        label: 'Living & Jantar Formal Clássico',
        keywords: ['sala 1', 'sala 2', 'sala 3', 'sala 4', 'sala 5', 'sala 6', 'jantar', 'deck'],
      },
      {
        id: 'hall',
        label: 'Hall Privativo com Boiserie',
        keywords: ['hall'],
      },
      {
        id: 'suite',
        label: 'Suíte Master & Closets',
        keywords: ['suite master', 'suíte master', 'closet', 'penteadaeira'],
      },
      {
        id: 'bebe',
        label: 'Quarto do Bebê & Infantil',
        keywords: ['nenem', 'quarto nenem', 'infantil', 'suíte infantil'],
      },
      {
        id: 'escritorio',
        label: 'Escritório Executivo Clássico',
        keywords: ['escritório', 'escritorio', 'prateleira'],
      },
      {
        id: 'almoco_cozinha',
        label: 'Sala de Almoço & Cozinha',
        keywords: ['almoço', 'almoco', 'cozinha', 'lavanderia', 'despejo'],
      },
    ],
  },

  cozinha_oxala: {
    slug: 'cozinha_oxala',
    title: 'Cozinha Oxalá',
    subtitle:
      'Cozinha rústica de 28 m² em conceito aberto com ladrilho português autêntico, marcenaria acolhedora e ilha funcional em São Paulo.',
    tag: 'Design de Interiores Rústico & Contemporâneo',
    seoKeywords: [
      'cozinha rústica',
      'ladrilho português cozinha',
      'ladrilho hidráulico cozinha',
      'cozinha rústica contemporânea',
      'cozinha conceito aberto rústica',
      'design de interiores com ladrilho português',
      'reforma de cozinha rústica são paulo',
      'ilha gourmet com ladrilho',
      'aracá interiores cozinha rústica',
    ],
    specs: {
      localizacao: 'São Paulo — SP',
      area: '65 m² (Área de Intervenção)',
      ano: '2026',
      status: 'Em execução de obra',
      tipo: 'Reforma de Cozinha Rústica & Área Gourmet em Conceito Aberto',
      escopo: 'Demolição Estrutural, Ladrilho Português, Marcenaria Gourmet e Gestão de Obra',
    },
    conceito:
      'O projeto da Cozinha Oxalá, em São Paulo, celebra o encontro irresistível entre o aconchego do design rústico e a fluidez da arquitetura contemporânea em conceito aberto. O elemento marcante da composição é a paginação artesanal em ladrilho português, cujos padrões tradicionais trazem alma, memória afetiva e forte personalidade ao coração da casa. Atualmente em execução de obra em 2026, a intervenção eliminou antigas alvenarias para conectar a cozinha rústica à sala e à área externa, combinando ilha de cocção generosa, bancadas nobres, detalhes em madeira rústica e iluminação quente que realça a textura dos materiais.',
    desafio:
      'Combinar a expressividade do ladrilho português e elementos rústicos com a praticidade de eletrodomésticos modernos de alta tecnologia, resolvendo interferências estruturais e prumadas hidráulicas de um imóvel antigo.',
    solucao:
      'Integramos o ladrilho português como ponto focal nas paredes de preparo e refeição, harmonizando com armários planejados off-white com puxadores discretos e bancadas de quartzo de fácil manutenção. A ilha gourmet atua como elo entre o rústico acolhedor e a funcionalidade contemporânea, com cooktop embutido, torre quente ergonômica e conexão direta com o quintal e a lavanderia.',
    destaques: [
      'Paginação com Ladrilho Português Tradicional de Inspiração Artesanal',
      'Estética Rústica Aconchegante e Conexão em Conceito Aberto',
      'Ilha Gourmet Central com Cooktop e Bancada de Refeições Rápidas',
      'Torre Quente com Eletrodomésticos Embutidos em Altura Ergonômica',
      'Entrada Generosa de Luz Natural e Conexão Fluida com a Área Externa',
      'Lavanderia Repaginada e Banheiros Integrados no Mesmo Padrão Visual',
    ],
    quote: {
      text: 'O ladrilho português e os elementos rústicos trazem uma ancestralidade calorosa que transforma o ato de cozinhar em pura celebração. A Cozinha Oxalá une história, rusticidade e alta funcionalidade contemporânea.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'cozinha',
        label: 'Cozinha Rústica & Ladrilho Português',
        keywords: ['cozinha'],
      },
      {
        id: 'externa',
        label: 'Área Externa Conectada',
        keywords: ['externa', 'a externa'],
      },
      {
        id: 'servico',
        label: 'Lavanderia Funcional',
        keywords: ['lavanderia'],
      },
      {
        id: 'banhos',
        label: 'Banheiros Renovados',
        keywords: ['banheiro'],
      },
    ],
  },

  'casa-alinho': {
    slug: 'casa-alinho',
    title: 'Casa Alinho',
    subtitle:
      'Projeto pet-friendly de 150 m² em Santo André com gatificação integrada à marcenaria, conforto familiar e estética contemporânea.',
    tag: 'Design de Interiores Familiar & Pet-Friendly com Gatificação',
    seoKeywords: [
      'gatificação',
      'design de interiores com gatificação',
      'marcenaria com gatificação',
      'projeto pet friendly com gatificação',
      'passarelas para gatos marcenaria',
      'design de interiores pet friendly santo andré',
      'parque joão ramalho santo andré',
      'reforma residencial familiar com gatos',
      'aracá interiores gatificação',
    ],
    specs: {
      localizacao: 'Parque João Ramalho — Santo André — SP',
      area: '150 m²',
      ano: '2026',
      status: 'Em execução',
      tipo: 'Residência Familiar & Pet-Friendly com Gatificação',
      escopo: 'Projeto de Interiores Completo, Gatificação Integrada, Reforma e Marcenaria Autoral',
    },
    conceito:
      'Localizada no Parque João Ramalho, em Santo André, a Casa Alinho foi desenhada sob medida para acolher a vida real de uma família completa: o casal, a filha recém-nascida, o filho primogênito e os gatos de estimação da família. Com 150 m², o projeto eleva o conceito de design pet-friendly a um novo patamar através da gatificação arquitetônica integrada: em vez de arranhadores convencionais avulsos e desarmônicos, passarelas elevadas, nichos de escalada e prateleiras de salto felino foram desenhados como parte indissociável da marcenaria sob medida do living e circulação, criando um circuito dinâmico para os gatos que enriquece a estética contemporânea do lar.',
    desafio:
      'Incorporar a gatificação completa para os gatos sem poluir a estética da sala de estar dos adultos, garantindo segurança total e higiene para o bebê que engatinha e a circulação livre do filho ativo.',
    solucao:
      'Desenhamos o circuito de gatificação no plano vertical superior, aproveitando a marcenaria do painel de TV, nichos suspensos e prateleiras com revestimento antiderrapante, permitindo aos felinos explorar o ambiente em rotas aéreas exclusivas. No piso, utilizamos sofás e tecidos com trama fechada antiarranhão e cantos arredondados protetores. Quartos infantis lúdicos e área externa revitalizada completam o aconchego da residência.',
    destaques: [
      'Gatificação Arquitetônica Integrada à Marcenaria sob Medida',
      'Circuito Aéreo de Passarelas e Nichos Felinos Desenhado com Estética Nobre',
      'Mobiliário e Revestimentos Pet-Friendly com Alta Durabilidade e Fácil Limpeza',
      'Living Integrado com Sofá em Ilha e Circulação Livre e Segura',
      'Cozinha Bicolor Contemporânea com Armazenamento Inteligente',
      'Quarto do Menino com Paleta Verde Floresta e Estação de Estudos',
      'Quarto da Bebê com Mesa Montessoriana e Iluminação Confortável',
      'Área Externa com Mural Verde e Lavanderia Integrada e Funcional',
    ],
    quote: {
      text: 'A verdadeira arquitetura afetiva abraça todos os habitantes da casa — inclusive os pets. Na Casa Alinho, a gatificação deixou de ser um acessório e se transformou em marcenaria autoral de alto padrão.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'social',
        label: 'Living com Gatificação & Estar',
        keywords: ['sala', 'sofá', 'sofa', 'televisão', 'televisao', 'tv'],
      },
      {
        id: 'cozinha',
        label: 'Cozinha Bicolor',
        keywords: ['cozinha'],
      },
      {
        id: 'infantil-menino',
        label: 'Quarto Menino (Verde)',
        keywords: ['menino', 'verde', 'pc'],
      },
      {
        id: 'infantil-menina',
        label: 'Quarto Menina (Montessoriano)',
        keywords: ['menina', 'montessoriana', 'quadro', 'cabeceira'],
      },
      {
        id: 'banho',
        label: 'Banho Orgânico',
        keywords: ['banheiro', 'espelho'],
      },
      {
        id: 'externa',
        label: 'Área Externa & Lavanderia',
        keywords: ['externa', 'lavanderia', 'mural'],
      },
    ],
  },

  resindencia_feijo: {
    slug: 'resindencia_feijo',
    title: 'Residência Feijó',
    subtitle:
      'Projeto de 460 m² em Jardim São Caetano com adega vertical climatizada, mármore travertino, ofurô e integração gourmet refinada.',
    tag: 'Arquitetura & Interiores',
    seoKeywords: [
      'arquitetura de interiores são caetano',
      'residência feijó jardim são caetano',
      'adega vertical climatizada sob medida',
      'mármore travertino living',
      'design de interiores alto padrão abc',
      'jardim zen com ofurô residencial',
      'quarto gamer planejado',
    ],
    specs: {
      localizacao: 'Jardim São Caetano — São Caetano do Sul — SP',
      area: '460 m²',
      ano: '2025',
      status: 'Em execução de obra',
      tipo: 'Residência Unifamiliar de Alto Padrão',
      escopo: 'Projeto Arquitetônico, Interiores e Gestão de Obra (Em execução)',
    },
    conceito:
      'A Residência Feijó nasce do encontro harmonioso entre a solidez das pedras naturais e a fluidez de ambientes integrados no prestigiado bairro Jardim São Caetano. O amplo living com pé-direito generoso é revestido em mármore travertino com paginação sob medida, valorizado por um lustre escultórico que pontua o eixo vertical da residência. Para celebrar a paixão da família pela enofilia, a transição entre o hall de entrada e a área social abriga uma espetacular adega climatizada vertical em serralheria preta e vidro, transformando a coleção de rótulos em obra de arte arquitetônica viva.',
    desafio:
      'Integrar uma residência de 460 m² garantindo que os espaços sociais fossem amplos e festivos para receber convidados, sem jamais perder o aconchego diário para cada membro da família, atendendo ainda aos desejos de dois filhos em fases distintas de desenvolvimento.',
    solucao:
      'Desenhamos fluxos contínuos e visuais desimpedidas entre estar, jantar e cozinha gourmet com ilha em quartzo. Nas áreas íntimas, criamos projetos totalmente personalizados: um quarto gamer com marcenaria tecnológica e nichos para o filho, uma suíte teen feminina com atmosfera suave, cabeceira estofada e closet integrado, além de um refúgio externo com jardim zen e ofurô em madeira para relaxamento total.',
    destaques: [
      'Adega Climatizada Vertical sob Medida integrada ao Hall de Entrada',
      'Painel em Mármore Travertino com Paginação Contínua no Living',
      'Jardim Zen Externo com Ofurô em Madeira e Paisagismo Contemplativo',
      'Salas de Banho com Cubas Esculpidas em Pedra Natural e Iluminação Indireta',
      'Quarto Infantojuvenil com Estação Gamer e Marcenaria Tecnológica',
      'Cozinha Gourmet com Ilha Central e Conexão Visual Completa com o Estar',
    ],
    quote: {
      text: 'Na Residência Feijó, cada textura mineral e plano de luz foi desenhado para criar uma atmosfera de solidez e refúgio urbano. O vinho, o jardim zen e a convivência têm aqui seu palco perfeito.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'living',
        label: 'Living & Adega',
        keywords: ['sala', 'estar', 'sofá', 'sofa', 'escada', 'lustre', 'adega', 'hall', 'lavabo'],
      },
      {
        id: 'gourmet',
        label: 'Cozinha Gourmet',
        keywords: ['cozinha', 'social da cozinha', 'gourmet'],
      },
      {
        id: 'zen',
        label: 'Jardim Zen & Ofurô',
        keywords: ['zen', 'ofurô', 'ofuro', 'cadeira'],
      },
      {
        id: 'dormitorios',
        label: 'Quartos & Suítes',
        keywords: ['quarto', 'teen', 'infantojuvenil', 'suíte', 'suite', 'hóspedes', 'hospedes', 'escritório', 'escritorio'],
      },
      {
        id: 'banhos',
        label: 'Salas de Banho',
        keywords: ['banho', 'chuveiro', 'cuba', 'nicho'],
      },
    ],
  },

  'veraneio-ninho-verde': {
    slug: 'veraneio-ninho-verde',
    title: 'Veraneio Ninho Verde',
    subtitle:
      'Casa de campo de 230 m² em Pardinho com design biofílico, varanda gourmet integrada e marcenaria sob medida para refúgio familiar.',
    tag: 'Interiores & Casa de Campo',
    seoKeywords: [
      'casa de campo interiores',
      'casa de veraneio ninho verde',
      'decoração rústica elegante casa de campo',
      'área gourmet com mesa de sinuca',
      'quartos de hóspedes temáticos',
      'design biofílico e texturas naturais',
    ],
    specs: {
      localizacao: 'Ninho Verde II — Interior de SP',
      area: '230 m²',
      ano: '2025',
      status: 'Concluído',
      tipo: 'Casa de Veraneio / Residencial de Campo',
      escopo: 'Design de Interiores Completo, Especificação de Mobiliário e Marcenaria Autoral',
    },
    conceito:
      'O projeto Veraneio Ninho Verde foi concebido como um antídoto à rotina acelerada da metrópole. Com 230 m² totalmente planejados, a casa se abre inteiramente para a paisagem verde ao redor, priorizando materiais honestos e sensoriais: madeiras claras, palha natural, fibras tramadas, linho cru e tons terrosos suaves. A ampla área social unifica sala de estar, jantar e cozinha em um único salão fluido, que se expande para a varanda de lazer equipada com mesa de sinuca, convidando longas tardes de conversa despretensiosa.',
    desafio:
      'Acomodar com máximo conforto tanto a família nuclear quanto grupos de amigos nos finais de semana e férias, garantindo privacidade acústica nos dormitórios, circulação ampla e materiais de fácil limpeza e manutenção no clima de campo.',
    solucao:
      'Setorizamos a casa em uma ala social dinâmica e uma ala íntima serena. Desenvolvemos dormitórios de hóspedes temáticos sob paletas cromáticas sazonais ("Quarto Outono" e "Quarto Verão"), suíte master com cabeceira estofada ampla e banho com pia dupla, e um quarto infantil lúdico com escrivaninha integrada e marcenaria montessoriana.',
    destaques: [
      'Living e Cozinha em Conceito Aberto com Ilha Central e Tons Terrosos',
      'Área de Lazer Integrada com Mesa de Jogos/Sinuca e Vista Panorâmica',
      'Quartos de Hóspedes Temáticos ("Outono" e "Verão") com Paletas Exclusivas',
      'Suíte Master Acolhedora com Banheiro de Pia Dupla e Metais Especiais',
      'Quarto Infantil Menina com Marcenaria Montessoriana e Estação de Desenho',
      'Biofilia e Texturas Naturais que Conectam o Interior à Vegetação Externa',
    ],
    quote: {
      text: 'Projetar uma casa de campo é traduzir a leveza dos dias de descanso em arquitetura. Escolhemos materiais que respiram frescor e convidam ao toque despretensioso.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'social',
        label: 'Living & Estar',
        keywords: ['sala', 'estar', 'televisão', 'televisao', 'tv'],
      },
      {
        id: 'cozinha',
        label: 'Cozinha & Jantar',
        keywords: ['cozinha', 'jantar'],
      },
      {
        id: 'lazer',
        label: 'Lazer & Sinuca',
        keywords: ['externa', 'sinuca', 'mesa'],
      },
      {
        id: 'suites',
        label: 'Suíte Master & Hóspedes',
        keywords: ['suíte', 'suite', 'hóspedes', 'hospedes', 'outono', 'verão', 'verao'],
      },
      {
        id: 'infantil',
        label: 'Quarto Infantil',
        keywords: ['quarto infantil', 'menina', 'escrivaninha'],
      },
      {
        id: 'banhos',
        label: 'Banhos',
        keywords: ['banho', 'banheiro'],
      },
    ],
  },

  projetoaptoblack: {
    slug: 'projetoaptoblack',
    title: 'Projeto Apto. Black',
    subtitle:
      'Apartamento de 82 m² no Brooklin com design dark contemporâneo, cristaleira iluminada e marcenaria sob medida intimista e elegante.',
    tag: 'Interiores & Design Urbano',
    seoKeywords: [
      'apartamento dark brooklin',
      'design de interiores preto e madeira',
      'apartamento compacto moderno são paulo',
      'cristaleira com vidro canelado e led',
      'bancada americana cozinha e estar',
      'iluminação cênica indireta apartamento',
    ],
    specs: {
      localizacao: 'Brooklin — São Paulo — SP',
      area: '82 m²',
      ano: '2023',
      status: 'Concluído',
      tipo: 'Apartamento Urbano Contemporâneo',
      escopo: 'Reforma de Interiores, Marcenaria Planejada e Projeto Luminotécnico Cênico',
    },
    conceito:
      'Localizado no vibrante bairro do Brooklin, em São Paulo, o Projeto Apto. Black desafia a ideia convencional de que metragens compactas de 82 m² exigem apenas paletas brancas. Ao abraçar a sofisticação dos pretos foscos, cinzas profundos e amadeirados escuros, o espaço ganhou uma atmosfera teatral e cosmopolita singular. A sobriedade dos tons é delicadamente equilibrada pelo calor da iluminação indireta quente (2700K) e pelas texturas táteis da marcenaria e dos tecidos escolhidos.',
    desafio:
      'Trabalhar uma cartela predominantemente escura em 82 m² no Brooklin sem comprometer a percepção de amplitude, a circulação e a sensação de acolhimento dos moradores.',
    solucao:
      'Criamos um eixo linear de marcenaria sob medida que conecta a entrada, a cozinha americana e a sala de TV em um gesto arquitetônico contínuo. A cristaleira retroiluminada em serralheria preta e vidro canelado funciona como divisor de ambientes e joia visual do hall, enquanto a bancada americana em pedra preta otimiza as refeições do dia a dia.',
    destaques: [
      'Cristaleira em Serralheria e Vidro Canelado com Retroiluminação LED',
      'Bancada Americana em Quartzo Preto Integrada ao Estar e Jantar',
      'Painel de TV com Fitas LED Indiretas Embutidas e Fiação 100% Oculta',
      'Eixo de Marcenaria Fluida que Maximiza a Sensação de Continuidade',
      'Paleta Dark Harmonizada com Luz Quente de 2700K e Detalhes Amadeirados',
    ],
    quote: {
      text: 'O preto na arquitetura é sinônimo de coragem e refinamento. Quando combinado com a temperatura de cor certa e texturas acolhedoras, ele cria um ninho urbano de pura elegância.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'living',
        label: 'Living & Painel TV',
        keywords: ['sala', 'painel', 'tv', 'sofá', 'sofa'],
      },
      {
        id: 'cozinha',
        label: 'Cozinha Americana & Bancada',
        keywords: ['cozinha', 'bancada', 'americana'],
      },
      {
        id: 'hall',
        label: 'Hall & Cristaleira',
        keywords: ['cristaleira', 'hall'],
      },
    ],
  },
}

/**
 * Retorna os dados enriquecidos de um projeto pelo slug,
 * gerando um fallback consistente caso o projeto não esteja no catálogo inicial.
 */
export function getProjectRichData(
  slug: string,
  fallbackDoc?: { title: string; description?: string; tag?: string }
): ProjectRichData {
  if (PROJECTS_RICH_DATA[slug]) {
    return PROJECTS_RICH_DATA[slug]
  }

  const title = fallbackDoc?.title || 'Projeto Autoral Aracá'
  const tag = fallbackDoc?.tag || 'Design de Interiores'
  const description =
    fallbackDoc?.description ||
    'Projeto autoral desenvolvido pelo estúdio Aracá Interiores, aliando estética sofisticada, funcionalidade e ergonomia real.'

  return {
    slug,
    title,
    subtitle: description.slice(0, 160) + (description.length > 160 ? '...' : ''),
    tag,
    seoKeywords: [
      title,
      tag,
      'Design de Interiores',
      'Arquitetura de Interiores',
      'Aracá Interiores',
      'São Paulo e Grande ABC',
    ],
    specs: {
      localizacao: 'São Paulo e Grande ABC',
      area: 'Projeto Personalizado',
      ano: '2025 / 2026',
      status: 'Em execução',
      tipo: tag,
      escopo: 'Projeto de Interiores Completo e Acompanhamento',
    },
    conceito: description,
    desafio:
      'Compreender as singularidades dos moradores e do espaço, traduzindo necessidades e desejos em uma planta harmoniosa e funcional.',
    solucao:
      'Desenvolvimento de projeto executivo milimétrico, curadoria de acabamentos nobres, iluminação cênica e marcenaria sob medida de alto padrão.',
    destaques: [
      'Marcenaria Autoral sob Medida com Otimização de Espaço',
      'Projeto Luminotécnico Cênico e Acolhedor',
      'Curadoria de Revestimentos e Texturas Naturais',
      'Harmonia Estética e Funcionalidade para o Dia a Dia',
    ],
    quote: {
      text: 'Cada projeto da Aracá é uma resposta única aos hábitos e afetos de quem habita o espaço.',
      author: 'Marcos & Rafaela',
      role: 'Sócios-fundadores e Designers, Aracá Interiores',
    },
    ambienteCategorias: [
      {
        id: 'geral',
        label: 'Ambientes do Projeto',
        keywords: [''],
      },
    ],
  }
}

/**
 * Gera um texto alternativo (alt) rico e altamente otimizado para SEO no Google Imagens,
 * contextualizando o ambiente, o estilo arquitetônico específico (Clássico/Neoclássico,
 * Rústico/Ladrilho Português, Gatificação/Pet-Friendly), o projeto, a localização e o estúdio.
 */
export function getSeoImageAlt(
  rawName: string | undefined,
  projectTitle: string,
  localizacao: string,
  tag: string,
  index: number
): string {
  let cleaned = (rawName || '').trim()
  cleaned = cleaned
    .replace(/_?r0\d/gi, '')
    .replace(/\.jpg|\.png|\.webp/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Tratamento contextual por termos específicos
  if (!cleaned || /^(imagem|foto|asocial|midias|\d+|\(\d+\))/i.test(cleaned)) {
    cleaned = `Perspectiva e detalhe do projeto (${index + 1})`
  } else if (/^sala\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Elysée')
      ? `Living e sala de estar clássica e neoclássica com boiserie (${num})`
      : `Living e sala de estar decorada (Foto ${num})`
  } else if (/^suite master\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Elysée')
      ? `Suíte master neoclássica com boiserie e marcenaria usinada (${num})`
      : `Suíte master com marcenaria planejada (Foto ${num})`
  } else if (/^su[íi]te infantil\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Elysée')
      ? `Quarto infantil clássico suave com molduras e boiseries (${num})`
      : `Suíte infantil com marcenaria sob medida (Foto ${num})`
  } else if (/^sala de jantar\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Elysée')
      ? `Sala de jantar formal neoclássica com boiseries e sancas iluminadas (${num})`
      : `Sala de jantar formal com iluminação cênica (Foto ${num})`
  } else if (/^cozinha\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Oxalá')
      ? `Cozinha rústica em conceito aberto com ladrilho português e ilha (${num})`
      : `Cozinha gourmet planejada com ilha (Foto ${num})`
  } else if (/^closet\s*\d+.*$/i.test(cleaned)) {
    cleaned = projectTitle.includes('Elysée')
      ? `Closet walk-in clássico usinado com iluminação interna (${cleaned})`
      : `Closet sob medida com iluminação interna (${cleaned})`
  } else if (/^hall\s*\d+$/i.test(cleaned)) {
    const num = cleaned.replace(/\D/g, '')
    cleaned = projectTitle.includes('Elysée')
      ? `Hall privativo neoclássico com boiseries e iluminação pontual (${num})`
      : `Hall de entrada com iluminação cênica (Foto ${num})`
  } else if (/^a externa\s*\d*$/i.test(cleaned)) {
    cleaned = projectTitle.includes('Oxalá')
      ? `Área externa integrada à cozinha rústica com ladrilho português`
      : `Área externa integrada com paisagismo e lazer`
  } else if (/^lavanderia\s*\d*$/i.test(cleaned)) {
    cleaned = `Lavanderia funcional com marcenaria embutida`
  } else if (cleaned.toLowerCase().includes('sofá') && projectTitle.includes('Alinho')) {
    cleaned = `Living familiar e pet-friendly com sofá em ilha e gatificação integrada`
  }

  const localCurto = localizacao.split('—')[0].trim()

  // Inclusão de palavras-chave temáticas no fechamento do alt
  let estiloSeo = tag
  if (projectTitle.includes('Elysée')) {
    estiloSeo = 'Design de Interiores Clássico e Neoclássico'
  } else if (projectTitle.includes('Oxalá')) {
    estiloSeo = 'Cozinha Rústica e Ladrilho Português'
  } else if (projectTitle.includes('Alinho')) {
    estiloSeo = 'Design Pet-Friendly com Gatificação'
  }

  return `${cleaned} — ${projectTitle} (${localCurto}) | ${estiloSeo} por Aracá Interiores`
}
