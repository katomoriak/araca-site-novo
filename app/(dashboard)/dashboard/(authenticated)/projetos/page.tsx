import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { getProjetosBaseUrl } from '@/lib/projetos-server'
import { ProjetosSeedButton } from './ProjetosSeedButton'

export default async function ProjetosPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projetos',
    limit: 100,
    pagination: false,
    sort: 'slug',
    overrideAccess: true,
  })
  const projects = (result.docs ?? []) as Array<{
    id: string
    slug: string
    title: string
    description?: string | null
    tag?: string | null
    cover: string
  }>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projetos da Home</h1>
          <p className="text-muted-foreground">
            Projetos exibidos na galeria da página inicial. Edite título, descrição e mídias (upload direto no Supabase).
          </p>
        </div>
        <div className="flex gap-2">
          <ProjetosSeedButton />
          <Button asChild>
            <Link href="/dashboard/projetos/novo">
              <Plus className="size-4" />
              Novo projeto
            </Link>
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum projeto</CardTitle>
            <CardDescription>
              Execute &quot;Importar projetos atuais&quot; para preencher a partir dos manifests em public/projetos, ou crie um novo projeto.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const baseUrl = getProjetosBaseUrl(p.slug)
            const coverSrc = `${baseUrl}/${encodeURIComponent(p.cover)}`
            return (
              <Link key={p.id} href={`/dashboard/projetos/${encodeURIComponent(p.slug)}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-video w-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverSrc}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-base">{p.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {p.tag && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {p.tag}
                        </span>
                      )}
                      <span className="text-xs">{p.slug}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
