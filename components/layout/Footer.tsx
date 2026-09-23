'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Linkedin, Instagram, ArrowRight, Mail, Phone } from 'lucide-react'
import { Container } from './Container'
import { LOCATIONS, getLocationHref } from '@/lib/seo-locations'

/* Navegação do site (sem locais sensíveis). Equipe acessa pelo Dashboard. */
const footerNavColumns = [
  {
    title: 'Serviços',
    links: [
      { href: '/servicos', label: 'Serviços de Interiores (Geral)' },
      { href: '/servicos/residencial', label: 'Projetos Residenciais' },
      { href: '/servicos/residencial/casas', label: '• Casas & Sobrados' },
      { href: '/servicos/residencial/apartamentos', label: '• Apartamentos' },
      { href: '/servicos/residencial/coberturas', label: '• Coberturas & Penthouses' },
      { href: '/servicos/residencial/reformas-retrofit', label: '• Reformas & Retrofit' },
      { href: '/servicos/comercial-corporativo', label: 'Projetos Comerciais & Corporativos' },
      { href: '/servicos/comercial-corporativo/escritorios', label: '• Escritórios & Sedes' },
      { href: '/servicos/comercial-corporativo/clinicas-consultorios', label: '• Clínicas & Consultórios' },
      { href: '/servicos/comercial-corporativo/lojas-varejo', label: '• Lojas & Varejo' },
      { href: '/servicos/gestao-acompanhamento-de-obra', label: 'Gestão de Obras de Interiores' },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { href: '/', label: 'Home' },
      { href: '/sobre', label: 'Sobre a Aracá' },
      { href: '/projetos', label: 'Projetos Autorais' },
      { href: '/blog', label: 'Blog de Decoração' },
      { href: '/contato', label: 'Contato & Propostas' },
    ],
  },
]

const footerContact = {
  email: 'contato@araca.arq.br',
  emailLabel: 'contato@araca.arq.br',
  phone: '(11) 93915-5979',
  whatsappHref: 'https://wa.me/5511939155979',
}

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.094.399-.303 1.236-.346 1.417-.056.236-.184.288-.429.174-1.604-.748-2.607-3.098-2.607-4.99 0-4.067 2.956-7.809 8.536-7.809 4.492 0 7.989 3.2 7.989 7.472 0 4.467-2.812 8.067-6.723 8.067-1.313 0-2.548-.682-2.972-1.492l-.809 3.085c-.292 1.114-1.085 2.508-1.618 3.36 1.247.388 2.571.597 3.939.597 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
  </svg>
)

