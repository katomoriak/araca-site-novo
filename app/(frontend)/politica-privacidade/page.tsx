import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Aracá Interiores',
  description: 'Saiba como a Aracá Interiores coleta e protege seus dados de acordo com a LGPD.',
  alternates: {
    canonical: `${baseUrl}/politica-privacidade`,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-semibold uppercase tracking-tight text-araca-cafe-escuro sm:text-5xl border-b border-araca-cafe-medio pb-8">
            Política de Privacidade
          </h1>
          
          <div className="mt-12 prose prose-araca max-w-none">
            <section>
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">1. Introdução</h2>
              <p>
                A Aracá Interiores valoriza a sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site. Ao navegar em nosso site, você concorda com as práticas descritas aqui.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">2. Coleta de Informações</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como quando você se inscreve em nossa newsletter (e-mail) ou entra em contato conosco via formulário ou WhatsApp (nome, telefone, e-mail).
              </p>
              <p className="mt-4">
                Também coletamos dados técnicos automaticamente, como endereço IP, tipo de navegador e páginas visitadas, para melhorar sua experiência em nosso site.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">3. Uso de Dados</h2>
              <p>
                Utilizamos seus dados para:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Responder a suas solicitações de orçamento e contato;</li>
                <li>Enviar newsletters e novidades sobre design e decoração (caso você tenha se inscrito);</li>
                <li>Melhorar o desempenho e a funcionalidade do nosso site;</li>
                <li>Garantir a segurança dos nossos serviços.</li>
              </ul>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">4. LGPD e Seus Direitos</h2>
              <p>
                Em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil, você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade de seus dados pessoais. Para exercer esses direitos, entre em contato conosco pelo e-mail <strong>contato@araca.arq.br</strong>.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">5. Cookies</h2>
              <p>
                Utilizamos cookies para entender como você interage com nosso site. Você pode gerenciar as preferências de cookies diretamente no seu navegador.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">6. Alterações</h2>
              <p>
                Podemos atualizar esta política periodicamente. Recomendamos que você a revise regularmente para estar ciente de quaisquer mudanças.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">7. Contato</h2>
              <p>
                Se tiver dúvidas sobre nossa Política de Privacidade, entre em contato através do e-mail: <strong>contato@araca.arq.br</strong>.
              </p>
            </section>
          </div>
          
          <div className="mt-16 pt-8 border-t border-araca-cafe-medio">
            <p className="text-sm text-araca-chocolate-amargo/60 italic">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
