'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HardHat,
  MessageCircle,
  Sofa,
  UtensilsCrossed,
  BedDouble,
  Maximize2,
  Sparkles,
  Sliders,
  KeyRound,
  FileCheck,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

// Fotos reais de projetos de apartamentos da Aracá Interiores (ex: Projeto Apto Black)
const HERO_APTO = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png'
const IMG_LIVING_VARANDA = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(30).png'
const IMG_COZINHA = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(31).png'
const IMG_QUARTO = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png'
const IMG_MARCENARIA = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(37).png'

const AMBIENTES_APTO = [
  {
    title: 'Living Ampliado e Varanda Gourmet Integrada',
    desc: 'Nivelamento de piso entre sala e sacada para criar uma área social contínua e convidativa. Fechamento de vidro, bancada gourmet com churrasqueira ecológica e iluminação indireta para noites agradáveis com amigos.',
    icon: Sofa,
    img: IMG_LIVING_VARANDA,
  },
  {
    title: 'Cozinhas Planejadas & Lavanderias Ocultas',
    desc: 'Otimização ergonômica com marcenaria sob medida inteligente. Painéis ripados ou portas mimetizadas que escondem a área de serviço, integrando a cozinha à sala com bancadas em quartzo e eletros embutidos.',
    icon: UtensilsCrossed,
    img: IMG_COZINHA,
  },
  {
    title: 'Suítes Aconchegantes e Closets Otimizados',
    desc: 'Cada centímetro aproveitado com elegância. Armários planejados com portas de correr reflexivas, cabeceiras estofadas sob medida e circuitos luminotécnicos que valorizam a sensação de acolhimento e repouso.',
    icon: BedDouble,
    img: IMG_QUARTO,
  },
  {
    title: 'Marcenaria Milimétrica Multifuncional',
    desc: 'Móveis que se adaptam à rotina moderna: bancadas de home office camufladas, nichos embutidos, iluminação LED embutida e marcenaria de alto acabamento que confere identidade visual única ao imóvel.',
    icon: Maximize2,
    img: IMG_MARCENARIA,
  },
]

const VANTAGENS_PLANTA = [
  {
    title: 'Personalização Antes da Entrega',
    desc: 'Defina alterações de alvenaria, pontos elétricos e hidráulicos durante o período de obras da construtora, economizando tempo e evitando retrabalho.',
    icon: KeyRound,
  },
  {
    title: 'Orçamento Programado e Sem Surpresas',
    desc: 'Com o projeto 3D e o caderno executivo prontos com antecedência, você cota marcenaria e acabamentos com calma e poder de negociação.',
    icon: FileCheck,
  },
  {
    title: 'Sensação de Amplitude Máxima',
    desc: 'Soluções de espelhos estratégicos, continuidade de piso e integração visual transformam apartamentos compactos em espaços surpreendentemente amplos.',
    icon: Sliders,
  },
  {
    title: 'Iluminação Cênica em Forro de Gesso',
    desc: 'Planejamento de sancas, rasgos de luz e spots pontuais antes de pintar o teto, garantindo circuitos independentes para cada momento do dia.',
    icon: Sparkles,
  },
]

export default function ApartamentosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Apartamentos em SP e ABC',
    serviceType: 'Design de Interiores Residencial para Apartamentos',
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
      'Projetos de interiores especializados em apartamentos novos, na planta e reformas de apartamentos em SP e ABC.',
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
            src={HERO_APTO}
            alt="Design de interiores para apartamentos - Aracá Interiores"
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
                { label: 'Apartamentos' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Apartamentos Novos, na Planta e Reformas
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores para Apartamentos em São Paulo e Grande ABC
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              De plantas compactas sofisticadas a metragens generosas, projetamos apartamentos que integram ambientes com maestria, valorizam cada metro quadrado e trazem a sensação de amplitude, aconchego e exclusividade para o seu dia a dia.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20projeto%20de%20interiores%20para%20o%20meu%20apartamento."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversar Sobre Meu Apartamento
              </a>
              <Link
                href="/projetos"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Ver Apartamentos Prontos
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* AMBIENTES SOB MEDIDA */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Ambientes Planejados
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Soluções Inteligentes para Cada Metro Quadrado
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Viver em apartamento requer um olhar técnico apurado sobre circulação, proporção e versatilidade. Nossos projetos equilibram estética refinada e funcionalidade plena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {AMBIENTES_APTO.map((item, idx) => {
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

      {/* COMPROU NA PLANTA? */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Antecipe e Economize
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Apartamentos Novos e na Planta: Planejamento Antes das Chaves
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Receber as chaves com o projeto de interiores pronto significa entrar na obra sem perder meses pagando condomínio de um imóvel vazio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VANTAGENS_PLANTA.map((item, idx) => {
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

      {/* CASES REAIS */}
      <section className="py-20 sm:py-28 bg-white border-y border-neutral-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
                Portfólio em Destaque
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight">
                Apartamentos Transformados pela Aracá
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center text-sm font-semibold text-araca-mineral-green hover:underline"
            >
              Ver Galeria Completa <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] group">
              <Image
                src="https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png"
                alt="Projeto Apto Black - Design de Interiores para Apartamento"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider text-araca-dourado-ocre font-semibold mb-1">
                  Projeto Apto Black · Santo André
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">
                  Atmosfera Contemporânea com Marcenaria Escura e Iluminação Pontual
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2">
                  Integração total do living, churrasqueira embutida na varanda e suíte master com cabeceira sofisticada.
                </p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] group">
              <Image
                src="https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png"
                alt="Suíte de Apartamento com Iluminação Relaxante"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider text-araca-dourado-ocre font-semibold mb-1">
                  Suíte & Área Íntima
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">
                  Closet Inteligente e Banheiro com Acabamento de Spa
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2">
                  Mobiliário sob medida para acomodar roupas e pertences com facilidade visual e amplitude.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTERLINKAGEM */}
      <section className="py-16 bg-araca-creme-claro">
        <Container>
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
                Outras Opções Residenciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Conheça Também Nossas Soluções para Casas e Coberturas
              </h3>
              <p className="text-sm text-neutral-600">
                Se você está reformando um imóvel antigo ou possui uma cobertura com área externa, veja nossas páginas dedicadas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicos/residencial/casas"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Projetos de Casas →
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

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-araca-cafe-escuro text-white text-center">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Pronto para Transformar Seu Apartamento?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Envie-nos a planta do seu apartamento e agende uma conversa sem compromisso com nossos arquitetos de interiores.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20enviar%20a%20planta%20do%20meu%20apartamento%20para%20uma%20avalia%C3%A7%C3%A3o%20de%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar Planta no WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
