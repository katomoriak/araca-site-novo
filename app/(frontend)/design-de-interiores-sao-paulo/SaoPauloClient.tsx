'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Phone,
  HelpCircle,
  Clock,
  Ruler,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'

const PROJECTS_SP = [
  {
    title: 'Apartamento Contemporâneo — Moema',
    desc: 'Integração de living e varanda gourmet com paleta sóbria, mármore e marcenaria sob medida.',
    image: 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png',
    tag: 'Residencial SP',
  },
  {
    title: 'Residência Alto Padrão — Jardins',
    desc: 'Conexão biofílica, iluminação cênica e mobiliário de design autoral.',
    image: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
    tag: 'Design de Interiores',
  },
  {
    title: 'Living Biofílico — Pinheiros',
    desc: 'Espaço pensado para receber com conforto térmico, luz natural e materiais orgânicos.',
    image: 'https://img.araca.arq.br/midias/resindencia_feijo/ARACA_INTERIORES%20(12).png',
    tag: 'Reforma Completa',
  },
]

const BAIRROS_SP = [
  { name: 'Jardins & Cerqueira César', desc: 'Apartamentos amplos e casas de alto padrão' },
  { name: 'Moema & Vila Nova Conceição', desc: 'Edifícios modernos e coberturas exclusivas' },
  { name: 'Pinheiros & Vila Madalena', desc: 'Espaços contemporâneos e lofts com personalidade' },
  { name: 'Itaim Bibi & Brooklin', desc: 'Residências executivas com alto valor agregado' },
  { name: 'Perdizes & Higienópolis', desc: 'Retrofit e reformas estruturais em edifícios clássicos' },
  { name: 'Campo Belo & Santo Amaro', desc: 'Projetos integrados e acolhedores para famílias' },
]

const TESTIMONIALS_SP = [
  {
    name: 'Beatriz M. — Apartamento em Moema',
    quote:
      'A Aracá cuidou de tudo na nossa reforma em Moema. A equipe aprovou o projeto no condomínio sem nenhuma pendência e a entrega do executivo para os fornecedores evitou qualquer surpresa no orçamento.',
  },
  {
    name: 'Eduardo F. — Residência nos Jardins',
    quote:
      'O detalhamento de marcenaria e iluminação foi impressionante. Cada milímetro foi pensado com bom gosto e funcionalidade. Recomendo de olhos fechados.',
  },
  {
    name: 'Carolina e Marcelo — Pinheiros',
    quote:
      'Estávamos receosos com o estresse da reforma, mas o acompanhamento da Aracá nos deu total segurança. O resultado superou muito nossas expectativas!',
  },
]

