import { getLeads, getTransactions } from '@/lib/payload'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import type { MonthlyData } from '@/components/dashboard/OverviewChart'
import { Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function getMonthLabel(dateStr: string) {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(d)
}

export default async function DashboardPage() {
  const [leads, transactions] = await Promise.all([
    getLeads(),
    getTransactions(),
  ])

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthStart = new Date(currentYear, currentMonth, 1)
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

  let receitaMes = 0
  let despesasMes = 0
  for (const t of transactions) {
    const d = new Date(t.date)
    if (d >= monthStart && d <= monthEnd) {
      if (t.type === 'income') receitaMes += t.amount
      else despesasMes += t.amount
    }
  }

  const pipelineLeads = leads.filter(
    (l) => l.status !== 'won' && l.status !== 'lost'
  ).length

  // Últimos 6 meses para o gráfico
  const monthsMap = new Map<string, { receita: number; despesas: number }>()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1)
    const key = getMonthLabel(d.toISOString())
    monthsMap.set(key, { receita: 0, despesas: 0 })
  }
  for (const t of transactions) {
    const key = getMonthLabel(t.date)
    if (!monthsMap.has(key)) continue
    const row = monthsMap.get(key)!
    if (t.type === 'income') row.receita += t.amount
    else row.despesas += t.amount
  }
  const chartData: MonthlyData[] = Array.from(monthsMap.entries()).map(
    ([month, row]) => ({
      month,
      receita: row.receita,
      despesas: row.despesas,
    })
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Visão geral</h1>
        <p className="text-muted-foreground">
          Resumo do CRM e do financeiro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              {pipelineLeads} no pipeline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaMes)}</div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas (mês)</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(despesasMes)}</div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo (mês)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(receitaMes - despesasMes)}
            </div>
            <p className="text-xs text-muted-foreground">Receita − despesas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita vs Despesas</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <OverviewChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}
