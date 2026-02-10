'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface BalanceDataPoint {
  month: string
  /** Receita − despesa do mês (isolado). */
  balancoMes: number
  /** Balanço do mês + consolidado do mês anterior. */
  balancoConsolidado: number
}

const chartConfig = {
  balancoConsolidado: {
    label: 'Balanço consolidado',
    color: 'hsl(142, 71%, 45%)',
  },
  balancoMes: {
    label: 'Balanço do mês',
    color: 'hsl(142, 71%, 35%)',
  },
} satisfies ChartConfig

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function BalanceChart({ data }: { data: BalanceDataPoint[] }) {
  if (data.length === 0) {
    return null
  }
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => formatCurrency(v)} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as BalanceDataPoint | undefined
                if (!p) return null
                return (
                  <div className="grid gap-0.5">
                    <span className="font-medium">{p.month}</span>
                    <span className="text-muted-foreground text-xs">
                      Mês: {formatCurrency(p.balancoMes)} · Consolidado: {formatCurrency(p.balancoConsolidado)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="balancoConsolidado"
          stroke="var(--color-balancoConsolidado)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
