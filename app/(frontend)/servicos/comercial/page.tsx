'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Store, Briefcase, Utensils, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ScrollTextReveal } from '@/components/home/ScrollTextReveal'
import { Parallax } from 'react-scroll-parallax'

// Fallback image constants from real gallery
const HERO_COMERCIAL = 'https://img.araca.arq.br/midias/allwin_markethome/allwin_projeto-arquitetonicoresidencial%20(1).png'
const IMG_SHOWROOM = 'https://img.araca.arq.br/midias/maximed_farmacia/aracainteriores_arquiteturacomercial_farmaciamaximed.png'

export default function ComercialPage() {
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const heroHeight = () => typeof window !== 'undefined' ? window.innerHeight : 800
    const handleScroll = () => {
      const y = window.scrollY
      const scrollingUp = y < lastScrollY.current
      const pastHero = y > heroHeight() * 0.85
      lastScrollY.current = y
      setShowFloatingNav(pastHero && scrollingUp)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-araca-bege-claro">
      {/* Floating Nav */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2"
          >
            <SiteNav theme="light-bg" logoVariant="cafe" noEnterAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col overflow-hidden text-white">
        <div className="absolute inset-0 bg-neutral-900">
           <Image
            src={HERO_COMERCIAL}
            alt="Arquitetura Comercial Allwin Market Home"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <SiteNav theme="dark-bg" noEnterAnimation />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4">
          <motion.div
            className="max-w-4xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm font-medium tracking-[0.25em] text-white/85">
              ESTRATÉGIA E DESIGN
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              Arquitetura Comercial: Design que gera Retorno
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl max-w-2xl mx-auto">
              Projetamos espaços comerciais que vendem, escritórios que produzem e salas que transmitem autoridade para o seu negócio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition - Scroll Reveal */}
      <section className="relative bg-araca-bege-claro">
        <ScrollTextReveal
          texts={[
            'O design do seu espaço impacta seu lucro.',
            'Serviços de arquitetura de interiores para comércios.',
            'Transformamos lojas, salas, escritórios e restaurantes.',
            'Otimização de espaço focada em performance.',
            'Design estratégico para atrair os clientes do ABC.',
          ]}
          highlights={{
            0: ['design', 'impacta', 'lucro'],
            1: ['arquitetura', 'interiores', 'comércios'],
            2: ['lojas', 'salas', 'escritórios', 'restaurantes'],
            3: ['Otimização', 'espaço', 'performance'],
            4: ['estratégico', 'atrair', 'ABC'],
          }}
          className="max-w-5xl text-center mx-auto"
        />
      </section>

      {/* Business Focus Content */}
      <section className="bg-white py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl lg:order-last">
              <Parallax speed={3} className="absolute inset-0">
                <Image
                  src={IMG_SHOWROOM}
                  alt="Projeto Maximed Farmácia - Aracá Interiores"
                  fill
                  className="object-cover"
                />
              </Parallax>
              <div className="absolute inset-0 bg-araca-cafe-escuro/10" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl">
                O Espaço como Ferramenta de Conversão
              </h2>
              <p className="mt-6 text-lg text-araca-cafe-escuro/80">
                Acreditamos que a arquitetura comercial deve ser um investimento com retorno claro. Mostramos como a <strong>otimização de espaço melhora as vendas</strong> em lojas de varejo — como o showroom de uma loja de persianas — ou como um <strong>escritório bem planejado aumenta a produtividade</strong> da sua equipe.
              </p>
              
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                 <div className="p-6 bg-araca-bege-claro rounded-xl border border-araca-cafe-escuro/5">
                    <TrendingUp className="h-8 w-8 text-araca-mineral-green mb-4" />
                    <h3 className="font-bold text-araca-cafe-escuro">Performance de Vendas</h3>
                    <p className="mt-2 text-sm text-araca-cafe-escuro/70">Layouts inteligentes que guiam o cliente e destacam produtos estrategicamente.</p>
                 </div>
                 <div className="p-6 bg-araca-bege-claro rounded-xl border border-araca-cafe-escuro/5">
                    <Users className="h-8 w-8 text-araca-mineral-green mb-4" />
                    <h3 className="font-bold text-araca-cafe-escuro">Bem-Estar & Foco</h3>
                    <p className="mt-2 text-sm text-araca-cafe-escuro/70">Escritórios que reduzem o estresse e potencializam a criatividade e entrega.</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Verticals Section */}
      <section className="bg-araca-cafe-escuro py-24 text-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Soluções por Segmento
            </h2>
            <p className="mt-4 text-white/60">Expertise técnica para os desafios de cada negócio.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                icon: Store, 
                title: 'Lojas e Varejo', 
                desc: 'Showrooms e espaços de imersão que fortalecem a marca e convertem visitantes.' 
              },
              { 
                icon: Briefcase, 
                title: 'Escritórios', 
                desc: 'Planejamento de fluxos, ergonomia e salas de reunião que impressionam clientes.' 
              },
              { 
                icon: Utensils, 
                title: 'Restaurantes', 
                desc: 'Design que une estética gastronômica com eficiência operacional de cozinha e salão.' 
              },
              { 
                icon: Store, 
                title: 'Clínicas e Salas', 
                desc: 'Ambientes que transmitem confiança, assepsia e acolhimento para seus pacientes.' 
              }
            ].map((box, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-araca-mineral-green mb-6">
                  <box.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{box.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{box.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Local Authority Section */}
      <section className="bg-araca-bege-claro py-24">
        <Container>
          <div className="max-w-3xl">
             <h2 className="font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl">
              Autoridade no ABC e SP
            </h2>
            <p className="mt-6 text-lg text-araca-cafe-escuro/80">
              Conhecemos o mercado local. Nossos projetos em Santo André e região ajudam empresários a se destacarem em um cenário competitivo, trazendo a sofisticação da capital para o polo comercial do ABC.
            </p>
            <div className="mt-10">
              <Link
                href="/projetos"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'border-araca-chocolate-amargo text-araca-chocolate-amargo hover:bg-araca-chocolate-amargo hover:text-white'
                )}
              >
                Ver Portfólio Comercial
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-araca-laranja-queimado py-20 text-white">
        <Container className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Pronto para valorizar seu imóvel comercial?
          </h2>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            Agende uma reunião estratégica e descubra como o design pode impulsionar seus resultados financeiros.
          </p>
          <div className="mt-10">
            <Link
              href="/contato"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-mineral-green text-white hover:bg-araca-mineral-green/90 shadow-xl'
              )}
            >
              Falar com Arquitetura Comercial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
