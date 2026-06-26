import { getCrmKanban } from '@/lib/supabase-crm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CrmKanban } from '@/components/dashboard/CrmKanban'
import { CrmPageActions } from '@/components/dashboard/CrmPageActions'
import { LeadsRecentCard } from '@/components/dashboard/LeadsRecentCard'

export default async function CrmPage() {
  const kanbanColumns = await getCrmKanban()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CRM</h1>
          <p className="text-muted-foreground">
            Leads e pipeline. Os dados são compartilhados com o ERP Aracá em tempo real.
          </p>
        </div>
        <CrmPageActions />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de fechamento</CardTitle>
          <CardDescription>
            Kanban por etapa da negociação. Arraste para mover entre colunas.
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
