'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Home,
  CheckCircle2,
  HardHat,
  MessageCircle,
  Sofa,
  UtensilsCrossed,
  BedDouble,
  Compass,
  TreePine,
  SunMedium,
  Layers,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

// Imagens reais da galeria de casas do escritório
const HERO_CASAS = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'
const IMG_LIVING = 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png'
const IMG_GOURMET = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'
const IMG_SUITE = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png'
const IMG_EXTERNA = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(18).png'

const AMBIENTES_CASA = [
  {
    title: 'Salas de Estar, Jantar e Livings com Pé-Direito Duplo',
    desc: 'Grandes vãos que pedem harmonia, aconchego e proporção milimétrica. Desenhamos livings integrados com lareiras ecológicas, painéis monumentais em lâmina natural de madeira e composições de iluminação cênica que valorizam o volume do espaço.',
    icon: Sofa,
    img: IMG_LIVING,
  },
  {
    title: 'Cozinhas Funcionais e Espaços Gourmet Integrados',
    desc: 'O ponto de encontro da família e amigos. Projetamos cozinhas com ilhas generosas em quartzo ou pedras exóticas, bancadas de cocção integradas ao espaço gourmet, churrasqueiras contemporâneas e conexão visual com piscina e jardim.',
    icon: UtensilsCrossed,
    img: IMG_GOURMET,
  },
  {
    title: 'Suítes Master com Closet Planejado e Banheiro Spa',
    desc: 'Refúgios privativos com isolamento acústico superior. Cabeceiras sob medida, closets amplos com iluminação interna LED integrada, banheiras de imersão freestanding e acabamentos nobres que transformam a rotina em momentos de spa.',
    icon: BedDouble,
    img: IMG_SUITE,
  },
  {
    title: 'Home Office, Varandas e Convivência Externa',
    desc: 'A perfeita transição entre o interior da casa e a área verde. Espaços de trabalho silenciosos e inspiradores, varandas acolhedoras com mobiliário outdoor resistente e integração com o projeto luminotécnico do paisagismo.',
    icon: TreePine,
    img: IMG_EXTERNA,
  },
]

const DIFERENCIAIS_CASAS = [
  {
    title: 'Aproveitamento Solar & Ventilação Cruzada',
    desc: 'Estudo minucioso da incidência de sol e ventos em cada cômodo para escolha de cortinas, revestimentos e climatização eficiente.',
    icon: SunMedium,
  },
  {
    title: 'Harmonia com Paisagismo e Arquitetura',
    desc: 'Projetamos os interiores em perfeita sintonia com a fachada e áreas externas, criando fluidez visual contínua sem quebras de estilo.',
    icon: Compass,
  },
  {
    title: 'Zoneamento Social, Íntimo e de Serviço',
    desc: 'Circulação inteligente que preserva a privacidade da família em dias de recepção e festa, garantindo funcionalidade técnica à rotina doméstica.',
    icon: Layers,
  },
  {
    title: 'Marcenaria & Pedras Nobres em Grande Escala',
    desc: 'Paginação de pedras naturais e detalhamento de marcenaria executiva adaptados a grandes dimensões, sem emendas visíveis incômodas.',
    icon: Sparkles,
  },
]

