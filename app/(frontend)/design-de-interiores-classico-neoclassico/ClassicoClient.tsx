'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
  HelpCircle,
  Gem,
  Columns,
  Lightbulb,
  Crown,
  Heart,
  Compass,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SiteNav } from '@/components/layout/SiteNav'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'

const HERO_ELYSEE = 'https://img.araca.arq.br/_thumbs/midias/apto_elysee/Sala%204.jpg_w1200_q80.webp'

const ELEMENTOS_CLASSICOS = [
  {
    icon: Columns,
    title: 'Boiserie e Molduras de Parede',
    desc: 'Cálculo rigoroso das proporções verticais para valorizar o pé-direito. Requadros milimétricos em poliuretano de alta densidade sem trincas ou imperfeições.',
  },
  {
    icon: Gem,
    title: 'Mármores e Revestimentos Nobres',
    desc: 'Composição com pedras naturais e novas tecnologias de porcelanatos marmorizados de grande formato, unindo estética luxuosa, facilidade de manutenção e excelente custo-benefício.',
  },
  {
    icon: Crown,
    title: 'Marcenaria com Usinagem Clássica',
    desc: 'Móveis sob medida com detalhes usinados, molduras, ornamentos clássicos e acabamento primoroso em laca, harmonizando com ferragens contemporâneas e estofados almofadados.',
  },
  {
    icon: Lightbulb,
    title: 'Iluminação Cênica e Indireta',
    desc: 'Contraponto sutil entre lustres clássicos de presença e rasgos de luz LED quente (2700K) que banham as molduras de gesso e as texturas das paredes.',
  },
]

const PROJETOS_NEOCLASSICOS = [
  {
    title: 'Living Clássico',
    desc: 'Equilíbrio sutil entre boiseries nas paredes, mobiliário sofisticado, iluminação quente e elementos clássicos sob medida.',
    image: HERO_ELYSEE,
    tag: 'Living Estilo Clássico - Jardim, Santo André - SP',
  },
  {
    title: 'Home-Office Clássico - Jardim, Santo André - SP',
    desc: 'Marcenaria clássica com usinagem detalhada, iluminação acolhedora e integração perfeita para trabalho e estudos com máximo conforto.',
    image: 'https://img.araca.arq.br/_thumbs/midias/apto_elysee/Escrit%C3%B3rio%201.jpg_w1200_q80.webp',
    tag: 'Home-Office Clássico - Jardim, Santo André - SP',
  },
  {
    title: 'Quarto Infantil Clássico - Jardim, Santo André - SP',
    desc: 'Linguagem clássica e suave com boiserie delicado, tons acolhedores e marcenaria funcional desenhada para acompanhar o crescimento.',
    image: 'https://img.araca.arq.br/_thumbs/midias/apto_elysee/su%C3%ADte%20infantil%201.jpg_w1200_q80.webp',
    tag: 'Quarto Infantil Clássico - Jardim, Santo André - SP',
  },
]

const TESTIMONIALS_CLASSICO = [
  {
    name: 'Helena V. — Residência nos Jardins',
    quote:
      'Eu tinha receio de que o clássico ficasse pesado ou cansativo com o tempo. A Aracá soube dosar com tanta maestria os boiseries e as cores claras que a nossa casa parece um palacete francês, mas com uma leveza e luminosidade incríveis!',
  },
  {
    name: 'Roberto e Cláudia — Cobertura em Higienópolis',
    quote:
      'Poucos escritórios sabem desenhar molduras e marcenaria clássica de verdade. O projeto executivo da Aracá veio milimétrico e o resultado final é de uma elegância sem igual.',
  },
  {
    name: 'Patrícia A. — Apartamento Alto Padrão em Moema',
    quote:
      'Os boiseries valorizaram tanto o pé-direito do apartamento que todo mundo comenta quando entra. O acabamento dos materiais especificados foi de altíssimo nível.',
  },
]

