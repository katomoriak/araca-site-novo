'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileCheck,
  Calendar,
  Phone,
  HelpCircle,
  HardHat,
  Banknote,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'

const PILARES_REFORMA = [
  {
    icon: FileCheck,
    title: '1. Projeto Executivo Detalhado',
    desc: 'Cadernos técnicos completos com cotas, pontos de elétrica e dados, paginação de revestimentos e projeto luminotécnico para eliminar qualquer dúvida na obra.',
  },
  {
    icon: Banknote,
    title: '2. Previsibilidade Orçamentária',
    desc: 'Planilha quantitativa de insumos e cotações transparentes com parceiros qualificados antes de iniciar a demolição, evitando compras emergenciais caras.',
  },
  {
    icon: Calendar,
    title: '3. Cronograma Físico-Financeiro',
    desc: 'Mapeamento das etapas críticas: quebra-quebra, alvenaria, forro, pintura, bancadas de pedra e montagem da marcenaria em sequência lógica sem atritos.',
  },
  {
    icon: HardHat,
    title: '4. Gestão e Fiscalização Técnica',
    desc: 'Visitas presenciais para fiscalizar prumo, nivelamento de pisos nobres, instalações e acabamentos finos, assegurando que o executado seja fiel ao 3D.',
  },
]

const COMPARATIVO = [
  {
    criterio: 'Controle de Gastos',
    avulso: 'Gastos 30% a 50% acima do previsto por falta de planejamento e compras erradas.',
    araca: 'Lista quantitativa rigorosa e cotações prévias com fornecedores de confiança.',
  },
  {
    criterio: 'Cumprimento de Prazos',
    avulso: 'Atrasos sucessivos causados pela falta de coordenação entre marcenaria, gesso e pedreiro.',
    araca: 'Cronograma integrado compatibilizando a entrada de cada equipe no momento exato.',
  },
  {
    criterio: 'Aprovação no Condomínio',
    avulso: 'Risco de multas, paralisação de obra e notificações por documentação incompleta.',
    araca: 'Emissão ágil de RRT/ART e laudo técnico conforme a norma ABNT NBR 16.280.',
  },
  {
    criterio: 'Padrão dos Acabamentos',
    avulso: 'Emendas visíveis, recortes de piso em locais nobres e marcenaria desalinhada.',
    araca: 'Fiscalização milimétrica de paginação, alinhamento de rodapés e iluminação cênica.',
  },
  {
    criterio: 'Saúde Mental do Cliente',
    avulso: 'Estresse diário recebendo ligações de prestadores e tendo que resolver imprevistos.',
    araca: 'Você desfruta da evolução da obra com relatórios e tranquilidade absoluta.',
  },
]

const PROJETOS_REFORMA = [
  {
    title: 'Retrofit e Reforma Completa — 180m²',
    desc: 'Demolição de paredes para integração de living, nova infraestrutura de ar-condicionado e forro monolítico.',
    image: 'https://img.araca.arq.br/midias/projetoaptoblack/ARACA_INTERIORES%20(33).png',
    tag: 'Reforma Integral',
  },
  {
    title: 'Reforma de Cozinha Gourmet e Lavanderia',
    desc: 'Substituição completa de revestimentos, bancada em ilha com pedra sinterizada e marcenaria náutica.',
    image: 'https://img.araca.arq.br/projeto-residencial-sustentavel-cozinha-integrada-santo-andre-araca-interiores.webp',
    tag: 'Cozinha & Gourmet',
  },
  {
    title: 'Área Social e Suítes de Alto Padrão',
    desc: 'Harmonização de tons terrosos, painéis ripados iluminados e banheiros com nichos embutidos esculpidos.',
    image: 'https://img.araca.arq.br/midias/resindencia_feijo/araca_interiores_%20(17).png',
    tag: 'Living & Suítes',
  },
]

