'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import type { MonthlyData } from '@/components/dashboard/OverviewChart'
import { BalanceChart } from '@/components/dashboard/BalanceChart'
import type { BalanceDataPoint } from '@/components/dashboard/BalanceChart'
import { AddTransactionButtons } from '@/components/dashboard/AddTransactionSheet'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import type { PayloadTransaction } from '@/lib/payload'
import { cn } from '@/lib/utils'

type TimeRange = '3m' | '6m' | '1y'
type ProjectionRange = '3m' | '6m' | '1y'

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date)
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Mês da transação a partir da string ISO (evita timezone: "2025-02-01" não vira jan). */
function getMonthKeyFromDateString(dateStr: string): string {
  const [y, m] = dateStr.slice(0, 10).split('-')
  if (y && m) return `${y}-${m}`
  return getMonthKey(new Date(dateStr))
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, n: number): Date {
  const out = new Date(d)
  out.setMonth(out.getMonth() + n)
  return out
}

function isExecutada(t: PayloadTransaction): boolean {
  return t.executada !== false
}

export function FinancePageContent() {
  const [transactions, setTransactions] = useState<PayloadTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('6m')
  const [projection, setProjection] = useState<ProjectionRange | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/transactions', { credentials: 'include' })
      if (!res.ok) throw new Error('Falha ao carregar')
      const data = await res.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const now = new Date()
  const todayKey = getMonthKey(now)
  const pastMonths = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
  const startPast = startOfMonth(addMonths(now, -pastMonths))
  const endPast = startOfMonth(now)
  const projMonths = projection === '3m' ? 3 : projection === '6m' ? 6 : projection === '1y' ? 12 : 0

  const months: { key: string; label: string; isFuture: boolean }[] = []
  let d = new Date(startPast.getFullYear(), startPast.getMonth(), 1)
  const endDate = projMonths > 0 ? addMonths(now, projMonths) : endPast
  while (d <= endDate) {
    months.push({
      key: getMonthKey(d),
      label: getMonthLabel(d),
      isFuture: getMonthKey(d) > todayKey,
    })
    d = addMonths(d, 1)
  }

  const chartData: MonthlyData[] = []
  const balanceData: BalanceDataPoint[] = []
  let balancoConsolidadoAnterior = 0

  // Com projeção ativada: todas as transações no período (passadas, atuais e futuras). Sem projeção: só executadas.
  const includeAllInChart = projection !== null

  for (const { key, label } of months) {
    let receita = 0
    let despesas = 0
    for (const t of transactions) {
      const tMonth = getMonthKeyFromDateString(t.date)
      if (tMonth !== key) continue
      if (!includeAllInChart && !isExecutada(t)) continue
      if (t.type === 'income') receita += t.amount
      else despesas += t.amount
    }
    chartData.push({ month: label, receita, despesas })
    const balancoMes = receita - despesas
    const balancoConsolidado = balancoConsolidadoAnterior + balancoMes
    balancoConsolidadoAnterior = balancoConsolidado
    balanceData.push({
      month: label,
      balancoMes,
      balancoConsolidado,
    })
  }

  const timeLabels: { value: TimeRange; label: string }[] = [
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último ano' },
  ]
  const projLabels: { value: ProjectionRange; label: string }[] = [
    { value: '3m', label: 'Próximos 3 meses' },
    { value: '6m', label: 'Próximos 6 meses' },
    { value: '1y', label: 'Próximo ano' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Financeiro</h1>
          <p className="text-muted-foreground">
            Receitas e despesas. Cadastre aqui ou em{' '}
            <Link href="/admin/collections/transactions" className="text-primary underline">
              Admin Payload
            </Link>
            .
          </p>
        </div>
        <AddTransactionButtons />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Receita vs Despesas</CardTitle>
              <CardDescription>
                {projection
                  ? `Todas as transações no período + projeção (${projLabels.find((p) => p.value === projection)?.label ?? projection})`
                  : 'Apenas transações marcadas como executadas'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Período:</span>
              {timeLabels.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTimeRange(value)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-sm font-medium transition-colors',
                    timeRange === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted'
                  )}
                >
                  {label}
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">Projeção:</span>
              <button
                type="button"
                onClick={() => setProjection(projection ? null : '6m')}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-sm font-medium transition-colors',
                  projection ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-muted'
                )}
              >
                {projection ? 'Ativada' : 'Desativada'}
              </button>
              {projection && (
                <>
                  {projLabels.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setProjection(value)}
                      className={cn(
                        'rounded-md border px-2.5 py-1 text-sm transition-colors',
                        projection === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              Carregando…
            </div>
          ) : (
            <>
              <OverviewChart data={chartData} />
              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium text-muted-foreground">Balanço consolidado (balanço do mês + consolidado anterior)</p>
                <BalanceChart data={balanceData} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Ordenadas por data (mais recentes primeiro). Marque &quot;Executada?&quot; para incluir no balanço realizado.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={transactions}
            onExecutadaChange={fetchTransactions}
          />
        </CardContent>
      </Card>
    </div>
  )
}
