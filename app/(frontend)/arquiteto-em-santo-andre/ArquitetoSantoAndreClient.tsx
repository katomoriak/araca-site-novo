'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Home, Store, ShieldCheck, HelpCircle } from 'lucide-react'
import type { ProjectGalleryItem } from '@/components/home/ProjectGallery'

const TestimonialsMarquee = dynamic(
  () => import('@/components/home/TestimonialsMarquee').then((m) => ({ default: m.TestimonialsMarquee })),
  { ssr: false }
)

const GalleryCarousel = dynamic(
  () => import('@/components/home/GalleryCarousel').then((m) => ({ default: m.GalleryCarousel })),
  { ssr: false }
)

const ProjectGallery = dynamic(
  () => import('@/components/home/ProjectGallery').then((m) => ({ default: m.ProjectGallery })),
  { ssr: false }
)

// Fallback projects if needed
const FALLBACK_PROJECTS: ProjectGalleryItem[] = [
  {
    id: '1',
    title: 'Design Biofílico Vila Assunção',
    description: 'Reforma de apartamento com integração total de vegetação e luz natural.',
    tag: 'Residencial',
    coverImage: 'https://img.araca.arq.br/design-de-interiores-sala-de-estar-biofilica-em-santo-andre-sp-araca-interiores.webp',
    media: [{ type: 'image', url: 'https://img.araca.arq.br/design-de-interiores-sala-de-estar-biofilica-em-santo-andre-sp-araca-interiores.webp' }]
  },
  {
    id: '2',
    title: 'Cozinha Sustentável Jardim',
    description: 'Projeto residencial focado em materiais de baixo impacto e funcionalidade.',
    tag: 'Residencial',
    coverImage: 'https://img.araca.arq.br/projeto-residencial-sustentavel-cozinha-integrada-santo-andre-araca-interiores.webp',
    media: [{ type: 'image', url: 'https://img.araca.arq.br/projeto-residencial-sustentavel-cozinha-integrada-santo-andre-araca-interiores.webp' }]
  }
]