const socialLinks = [
  { href: 'https://www.instagram.com/aracainteriores/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/araca-arq', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://br.pinterest.com/aracainteriores/_created/', icon: PinterestIcon, label: 'Pinterest' },
]

export function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), status: 'subscribed' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        return
      }
      const data = await res.json().catch(() => ({}))
      // E-mail já inscrito: mostrar sucesso para não expor se o e-mail existe
      if (res.status === 400 && data?.errors?.[0]?.message?.toLowerCase().includes('unique')) {
        setStatus('success')
        setEmail('')
        return
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="overflow-hidden">
      {/* Seção Newsletter - fundo laranja da marca */}
      <section className="bg-araca-laranja-queimado px-4 py-14 sm:px-6">
        <Container>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="max-w-md">
              <h2 className="font-display text-4xl font-semibold uppercase text-araca-creme sm:text-5xl md:text-6xl lg:text-7xl">
                Receba dicas de Decoração
              </h2>
              <p className="mt-3 text-sm font-body text-araca-bege-medio">
                Receba novidades, dicas de decoração e acesso antecipado a novos
                conteúdos.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
                disabled={status === 'loading'}
                className="w-full sm:w-auto sm:flex-1 rounded-lg border border-araca-creme/25 bg-araca-laranja-medio/70 px-4 py-3.5 font-body text-araca-creme placeholder:text-araca-creme/60 focus:border-araca-creme focus:outline-none focus:ring-1 focus:ring-araca-creme disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 rounded-lg bg-araca-creme px-6 py-3.5 font-medium font-body text-araca-cafe-escuro transition hover:bg-araca-bege-claro disabled:opacity-60"
              >
                {status === 'loading' ? (
                  'Enviando…'
                ) : status === 'success' ? (
                  'Enviado ✓'
                ) : status === 'error' ? (
                  'Tentar novamente'
                ) : (
                  <>
                    Inscrever
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-sm text-araca-creme/90">
                Não foi possível inscrever. Tente de novo em instantes.
              </p>
            )}
          </div>
          <p className="mt-5 text-center text-xs font-body text-araca-bege-medio">
            Cancele quando quiser. Respeitamos sua caixa de entrada.
          </p>
        </Container>
      </section>

      {/* Seção principal - fundo bege claro + logo watermark */}
      <section className="relative bg-araca-bege-claro px-4 py-12 pr-20 sm:px-6 sm:pr-24">
        {/* Logo watermark - position absolute, opacity 0.1 */}
        <div
          className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden"
          aria-hidden
        >
          <Image
            src="/logotipos/LOGOTIPO_PRINCIPAL.svg"
            alt="Marca d'água Aracá Interiores"
            width={400}
            height={200}
            className="h-auto max-h-[60%] w-auto max-w-[80%] opacity-10"
            style={{ width: 'auto', height: 'auto', objectFit: 'contain', objectPosition: 'bottom center' }}
          />
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            {/* Logo + tagline + redes sociais */}
            <div className="max-w-sm">
              <Link href="/" className="inline-block">
                <Image
                  src="/logotipos/LOGOTIPO_PRINCIPAL.svg"
                  alt="Aracá Interiores"
                  width={180}
                  height={60}
                  className="h-auto w-44"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
              <p className="mt-3 text-sm text-araca-chocolate-amargo/90">
                Interiores que combinam beleza e conforto. Projetos sob medida
                para quem acredita que a casa deve ser um refúgio.
              </p>
              <ul className="mt-6 flex gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-araca-cafe-escuro/30 text-araca-cafe-escuro transition hover:border-araca-laranja-queimado hover:bg-araca-laranja-queimado hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colunas de navegação + contato */}
            <div className="flex flex-wrap gap-10 sm:gap-12">
              {footerNavColumns.map((col) => (
                <div key={col.title}>
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-araca-cafe-escuro">
                    {col.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                          className="text-sm text-araca-chocolate-amargo/85 transition hover:text-araca-laranja-queimado"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Coluna SEO Local — Atuação por cidade */}
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-araca-cafe-escuro">
                  Atuação
                </h3>
                <ul className="mt-4 space-y-2">
                  {LOCATIONS.map((loc) => (
                    <li key={loc.slug}>
                      <Link
                        href={getLocationHref(loc)}
                        className="text-sm text-araca-chocolate-amargo/85 transition hover:text-araca-laranja-queimado"
                      >
                        {loc.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-araca-cafe-escuro">
                  Contato
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href={footerContact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-araca-chocolate-amargo/85 transition hover:text-araca-laranja-queimado"
                      aria-label="WhatsApp: (11) 93915-5979"
                    >
                      <Phone className="h-4 w-4" />
                      {footerContact.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${footerContact.email}`}
                      className="inline-flex items-center gap-2 text-sm text-araca-chocolate-amargo/85 transition hover:text-araca-laranja-queimado"
                    >
                      <Mail className="h-4 w-4" />
                      {footerContact.emailLabel}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rodapé legal */}
          <div className="mt-12 flex flex-col gap-6 border-t border-araca-cafe-medio pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-araca-chocolate-amargo/80">
                © {year} Aracá Interiores. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link
                  href="/politica-privacidade"
                  className="text-sm text-araca-chocolate-amargo/80 transition hover:text-araca-laranja-queimado"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/termos"
                  className="text-sm text-araca-chocolate-amargo/80 transition hover:text-araca-laranja-queimado"
                >
                  Termos de Uso
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-araca-chocolate-amargo/80 transition hover:text-araca-laranja-queimado"
                >
                  Dashboard
                </Link>
                <a
                  href="https://www.agencianaut.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-araca-chocolate-amargo/70 hover:text-araca-laranja-queimado transition"
                  aria-label="Naut - Design e Desenvolvimento"
                >
                  <span className="text-sm text-araca-chocolate-amargo/60">Desenvolvido por</span>
                  <Image
                    src="/assets/naut-logotipo-mono-branco.svg"
                    alt="Naut"
                    width={120}
                    height={40}
                    className="h-6 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </footer>
  )
}
