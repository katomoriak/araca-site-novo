'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Users,
  ShieldCheck,
  HardHat,
  MessageCircle,
  Lightbulb,
  Building,
  Headphones,
  CheckCircle2,
  Coffee,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_ESCRITORIO = 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png'

const AREAS_CORPORATIVAS = [
  {
    title: 'Open Spaces Colaborativos & Ergonomia NR-17',
    desc: 'Estações de trabalho dinâmicas com passagens de fiação inteligentes, mesas com regulagem de altura e cadeiras de alta performance ergonômica. Desenhamos layouts que favorecem a interação entre equipes sem comprometer a concentração individual.',
    icon: Users,
    img: HERO_ESCRITORIO,
  },
  {
    title: 'Salas de Reunião Executivas com Conforto Acústico',
    desc: 'Espaços pensados para tomadas de decisão e apresentações de impacto. Tratamento acústico com painéis absorvedores de som, cabeamento estruturado para videoconferências em 4K e iluminação técnica antirreflexo.',
    icon: Headphones,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
  },
  {
    title: 'Recepções e Salas de Espera Institucionais',
    desc: 'O primeiro ponto de contato físico do cliente com a sua marca. Balcões de atendimento imponentes, marcenaria sob medida com logomarca retroiluminada e atmosfera executiva que transmite solidez, prestígio e inovação.',
    icon: Building,
    img: 'https://img.araca.arq.br/midias/maximed_farmacia/aracainteriores_arquiteturacomercial_farmaciamaximed.png',
  },
  {
    title: 'Áreas de Descompressão, Copas e Lounges',
    desc: 'Ambientes descontraídos que retêm talentos e estimulam a criatividade. Copas equipadas, sofás modulares, bancadas para refeições rápidas e iluminação acolhedora para momentos de pausa e troca de ideias.',
    icon: Coffee,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
]

const BENEFICIOS_CORPORATIVOS = [
  {
    title: 'Atração e Retenção de Melhores Talentos',
    desc: 'Um ambiente moderno e confortável reduz o turnover e fortalece o orgulho de pertencer da equipe no modelo presencial ou híbrido.',
    icon: Sparkles,
  },
  {
    title: 'Aumento Comprovado de Produtividade',
    desc: 'Iluminação técnica adequada (Lux correto) e conforto acústico reduzem o cansaço visual e aumentam o foco operacional.',
    icon: BarChart3,
  },
  {
    title: 'Conformidade com Normas Regulamentadoras',
    desc: 'Projetos em total aderência à NR-17 (ergonomia), normas de combate a incêndio (AVCB) e rotas de fuga acessíveis.',
    icon: ShieldCheck,
  },
  {
    title: 'Identidade de Marca Aplicada ao Espaço',
    desc: 'Branding ambiental que materializa os valores e a cultura da sua empresa na arquitetura, cores e texturas.',
    icon: Briefcase,
  },
]

export default function EscritoriosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Escritórios e Sedes',
    serviceType: 'Design de Interiores Corporativo para Escritórios e Empresas',
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
      'Projetos de interiores corporativos para escritórios, sedes empresariais e coworkings em SP e Grande ABC.',
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
            src={HERO_ESCRITORIO}
            alt="Design de interiores para escritórios e espaços corporativos - Aracá Interiores"
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
                { label: 'Comercial & Corporativo', href: '/servicos/comercial-corporativo' },
                { label: 'Escritórios' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Arquitetura Corporativa
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores para Escritórios e Espaços Corporativos no ABC e SP
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Criamos escritórios contemporâneos que unem ergonomia, acústica e identidade de marca. Ambientes inspiradores que atraem talentos, elevam a produtividade da equipe e impressionam clientes e investidores.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20corporativo%20para%20minha%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Agendar Reunião Corporativa
              </a>
              <Link
                href="/servicos/comercial-corporativo"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Ver Serviços Comerciais
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ÁREAS CORPORATIVAS */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Setores Estratégicos
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Ambientes Desenhados para a Alta Performance
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              O layout de um escritório moderno equilibra zonas de foco profundo e espaços dinâmicos de conexão entre equipes e lideranças.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {AREAS_CORPORATIVAS.map((item, idx) => {
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

      {/* DIFERENCIAIS CORPORATIVOS */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Retorno sobre o Investimento
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Vantagens Estratégicas do Projeto Corporativo Aracá
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Um escritório inteligente não é custo, é alavanca de produtividade e consolidação de marca no mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFICIOS_CORPORATIVOS.map((item, idx) => {
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

      {/* INTERLINKAGEM COM OUTROS COMERCIAIS */}
      <section className="py-16 bg-araca-creme-claro">
        <Container>
          <div className="rounded-3xl bg-neutral-100 border border-neutral-200/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
                Outros Segmentos Comerciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Atua na Área de Saúde ou Varejo?
              </h3>
              <p className="text-sm text-neutral-600">
                Conheça nossos projetos especializados para consultórios médicos, clínicas de estética e lojas de varejo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicos/comercial-corporativo/clinicas-consultorios"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Clínicas & Consultórios →
              </Link>
              <Link
                href="/servicos/comercial-corporativo/lojas-varejo"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Lojas & Varejo →
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
              Vamos Projetar o Novo Escritório da Sua Empresa?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Solicite uma proposta personalizada e receba um estudo prévio de viabilidade espacial e layout para a sua sede corporativa.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20uma%20proposta%20para%20o%20projeto%20corporativo%20da%20minha%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Briefing Corporativo
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