export function SaoPauloClient() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-araca-cafe-escuro px-4 pb-20 pt-32 text-white sm:px-6 sm:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-araca-cafe-escuro" />

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-araca-laranja-queimado/40 bg-araca-laranja-queimado/15 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              <Sparkles className="h-3.5 w-3.5" />
              São Paulo • Capital
            </span>

            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Designer de Interiores em{' '}
              <span className="text-araca-laranja-queimado">São Paulo</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-araca-creme/90 sm:text-xl">
              Projetos autorais de alto padrão e reformas executivas residenciais na capital
              paulista. Unimos rigor técnico, biofilia e sofisticação atemporal para transformar o
              seu imóvel em um refúgio exclusivo.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20de%20design%20de%20interiores%20para%20meu%20im%C3%B3vel%20em%20S%C3%A3o%20Paulo."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-sp-hero"
                className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:brightness-110"
              >
                <Phone className="h-5 w-5" />
                Solicitar Proposta no WhatsApp
              </a>
              <Link
                href="/projetos"
                id="cta-projetos-sp-hero"
                className="inline-flex items-center gap-2 rounded-lg border border-araca-creme/30 px-8 py-4 font-body text-base font-medium text-araca-creme transition hover:border-araca-creme hover:bg-white/5"
              >
                Conhecer Projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Badges de Autoridade */}
            <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  100%
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Aprovação em Condomínios SP</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  +80
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Ambientes Transformados</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  RRT / ART
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Responsabilidade Técnica</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  360°
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Do Conceito à Gestão de Obra</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. BAIRROS ATENDIDOS EM SP ── */}
      <section className="bg-araca-bege-claro py-20">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Cobertura Presencial
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Atuação nos Principais Bairros de São Paulo
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-araca-chocolate-amargo/80">
              Nossa equipe atende in loco na capital, realizando medições técnicas a laser, visitas a
              showrooms e reuniões presenciais nos melhores endereços de SP.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BAIRROS_SP.map((b, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-araca-cafe-medio/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-araca-laranja-queimado hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado transition group-hover:bg-araca-laranja-queimado group-hover:text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                  {b.name}
                </h3>
                <p className="mt-2 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. POR QUE ESCOLHER A ARACÁ EM SP (DIFERENCIAIS) ── */}
      <section className="bg-white py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Expertise Técnica
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-araca-cafe-escuro sm:text-4xl">
                Design de interiores pensado para os desafios da capital paulista
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                Reformar na cidade de São Paulo exige muito mais do que bom gosto. Condomínios de alto
                padrão possuem exigências rígidas de horários, emissão de laudos técnicos (NBR
                16.280), isolamento acústico e descarte de resíduos.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-araca-bege-claro text-araca-laranja-queimado">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                      Tranquilidade com a Administração do Prédio
                    </h3>
                    <p className="mt-1 text-sm text-araca-chocolate-amargo/75">
                      Entregamos toda a documentação, RRT de projeto e memorial descritivo antes do
                      início da obra, evitando notificações ou multas de condomínio.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-araca-bege-claro text-araca-laranja-queimado">
                    <Ruler className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                      Detalhamento Executivo Milimétrico
                    </h3>
                    <p className="mt-1 text-sm text-araca-chocolate-amargo/75">
                      Plantas completas de iluminação, pontos de tomada, paginação de pisos nobres,
                      marcenaria inteligente e cortes detalhados para cada fornecedor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-araca-bege-claro text-araca-laranja-queimado">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                      Cronograma e Controle Orçamentário
                    </h3>
                    <p className="mt-1 text-sm text-araca-chocolate-amargo/75">
                      Compatibilizamos o cronograma de marcenaria, marmoraria e vidraçaria para
                      evitar atrasos desnecessários na entrega das suas chaves.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-[550px] w-full">
                <Image
                  src="https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png"
                  alt="Projeto Executivo de Interiores em São Paulo — Aracá Interiores"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block rounded-full bg-araca-laranja-queimado px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-white">
                  Projeto Assinado
                </span>
                <p className="mt-2 font-display text-xl font-bold">
                  Apto Black — Elegância e Contemporaneidade
                </p>
                <p className="mt-1 text-xs text-white/80">
                  São Paulo • Projeto luminotécnico e marcenaria exclusiva
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. PROJETOS EM DESTAQUE ── */}
      <section className="bg-araca-bege-claro/40 py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Portfólio Selecionado
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
                Inspirações de Projetos Residenciais
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold text-araca-laranja-queimado hover:underline"
            >
              Ver todos os projetos autorais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PROJECTS_SP.map((proj, idx) => (
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

      {/* ── 5. DEPOIMENTOS DE CLIENTES ── */}
      <section className="bg-araca-cafe-escuro py-24 text-white">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Experiência Comprovada
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              O que dizem os clientes da Aracá Interiores
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-araca-creme/80">
              A tranquilidade de quem contratou um escritório comprometido com prazos e excelência.
            </p>
          </div>
          <div className="mt-12">
            <TestimonialsMarquee items={TESTIMONIALS_SP} />
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ (DÚVIDAS FREQUENTES EM SP) ── */}
      <section className="bg-white py-24">
        <Container className="max-w-4xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex rounded-full bg-araca-bege-claro p-3 text-araca-laranja-queimado">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Perguntas Frequentes — São Paulo
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/75">
              Tudo sobre o processo de contratação, projetos executivos e reformas na capital.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Como funciona a contratação de um designer de interiores em São Paulo?',
                a: 'Iniciamos com uma reunião de alinhamento e briefing detalhado para compreender seu estilo, necessidades funcionais e orçamento. A partir disso, apresentamos o estudo preliminar com imagens 3D fotorrealistas e, após sua validação, produzimos o caderno executivo com todas as especificações técnicas para compras e execução.',
              },
              {
                q: 'A Aracá faz acompanhamento e gestão de obras em apartamentos na capital de SP?',
                a: 'Sim. Oferecemos acompanhamento técnico e gestão completa de obra em condomínios da capital. Cuidamos da emissão de RRT/ART, compatibilização com as regras da NBR 16.280 do condomínio, alinhamento com empreiteiros e controle de qualidade dos acabamentos.',
              },
              {
                q: 'Quais bairros de São Paulo a Aracá Interiores atende?',
                a: 'Atendemos toda a cidade de São Paulo, especialmente bairros como Jardins, Moema, Pinheiros, Vila Madalena, Itaim Bibi, Vila Nova Conceição, Perdizes, Higienópolis, Brooklin e Campo Belo, além de casas em condomínios da Grande SP.',
              },
              {
                q: 'Quanto tempo leva para desenvolver um projeto de interiores residencial em SP?',
                a: 'Em média, entre 45 e 75 dias para um projeto residencial completo (do conceito até todos os cadernos executivos de marcenaria, elétrica e iluminação), dependendo da metragem do imóvel e do ritmo de alinhamento das etapas.',
              },
              {
                q: 'Qual o investimento para contratar o escritório Aracá Interiores?',
                a: 'O investimento é calculado de acordo com a área do imóvel (m²), complexidade dos ambientes e escopo desejado (projeto executivo ou projeto com gestão de obra). Fale conosco pelo WhatsApp para conversarmos sobre seu imóvel e receber uma estimativa personalizada.',
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
      <section className="relative overflow-hidden bg-araca-laranja-queimado py-20 text-white">
        <Container className="relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Pronto para iniciar seu projeto em São Paulo?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Converse agora com nossa equipe de arquitetura e design de interiores. Envie sua planta
            ou agende uma visita técnica no seu imóvel.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20interiores%20em%20S%C3%A3o%20Paulo."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-sp-bottom"
              className="inline-flex items-center gap-2 rounded-lg bg-araca-cafe-escuro px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:bg-black"
            >
              <Phone className="h-5 w-5 text-araca-laranja-queimado" />
              Falar pelo WhatsApp
            </a>
            <Link
              href="/contato"
              id="cta-contato-sp-bottom"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-8 py-4 font-body text-base font-medium text-white transition hover:bg-white/10"
            >
              Enviar Mensagem
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
