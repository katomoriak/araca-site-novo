import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const PERMISSION_LABELS: Record<string, string> = {
  blog: 'Blog',
  finance: 'Financeiro',
  crm: 'CRM',
  projetos: 'Projetos',
  users: 'Usuários',
}

export default async function UsersPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'users',
    limit: 100,
    pagination: false,
    sort: 'name',
    overrideAccess: true,
  })

  const users = (result.docs ?? []) as Array<{
    id: string
    name?: string | null
    email: string
    role?: string | null
    permissions?: string[] | null
    showAsPublicAuthor?: boolean | null
  }>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e exibição como autor no blog.
          </p>
        </div>
        <Link
          href="/admin/collections/users"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Abrir Payload Admin
        </Link>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum usuário</CardTitle>
            <CardDescription>
              Não há usuários cadastrados no sistema.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-base">
                      {user.name || user.email}
                    </CardTitle>
                    {user.name && (
                      <CardDescription className="mt-1">
                        {user.email}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'Editor'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.role !== 'admin' && user.permissions && user.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {PERMISSION_LABELS[p] ?? p}
                      </Badge>
                    ))}
                  </div>
                )}
                {user.showAsPublicAuthor && (
                  <Badge variant="outline" className="text-xs">
                    Autor público
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Como editar usuários?</CardTitle>
          <CardDescription>
            Acesse o Payload Admin em{' '}
            <Link href="/admin" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              /admin
            </Link>
            {' '}para criar, editar e excluir usuários. Configure permissões e a opção &quot;Exibir como autor no blog&quot; na coleção Users.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