const TESTIMONIALS_REFORMA = [
  {
    name: 'Guilherme e Tatiana — Reforma de Apartamento',
    quote:
      'Já havíamos passado por uma obra traumática antes e estávamos com muito medo de reformar o novo apartamento. A equipe da Aracá foi impecável: cronograma cumprido à risca e nenhum imprevisto financeiro!',
  },
  {
    name: 'Vanessa P. — Apartamento na Planta em SP',
    quote:
      'Desenvolvemos todo o projeto enquanto o prédio estava sendo construído. Quando pegamos as chaves, a Aracá já estava com tudo cotado e pronto para executar. Obra limpa, organizada e sem dor de cabeça.',
  },
  {
    name: 'Lucas B. — Cobertura Duplex no ABC',
    quote:
      'A compatibilização da marcenaria com o gesso e as pedras foi cirúrgica. Ter profissionais fiscalizando a obra fez toda a diferença na qualidade final.',
  },
]

export function ReformaClient() {
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
              <HardHat className="h-3.5 w-3.5" />
              Execução & Gestão de Obra • SP & ABC
            </span>

            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Reforma de Interiores{' '}
              <span className="text-araca-laranja-queimado">Residencial</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-araca-creme/90 sm:text-xl">
              Do projeto executivo à entrega das chaves. Reformamos seu apartamento ou casa com
              rigor técnico, planejamento orçamentário transparente e fiscalização constante de obra
              — sem surpresas desagradáveis ou atrasos.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20uma%20reforma%20residencial%20completa%20para%20meu%20im%C3%B3vel."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-reforma-hero"
                className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:brightness-110"
              >
                <Phone className="h-5 w-5" />
                Orçar Reforma no WhatsApp
              </a>
              <a
                href="#pilares"
                id="cta-pilares-hero"
                className="inline-flex items-center gap-2 rounded-lg border border-araca-creme/30 px-8 py-4 font-body text-base font-medium text-araca-creme transition hover:border-araca-creme hover:bg-white/5"
              >
                Como Funciona a Obra
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Badges de Confiança */}
            <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Zero Retrabalho
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Projeto executivo sem pontas soltas</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Previsibilidade
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Quantitativos e cotações prévias</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  NBR 16.280
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">RRT e laudos condominiais</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-araca-laranja-queimado sm:text-3xl">
                  Turnkey
                </p>
                <p className="mt-1 text-xs text-araca-creme/75 sm:text-sm">Entrega pronta para morar</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. OS 4 PILARES DA REFORMA ARACÁ ── */}
      <section id="pilares" className="bg-araca-bege-claro py-24">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Método Comprovado
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Os 4 Pilares da Reforma Sem Estresse
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-araca-chocolate-amargo/80">
              Transformar um imóvel deve ser uma experiência empolgante, não um pesadelo diário.
              Nosso processo é estruturado para garantir controle absoluto sobre cada etapa.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILARES_REFORMA.map((pil, idx) => {
              const Icon = pil.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-araca-cafe-medio/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-araca-laranja-queimado hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-araca-bege-claro p-3 text-araca-laranja-queimado">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-araca-cafe-escuro">
                    {pil.title}
                  </h3>
                  <p className="mt-3 text-sm text-araca-chocolate-amargo/75 leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── 3. COMPARATIVO: REFORMA AVULSA VS REFORMA ARACÁ ── */}
      <section className="bg-white py-24">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Comparativo Real
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Contratar Avulso vs. Reforma Integrada com a Aracá
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-base text-araca-chocolate-amargo/80">
              Entenda por que tentar gerenciar uma reforma por conta própria costuma custar muito
              mais caro no final.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl border border-araca-cafe-medio/20 shadow-lg">
            <div className="grid grid-cols-1 divide-y divide-araca-cafe-medio/15 md:grid-cols-12 md:divide-x md:divide-y-0">
              {/* Header Colunas */}
              <div className="bg-araca-cafe-escuro p-6 text-white md:col-span-3">
                <p className="font-display text-lg font-bold">Aspecto da Obra</p>
                <p className="mt-1 text-xs text-araca-creme/70">O que você precisa considerar</p>
              </div>
              <div className="bg-red-50/50 p-6 md:col-span-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <p className="font-display text-lg font-bold">Reforma Avulsa / Por Conta</p>
                </div>
              </div>
              <div className="bg-emerald-50/60 p-6 md:col-span-5">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="font-display text-lg font-bold">Reforma Integrada Aracá</p>
                </div>
              </div>
            </div>

            {/* Linhas */}
            {COMPARATIVO.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 border-t border-araca-cafe-medio/15 md:grid-cols-12 md:divide-x md:divide-araca-cafe-medio/15"
              >
                <div className="bg-araca-bege-claro/40 p-5 md:col-span-3">
                  <p className="font-display text-sm font-bold text-araca-cafe-escuro">
                    {item.criterio}
                  </p>
                </div>
                <div className="p-5 md:col-span-4 bg-red-50/20">
                  <p className="text-sm text-red-900/80 leading-relaxed">{item.avulso}</p>
                </div>
                <div className="p-5 md:col-span-5 bg-emerald-50/30">
                  <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                    {item.araca}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. PROJETOS DE REFORMA EM DESTAQUE ── */}
      <section className="bg-araca-bege-claro/40 py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
                Portfólio de Obras
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
                Transformações Residenciais de Sucesso
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
            {PROJETOS_REFORMA.map((proj, idx) => (
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

      {/* ── 5. DEPOIMENTOS DE QUEM REFORMOU ── */}
      <section className="bg-araca-cafe-escuro py-24 text-white">
        <Container>
          <div className="text-center">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-araca-laranja-queimado">
              Resultados Reais
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              A tranquilidade de quem reformou com a Aracá
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-araca-creme/80">
              Veja a opinião de proprietários que entregaram suas chaves em nossas mãos.
            </p>
          </div>
          <div className="mt-12">
            <TestimonialsMarquee items={TESTIMONIALS_REFORMA} />
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ (DÚVIDAS FREQUENTES SOBRE REFORMA) ── */}
      <section className="bg-white py-24">
        <Container className="max-w-4xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex rounded-full bg-araca-bege-claro p-3 text-araca-laranja-queimado">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-araca-cafe-escuro sm:text-4xl">
              Dúvidas Frequentes sobre Reforma Residencial
            </h2>
            <p className="mt-3 text-araca-chocolate-amargo/75">
              Esclarecimentos técnicos sobre prazos, gerenciamento, custos e normas condominiais.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Qual a diferença entre contratar apenas um projeto e contratar a reforma com acompanhamento de obra?',
                a: 'Com apenas o projeto, o cliente precisa gerenciar múltiplos fornecedores, conferir prumos e níveis, resolver imprevistos técnicos diários e cobrar prazos de cada prestador. Com a reforma e gestão da Aracá, nossa equipe técnica assume essa responsabilidade, fiscalizando o padrão e garantindo fidelidade absoluta ao projeto.',
              },
              {
                q: 'Quanto tempo dura uma reforma de apartamento de alto padrão?',
                a: 'Em média, a execução da obra dura entre 3 e 6 meses após a entrega do projeto executivo e aprovação do condomínio, variando conforme a metragem e a complexidade das alterações de alvenaria e acabamentos.',
              },
              {
                q: 'A Aracá emite a documentação necessária para o condomínio (RRT / ART)?',
                a: 'Sim. Cuidamos de todo o processo de emissão de Registro de Responsabilidade Técnica (RRT do CAU), laudos técnicos exigidos pela norma ABNT NBR 16.280 e memorial descritivo antes do início dos trabalhos.',
              },
              {
                q: 'Como é feito o controle de custos para evitar surpresas no orçamento?',
                a: 'Elaboramos uma planilha quantitativa detalhada antes de qualquer quebra-quebra, com cotações com fornecedores parceiros homologados. Isso traz previsibilidade orçamentária e evita compras de emergência que encarecem a obra.',
              },
              {
                q: 'É possível fazer reforma com apartamento na planta antes da entrega das chaves?',
                a: 'Sim, e é o momento perfeito! Desenvolvemos o projeto executivo e compatibilizações durante o período de obras do edifício. Assim que as chaves forem liberadas, a obra inicia sem perder meses preciosos de espera.',
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
            Pronto para reformar sem dor de cabeça?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Envie sua planta ou agende uma reunião com nossa equipe técnica para receber uma
            avaliação completa de viabilidade e orçamento.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/5511939155979?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20avalia%C3%A7%C3%A3o%20de%20reforma%20residencial."
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-reforma-bottom"
              className="inline-flex items-center gap-2 rounded-lg bg-araca-cafe-escuro px-8 py-4 font-body text-base font-semibold text-white shadow-xl transition hover:bg-black"
            >
              <Phone className="h-5 w-5 text-araca-laranja-queimado" />
              Solicitar Orçamento de Reforma
            </a>
            <Link
              href="/contato"
              id="cta-contato-reforma-bottom"
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
