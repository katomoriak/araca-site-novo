import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home, Building2, Hammer, CheckCircle2, MessageCircle } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata: Metadata = {
  title: 'Serviços de Design de Interiores | Aracá Interiores',
  description:
    'Desenvolvimento de projetos criativos, projetos executivos completos, detalhamento de marcenaria e acompanhamento de obras residenciais e comerciais no ABC e SP.',
  alternates: {
    canonical: `${baseUrl}/servicos`,
  },
}

const servicosSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Design de Interiores Residencial e Comercial',
      provider: {
        '@id': 'https://www.araca.arq.br/#organization',
      },
      areaServed: [
        'Grande ABC',
        'São Paulo',
      ],
      description:
        'Desenvolvimento de projetos criativos, projetos executivos completos, detalhamento de marcenaria e acompanhamento de obras residenciais.',
    },
  ],
}

const SERVICOS = [
  {
    title: 'Arquitetura e Interiores Residencial',
    subtitle: 'Do apartamento novo à casa de condomínio',
    description:
      'Projetos autorais que unem afeto, funcionalidade e elegância atemporal. Criação de layouts sob medida, estudo luminotécnico e integração de ambientes.',
    href: '/servicos/residencial',
    icon: Home,
    tag: 'Mais Procurado',
    items: [
      'Estudo de layout e volumetria 3D realista',
      'Paleta de materiais e curadoria de mobiliário',
      'Plantas técnicas de elétrica, iluminação e gesso',
    ],
  },
  {
    title: 'Arquitetura e Espaços Comerciais',
    subtitle: 'Ambientes estratégicos para sua marca',
    description:
      'Design corporativo, consultórios, escritórios e pontos de venda planejados para elevar a experiência dos clientes e impulsionar resultados.',
    href: '/servicos/comercial',
    icon: Building2,
    tag: 'Corporativo',
    items: [
      'Identidade visual espacial e branding aplicado',
      'Fluxo de atendimento, ergonomia e acessibilidade',
      'Otimização de custos e cronograma corporativo',
    ],
  },
  {
    title: 'Reforma e Acompanhamento de Obra',
    subtitle: 'Fiscalização técnica e tranquilidade',
    description:
      'Acompanhamento presencial minucioso para garantir fidelidade total ao projeto executivo, evitando retrabalhos, atrasos e desperdício de material.',
    href: '/reforma-de-interiores-residencial',
    icon: Hammer,
    tag: 'Execução',
    items: [
      'Detalhamento minucioso de marcenaria e marmoraria',
      'Compatibilização técnica com instaladores e fornecedores',
      'Relatórios e visitas técnicas no Grande ABC e SP',
    ],
  },
]

export default function ServicosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicosSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1b2a22] to-[#25392d] pt-32 pb-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <Container className="relative z-10 text-center max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Escopo Completo e Modular
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl md:text-6xl text-white">
            Serviços de Interiores com Alma e Rigor Técnico
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-body">
            Desenvolvemos projetos criativos e executivos completos para lares e empresas no Grande ABC e em São Paulo. Escolha a solução ideal para o seu momento.
          </p>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#faf8f5]">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICOS.map((servico) => {
              const Icon = servico.icon
              return (
                <div
                  key={servico.title}
                  className="group flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3c5945]/10 text-[#3c5945] transition-colors group-hover:bg-[#3c5945] group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-[#f3ede6] px-3 py-1 text-xs font-medium text-[#4a3f35]">
                        {servico.tag}
                      </span>
                    </div>

                    <h2 className="mt-6 font-display text-2xl font-bold text-neutral-900">
                      {servico.title}
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      {servico.subtitle}
                    </p>
                    <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-body">
                      {servico.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-neutral-100 space-y-2.5">
                      {servico.items.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="h-4 w-4 text-[#3c5945] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href={servico.href}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'default' }),
                        'w-full justify-between rounded-xl group-hover:bg-[#3c5945] group-hover:text-white group-hover:border-[#3c5945] transition-colors'
                      )}
                    >
                      <span>Ver detalhes do serviço</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Box */}
          <div className="mt-16 rounded-3xl bg-[#3c5945] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                Deseja uma proposta personalizada para sua reforma?
              </h3>
              <p className="mt-3 text-white/80 text-sm sm:text-base font-body">
                Converse diretamente com Marcos Paulo ou Rafaela Garbuio e receba uma avaliação preliminar sem compromisso.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'bg-[#d4af37] text-black hover:bg-[#c29d2b] font-medium rounded-xl gap-2 shadow-md'
                )}
              >
                <MessageCircle className="h-5 w-5" />
                Falar pelo WhatsApp
              </a>
              <Link
                href="/contato"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 rounded-xl'
                )}
              >
                Enviar Mensagem
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
