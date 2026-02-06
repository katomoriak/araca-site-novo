import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { Container } from './Container'

const footerLinks = [
  { href: '/', label: 'Início' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/design-system', label: 'Design System' },
  { href: '/admin', label: 'Admin' },
]

const socialLinks = [
  { href: '#', icon: Github, label: 'GitHub' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Twitter, label: 'Twitter' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/50">
      <Container>
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="font-display text-lg font-semibold text-foreground"
            >
              Aracá Interiores
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Blog profissional com Next.js e Payload CMS. Design System Lab para
              documentação de componentes.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <ul className="flex flex-wrap gap-6">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          © {year} Aracá Interiores. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  )
}
