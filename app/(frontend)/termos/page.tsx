import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export const metadata: Metadata = {
  title: 'Termos de Uso | Aracá Interiores',
  description: 'Leia os termos de uso do site da Aracá Interiores.',
  alternates: {
    canonical: `${baseUrl}/termos`,
  },
}

export default function TermsPage() {
  return (
    <div className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-semibold uppercase tracking-tight text-araca-cafe-escuro sm:text-5xl border-b border-araca-cafe-medio pb-8">
            Termos de Uso
          </h1>
          
          <div className="mt-12 prose prose-araca max-w-none">
            <section>
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site da Aracá Interiores (araca.arq.br), você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nosso site.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">2. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo textos, logotipos, imagens, designs e fotografias de projetos, é propriedade exclusiva da Aracá Interiores ou é utilizado com permissão. A reprodução, distribuição ou uso comercial de qualquer conteúdo sem autorização prévia por escrito é estritamente proibida.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">3. Uso do Site</h2>
              <p>
                Este site deve ser utilizado apenas para fins legítimos, como consulta de projetos, leitura de blog e contato comercial. É proibido qualquer uso que possa danificar, sobrecarregar ou prejudicar a disponibilidade do site.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">4. Limitação de Responsabilidade</h2>
              <p>
                A Aracá Interiores se esforça para manter as informações do site precisas e atualizadas, mas não garante a ausência de erros. Não nos responsabilizamos por perdas ou danos decorrentes do uso ou da impossibilidade de uso do site.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">5. Links para Terceiros</h2>
              <p>
                Nosso site pode conter links para sites de terceiros. Não temos controle sobre o conteúdo ou as práticas de privacidade desses sites e não assumimos responsabilidade por eles.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">6. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer conflito será resolvido nos tribunais competentes do Brasil.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-araca-cafe-escuro uppercase tracking-wider mb-4">7. Alterações</h2>
              <p>
                Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. O uso continuado do site após alterações constitui aceitação dos novos termos.
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
