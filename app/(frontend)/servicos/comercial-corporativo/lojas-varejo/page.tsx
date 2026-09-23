'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Store,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  HardHat,
  MessageCircle,
  Eye,
  Layers,
  CheckCircle2,
  DollarSign,
  Palette,
  Compass,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'

const HERO_VAREJO = 'https://img.araca.arq.br/midias/maximed_farmacia/aracainteriores_arquiteturacomercial_farmaciamaximed.png'

const PILARES_VAREJO = [
  {
    title: 'Visual Merchandising & Pontos Focais',
    desc: 'O produto como protagonista absoluto. Desenhamos expositores, araras embutidas, nichos iluminados e ilhas centrais que conduzem o olhar do visitante aos itens de maior margem e lançamento da sua marca.',
    icon: Eye,
    img: HERO_VAREJO,
  },
  {
    title: 'Jornada e Fluxo de Circulação Estratégico',
    desc: 'Layout anti-fricção: estudo da curva de circulação natural dos consumidores. Zonas de desaceleração na entrada, corredores intuitivos e posicionamento estratégico de novidades que aumentam o tempo de permanência.',
    icon: Compass,
    img: 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png',
  },
  {
    title: 'Iluminação Comercial de Alto IRC (Índice de Reprodução de Cor)',
    desc: 'A luz que vende. Projetores em trilhos eletrizados com facho ajustável e lâmpadas que reproduzem a cor real dos tecidos, joias e produtos, sem alterar tons e criando atmosfera envolvente que convida à compra.',
    icon: Sparkles,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
  },
  {
    title: 'Checkouts Atraentes e Provadores Experienciais',
    desc: 'O fechamento da venda sem estresse. Balcões de caixa funcionais com espaço para compras por impulso, e provadores amplos com espelhos favoráveis, iluminação suave sem sombras duras e gancho para fotos.',
    icon: ShoppingBag,
    img: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png',
  },
]

const IMPACTO_RETAIL = [
  {
    title: 'Aumento Direto do Ticket Médio',
    desc: 'A exposição inteligente de produtos complementares e o apelo visual multiplicam compras por impulso no ponto de venda.',
    icon: DollarSign,
  },
  {
    title: 'Experiência de Marca Memorável',
    desc: 'Ambientes instagramáveis e sensorialmente ricos que fazem os clientes preferirem a loja física à compra impessoal online.',
    icon: Palette,
  },
  {
    title: 'Aproveitamento Máximo da Área de Vendas',
    desc: 'Otimização inteligente entre salão de atendimento e estoque de apoio, garantindo rápida reposição de mercadorias.',
    icon: Layers,
  },
  {
    title: 'Acompanhamento e Rapidez de Execução',
    desc: 'Sabemos que dia de loja fechada em reforma é dia sem faturar. Detalhamento executivo rigoroso para obras rápidas e limpas.',
    icon: HardHat,
  },
]

export default function LojasVarejoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Design de Interiores para Lojas e Showrooms',
    serviceType: 'Arquitetura Comercial e Retail Design para Varejo',
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
      'Projetos de arquitetura comercial e design de interiores para lojas, boutiques, farmácias e showrooms em SP e ABC.',
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
            src={HERO_VAREJO}
            alt="Design de interiores para lojas e showrooms - Aracá Interiores"
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
                { label: 'Lojas & Varejo' },
              ]}
              className="mb-6"
            />

            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre backdrop-blur-md border border-white/10 mb-4">
              Arquitetura Comercial e Retail Design
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Design de Interiores e Retail Design para Lojas e Showrooms no ABC e SP
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed mb-8 max-w-2xl">
              Projetamos lojas que transformam visitantes em clientes fiéis. Aplicamos técnicas comprovadas de retail design, fluxo de consumo e iluminação estratégica para valorizar o produto e acelerar o crescimento das suas vendas.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20projeto%20da%20minha%20loja%20ou%20showroom."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl'
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversar Sobre Minha Loja
              </a>
              <Link
                href="/servicos/comercial-corporativo"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                )}
              >
                Conhecer Segmentos Comerciais
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* PILARES DO VAREJO */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-mineral-green mb-2 block">
              Estratégia de Ponto de Venda
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-araca-cafe-escuro font-bold tracking-tight mb-4">
              Cada Detalhe Pensado para Atrair, Envolver e Vender
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              A arquitetura comercial conecta a identidade da sua marca aos desejos do consumidor, criando uma jornada de compra fluida e estimulante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {PILARES_VAREJO.map((item, idx) => {
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

      {/* DIFERENCIAIS DE RETAIL */}
      <section className="py-20 bg-neutral-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-araca-dourado-ocre mb-2 block">
              Performance Comercial
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              O Impacto Real do Retail Design no Seu Negócio
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg">
              Lojas bem projetadas vendem mais, retêm clientes por mais tempo e aumentam a percepção de valor dos produtos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACTO_RETAIL.map((item, idx) => {
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
                Outros Projetos Comerciais
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-araca-cafe-escuro font-semibold mb-2">
                Conheça Nossos Projetos para Escritórios e Clínicas
              </h3>
              <p className="text-sm text-neutral-600">
                Criamos soluções corporativas sob medida para empresas de tecnologia, advocacia e clínicas de saúde.
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
                href="/servicos/comercial-corporativo/clinicas-consultorios"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-araca-cafe-escuro border border-neutral-300 hover:border-araca-mineral-green hover:text-araca-mineral-green transition-all"
              >
                Clínicas & Consultórios →
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
              Vamos Transformar o Ponto de Venda da Sua Marca?
            </h2>
            <p className="text-neutral-300 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Agende uma reunião com nossa equipe de arquitetura comercial e descubra como o retail design pode impulsionar suas vendas.
            </p>
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20o%20projeto%20da%20minha%20loja."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-dourado-ocre hover:bg-araca-dourado-ocre/90 text-white font-medium shadow-xl px-8 py-4 text-base'
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicitar Reunião de Retail Design
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