export function ClassicoClient() {
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const heroHeight = () => (typeof window !== 'undefined' ? window.innerHeight : 800)
    const handleScroll = () => {
      const y = window.scrollY
      const scrollingUp = y < lastScrollY.current
      const pastHero = y > heroHeight() * 0.7
      lastScrollY.current = y
      setShowFloatingNav(pastHero && scrollingUp)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Menu Flutuante ao Rolar para Cima ── */}
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

      {/* ── 1. HERO SECTION COM FOTO DE PROJETO CLÁSSICO E MENU INTEGRADO ── */}
      <section className="relative flex min-h-[92vh] flex-col overflow-hidden text-white">
        {/* Imagem de Fundo (Elysée) com Overlay Nobre */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Image
            src={HERO_ELYSEE}
            alt="Design de Interiores Clássico e Neoclássico - Projeto Elysée"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Overlay escuro em degradê suave para legibilidade impecável */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85" />
          {/* Luz difusa e textura sutil */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden
          />
        </div>

        {/* Menu integrado transparente (dark-bg) sobre a foto do topo */}
        <div className="relative z-20 pt-4 pb-2">
          <SiteNav theme="dark-bg" noEnterAnimation />
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
          <Container className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-araca-creme shadow-lg backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-araca-dourado-claro" />
                Estilo Autoral • Neoclássico & Boiserie
              </span>

              <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:text-5xl md:text-6xl lg:text-7xl">
                Design de Interiores{' '}
                <span className="relative inline-block text-araca-dourado-claro drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Clássico & Neoclássico
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-araca-creme drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-xl">
                A harmonia perfeita entre as proporções áureas da arquitetura tradicional e a leveza
                da vida contemporânea. Projetos com boiserie milimétrico, marcenaria nobre e
                sofisticação atemporal em São Paulo e ABC.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20interiores%20no%20estilo%20cl%C3%A1ssico%20ou%20neocl%C3%A1ssico."
                  target="_blank"
                  rel="noopener noreferrer"
                  id="cta-whatsapp-classico-hero"
                  className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-base font-semibold text-white shadow-2xl transition hover:brightness-110"
                >
                  <Phone className="h-5 w-5" />
                  Consultar Projeto com Especialista
                </a>
                <Link
                  href="/projetos"
                  id="cta-projetos-classico-hero"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-black/40 px-8 py-4 font-body text-base font-medium text-white shadow-lg backdrop-blur-md transition hover:border-white hover:bg-white/10"
                >
                  Ver Galeria de Projetos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Badges de Sofisticação com Glassmorphism para legibilidade 100% nítida */}
              <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/20 pt-8 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3.5 backdrop-blur-md">
                  <p className="font-display text-2xl font-bold text-araca-dourado-claro drop-shadow sm:text-3xl">
                    Boiserie
                  </p>
                  <p className="mt-1 text-xs text-araca-creme/90 sm:text-sm">Proporções verticais perfeitas</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3.5 backdrop-blur-md">
                  <p className="font-display text-2xl font-bold text-araca-dourado-claro drop-shadow sm:text-3xl">
                    Atemporal
                  </p>
                  <p className="mt-1 text-xs text-araca-creme/90 sm:text-sm">Elegância imune a modismos</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3.5 backdrop-blur-md">
                  <p className="font-display text-2xl font-bold text-araca-dourado-claro drop-shadow sm:text-3xl">
                    Marcenaria
                  </p>
                  <p className="mt-1 text-xs text-araca-creme/90 sm:text-sm">Usinagem clássica sob medida</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3.5 backdrop-blur-md">
                  <p className="font-display text-2xl font-bold text-araca-dourado-claro drop-shadow sm:text-3xl">
                    Alto Padrão
                  </p>
                  <p className="mt-1 text-xs text-araca-creme/90 sm:text-sm">Valorização máxima do imóvel</p>
                </div>
              </div>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* ── 2. OS ELEMENTOS DA LINGUAGEM CLÁSSICA ARACÁ ── */}
      <section className="bg-araca-bege-claro py-24">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Identidade & Refinamento
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Os Pilares do Neoclássico Contemporâneo
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-araca-chocolate-amargo/80">
              O estilo clássico é sofisticado, atemporal e fascinante. Com os novos materiais e tecnologias de fabricação, hoje é muito mais acessível, preciso e viável executá-lo com perfeição — permitindo integrá-lo harmoniosamente a novos móveis e estilos para dar vida ao autêntico neoclássico contemporâneo.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ELEMENTOS_CLASSICOS.map((elem, idx) => {
              const Icon = elem.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-araca-cafe-medio/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-araca-laranja-queimado hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                    {elem.title}
                  </h3>
                  <p className="mt-3 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                    {elem.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── 3. ESTUDO DE CASO: APTO. ELYSÉE ── */}
      <section className="bg-white py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Obra de Arte Residencial
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-araca-cafe-escuro sm:text-4xl">
                O clássico que respira leveza e acolhimento
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                No <strong>Apto. Elysée</strong> (Jardim, Santo André - SP), cada requadro de boiserie foi calculado para se
                alinhar perfeitamente aos eixos do espaço. A paleta neutra em
                tons de off-white e linho equilibra a nobreza das molduras e da usinagem clássica, criando uma
                atmosfera digna de um hotel 5 estrelas parisiense, com todo o conforto de um lar
                familiar e contemporâneo.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-araca-laranja-queimado mt-0.5" />
                  <p className="text-sm text-araca-chocolate-amargo/85">
                    <strong>Integração com o moderno:</strong> Ar-condicionado embutido e automação
                    de iluminação sem interferir na harmonia visual das molduras.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-araca-laranja-queimado mt-0.5" />
                  <p className="text-sm text-araca-chocolate-amargo/85">
                    <strong>Molduras indestrutíveis e acessíveis:</strong> Perfis em poliuretano de alta
                    densidade resistentes a choques mecânicos e umidade, fáceis e ágeis de instalar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-araca-laranja-queimado mt-0.5" />
                  <p className="text-sm text-araca-chocolate-amargo/85">
                    <strong>Iluminação 2700K:</strong> Luz quente indireta que valoriza as sombras e
                    relevos das molduras e ornamentos ao cair da noite.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Adorei%20os%20projetos%20em%20estilo%20cl%C3%A1ssico%20e%20neocl%C3%A1ssico%20e%20gostaria%20de%20conversar%20sobre%20meu%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                >
                  <Phone className="h-4 w-4" />
                  Quero um Projeto Nessa Linguagem
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-[550px] w-full">
                <Image
                  src="https://img.araca.arq.br/_thumbs/midias/apto_elysee/Suite%20master%204.jpg_w1200_q80.webp"
                  alt="Design de Interiores Neoclássico com Boiserie — Apto. Elysée"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block rounded-full bg-araca-laranja-queimado px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-white">
                  Apto. Elysée
                </span>
                <p className="mt-2 font-display text-xl font-bold">
                  Suíte Master Clássica
                </p>
                <p className="mt-1 text-xs text-white/80">
                  Simetria, molduras refinadas e luz quente
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. GALERIA DE PROJETOS CLÁSSICOS ── */}
      <section className="bg-araca-bege-claro/40 py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Portfólio de Luxo
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
                Ambientes Clássicos Assinados
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold text-araca-laranja-queimado hover:underline"
            >
              Ver mais projetos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PROJETOS_NEOCLASSICOS.map((proj, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 font-body text-xs font-semibold text-araca-cafe-escuro backdrop-blur-sm">
                      {proj.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                    {proj.title}
                  </h3>
                  <p className="mt-2 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. QUEM SOMOS: HUMANIZAÇÃO & DESIGNERS ── */}
      <section className="relative overflow-hidden bg-white py-20 border-t border-araca-cafe-medio/10">
        {/* Marca d'água do símbolo Caetê */}
        <div
          className="pointer-events-none absolute -right-20 -bottom-24 z-0 opacity-[0.06] select-none"
          aria-hidden
        >
          <Image
            src="/logotipos/utilitaries/U_CAETE.svg"
            alt=""
            width={580}
            height={580}
            className="h-[520px] w-auto object-contain"
          />
        </div>
        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Foto Dupla Marcos & Rafaela */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-araca-cafe-medio/15 shadow-xl bg-neutral-900">
                  <Image
                    src="/equipe/marco-e-rafa-color.jpg"
                    alt="Marcos Paulo e Rafaela Garbuio — Aracá Interiores"
                    fill
                    className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-block rounded-full bg-araca-laranja-queimado/90 px-3 py-0.5 font-body text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      Designers & Fundadores
                    </span>
                    <p className="mt-1.5 font-display text-xl font-bold">Marcos Paulo & Rafaela Garbuio</p>
                    <p className="text-xs text-araca-creme/90">Aracá Interiores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto curto e humanizado */}
            <div className="lg:col-span-7 lg:pl-4">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Por trás dos projetos
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-araca-cafe-escuro sm:text-3xl">
                Prazer, nós somos a Aracá
              </h2>
              
              <p className="mt-4 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                Acreditamos que arquitetura e design de interiores são, antes de tudo, sobre pessoas e afeto. Não criamos apenas ambientes bonitos: traduzimos histórias reais em espaços acolhedores para você viver bem.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-araca-bege-claro/40 p-4 border border-araca-cafe-medio/10">
                  <Crown className="h-5 w-5 flex-shrink-0 text-araca-laranja-queimado mt-0.5" />
                  <div>
                    <p className="font-display text-base font-bold text-araca-cafe-escuro">
                      Marcos Paulo
                    </p>
                    <p className="text-sm text-araca-chocolate-amargo/80">
                      O designer apaixonado pelo clássico e neoclássico — movido pela harmonia das proporções, pela elegância dos boiseries e pela precisão atemporal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-araca-bege-claro/40 p-4 border border-araca-cafe-medio/10">
                  <Sparkles className="h-5 w-5 flex-shrink-0 text-araca-laranja-queimado mt-0.5" />
                  <div>
                    <p className="font-display text-base font-bold text-araca-cafe-escuro">
                      Rafaela Garbuio
                    </p>
                    <p className="text-sm text-araca-chocolate-amargo/80">
                      Amante do maximalismo — traz riqueza de texturas, personalidade vibrante e camadas que fazem a casa ter alma, calor e história.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/5511939155979?text=Ol%C3%A1%20Marcos%20e%20Rafaela!%20Gostaria%20de%20conversar%20sobre%20meu%20projeto%20de%20interiores."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-5 py-2.5 font-body text-sm font-semibold text-white shadow transition hover:brightness-110"
                >
                  <Phone className="h-4 w-4" />
                  Falar com a gente
                </a>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-araca-cafe-escuro hover:text-araca-laranja-queimado hover:underline"
                >
                  Saiba mais sobre a nossa trajetória
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 6. DEPOIMENTOS DE CLIENTES ── */}
      <section className="bg-araca-cafe-escuro py-24 text-white">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Reconhecimento
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              A apreciação de quem valoriza o design atemporal
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-araca-creme/80">
              Ambientes desenhados para encantar gerações da família.
            </p>
          </div>
          <div className="mt-12">
            <TestimonialsMarquee items={TESTIMONIALS_CLASSICO} />
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ (DÚVIDAS SOBRE O ESTILO CLÁSSICO & BOISERIE) ── */}
      <section className="bg-white py-24">
        <Container className="max-w-4xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex rounded-full bg-araca-bege-claro p-3 text-araca-laranja-queimado">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Perguntas Frequentes — Clássico & Neoclássico
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/75">
              Tire suas dúvidas sobre materiais, boiserie, proporções e custos.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'O que diferencia o estilo clássico do neoclássico contemporâneo?',
                a: 'O clássico tradicional carrega ornamentos pesados, dourados exagerados e tons escuros. O neoclássico contemporâneo (estilo trabalhado pela Aracá) traz a sofisticação da simetria, molduras e rodapés altos, mas combinada com paletas claras (linho, fendi, off-white), móveis de design limpo e iluminação cênica suave.',
              },
              {
                q: 'É possível aplicar boiserie em apartamentos modernos com pé-direito padrão (2,50m a 2,70m)?',
                a: 'Com certeza! O segredo está no cálculo milimétrico das proporções verticais das molduras. Desenhamos cada requadro para alongar a percepção vertical do ambiente, integrando harmoniosamente com interruptores e portas sem poluir a parede.',
              },
              {
                q: 'Qual o melhor material para boiserie: gesso tradicional ou poliuretano / poliestireno?',
                a: 'Recomendamos perfis de poliuretano ou poliestireno de alta densidade. Eles são 100% resistentes à umidade, não trincam com facilidade, não sofrem com choques mecânicos e permitem acabamento impecável com qualquer tinta acrílica.',
              },
              {
                q: 'Como a marcenaria se integra ao estilo clássico sem parecer antiga?',
                a: 'Desenvolvemos marcenaria sob medida com usinagem clássica precisa, molduras e ornamentos elegantes em laca acetinada, combinadas com ferragens de amortecimento suave, puxadores de alto padrão e mobiliário com estofados almofadados confortáveis.',
              },
              {
                q: 'Um projeto neoclássico valoriza o imóvel no mercado de alto padrão?',
                a: 'Sim, substancialmente. O estilo neoclássico é atemporal e altamente desejado nos bairros nobres de São Paulo. Ele não fica datado com o passar das modas, garantindo alta liquidez e valorização ao imóvel.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-araca-cafe-medio/15 bg-araca-bege-claro/20 transition-all hover:bg-araca-bege-claro/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 focus:outline-none">
                  <h3 className="font-display text-lg font-bold text-araca-cafe-escuro transition-colors group-open:text-araca-laranja-queimado">
                    {faq.q}
                  </h3>
                  <div className="ml-4 flex-shrink-0 transition-transform group-open:rotate-180">
                    <ArrowRight className="h-5 w-5 rotate-90 text-araca-laranja-queimado" />
                  </div>
                </summary>
                <div className="px-6 pb-6 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. CTA FINAL ── */}
      <section className="relative overflow-hidden bg-araca-cafe-escuro py-20 text-white border-t border-araca-cafe-medio/20">
        <Container className="relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl text-araca-creme">
            Sonha com um espaço de elegância atemporal?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-araca-bege-medio sm:text-lg">
            Agende uma conversa exclusiva com nossos arquitetos para falar sobre seu projeto em
            estilo clássico ou neoclássico.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20conversa%20sobre%20meu%20projeto%20cl%C3%A1ssico/neocl%C3%A1ssico."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-classico-bottom"
              className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:brightness-110"
            >
              <Phone className="h-5 w-5 text-white" />
              Falar com o Escritório no WhatsApp
            </a>
            <Link
              href="/contato"
              id="cta-contato-classico-bottom"
              className="inline-flex items-center gap-2 rounded-lg border border-araca-bege-medio/40 px-8 py-4 font-body text-base font-medium text-araca-creme transition hover:bg-white/10"
            >
              Enviar Mensagem
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