export function ArquitetoSantoAndreClient() {
  const [selectedProject, setSelectedProject] = useState<ProjectGalleryItem | null>(null)
  
  const openGallery = useCallback((project: ProjectGalleryItem | null) => {
    setSelectedProject(project)
  }, [])

  const closeGallery = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const testimonials = [
    {
      name: 'Mariana S.',
      quote: 'Processo claro e leve. O resultado ficou acima do que imaginamos — e a obra fluiu sem sustos.',
    },
    {
      name: 'Rafael C.',
      quote: 'Detalhamento impecável. A equipe traduziu nossas referências em um espaço com personalidade.',
    },
    {
      name: 'Camila L.',
      quote: 'Flexível de verdade: escolhemos o que precisávamos e tivemos suporte no momento certo.',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-araca-cafe-escuro pt-20 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-araca-cafe-escuro/60 pointer-events-none" />
        
        <Container className="relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-widest uppercase rounded-full bg-araca-laranja-queimado/20 text-araca-laranja-queimado border border-araca-laranja-queimado/30">
              Santo André • ABC Paulista
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Arquiteto em Santo André — <br className="hidden md:block" />
              <span className="text-araca-laranja-queimado">Design Biofílico</span> e Sustentável
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-araca-creme/90 sm:text-xl leading-relaxed">
              A Aracá Interiores transforma espaços em Santo André integrando natureza, funcionalidade e design consciente. Projetos residenciais e comerciais que conectam as pessoas ao ambiente ao redor.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contato"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-araca-laranja-queimado text-white hover:bg-araca-laranja-queimado/90 min-w-[200px]'
                )}
              >
                Solicitar orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                href="/projetos"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'border-araca-creme/30 text-araca-creme hover:bg-white/5 min-w-[200px]'
                )}
              >
                Ver projetos
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. APRESENTAÇÃO */}
      <section className="bg-araca-bege-claro py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl leading-tight">
                Aracá Interiores: design de interiores em Santo André com alma biofílica
              </h2>
              <div className="mt-8 space-y-6 text-araca-chocolate-amargo/85 text-lg leading-relaxed">
                <p>
                  Se você busca um <strong>arquiteto em Santo André</strong> com visão diferenciada, a Aracá Interiores oferece algo além do projeto convencional: um design que parte da natureza para criar ambientes mais saudáveis, funcionais e belos.
                </p>
                <p>
                  Nosso estúdio atende toda a região do ABC com projetos residenciais, comerciais e de design de interiores, sempre orientados pelos princípios da arquitetura biofílica e da sustentabilidade.
                </p>
                <p>
                  Cada projeto começa por uma escuta cuidadosa: entendemos o estilo de vida, as necessidades do espaço e o entorno da cidade para propor soluções que façam sentido de verdade.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-3xl shadow-xl"
            >
               <img 
                src="https://img.araca.arq.br/projeto-de-design-de-interiores-biofilico-em-santo-andre-sp-araca-interiores.webp" 
                alt="projeto de design de interiores biofílico em Santo André SP — Aracá Interiores"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-araca-laranja-queimado/10" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 3. SERVIÇOS */}
      <section className="bg-white py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              O que o nosso estúdio de arquitetura em Santo André realiza
            </h2>
            <div className="mt-4 h-1 w-20 bg-araca-laranja-queimado mx-auto rounded-full" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Home className="h-6 w-6" />,
                title: 'Projeto Residencial Sustentável',
                desc: 'Projetamos casas e apartamentos que equilibram estética, conforto e eficiência. Máximo aproveitamento de luz natural e materiais de baixo impacto.'
              },
              {
                icon: <Leaf className="h-6 w-6" />,
                title: 'Design de Interiores Biofílico',
                desc: 'Integramos madeira, pedra, vegetação e luz para criar ambientes que reduzem o estresse e aumentam a sensação de bem-estar.'
              },
              {
                icon: <Store className="h-6 w-6" />,
                title: 'Projeto Comercial',
                desc: 'Desenvolvemos lojas, restaurantes e escritórios em Santo André unindo identidade visual, funcionalidade e experiências memoráveis.'
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: 'Reforma e Construção',
                desc: 'Gestão de obra e supervisão técnica. Trabalhamos com fornecedores comprometidos com qualidade e sustentabilidade.'
              }
            ].map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-araca-bege-claro/40 border border-araca-cafe-medio/10 hover:border-araca-laranja-queimado/30 transition-all hover:shadow-lg"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-araca-laranja-queimado/10 text-araca-laranja-queimado group-hover:bg-araca-laranja-queimado group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-araca-cafe-escuro mb-4 leading-snug">
                  {service.title}
                </h3>
                <p className="text-araca-chocolate-amargo/80 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. DIFERENCIAL BIOFÍLICO */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-araca-cafe-escuro/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1585128792020-803d29415281?q=80&w=2000" 
            alt="Textura natural e plantas" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold sm:text-5xl mb-12"
            >
              Design biofílico em Santo André: o que é e por que transforma ambientes
            </motion.h2>
            <div className="space-y-8 text-lg text-araca-creme/90 leading-relaxed text-left md:columns-2 gap-12">
              <p>
                O design biofílico parte de uma premissa simples: os seres humanos têm uma conexão inata com a natureza. Quando um ambiente integra elementos naturais — luz solar abundante, vegetação, texturas orgânicas e materiais como madeira e pedra — o resultado vai além da estética.
              </p>
              <p>
                Estudos mostram que espaços biofílicos reduzem o estresse, aumentam a concentração e melhoram a qualidade do sono. Na Aracá Interiores, aplicamos esses princípios de forma prática em cada projeto em Santo André.
              </p>
              <p>
                Escolhemos materiais sustentáveis de procedência responsável, priorizamos aberturas que aproveitam a iluminação natural e integramos jardins e canteiros ao projeto arquitetônico.
              </p>
              <p>
                O resultado são espaços que respeitam o meio ambiente e, ao mesmo tempo, proporcionam uma qualidade de vida muito superior para nossos clientes na região do ABC.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-16 flex justify-center"
            >
              <div className="inline-flex items-center gap-4 bg-araca-laranja-queimado/20 backdrop-blur-md border border-araca-laranja-queimado/30 p-6 rounded-2xl">
                <Leaf className="h-10 w-10 text-araca-laranja-queimado flex-shrink-0" />
                <p className="text-left font-medium text-araca-creme max-w-xs">
                  "Integramos o verde e o orgânico à vida urbana de Santo André."
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 5. PORTFÓLIO */}
      <section className="bg-araca-bege-claro py-24 overflow-hidden">
        <Container>
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Projetos realizados em Santo André e região
            </h2>
            <p className="mt-4 text-araca-chocolate-amargo/85 text-lg max-w-2xl">
              Cada projeto nasce de uma conversa. Conheça alguns dos ambientes que criamos para clientes em Santo André, São Bernardo, São Caetano e região do ABC — do espaço residencial ao ambiente comercial.
            </p>
          </div>
        </Container>
        
        <div className="mt-8">
           <GalleryCarousel 
             projects={FALLBACK_PROJECTS} 
             onSelectProject={openGallery} 
           />
        </div>
        
        <Container className="mt-12 text-center">
          <Link
            href="/projetos"
            className={cn(
               buttonVariants({ variant: 'link' }),
               'text-araca-laranja-queimado font-bold text-lg hover:gap-3 transition-all'
            )}
          >
            Ver galeria completa de projetos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Container>
      </section>

      {/* 6. SANTO ANDRÉ LOCAL */}
      <section className="bg-white py-24">
        <Container>
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
                Arquitetura e design de interiores em Santo André
              </h2>
              <div className="space-y-4 text-araca-chocolate-amargo/85 leading-relaxed">
                <p>
                  Santo André é uma das cidades mais dinâmicas do Grande ABC paulista, com uma arquitetura que reflete décadas de crescimento industrial e uma urbanização cada vez mais planejada. 
                </p>
                <p>
                  Bairros como <strong>Vila Assunção, Jardim</strong> e o <strong>Centro histórico</strong> reúnem residências sofisticadas, empreendimentos comerciais modernos e uma população que valoriza qualidade de vida e espaços bem projetados.
                </p>
                <p>
                  A cidade tem crescido com condomínios de alto padrão e uma demanda crescente por projetos que vão além do funcional — espaços que expressem identidade e conectem os moradores à natureza.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-64 rounded-2xl overflow-hidden shadow-lg transform translate-y-8"
              >
                <img src="https://img.araca.arq.br/design-de-interiores-sala-de-estar-biofilica-em-santo-andre-sp-araca-interiores.webp" alt="Arquitetura em Santo André" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <img src="https://img.araca.arq.br/projeto-residencial-sustentavel-cozinha-integrada-santo-andre-araca-interiores.webp" alt="Design de Interiores em Santo André" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. DEPOIMENTOS */}
      <section className="bg-araca-cafe-escuro py-24 overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-araca-creme sm:text-4xl px-4">
              O que dizem nossos clientes em Santo André
            </h2>
          </div>
          <TestimonialsMarquee items={testimonials} />
        </Container>
      </section>

      {/* 8. FAQ */}
      <section className="bg-white py-24">
        <Container className="max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex p-3 rounded-full bg-araca-bege-claro text-araca-laranja-queimado mb-4">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Dúvidas frequentes
            </h2>
            <p className="mt-4 text-araca-chocolate-amargo/70">
              Tudo o que você precisa saber sobre contratar arquitetura em Santo André.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Quanto custa contratar um arquiteto ou designer de interiores em Santo André?',
                a: 'O valor de um projeto de design de interiores ou arquitetura em Santo André varia de acordo com o tipo de projeto (residencial ou comercial), a metragem do espaço e o nível de detalhamento necessário. Na Aracá Interiores trabalhamos com orçamentos personalizados.'
              },
              {
                q: 'O que é design biofílico e como ele se aplica a projetos em Santo André?',
                a: 'O design biofílico é uma abordagem que integra elementos naturais — luz, vegetação, materiais orgânicos — ao projeto. Aplicado em Santo André, ele transforma apartamentos e casas em ambientes mais saudáveis e visualmente únicos.'
              },
              {
                q: 'A Aracá acompanha a obra em Santo André?',
                a: 'Sim. Além do projeto completo, oferecemos serviço de gestão e acompanhamento de obra para garantir fidelidade ao projeto e qualidade na entrega — do início ao acabamento final.'
              },
              {
                q: 'Vocês atendem além de Santo André?',
                a: 'Sim, atendemos toda a região do Grande ABC (São Bernardo, São Caetano, Diadema, etc) e a Grande São Paulo.'
              }
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl border border-araca-cafe-medio/10 bg-araca-bege-claro/20 transition-all hover:bg-araca-bege-claro/40">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 focus:outline-none">
                  <h3 className="font-display text-lg font-bold text-araca-cafe-escuro group-open:text-araca-laranja-queimado transition-colors">
                    {item.q}
                  </h3>
                  <div className="flex-shrink-0 ml-4 transition-transform group-open:rotate-180">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-8 text-araca-chocolate-amargo/85 leading-relaxed">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* 9. CTA FINAL */}
      <section id="contato" className="py-24 bg-araca-laranja-queimado text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
           <img src="/logotipos/LOGOTIPO%20REDONDO@300x.png" alt="" width={600} height={600} style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        
        <Container className="relative z-10 text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl mb-6">
            Pronto para transformar seu espaço em Santo André?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 mb-12">
            Fale com a Aracá Interiores e descubra como um projeto de design biofílico e sustentável pode transformar seu imóvel em Santo André. Atendimento personalizado, do conceito à entrega.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/5511997458464"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white text-araca-laranja-queimado hover:bg-araca-creme w-full sm:w-auto px-10'
              )}
            >
              Chamar no WhatsApp
            </a>
            <a
              href="mailto:contato@araca.arq.br"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-white/40 text-white hover:bg-white/10 w-full sm:w-auto px-10'
              )}
            >
              Enviar um e-mail
            </a>
          </div>
        </Container>
      </section>

      {/* MODAL DE GALERIA */}
      {selectedProject && (
        <ProjectGallery
          project={selectedProject}
          onClose={closeGallery}
        />
      )}
    </div>
  )
}
