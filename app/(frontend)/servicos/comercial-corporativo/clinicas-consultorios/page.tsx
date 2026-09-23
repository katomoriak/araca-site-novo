'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  MessageCircle,
  HeartPulse,
  Sparkles,
  Smile,
  Accessibility,
  Eye,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_CLINICA = 'https://img.araca.arq.br/midias/maximed_farmacia/aracainteriores_arquiteturacomercial_farmaciamaximed.png'

const AMBIENTES_CLINICA = [
  {
    title: 'Recepções Humanizadas e Salas de Espera Confortáveis',
    desc: 'Eliminamos a frieza dos consultórios tradicionais. Desenhamos salas de espera com poltronas ergonômicas individuais, iluminação indireta quente, aromatização integrada e isolamento acústico para transmitir calma e acolhimento aos pacientes.',
    icon: Smile,
    img: HERO_CLINICA,
  },
  {
    title: 'Consultórios Médicos e Odontológicos Ergonômicos',
    desc: 'Mesa de atendimento elegante para diálogo com o paciente separada da área de exame físico. Marcenaria hospitalar em conformidade técnica, gaveteiros com fechamento suave e iluminação pontual de precisão.',
    icon: Stethoscope,
    img: 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png',
  },
  {
    title: 'Salas de Procedimentos, Estética e Exames',
    desc: 'Revestimentos vinílicos ou porcelanatos de junta mínima laváveis e antifúngicos. Bancadas com cubas profundas e acionamento por cotovelo ou sensor, fluxo de descarte de resíduos e pontos elétricos estabilizados para equipamentos de ponta.',
    icon: HeartPulse,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
  {
    title: 'Sanitários Acessíveis e Espaços de Apoio Técnico',
    desc: 'Banheiros adaptados elegantes em total respeito à norma NBR 9050, DML (Depósito de Material de Limpeza), expurgo e copa de funcionários planejados milimetricamente para otimizar a área útil da clínica.',
    icon: Accessibility,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(15).png',
  },
]

const NORMAS_E_DIFERENCIAIS = [
  {
    title: 'Aprovação Facilitada na Vigilância Sanitária',
    desc: 'Projetos desenhados rigorosamente de acordo com a RDC 50 da ANVISA e diretrizes das vigilâncias municipais do ABC e SP.',
    icon: ShieldCheck,
  },
  {
    title: 'Acessibilidade Universal NBR 9050',
    desc: 'Portas com larguras regulamentares, barras de apoio elegantes, corredores fluidos para macas/cadeiras e piso tátil integrado ao design.',
    icon: Accessibility,
  },
  {
    title: 'Iluminação Circadiana e Relaxante',
    desc: 'Temperatura de cor da luz calculada para acalmar a ansiedade de quem aguarda atendimento e garantir precisão diagnóstica no consultório.',
    icon: Eye,
  },
  {
    title: 'Biossegurança com Estética de Alto Padrão',
    desc: 'Materiais nobres impermeáveis, fáceis de higienizar e duráveis, que transmitem credibilidade e elegância aos seus pacientes particulares.',
    icon: Activity,
  },
]

export default function ClinicasConsultoriosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Clínicas e Consultórios',
    serviceType: 'Arquitetura de Interiores para Clínicas Médicas e Odontológicas',
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
      'Projetos de interiores para clínicas médicas, consultórios de odontologia, psicologia e estética com aprovação ANVISA em SP e ABC.',
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
            src={HERO_CLINICA}
            alt="Design de interiores para clínicas e consultórios - Aracá Interiores"
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
                { label: 'Clínicas & Consultórios' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Saúde e Bem-Estar com Rigor Técnico
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores para Clínicas e Consultórios Médicos no ABC e SP
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Projetamos espaços de saúde que acolhem o paciente com aconchego e sofisticação, transformando a experiência de consulta e cumprindo com rigor técnico todas as exigências sanitárias e de acessibilidade da ANVISA.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20para%20minha%20cl%C3%ADnica%20ou%20consult%C3%B3rio."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar Sobre Meu Consultório
              </a>
              <Link
                href="/servicos/comercial-corporativo"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Ver Outros Serviços Comerciais
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* AMBIENTES DA CLÍNICA */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Humanização & Biossegurança
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Ambientes Projetados para o Cuidado e a Confiança
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              O design de um consultório deve equilibrar duas forças essenciais: a sensação de bem-estar para quem é atendido e a praticidade asséptica para quem opera os atendimentos diários.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {AMBIENTES_CLINICA.map((item, idx) => {
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

      {/* NORMAS ANVISA E TÉCNICA */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Conformidade Sanitária
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Rigor às Normas da ANVISA sem Abrir Mão da Beleza
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Evite notificações e embargos da vigilância sanitária com projetos executivos que atendem todas as exigências legais desde o primeiro traço.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NORMAS_E_DIFERENCIAIS.map((item, idx) => {
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
                Outros Segmentos Comerciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Conheça Também Projetos para Escritórios e Lojas
              </h3>
              <p className="text-sm text-neutral-600">
                Se você também precisa projetar sedes corporativas, coworkings ou espaços de varejo, conheça nossas outras divisões.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/servicos/comercial-corporativo/escritorios"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Escritórios Corporativos →
              </Link>
              <Link
                href="/servicos/comercial-corporativo/lojas-varejo"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Lojas & Showrooms →
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
              Vamos Criar um Espaço de Saúde Referência no ABC ou SP?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Receba um atendimento personalizado com arquitetos especialistas em normas de saúde e arquitetura hospitalar de alto padrão.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20projeto%20da%20minha%20cl%C3%ADnica."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Reunião de Briefing
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
