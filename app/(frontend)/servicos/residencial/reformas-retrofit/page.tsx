'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Hammer,
  Wrench,
  CheckCircle2,
  HardHat,
  MessageCircle,
  Sofa,
  Zap,
  Sparkles,
  Layers,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

// Fotos de projetos executados
const HERO_REFORMA = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'
const IMG_INTEGRACAO = 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png'
const IMG_INFRA = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(38).png'
const IMG_ACABAMENTOS = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png'
const IMG_ILUMINACAO = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png'

const PILARES_RETROFIT = [
  {
    title: 'Retrofit Técnico: Renovação Elétrica, Hidráulica e Climatização',
    desc: 'Imóveis com mais de 10 ou 15 anos não foram concebidos para a carga elétrica dos aparelhos atuais (cooktops por indução, automação, ar-condicionado multi-split). Redimensionamos quadros de força, substituímos tubulações antigas por PEX/PPR e modernizamos prumadas.',
    icon: Zap,
    img: IMG_INFRA,
  },
  {
    title: 'Demolição Estratégica e Integração de Ambientes',
    desc: 'Derrubar paredes certas com respaldo técnico (ART/RRT e laudo de engenharia). Unificamos salas compartimentadas, integramos cozinhas aos livings e transformamos plantas antigas e escuras em espaços luminosos, amplos e contínuos.',
    icon: Hammer,
    img: IMG_INTEGRACAO,
  },
  {
    title: 'Nivelamento de Pisos, Forros e Iluminação Contemporânea',
    desc: 'Eliminação de desníveis indesejados entre cômodos, aplicação de pisos nobres contínuos sem soleiras chamativas, e forros de gesso rebaixados para embutir iluminação indireta cênica, caixas de som e cortineiros iluminados.',
    icon: Layers,
    img: IMG_ILUMINACAO,
  },
  {
    title: 'Harmonização de Acabamentos Nobres e Marcenaria Autoral',
    desc: 'Substituição de revestimentos obsoletos por mármores nobres, porcelanatos em grandes formatos e marcenaria sob medida que oculta pilares, vigas aparentes e quadros de luz, valorizando o patrimônio de forma perene.',
    icon: Sparkles,
    img: IMG_ACABAMENTOS,
  },
]

const VANTAGENS_RETROFIT = [
  {
    title: 'Valorização Imobiliária Imediata',
    desc: 'Um imóvel reformado e modernizado por arquitetos renomados valoriza de 25% a 40% a mais no mercado do que o custo investido na obra.',
    icon: TrendingUp,
  },
  {
    title: 'Segurança Estrutural e Normativa',
    desc: 'Todo processo com emissão de ART/RRT de reforma em total conformidade com a norma NBR 16.280, aprovado perante condomínios.',
    icon: ShieldCheck,
  },
  {
    title: 'Sem Surpresas Orçamentárias',
    desc: 'O diagnóstico prévio do estado do imóvel evita aditivos contratuais indesejados e atrasos por descobertas tardias de canteiro.',
    icon: FileCheck2,
  },
  {
    title: 'Acompanhamento de Obra Presencial',
    desc: 'Possibilidade de contratar nossa Gestão Técnica de Obra para fiscalizar equipes, validar entregas e garantir que o projeto seja executado à risca.',
    icon: HardHat,
  },
]

export default function ReformasRetrofitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Reforma e Retrofit de Interiores Residencial',
    serviceType: 'Reforma de Interiores e Retrofit Residencial de Alto Padrão',
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
      'Projetos de reforma completa de apartamentos e casas com diagnóstico técnico, caderno executivo e retrofit de infraestrutura no ABC e SP.',
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
            src={HERO_REFORMA}
            alt="Reforma e retrofit de interiores residencial - Aracá Interiores"
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
                { label: 'Reformas & Retrofit' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Modernização de Casas e Apartamentos
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Reforma e Retrofit de Interiores Residencial no ABC e São Paulo
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Transforme um imóvel tradicional em um lar contemporâneo de alto padrão. Unimos diagnósticos técnicos de engenharia, projetos executivos milimétricos e materiais de alta tecnologia para revitalizar seu espaço com segurança e previsibilidade.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20um%20diagn%C3%B3stico%20para%20a%20reforma%20do%20meu%20im%C3%B3vel."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Solicitar Diagnóstico de Reforma
              </a>
              <Link
                href="/reforma-de-interiores-residencial"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Conhecer Método Completo de Reforma
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* PILARES DO RETROFIT */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Transformação com Segurança
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Transformação Completa Respeitando a Essência do Seu Imóvel
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              O retrofit vai além de uma pintura nova: ele rejuvenesce toda a estrutura oculta e a estética do imóvel, preparando-o para as próximas décadas de conforto e valorização.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {PILARES_RETROFIT.map((item, idx) => {
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

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Tranquilidade e Previsibilidade
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Por Que Contratar Arquitetos Especialistas para sua Reforma?
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Reformar sem projeto executivo detalhado é a causa número um de atrasos, estouros orçamentários e retrabalhos dolorosos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VANTAGENS_RETROFIT.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-araca-dourado-ocre/20 border border-araca-dourado-ocre/30 flex items-center justify-center text-araca-dourado-ocre mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* CARD SERVIÇO IRMÃO: GESTÃO DE OBRAS */}
      <section className="py-16 bg-araca-creme-claro">
        <Container>
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-araca-mineral-green mb-1 block">
                Etapa Fundamental da Reforma
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Conheça Nossa Gestão e Acompanhamento de Obra
              </h3>
              <p className="text-sm text-neutral-600">
                Evite dores de cabeça com empreiteiros e fornecedores. Nossa equipe fiscaliza o canteiro presencialmente para assegurar fidelidade absoluta ao projeto e cronograma.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicos/gestao-acompanhamento-de-obra"
                className="rounded-full bg-araca-mineral-green px-5 py-2.5 text-xs font-semibold text-white hover:bg-araca-mineral-green/90 transition-all shadow-sm"
              >
                Conhecer Gestão de Obra →
              </Link>
              <Link
                href="/reforma-de-interiores-residencial"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Landing Page de Reformas
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-araca-cafe-escuro text-white text-center">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Vai Reformar seu Imóvel no ABC ou SP?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Vamos avaliar a planta e o estado atual do seu imóvel para propor o melhor projeto de retrofit e modernização.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20a%20reforma%20do%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Agendar Conversa com Arquitetos
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