export default function CasasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Casas no ABC e SP',
    serviceType: 'Design de Interiores Residencial para Casas e Sobrados',
    provider: {
      '@type': 'InteriorDesigner',
      name: 'Aracá Interiores',
      url: 'https://www.araca.arq.br',
      telephone: '+5511939155979',
      email: 'contato@araca.arq.br',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Grande ABC' },
      { '@type': 'AdministrativeArea', name: 'Santo André' },
      { '@type': 'AdministrativeArea', name: 'São Bernardo do Campo' },
      { '@type': 'AdministrativeArea', name: 'São Caetano do Sul' },
      { '@type': 'City', name: 'São Paulo' },
    ],
    description:
      'Projetos de interiores para casas e sobrados de alto padrão em condomínios fechados e áreas nobres de SP e ABC.',
  }

  return (
    <div className="min-h-screen bg-araca-creme-claro text-neutral-900 selection:bg-araca-dourado-ocre/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] lg:min-h-[72vh] flex flex-col justify-between overflow-hidden bg-araca-cafe-escuro text-white pb-12 sm:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_CASAS}
            alt="Design de interiores para casas de alto padrão - Aracá Interiores"
            fill
            priority
            className="object-cover object-center brightness-[0.42] contrast-[1.08]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-araca-cafe-escuro via-araca-cafe-escuro/60 to-transparent" />
        </div>

        <div className="relative z-20">
          <SiteNav theme="dark-bg" />
        </div>

        <Container className="relative z-10 pt-16 sm:pt-20">
          <div className="max-w-3xl">
            <Breadcrumbs
              theme="dark"
              items={[
                { label: 'Serviços', href: '/servicos' },
                { label: 'Residencial', href: '/servicos/residencial' },
                { label: 'Casas' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Projetos Residenciais Exclusivos
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores para Casas e Sobrados de Alto Padrão no ABC e SP
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Casas possuem escala e vocação únicas: generosidade de luz natural, pé-direito duplo e integração com a natureza. Desenhamos interiores autorais que harmonizam a grandiosidade arquitetônica ao acolhimento mais íntimo da sua família.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20interiores%20para%20minha%20casa."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversar Sobre Meu Projeto
              </a>
              <Link
                href="/projetos"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Ver Casas Executadas
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* AMBIENTES PLANEJADOS */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Ambientes Sob Medida
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Ambientes Pensados para a Rotina e Convivência em Casa
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Cada cômodo de uma casa exige atenção às proporções e ao ritmo de vida dos moradores. Planejamos a distribuição de cada metro quadrado para acolher momentos íntimos e grandes recepções.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {AMBIENTES_CASA.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 rounded-xl bg-araca-cafe-escuro/80 backdrop-blur-md p-2.5 text-white border border-white/10">
                      <Icon className="h-5 w-5 text-araca-dourado-ocre" />
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl text-araca-cafe-escuro font-semibold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* DIFERENCIAIS PARA GRANDES METRAGENS */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Engenharia e Estética Integradas
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              O Diferencial do Projeto de Interiores para Casas e Grandes Metragens
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Em residências térreas ou assobradadas, a técnica arquitetônica deve caminhar lado a lado com a escolha refinada de texturas e iluminação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFERENCIAIS_CASAS.map((dif, idx) => {
              const Icon = dif.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-araca-dourado-ocre/20 border border-araca-dourado-ocre/30 flex items-center justify-center text-araca-dourado-ocre mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{dif.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{dif.desc}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* CASES REAIS E PROJETOS */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
                Portfólio Selecionado
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight">
                Veja Projetos de Casas Executados pela Aracá
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center text-sm font-semibold text-araca-mineral-green hover:underline"
            >
              Explorar Todos os Projetos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] group">
              <Image
                src="https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png"
                alt="Residência Feijó - Projeto de Interiores de Casa"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider text-araca-dourado-ocre font-semibold mb-1">
                  Residência Feijó · Sobrado de Alto Padrão
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">
                  Integração Total de Área Social e Convivência com Gourmet
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2">
                  Projeto completo com marcenaria sob medida, iluminação indireta aconchegante e integração entre estar, jantar e jardim.
                </p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] group">
              <Image
                src="https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(12).png"
                alt="Living de Casa com Lareira e Pé-direito Duplo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider text-araca-dourado-ocre font-semibold mb-1">
                  Área Íntima & Suítes
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">
                  Acabamentos Nobres e Conforto Acústico para o Descanso
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2">
                  Suítes climatizadas com cabeceiras contínuas estofadas e iluminação quente pensada para desacelerar o ritmo diário.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTERLINKAGEM COM OUTRAS TIPOLOGIAS */}
      <section className="py-16 bg-araca-creme-claro">
        <Container>
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
                Outras Tipologias Residenciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Mora em Apartamento ou Cobertura?
              </h3>
              <p className="text-sm text-neutral-600">
                Desenvolvemos também soluções especializadas para plantas de apartamentos e coberturas exclusivas, além de gestão técnica de obra.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicos/residencial/apartamentos"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Projetos de Apartamentos →
              </Link>
              <Link
                href="/servicos/residencial/coberturas"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Projetos de Coberturas →
              </Link>
              <Link
                href="/servicos/gestao-acompanhamento-de-obra"
                className="rounded-full bg-araca-mineral-green px-5 py-2.5 text-xs font-semibold text-white hover:bg-araca-mineral-green/90 transition-all shadow-sm"
              >
                Gestão de Obra Presencial
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-24 bg-araca-cafe-escuro text-white text-center">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Vamos Conversar Sobre o Projeto da Sua Casa?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Conte-nos sobre o seu imóvel, seu estilo e seus sonhos. Vamos transformar cada espaço no melhor lugar para viver e receber.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20o%20projeto%20de%20interiores%20da%20minha%20casa."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Proposta para Casa
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
