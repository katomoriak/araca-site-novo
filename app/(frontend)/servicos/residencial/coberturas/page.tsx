'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sun,
  ShieldAlert,
  HardHat,
  MessageCircle,
  Sofa,
  UtensilsCrossed,
  Sparkles,
  Waves,
  ShieldCheck,
  Wind,
  Layers,
  Volume2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

// Fotos e imagens conceituais de coberturas
const HERO_COBERTURA = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(18).png'
const IMG_DECK = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'
const IMG_GOURMET = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'
const IMG_MEZANINO = 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png'
const IMG_MASTER = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png'

const DESTAQUES_COBERTURA = [
  {
    title: 'Área Externa Privativa com Deck, Spa ou Piscina',
    desc: 'O refúgio sob o céu aberto. Desenhamos decks em madeira nobre ou porcelanato técnico antiderrapante, lounges externos com lareiras ecológicas de chão, chuveirões esculturais e paisagismo adaptado ao vento e ao sol pleno.',
    icon: Waves,
    img: IMG_DECK,
  },
  {
    title: 'Espaço Gourmet Coberto com Fechamento Panorâmico',
    desc: 'Versatilidade total para receber o ano inteiro. Fechamentos em vidro retrátil, churrasqueiras integradas a coifas de alta sucção, bancadas generosas com chopeiras embutidas e ilha de apoio para experiências gastronômicas inesquecíveis.',
    icon: UtensilsCrossed,
    img: IMG_GOURMET,
  },
  {
    title: 'Mezaninos Imponentes, Escadas Esculturais e Pé-Direito Alto',
    desc: 'A fluidez entre o pavimento social e a área superior. Escadas metálicas ou em concreto aparente desenhadas como verdadeiras obras de arte, integradas a guarda-corpos em vidro e paredes com painéis contínuos monumentais.',
    icon: Layers,
    img: IMG_MEZANINO,
  },
  {
    title: 'Suíte Master Panorâmica e Sala Íntima',
    desc: 'Privacidade absoluta nas alturas. Dormitórios com vista privilegiada da cidade, cortinas motorizadas com acionamento por voz, closets ventilados e banheiros com claraboias ou banheiras de imersão de contemplação.',
    icon: Sparkles,
    img: IMG_MASTER,
  },
]

const CUIDADOS_TECNICOS = [
  {
    title: 'Cálculo de Cargas Estruturais',
    desc: 'Análise rigorosa do peso da lâmina d’água de spas, ofurôs ou piscinas junto ao engenheiro calculista do condomínio antes de qualquer intervenção.',
    icon: ShieldCheck,
  },
  {
    title: 'Impermeabilização de Alta Performance',
    desc: 'Especificação técnica de mantas asfálticas ou poliureias com teste de estanqueidade obrigatório para garantir zero infiltração nos vizinhos inferiores.',
    icon: ShieldAlert,
  },
  {
    title: 'Resistência a Ventos e Insolação Extrema',
    desc: 'Materiais com tratamento UV, pergolados bioclimáticos e fechamentos de sacada testados contra rajadas de vento severas em pavimentos elevados.',
    icon: Wind,
  },
  {
    title: 'Automação e Som Ambiente Setorizado',
    desc: 'Sistemas de som embutidos resistentes à umidade na área externa, integrados a cenários de iluminação e controle climático na palma da mão.',
    icon: Volume2,
  },
]

export default function CoberturasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Coberturas e Penthouses',
    serviceType: 'Design de Interiores Residencial de Alto Padrão para Coberturas',
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
      'Projetos de interiores exclusivos para coberturas duplex, triplex e penthouses em SP e Grande ABC.',
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
            src={HERO_COBERTURA}
            alt="Design de interiores para coberturas e penthouses - Aracá Interiores"
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
                { label: 'Coberturas' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Penthouses e Coberturas Duplex
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores para Coberturas e Penthouses de Alto Padrão
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Viver em uma cobertura combina o conforto da casa com a segurança e a vista panorâmica do edifício. Projetamos ambientes exclusivos que unem áreas externas deslumbrantes a interiores refinados e protegidos.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20projeto%20de%20interiores%20da%20minha%20cobertura."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversar Sobre Minha Cobertura
              </a>
              <Link
                href="/projetos"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Ver Portfólio Geral
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* AMBIENTES E DESTAQUES */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Exclusividade nas Alturas
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              O Ápice da Sofisticação e do Lazer Privativo
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              O projeto de cobertura exige soluções sob medida tanto para as áreas de contemplação externa quanto para os ambientes íntimos e sociais cobertos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {DESTAQUES_COBERTURA.map((item, idx) => {
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

      {/* CUIDADOS TÉCNICOS ESPECÍFICOS */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Engenharia e Segurança
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Segurança Técnica: Impermeabilização e Cargas Estruturais
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Reformar ou projetar uma cobertura envolve responsabilidades técnicas complexas que vão muito além da decoração visual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUIDADOS_TECNICOS.map((item, idx) => {
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

      {/* INTERLINKAGEM */}
      <section className="py-16 bg-araca-creme-claro">
        <Container>
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
                Navegue pelos Serviços Residenciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Conheça Outros Tipos de Projetos Residenciais
              </h3>
              <p className="text-sm text-neutral-600">
                Explore nossas soluções para casas, sobrados, apartamentos compactos e reformas completas com acompanhamento de obra.
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
                href="/servicos/residencial/apartamentos"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Projetos de Apartamentos →
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
              Vamos Tornar Sua Cobertura Única?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Agende uma consulta com nossos especialistas em coberturas e conheça as possibilidades de valorização do seu patrimônio.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20projeto%20da%20minha%20cobertura."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Consulta de Cobertura
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
