'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProjetosHero } from '@/components/projetos/ProjetosHero'
import { Container } from '@/components/layout/Container'
import { contatoContent } from '@/content/contato'

const TIPOS_CONSULTA = ['Projeto residencial', 'Projeto comercial', 'Consultoria', 'Outros'] as const

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

export function ContatoPageContent() {
  const { hero, intro, contact, form } = contatoContent
  const [tipoConsulta, setTipoConsulta] = useState<string>(TIPOS_CONSULTA[0])
  const [contactForm, setContactForm] = useState({
    nome: '',
    sobrenome: '',
    pais: '',
    telefone: '',
    email: '',
    mensagem: '',
    newsletter: false,
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [contactError, setContactError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError(null)
    setContactStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: contactForm.nome.trim(),
          sobrenome: contactForm.sobrenome.trim() || undefined,
          pais: contactForm.pais.trim() || undefined,
          telefone: contactForm.telefone.trim() || undefined,
          email: contactForm.email.trim().toLowerCase(),
          tipoConsulta: tipoConsulta || undefined,
          mensagem: contactForm.mensagem.trim() || undefined,
          newsletter: contactForm.newsletter,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setContactError(
          data.error || data.errors?.[0] || 'Não foi possível enviar. Tente novamente.'
        )
        setContactStatus('error')
        return
      }
      const hadNewsletter = contactForm.newsletter
      const subscribeEmail = contactForm.email.trim().toLowerCase()
      setContactStatus('success')
      setContactForm({
        nome: '',
        sobrenome: '',
        pais: '',
        telefone: '',
        email: '',
        mensagem: '',
        newsletter: false,
      })
      setTipoConsulta(TIPOS_CONSULTA[0])
      if (hadNewsletter && subscribeEmail) {
        fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: subscribeEmail, status: 'subscribed' }),
        }).catch(() => {})
      }
    } catch {
      setContactError('Erro de conexão. Tente novamente.')
      setContactStatus('error')
    }
  }

  return (
    <>
      <ProjetosHero
        title={hero.title}
        subtitle={hero.subtitle}
        heroImage={hero.heroImage}
      />

      <section
        className="relative min-h-[640px] py-20 sm:py-24 bg-[var(--araca-bege-claro)]"
        aria-labelledby="contato-heading"
      >
        <div className="px-4 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-araca-mineral-green shadow-2xl p-8 sm:p-10">
            <Container className="grid gap-12 lg:grid-cols-[1fr,minmax(380px,440px)] lg:gap-16 items-start lg:items-stretch !px-0">
              {/* Coluna esquerda: título, descrição e informações de contato */}
              <div className="relative text-white space-y-8 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-start pointer-events-none opacity-10"
                  aria-hidden
                >
                  <div className="relative h-full max-h-[280px] w-[45%] max-w-[200px]">
                    <Image
                      src="/logotipos/LOGOTIPO%20REDONDO@300x.png"
                      alt=""
                      fill
                      sizes="200px"
                      className="object-contain object-left-bottom"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                </div>
                <motion.div {...fadeInUp}>
                  <h2
                    id="contato-heading"
                    className="font-display text-3xl font-bold sm:text-4xl"
                  >
                    {intro.title}
                  </h2>
                  <p className="mt-4 text-white/90 text-base sm:text-lg max-w-lg">
                    {intro.description}
                  </p>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2 text-white/95">
                  <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <h3 className="font-display font-semibold text-white">Localização</h3>
                    <p className="mt-1 text-sm text-white/90">{contact.location}</p>
                    <p className="mt-0.5 text-sm text-white/80">{contact.schedule}</p>
                  </motion.div>
                  <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
                    <h3 className="font-display font-semibold text-white">Redes sociais</h3>
                    <p className="mt-1 flex flex-wrap gap-3">
                      <a
                        href={contact.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/90 hover:text-white underline underline-offset-2"
                        aria-label="Instagram"
                      >
                        Instagram
                      </a>
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/90 hover:text-white underline underline-offset-2"
                        aria-label="LinkedIn"
                      >
                        LinkedIn
                      </a>
                    </p>
                  </motion.div>
                  <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <h3 className="font-display font-semibold text-white">Email</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 text-sm text-white/90 hover:text-white underline underline-offset-2"
                    >
                      {contact.email}
                    </a>
                  </motion.div>
                  <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
                    <h3 className="font-display font-semibold text-white">Telefone</h3>
                    <a
                      href={contact.phoneHref}
                      className="mt-1 text-sm text-white/90 hover:text-white underline underline-offset-2"
                    >
                      {contact.phone}
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* Coluna direita: card branco com formulário */}
              <motion.div
                className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <h3 className="font-display text-xl font-bold text-araca-cafe-escuro">
                  {form.title}
                </h3>
                <p className="mt-2 text-sm text-araca-chocolate-amargo">{form.subtitle}</p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="sr-only">Nome</span>
                      <input
                        type="text"
                        placeholder="Nome"
                        required
                        value={contactForm.nome}
                        onChange={(e) =>
                          setContactForm((p) => ({ ...p, nome: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Sobrenome</span>
                      <input
                        type="text"
                        placeholder="Sobrenome"
                        value={contactForm.sobrenome}
                        onChange={(e) =>
                          setContactForm((p) => ({ ...p, sobrenome: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="sr-only">País</span>
                      <input
                        type="text"
                        placeholder="País"
                        value={contactForm.pais}
                        onChange={(e) =>
                          setContactForm((p) => ({ ...p, pais: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Telefone</span>
                      <input
                        type="tel"
                        placeholder="Telefone"
                        value={contactForm.telefone}
                        onChange={(e) =>
                          setContactForm((p) => ({ ...p, telefone: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green"
                    />
                  </label>
                  <div>
                    <span className="block text-sm font-medium text-araca-cafe-escuro mb-2">
                      Tipo de consulta
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TIPOS_CONSULTA.map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setTipoConsulta(op)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-araca-mineral-green focus:ring-offset-2 ${
                            tipoConsulta === op
                              ? 'border-araca-mineral-green bg-araca-mineral-green/10 text-araca-cafe-escuro'
                              : 'border-gray-200 text-araca-chocolate-amargo hover:border-araca-mineral-green hover:bg-araca-mineral-green/5'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="sr-only">Mensagem</span>
                    <textarea
                      placeholder="Mensagem"
                      rows={4}
                      value={contactForm.mensagem}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, mensagem: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-araca-cafe-escuro placeholder:text-gray-400 focus:border-araca-mineral-green focus:outline-none focus:ring-1 focus:ring-araca-mineral-green resize-y min-h-[100px]"
                    />
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactForm.newsletter}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, newsletter: e.target.checked }))
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-araca-mineral-green focus:ring-araca-mineral-green"
                    />
                    <span className="text-sm text-araca-chocolate-amargo">
                      {form.newsletterLabel}
                    </span>
                  </label>
                  {contactStatus === 'success' && (
                    <p className="text-sm text-araca-mineral-green font-medium">
                      {form.successMessage}
                    </p>
                  )}
                  {contactStatus === 'error' && contactError && (
                    <p className="text-sm text-red-600">{contactError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={contactStatus === 'loading'}
                    className="w-full rounded-lg bg-araca-mineral-green px-4 py-3 font-medium text-white hover:bg-araca-rifle-green focus:outline-none focus:ring-2 focus:ring-araca-mineral-green focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {contactStatus === 'loading' ? form.submittingLabel : form.submitLabel}
                  </button>
                </form>
              </motion.div>
            </Container>
          </div>
        </div>
      </section>
    </>
  )
}
