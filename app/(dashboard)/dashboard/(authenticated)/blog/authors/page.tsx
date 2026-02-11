import { getPayloadClient } from '@/lib/payload'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function AuthorsPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'users',
    limit: 100,
    pagination: false,
    sort: 'name',
    overrideAccess: true,
  })
  
  const authors = (result.docs ?? []) as Array<{
    id: string
    name?: string | null
    email: string
    role?: string | null
  }>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Autores do Blog</h1>
          <p className="text-muted-foreground">
            Lista de usuários que podem ser autores de posts. Gerencie usuários no Payload Admin.
          </p>
        </div>
      </div>

      {authors.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum autor</CardTitle>
            <CardDescription>
              Não há usuários cadastrados no sistema.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Card key={author.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-base">
                      {author.name || author.email}
                    </CardTitle>
                    {author.name && (
                      <CardDescription className="mt-1">
                        {author.email}
                      </CardDescription>
                    )}
                  </div>
                  {author.role && (
                    <Badge variant={author.role === 'admin' ? 'default' : 'secondary'}>
                      {author.role}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Como adicionar novos autores?</CardTitle>
          <CardDescription>
            Para adicionar novos autores, acesse o Payload Admin em{' '}
            <a href="/admin" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              /admin
            </a>
            {' '}e crie novos usuários na coleção Users.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
