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
import { getProjetoCoverUrl } from '@/lib/projetos-server'
import { ProjetosSeedButton } from './ProjetosSeedButton'
import { ProjectCardWithDelete } from './ProjectCardWithDelete'

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
            const coverSrc = getProjetoCoverUrl(p.slug, p.cover)
            return (
              <ProjectCardWithDelete
                key={p.id}
                slug={p.slug}
                title={p.title}
                tag={p.tag}
                coverSrc={coverSrc}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
