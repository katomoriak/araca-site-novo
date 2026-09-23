/**
 * Conteúdo da página Sobre nós.
 * Centralizado aqui para edição fácil e futura migração para CMS (Payload).
 */

export const sobreContent = {
  hero: {
    title: 'Aracá Interiores: Projeto que se adapta ao seu momento',
    subtitle:
      'Na Aracá, combinamos estética, funcionalidade e execução. Você escolhe o que contratar — com clareza e um padrão de entrega consistente.',
    /** Imagem de fundo do hero (atrás do menu, P&B, multiply). */
    heroImage: '/projetos/areasocial_residencia-ninhoverce/cover.png',
    heroImageAlt: 'Projeto de interiores Aracá — área social residencial',
    /** Imagem em destaque após o texto (card). Se não definir, usa heroImage. */
    heroCardImage:
      'https://img.araca.arq.br/midias/veraneio-ninho-verde/ARACA_INTERIORES%20(26).png',
    heroCardImageAlt: 'Projeto Aracá — residência Ninho Verde, interiores',
  },

  quemSomos: {
    title: 'Quem somos',
    paragraphs: [
      'Somos a Aracá Interiores, um escritório de Decoração e Design de Interiores com atuação no Grande ABC e em São Paulo. Nosso modelo é totalmente inovador: oferecemos projeto criativo, projeto executivo, detalhamentos e acompanhamento de obra de forma modular.',
      'Como Decoradores e Designers de Interiores no Grande ABC e em São Paulo, buscamos traduzir a identidade de cada cliente em espaços únicos com vida e personalidade. Trabalhamos em projetos residenciais e comerciais, garantindo que você contrate apenas o que faz sentido para o seu momento.',
    ],
  },

  valores: [
    {
      title: 'Estética',
      description: 'Cada espaço reflete identidade e intenção, com materiais e luz pensados para o seu dia a dia.',
    },
    {
      title: 'Funcionalidade',
      description: 'Planejamento que antecipa uso real: circulação, armazenamento e conforto em primeiro lugar.',
    },
    {
      title: 'Execução',
      description: 'Detalhamento e acompanhamento de obra para que o projeto saia do papel com previsibilidade.',
    },
    {
      title: 'Clareza',
      description: 'Processo transparente, escopo definido e comunicação constante em todas as etapas.',
    },
  ],

  processo: {
    title: 'Como trabalhamos',
    steps: [
      { number: 1, title: 'Escuta', description: 'Entendemos seu estilo de vida, referências e prioridades para o espaço.' },
      { number: 2, title: 'Projeto', description: 'Desenvolvemos o conceito criativo e, se desejar, o projeto executivo.' },
      { number: 3, title: 'Detalhamento', description: 'Especificações técnicas e materiais para orçamento e execução.' },
      { number: 4, title: 'Obra', description: 'Acompanhamento na obra para garantir que o resultado reflita o projeto.' },
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
    title: 'Quem está por trás da Aracá',
    subtitle:
      'Uma visão compartilhada de design, funcionalidade e sensibilidade na transformação de ambientes.',
    membros: [
      {
        nome: 'Marcos Paulo',
        cargo: 'Designer & Decorador',
        subtitulo: 'Co-fundador | Graduando em Arquitetura e Urbanismo (FSA 2028)',
        foto: '/equipe/marcos-paulo.jpg',
        fotoAlt: 'Foto de Marcos Paulo — Co-fundador, Designer & Decorador da Aracá Interiores',
        bio: 'Com olhar apurado para harmonia estética, curadoria de texturas e composição de mobiliário, une criatividade e sensibilidade artística para conceber atmosferas acolhedoras e autênticas. Atualmente cursa Arquitetura e Urbanismo na Fundação Santo André (formação prevista para 2028), unindo o rigor técnico da arquitetura ao dinamismo da decoração contemporânea.',
      },
      {
        nome: 'Rafaela Garbuio',
        cargo: 'Designer de Interiores',
        subtitulo: 'Co-fundadora | Graduanda em Arquitetura e Urbanismo (FSA 2028)',
        foto: '/equipe/rafaela-garbuio.jpg',
        fotoAlt: 'Foto de Rafaela Garbuio — Co-fundadora & Designer de Interiores da Aracá Interiores',
        bio: 'Especialista em unir funcionalidade inteligente à expressividade do espaço. Conduz o desenvolvimento de projetos executivos com foco em ergonomia, iluminação e detalhamento minucioso. Também graduanda em Arquitetura e Urbanismo pela Fundação Santo André (conclusão em 2028), traz para cada projeto uma visão estruturada que equilibra beleza e praticidade no dia a dia.',
      },
    ],
  },

  cta: {
    primary: { label: 'Ver projetos', href: '/projetos' },
    secondary: { label: 'Fale conosco', href: '/contato' },
  },
} as const
