import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LOCATIONS, getLocationBySlug } from '@/lib/seo-locations'
import { Container } from '@/components/layout/Container'

/* ─────────────────────────────────────────────
   SSG — gera uma página estática por cidade
───────────────────────────────────────────── */
export function generateStaticParams() {
    return LOCATIONS.map((loc) => ({ city: loc.slug }))
}

/* ─────────────────────────────────────────────
   Metadata dinâmica por cidade
───────────────────────────────────────────── */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ city: string }>
}): Promise<Metadata> {
    const { city } = await params
    const loc = getLocationBySlug(city)
    if (!loc) return {}

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
    const canonical = `${baseUrl}/arquitetura-interiores-${loc.slug}`

    return {
        title: `Arquiteto de Interiores em ${loc.label} | Aracá Interiores`,
        description: `Projetos de arquitetura e design de interiores em ${loc.label}. Especialistas em alto padrão e apartamentos. Agende sua consultoria com a Aracá Interiores.`,
        alternates: { canonical },
        openGraph: {
            type: 'website',
            locale: 'pt_BR',
            url: canonical,
            title: `Arquiteto de Interiores em ${loc.label} | Aracá Interiores`,
            description: `Projetos de arquitetura e design de interiores em ${loc.label}. Especialistas em alto padrão e apartamentos. Agende sua consultoria com a Aracá Interiores.`,
            images: [
                {
                    url: '/hero-interiores.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Arquiteto de Interiores em ${loc.label} — Aracá Interiores`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Arquiteto de Interiores em ${loc.label} | Aracá Interiores`,
            description: `Projetos de arquitetura e design de interiores em ${loc.label}. Especialistas em alto padrão e apartamentos.`,
            images: ['/hero-interiores.jpg'],
        },
    }
}

/* ─────────────────────────────────────────────
   Componente da página
───────────────────────────────────────────── */
export default async function CidadePage({
    params,
}: {
    params: Promise<{ city: string }>
}) {
    const { city } = await params
    const loc = getLocationBySlug(city)
    if (!loc) notFound()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'
    const canonical = `${baseUrl}/arquitetura-interiores-${loc.slug}`

    /* Schema JSON-LD: LocalBusiness por cidade */
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'InteriorDesigner',
        name: 'Aracá Interiores',
        url: baseUrl,
        description: `Escritório de arquitetura de interiores em ${loc.label}. Projetos residenciais e comerciais com foco em estilo alto padrão e apartamentos.`,
        telephone: '+5511997458464',
        email: 'contato@araca.arq.br',
        areaServed: {
            '@type': 'City',
            name: loc.label,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: loc.label,
            addressRegion: loc.region,
            addressCountry: 'BR',
        },
        sameAs: [
            'https://www.instagram.com/aracainteriores/',
            'https://www.linkedin.com/company/araca-arq',
        ],
    }

    /* Cidades vinculadas — exclui a atual para links internos */
    const outrasLocais = LOCATIONS.filter((l) => l.slug !== loc.slug)

    return (
        <>
            {/* JSON-LD LocalBusiness */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-araca-cafe-escuro px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
                {/* Overlay pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #e7e5e4 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                    aria-hidden
                />

                <Container className="relative z-10 text-center">
                    <p className="font-body text-sm font-medium uppercase tracking-widest text-araca-laranja-queimado">
                        {loc.region}
                    </p>

                    {/* H1 semântico otimizado — keyword principal no início */}
                    <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-araca-creme sm:text-5xl md:text-6xl lg:text-7xl">
                        Seu projeto de{' '}
                        <span className="text-araca-laranja-queimado">interiores</span>
                        <br />
                        em {loc.label}
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-araca-bege-medio sm:text-lg">
                        A Aracá Interiores é o escritório de arquitetura de interiores referência em{' '}
                        <strong className="text-araca-creme">{loc.label}</strong> e região. Criamos projetos
                        residenciais e comerciais com foco em estilo{' '}
                        <strong className="text-araca-creme">Alto Padrão e Apartamentos</strong> — ambientes que
                        equilibram beleza, função e identidade.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="https://wa.me/5511997458464"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="cta-whatsapp-hero"
                            className="inline-flex items-center gap-2 rounded-lg bg-araca-laranja-queimado px-8 py-4 font-body font-semibold text-white shadow-lg transition hover:brightness-110"
                        >
                            Agendar consultoria gratuita
                        </a>
                        <Link
                            href="/projetos"
                            id="cta-projetos-hero"
                            className="inline-flex items-center gap-2 rounded-lg border border-araca-creme/30 px-8 py-4 font-body font-medium text-araca-creme transition hover:border-araca-creme hover:bg-white/5"
                        >
                            Ver projetos
                        </Link>
                    </div>
                </Container>
            </section>

            {/* ── KEYWORDS SECTION — Rich copy com palavras-chave naturais ── */}
            <section className="bg-araca-bege-claro px-4 py-20 sm:px-6">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <h2 className="font-display text-3xl font-semibold text-araca-cafe-escuro sm:text-4xl">
                            Escritório de design de interiores em {loc.label}
                        </h2>
                        <p className="mt-6 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                            Somos um <strong>escritório de arquitetura em {loc.label}</strong> especializado em
                            projetos que transformam espaços residenciais e comerciais. Nossa equipe entrega desde
                            o projeto criativo até o detalhamento executivo e o acompanhamento de obra —{' '}
                            <strong>tudo em um modelo integrado e sob medida</strong>.
                        </p>
                        <p className="mt-4 font-body text-base leading-relaxed text-araca-chocolate-amargo/85">
                            Se você busca um <strong>arquiteto de interiores em {loc.label}</strong> que une
                            sofisticação, praticidade e fidelidade ao seu estilo de vida, você chegou ao lugar
                            certo. Nossos <strong>projetos de interiores em {loc.label}</strong> nascem de uma
                            escuta profunda e uma curadoria cuidadosa de materiais, cores e mobiliário.
                        </p>
                        {loc.neighborhood && (
                            <p className="mt-4 font-body text-sm text-araca-chocolate-amargo/70">
                                Atendemos {loc.label} e arredores, incluindo: {loc.neighborhood} e demais bairros da
                                região.
                            </p>
                        )}
                    </div>
                </Container>
            </section>

            {/* ── SERVIÇOS ── */}
            <section className="bg-white px-4 py-20 sm:px-6">
                <Container>
                    <h2 className="text-center font-display text-3xl font-semibold text-araca-cafe-escuro sm:text-4xl">
                        O que fazemos em {loc.label}
                    </h2>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: 'Projeto de Arquitetura de Interiores',
                                desc: `Criamos o projeto completo do seu espaço em ${loc.label}: layout, revestimentos, marcenaria, iluminação e detalhamentos.`,
                            },
                            {
                                title: 'Design de Interiores',
                                desc: `Curadoria de estilo, mobiliário e decoração para criar ambientes com identidade única — do conceito à execução.`,
                            },
                            {
                                title: 'Projeto Executivo',
                                desc: `Documentação técnica detalhada para obra: plantas, cortes, elevações e especificação de materiais.`,
                            },
                            {
                                title: 'Apartamentos',
                                desc: `Ambientes limpos, funcionais e atemporais. Cada elemento tem propósito. A forma segue a função.`,
                            },
                            {
                                title: 'Alto Padrão',
                                desc: `A fusão entre o wabi-sabi japonês e a leveza escandinava. Naturalidade, textura e equilíbrio.`,
                            },
                            {
                                title: 'Consultoria de Interiores',
                                desc: `Uma sessão focada para orientar reformas, compras e decisões de decoração — sem compromisso com projeto completo.`,
                            },
                        ].map((s) => (
                            <div
                                key={s.title}
                                className="rounded-xl border border-araca-cafe-medio/20 bg-araca-creme/60 p-6 transition hover:border-araca-laranja-queimado/40 hover:shadow-md"
                            >
                                <h3 className="font-display text-lg font-semibold text-araca-cafe-escuro">
                                    {s.title}
                                </h3>
                                <p className="mt-3 font-body text-sm leading-relaxed text-araca-chocolate-amargo/80">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="bg-araca-laranja-queimado px-4 py-20 sm:px-6">
                <Container className="text-center">
                    <h2 className="font-display text-3xl font-semibold text-araca-creme sm:text-4xl md:text-5xl">
                        Pronto para transformar seu espaço em {loc.label}?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl font-body text-base text-araca-creme/85">
                        Agende uma consultoria sem compromisso e descubra como a Aracá Interiores pode criar o
                        projeto ideal para você.
                    </p>
                    <a
                        href="https://wa.me/5511997458464"
                        target="_blank"
                        rel="noopener noreferrer"
                        id="cta-whatsapp-bottom"
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-araca-creme px-8 py-4 font-body font-semibold text-araca-cafe-escuro shadow-lg transition hover:bg-white"
                    >
                        Falar pelo WhatsApp
                    </a>
                </Container>
            </section>

            {/* ── INTERNAL LINKING — Outras cidades atendidas ── */}
            <section className="bg-araca-bege-claro px-4 py-12 sm:px-6" aria-label="Outras cidades atendidas">
                <Container>
                    <p className="font-body text-sm font-semibold uppercase tracking-wider text-araca-cafe-escuro">
                        Também atuamos em:
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-3">
                        {outrasLocais.map((l) => (
                            <li key={l.slug}>
                                <Link
                                    href={`/arquitetura-interiores-${l.slug}`}
                                    className="rounded-full border border-araca-cafe-medio/30 bg-white px-4 py-2 font-body text-sm text-araca-chocolate-amargo/85 transition hover:border-araca-laranja-queimado hover:text-araca-laranja-queimado"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>
        </>
    )
}
