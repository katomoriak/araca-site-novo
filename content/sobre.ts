/**
 * Conteúdo da página Sobre nós.
 * Centralizado aqui para edição fácil e futura migração para CMS (Payload).
 */

export const sobreContent = {
  hero: {
    title: 'Aracá Interiores | Estúdio de Design de Interiores no ABC e São Paulo',
    subtitle:
      'Prazer, nós somos a <strong>Aracá</strong>. Acreditamos que o <strong>design de interiores</strong> é, antes de tudo, sobre pessoas e afeto. Não criamos apenas ambientes bonitos: traduzimos histórias reais em <strong>espaços acolhedores</strong>, funcionais e cheios de alma para você viver bem.',
    /** Imagem de fundo do hero (atrás do menu, P&B, multiply). */
    heroImage: '/projetos/areasocial_residencia-ninhoverce/cover.png',
    heroImageAlt: 'Projeto de interiores Aracá — área social residencial',
    /** Imagem em destaque após o texto (card). Se não definir, usa heroImage. */
    heroCardImage:
      'https://img.araca.arq.br/midias/veraneio-ninho-verde/ARACA_INTERIORES%20(26).png',
    heroCardImageAlt: 'Projeto Aracá — residência Ninho Verde, interiores',
  },

  quemSomos: {
    title: 'Quem Somos: Espaços Interiores Feitos de Histórias Reais',
    paragraphs: [
      'A <strong>Aracá Interiores</strong> é um <strong>estúdio de design e decoração de interiores</strong> com atuação em todo o <strong>Grande ABC</strong> (Santo André, São Bernardo, São Caetano) e na capital paulista. Desenvolvemos <strong>projetos residenciais e comerciais</strong> através de um modelo modular e transparente: do conceito criativo ao projeto executivo, detalhamento de marcenaria e acompanhamento de obra. Nosso objetivo é garantir que seu lar reflita sua verdadeira essência, contratando exatamente o que faz sentido para o seu momento.',
    ],
  },

  valores: [
    {
      title: 'Estética com Significado',
      description: 'Cada detalhe reflete sua identidade. Escolhemos paletas, materiais e iluminação que criam aconchego imediato.',
    },
    {
      title: 'Funcionalidade e Ergonomia Real',
      description: 'Espaços pensados para a rotina: circulação fluida, marcenaria inteligente e aproveitamento máximo dos ambientes internos.',
    },
    {
      title: 'Detalhamento e Execução Sem Surpresas',
      description: 'Projetos executivos precisos para marcenaria, marmoraria e elétrica, garantindo que o planejado seja fielmente executado na obra.',
    },
    {
      title: 'Clareza e Liberdade de Escolha',
      description: 'Processo modular e transparente. Você entende cada etapa, controla seu investimento e acompanha o cronograma com tranquilidade.',
    },
  ],

  processo: {
    title: 'Como Transformamos Seu Ambiente: Nosso Método',
    steps: [
      { number: 1, title: '1. Escuta e Diagnóstico de Estilo', description: 'Mergulhamos no seu dia a dia, rotina e preferências estéticas para definir as prioridades do espaço.' },
      { number: 2, title: '2. Conceito Criativo e Layout', description: 'Apresentação visual, estudo de layout, volumetria e definição da personalidade de cada cômodo.' },
      { number: 3, title: '3. Projeto Executivo e Detalhamentos', description: 'Caderno técnico completo com especificações de revestimentos, iluminação, pontos elétricos e mobiliário sob medida.' },
      { number: 4, title: '4. Acompanhamento de Obra e Produção', description: 'Suporte próximo na execução e produção final dos ambientes para que o resultado saia exatamente como sonhado.' },
    ],
  },

  depoimentos: [
    {
      name: 'Vitória Molon Oliveira',
      rating: 5,
      time: '4 meses atrás',
      quote:
        'Pessoal da Aracá Interiores quem fez e nos auxiliou no projeto do nosso primeiro apartamento, muitas dúvidas, inseguranças e começamos do zero... Marcos e Rafaela foram sensacionais criando e acompanhando todos os nossos passos para conseguirmos iniciar nosso projeto/reforma. Super indicamos!',
    },
    {
      name: 'Filipi Cunha',
      rating: 5,
      time: '4 meses atrás',
      quote:
        'A Aracá Interiores superou totalmente minhas expectativas! Atendimento extremamente profissional, atencioso e cheio de criatividade. O projeto ficou sofisticado, funcional e com cada detalhe pensado exatamente no que queria. Além da qualidade do trabalho, o acompanhamento durante todo o processo foi excelente.',
    },
    {
      name: 'Iasmim Oliveira Araujo',
      rating: 5,
      time: '3 meses atrás',
      quote:
        'Marcos e Rafaela têm um olhar muito apurado e um cuidado indescritível quando falamos de trazer o nosso sonho para a realidade. Processo claro, transparente e, acima de tudo: dentro do orçamento. Confesso que achei que no início seria um investimento muito além do que esperava, mas eles tiveram uma atenção profunda em tudo o que falamos.',
    },
    {
      name: 'Raphael Loreno',
      rating: 5,
      time: '3 meses atrás',
      quote:
        'Contratar esse profissional foi uma das melhores decisões que tomamos. Desde o primeiro atendimento, ele demonstrou muito conhecimento, atenção aos detalhes e comprometimento com cada etapa do projeto. Além de transformar nossas ideias em algo ainda melhor do que imaginávamos, conseguiu unir estética, funcionalidade e praticidade de forma impecável.',
    },
    {
      name: 'Bruna Rodrigues',
      rating: 5,
      time: 'Recentemente',
      quote:
        'Eu simplesmente amei o trabalho deles! São muito atenciosos, divertidos e profissionais. Ah e também muito pacientes com as clientes ansiosas tipo... eu hahaha. Recomendo de olhos fechados!',
    },
    {
      name: 'Oscarito Willka Condori',
      rating: 5,
      time: '3 semanas atrás',
      quote:
        'Fiz o meu projeto com eles. Gostei demais do trabalho e deles também, apelidei eles de casal fofo. 🫶🏾 Indicaria sem pensar duas vezes. Cumpriram os prazos, deram a atenção necessária, nada a reclamar.',
    },
    {
      name: 'Fabiola Prior',
      rating: 5,
      time: '1 mês atrás',
      quote:
        'Com uma reunião a Aracá Interiores entendeu exatamente a minha ideia de projeto e necessidade. Tive um atendimento totalmente exclusivo e diferenciado. Super indico quem está buscando profissionais qualificados.',
    },
    {
      name: 'Alice Veloso',
      rating: 5,
      time: '5 meses atrás',
      quote:
        'Trabalho impecável! Captaram exatamente o que queria para meu apartamento. Muita qualidade e eficiência!',
    },
  ],

  equipe: {
    title: 'Quem Cria: A Essência e os Estilos por Trás da Aracá',
    subtitle:
      'Duas visões complementares que transformam ambientes internos em lares autênticos.',
    membros: [
      {
        nome: 'Marcos Paulo',
        cargo: 'Harmonia Clássica e Precisão Atemporal',
        subtitulo: 'Co-fundador | Graduando em Arquitetura e Urbanismo (FSA 2028)',
        foto: '/equipe/marcos-paulo.jpg',
        fotoAlt: 'Foto de Marcos Paulo — Harmonia Clássica e Precisão Atemporal | Aracá Interiores',
        bio: 'Designer apaixonado pelas linhas do <strong>clássico e neoclássico</strong>, Marcos é movido pela harmonia das proporções, pela elegância dos boiseries e pela <strong>curadoria refinada de texturas e mobiliário</strong>. Aliando sua sensibilidade estética ao rigor técnico de sua formação em Arquitetura e Urbanismo (FSA), cria <strong>composições equilibradas, sofisticadas e acolhedoras</strong>.',
      },
      {
        nome: 'Rafaela Garbuio',
        cargo: 'Maximalismo, Texturas e Personalidade Vibrante',
        subtitulo: 'Co-fundadora | Graduanda em Arquitetura e Urbanismo (FSA 2028)',
        foto: '/equipe/rafaela-garbuio.jpg',
        fotoAlt: 'Foto de Rafaela Garbuio — Maximalismo, Texturas e Personalidade Vibrante | Aracá Interiores',
        bio: 'Amante do <strong>maximalismo</strong>, Rafaela explora camadas, cores, iluminação cênica e riqueza de texturas que dão calor e vida aos espaços. Também graduanda em Arquitetura e Urbanismo (FSA), conduz o <strong>detalhamento executivo e a ergonomia</strong> de forma minuciosa, assegurando que a expressividade e a ousadia visual andem de mãos dadas com a <strong>praticidade do dia a dia</strong>.',
      },
    ],
  },

  cta: {
    title: 'Pronto Para Viver Bem? Vamos Conversar Sobre o Seu Projeto',
    description:
      'Seja para reformar um apartamento novo ou renovar a decoração da sua casa no ABC ou em São Paulo, estamos prontos para ouvir sua história.',
    primary: { label: 'Solicitar um Orçamento via WhatsApp', href: 'https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20o%20meu%20projeto.' },
    secondary: { label: 'Conhecer Nossos Projetos', href: '/projetos' },
  },
} as const
