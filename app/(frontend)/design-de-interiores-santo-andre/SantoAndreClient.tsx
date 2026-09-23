'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  MapPin,
  Leaf,
  Phone,
  HelpCircle,
  Clock,
  Ruler,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'

const LOCAL_PROJECTS = [
  {
    title: 'Design Biofílico — Vila Assunção',
    desc: 'Reforma de apartamento com integração total de luz natural, vegetação nativa e marcenaria inteligente.',
    image: 'https://img.araca.arq.br/design-de-interiores-sala-de-estar-biofilica-em-santo-andre-sp-araca-interiores.webp',
    tag: 'Santo André • Residencial',
  },
  {
    title: 'Cozinha e Living Integrado — Bairro Jardim',
    desc: 'Projeto residencial focado em materiais de baixo impacto, bancada em quartzo e iluminação acolhedora.',
    image: 'https://img.araca.arq.br/projeto-residencial-sustentavel-cozinha-integrada-santo-andre-araca-interiores.webp',
    tag: 'Santo André • Reforma',
  },
  {
    title: 'Área Íntima e Suíte Master — ABC Paulista',
    desc: 'Conforto acústico, cabeceira estofada e closet sob medida otimizando cada centímetro da planta.',
    image: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
    tag: 'Santo André • Alto Padrão',
  },
]

const BAIRROS_SANTO_ANDRE = [
  { name: 'Bairro Jardim', desc: 'Edifícios residenciais de alto padrão e apartamentos na planta' },
  { name: 'Vila Assunção', desc: 'Reformas completas, integração de ambientes e aconchego' },
  { name: 'Campestre', desc: 'Espaços amplos para famílias e áreas sociais integradas' },
  { name: 'Vila Bastos', desc: 'Projetos autorais com foco em biofilia e iluminação natural' },
  { name: 'Vila Gilda & Valparaíso', desc: 'Marcenaria sob medida e otimização de plantas modernas' },
  { name: 'São Caetano & SBC', desc: 'Atendimento contínuo em todas as cidades do Grande ABC' },
]

const TESTIMONIALS_SANTO_ANDRE = [
  {
    name: 'Mariana S. — Bairro Jardim, Santo André',
    quote:
      'Processo claro, pontual e leve. Por estarem em Santo André, as visitas na obra foram rápidas e qualquer dúvida resolvida na hora. O resultado ficou maravilhoso!',
  },
  {
    name: 'Rafael C. — Vila Assunção',
    quote:
      'Detalhamento impecável. A equipe da Aracá traduziu perfeitamente o que a gente queria em um projeto biofílico que impressiona todo mundo que nos visita.',
  },
  {
    name: 'Camila L. — Campestre',
    quote:
      'Acompanharam nossa obra do início ao fim. Economizamos muito tempo e dinheiro com as especificações que eles fizeram com lojas do próprio ABC.',
  },
]

