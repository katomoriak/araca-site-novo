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
      'Somos a Aracá Interiores, um escritório de arquitetura de interiores em Santo André com atuação em toda a região de São Paulo SP. Nosso modelo é totalmente inovador: oferecemos projeto criativo, projeto executivo, detalhamentos e acompanhamento de obra de forma modular.',
      'Como arquitetos e designer de interiores em Santo André, buscamos traduzir a identidade de cada cliente em espaços únicos. Trabalhamos em projetos residenciais e comerciais, garantindo que você contrate apenas o que faz sentido para o seu momento.',
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
      name: 'Mariana S.',
      quote:
        'Processo claro e leve. O resultado ficou acima do que imaginamos — e a obra fluiu sem sustos.',
    },
    {
      name: 'Rafael C.',
      quote:
        'Detalhamento impecável. A equipe traduziu nossas referências em um espaço com personalidade.',
    },
    {
      name: 'Camila L.',
      quote:
        'Flexível de verdade: escolhemos o que precisávamos e tivemos suporte no momento certo.',
    },
  ],

  cta: {
    primary: { label: 'Ver projetos', href: '/projetos' },
    secondary: { label: 'Fale conosco', href: '/contato' },
  },
} as const
