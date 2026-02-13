'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Linkedin, Instagram, ArrowRight, Mail, Phone } from 'lucide-react'
import { Container } from './Container'

/* Navegação do site (sem locais sensíveis). Equipe acessa pelo Dashboard. */
const footerNavColumns = [
  {
    title: 'Navegação',
    links: [
      { href: '/', label: 'Home' },
      { href: '/sobre', label: 'Sobre nós' },
      { href: '/projetos', label: 'Projetos' },
      { href: '/contato', label: 'Contato' },
      { href: '/blog', label: 'Blog' },
    ],
  },
]

const footerContact = {
  email: 'contato@araca.arq.br',
  emailLabel: 'contato@araca.arq.br',
  phone: '(11) 99745-8464',
  whatsappHref: 'https://wa.me/5511997458464',
}

const socialLinks = [
  { href: 'https://www.instagram.com/aracainteriores/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/araca-arq', icon: Linkedin, label: 'LinkedIn' },
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
            alt=""
            width={400}
            height={200}
            className="h-auto max-h-[60%] w-auto max-w-[80%] opacity-10"
            style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
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
                      aria-label="WhatsApp: (11) 99745-8464"
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
                  href="https://naut.design"
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
