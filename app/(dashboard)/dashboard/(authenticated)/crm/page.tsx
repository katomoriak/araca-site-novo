import Link from 'next/link'
import { getCrmKanbanData } from '@/lib/payload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CrmKanban } from '@/components/dashboard/CrmKanban'
import { CrmPageActions } from '@/components/dashboard/CrmPageActions'
import { LeadsRecentCard } from '@/components/dashboard/LeadsRecentCard'

export default async function CrmPage() {
  const kanbanColumns = await getCrmKanbanData()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CRM</h1>
          <p className="text-muted-foreground">
            Leads e pipeline. Gerencie no{' '}
            <Link href="/admin/collections/leads" className="text-primary underline">
              Admin Payload
            </Link>
            {' '}e{' '}
            <Link href="/admin/collections/negociacoes" className="text-primary underline">
              Negociações
            </Link>
            .
          </p>
        </div>
        <CrmPageActions />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de fechamento</CardTitle>
          <CardDescription>
            Kanban por etapa da negociação. Valor acumulado em cada coluna. Clique no card para editar a negociação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrmKanban columns={kanbanColumns} />
        </CardContent>
      </Card>

      <LeadsRecentCard />
    </div>
  )
}