export function SantoAndreClient() {
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
              <MapPin className="h-3.5 w-3.5" />
              Santo André • ABC Paulista
            </span>

            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Design de Interiores em{' '}
              <span className="text-araca-laranja-queimado">Santo André</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-araca-creme/90 sm:text-xl">
              Escritório de arquitetura e design de interiores com base no ABC. Projetos
              residenciais autorais, design biofílico e reformas completas com acompanhamento
              técnico de perto no seu imóvel.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20avalia%C3%A7%C3%A3o%20para%20meu%20projeto%20em%20Santo%20Andr%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-sa-hero"
                className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:brightness-110"
              >
                <Phone className="h-5 w-5" />
                Falar com Especialista no ABC
              </a>
              <Link
                href="/projetos"
                id="cta-projetos-sa-hero"
                className="inline-flex items-center gap-2 rounded-lg border border-araca-creme/30 px-8 py-4 font-body text-base font-medium text-araca-creme transition hover:border-araca-creme hover:bg-white/5"
              >
                Ver Galeria de Projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Badges Locais */}
            <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Base Local
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Escritório e equipe em Santo André</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Presença Ágil
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Visitas frequentes na sua obra</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Rede ABC
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Fornecedores parceiros homologados</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Biofilia
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Bem-estar e materiais conscientes</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. VANTAGENS DE CONTRATAR QUEM ESTÁ NO ABC ── */}
      <section className="bg-araca-bege-claro py-20">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Vantagem da Proximidade
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Por que contratar um designer de interiores com base em Santo André?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-araca-chocolate-amargo/80">
              Contratar um escritório distante pode gerar atrasos na resolução de dúvidas na obra.
              Com a Aracá Interiores no ABC, você tem suporte rápido e presença direta.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-araca-cafe-medio/15 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                Rapidez de Resposta
              </h3>
              <p className="mt-3 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                Qualquer necessidade de conferência in loco no seu apartamento é atendida em questão
                de minutos, sem custo de deslocamento excessivo ou remarcações de dias.
              </p>
            </div>

            <div className="rounded-2xl border border-araca-cafe-medio/15 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado">
                <Ruler className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                Parceiros Homologados no ABC
              </h3>
              <p className="mt-3 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                Temos relacionamento direto com as melhores marmorarias, marceneiros, vidraçarias e
                lojas de iluminação do Grande ABC, garantindo negociações justas e cumprimento de
                prazos.
              </p>
            </div>

            <div className="rounded-2xl border border-araca-cafe-medio/15 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                Abordagem Biofílica e Saudável
              </h3>
              <p className="mt-3 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                Especialistas em projetos que priorizam luz natural, plantas adequadas para clima de
                apartamento e materiais atóxicos que melhoram a saúde e produtividade da família.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. BAIRROS ATENDIDOS EM SANTO ANDRÉ ── */}
      <section className="bg-white py-20">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Regiões Atendidas
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Projetos em Santo André e Grande ABC
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BAIRROS_SANTO_ANDRE.map((b, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-araca-cafe-medio/15 bg-araca-bege-claro/30 p-6 transition hover:bg-araca-bege-claro/60"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-araca-laranja-queimado" />
                  <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                    {b.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. PROJETOS LOCAIS EM DESTAQUE ── */}
      <section className="bg-araca-bege-claro/40 py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Portfólio Local
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
                Projetos Executados no ABC
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold text-araca-laranja-queimado hover:underline"
            >
              Ver mais projetos autorais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {LOCAL_PROJECTS.map((proj, idx) => (
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

      {/* ── 5. DEPOIMENTOS DE CLIENTES DO ABC ── */}
      <section className="bg-araca-cafe-escuro py-24 text-white">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Satisfação Comprovada
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Depoimentos de Clientes no ABC Paulista
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-araca-creme/80">
              Famílias e clientes que confiaram na Aracá Interiores para transformar seus lares.
            </p>
          </div>
          <div className="mt-12">
            <TestimonialsMarquee items={TESTIMONIALS_SANTO_ANDRE} />
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ (DÚVIDAS FREQUENTES NO ABC) ── */}
      <section className="bg-white py-24">
        <Container className="max-w-4xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex rounded-full bg-araca-bege-claro p-3 text-araca-laranja-queimado">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Perguntas Frequentes — Santo André
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/75">
              Dúvidas comuns sobre contratação de projeto e reforma no Grande ABC.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Quanto custa contratar um designer de interiores ou arquiteto em Santo André?',
                a: 'O investimento varia conforme a área a ser trabalhada (m²), se haverá reforma estrutural e o detalhamento necessário de marcenaria e iluminação. Na Aracá Interiores elaboramos orçamentos sob medida e transparentes logo após a primeira conversa.',
              },
              {
                q: 'O que é design biofílico e como ele se aplica aos imóveis em Santo André?',
                a: 'O design biofílico traz elementos vivos, iluminação solar otimizada, texturas orgânicas e plantas selecionadas para dentro do lar. Em apartamentos de Santo André, ele proporciona maior conforto térmico e reduz o estresse da rotina urbana.',
              },
              {
                q: 'A Aracá faz acompanhamento e gestão de obras no ABC?',
                a: 'Sim. Oferecemos acompanhamento técnico e gestão de obra para garantir que o projeto seja executado exatamente como aprovado no 3D, com vistorias regulares na obra e comunicação contínua com os prestadores de serviço.',
              },
              {
                q: 'Em quais bairros de Santo André a Aracá mais atua?',
                a: 'Atuamos fortemente no Bairro Jardim, Vila Assunção, Campestre, Vila Bastos, Vila Gilda, Casa Branca, Valparaíso e condomínios fechados da região.',
              },
              {
                q: 'Vocês atendem outras cidades do Grande ABC além de Santo André?',
                a: 'Sim! Atendemos toda a região do ABC (São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, etc.) e também clientes na capital paulista.',
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
            Pronto para transformar seu imóvel em Santo André?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Agende uma conversa com nossa equipe no ABC. Traga sua planta e venha planejar seu novo
            espaço com quem entende da região.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20conversa%20sobre%20meu%20projeto%20em%20Santo%20Andr%C3%A9."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-sa-bottom"
              className="inline-flex items-center gap-2 rounded-lg bg-araca-cafe-escuro px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:bg-black"
            >
              <Phone className="h-5 w-5 text-araca-laranja-queimado" />
              Falar pelo WhatsApp
            </a>
            <Link
              href="/contato"
              id="cta-contato-sa-bottom"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-8 py-4 font-body text-base font-medium text-white transition hover:bg-white/10"
            >
              Solicitar Contato
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
