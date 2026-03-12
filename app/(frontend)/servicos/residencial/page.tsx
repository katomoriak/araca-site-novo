'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Home, CheckCircle2, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { buttonVariants } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ScrollTextReveal } from '@/components/home/ScrollTextReveal'
import { Parallax } from 'react-scroll-parallax'

// Fallback image constants
const HERO_RESIDENCIAL = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png'
const IMG_JAPANDI = 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png'
const IMG_MINIMALIST = 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png'
const IMG_NEOCLASSIC = 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(14).png'

export default function ResidencialPage() {
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
            src={HERO_RESIDENCIAL}
            alt="Arquitetura Residencial - Residência Feijó"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
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
              SERVIÇOS DE ARQUITETURA
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              Arquitetura Residencial: Sua casa com alma e estilo
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl max-w-2xl mx-auto">
              Transformamos apartamentos e casas em refúgios personalizados, unindo conforto, funcionalidade e as últimas tendências do design mundial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section - Scroll Reveal */}
      <section className="relative bg-araca-bege-claro">
        <ScrollTextReveal
          texts={[
            'Criamos espaços para a vida acontecer.',
            'Nossos serviços de arquitetura de interiores para residências...',
            '...focam na sua rotina e bem-estar.',
            'Do apartamento de alto padrão à casa neoclássica.',
            'Transformamos cada detalhe com propósito.',
          ]}
          highlights={{
            0: ['espaços', 'vida'],
            1: ['arquitetura', 'interiores', 'residências'],
            2: ['rotina', 'bem-estar'],
            3: ['alto padrão', 'neoclássica'],
            4: ['detalhe', 'propósito'],
          }}
          className="max-w-5xl text-center mx-auto"
        />
      </section>

      {/* Detailed Content */}
      <section className="bg-white py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl">
                O Processo Aracá para seu Lar
              </h2>
              <p className="mt-6 text-lg text-araca-cafe-escuro/80">
                Entendemos que cada família é única. Por isso, desenvolvemos desde projetos de <strong>apartamentos de alto padrão</strong> — que prezam pelo alto padrão e aconchego — até <strong>casas de veraneio com toques neoclássicos</strong> de alta sofisticação.
              </p>
              
              <ul className="mt-10 space-y-6">
                {[
                  { title: 'Análise de Estilo', desc: 'Identificamos se sua preferência é por uma arquitetura de apartamentos ou clássica.' },
                  { title: 'Funcionalidade Total', desc: 'Otimização de layouts para apartamentos compactos ou grandes casas.' },
                  { title: 'Escolha de Materiais', desc: 'Seleção curada de texturas e cores que conferem personalidade ao imóvel.' },
                  { title: 'Acompanhamento', desc: 'Garantimos que o projeto seja executado exatamente como planejado.' }
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-araca-mineral-green" />
                    <div>
                      <h3 className="font-bold text-araca-cafe-escuro">{item.title}</h3>
                      <p className="text-sm text-araca-cafe-escuro/70">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <Parallax speed={-5} className="absolute inset-0">
                <Image
                  src={IMG_JAPANDI}
                  alt="Interior Residencial de Alto Padrão - Ninho Verde"
                  fill
                  className="object-cover"
                />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs uppercase tracking-widest opacity-80">Projeto Recente</p>
                <p className="text-xl font-display font-medium">Apartamento de Alto Padrão no ABC</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Styles Grid */}
      <section className="bg-araca-bege-claro py-24 overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-araca-chocolate-amargo sm:text-4xl">
              Estilos que Dominamos
            </h2>
            <p className="mt-4 text-araca-cafe-escuro/70">Arquitetura de interiores adaptada ao seu gosto pessoal.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                 title: 'Apartamentos Modernos',
                 img: IMG_MINIMALIST,
                 desc: 'Linhas limpas, cores sóbrias e máxima funcionalidade para seu dia a dia.'
              },
              {
                 title: 'Alto Padrão',
                 img: IMG_JAPANDI,
                 desc: 'O equilíbrio perfeito entre a estética japonesa e o conforto escandinavo.'
              },
              {
                 title: 'Clássico & Neoclássico',
                 img: IMG_NEOCLASSIC,
                 desc: 'Molduras, gesso e elegância atemporal para projetos de alto padrão.'
              }
            ].map((style, i) => (
              <motion.div
                key={i}
                className="group relative h-[400px] overflow-hidden rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Image
                  src={style.img}
                  alt={style.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-xl font-display font-bold text-white">{style.title}</h3>
                  <p className="mt-2 text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {style.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-araca-mineral-green py-20 text-white">
        <Container className="text-center">
          <Star className="mx-auto h-12 w-12 text-araca-creme/30 mb-8" />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Vamos começar o seu projeto residencial?
          </h2>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Seja para um apartamento novo ou reforma da casa da família, estamos prontos para criar o lar dos seus sonhos em Santo André e SP.
          </p>
          <div className="mt-10">
            <Link
              href="/contato"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-araca-laranja-queimado text-white hover:bg-araca-laranja-queimado/90'
              )}
            >
              Solicitar Orçamento Personalizado
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer Decoration */}
      <div className="relative h-24 bg-araca-bege-claro">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(48, 22, 12, 0.05))'
          }}
        />
      </div>
    </main>
  )
}
