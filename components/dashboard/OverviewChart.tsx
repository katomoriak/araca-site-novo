'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface MonthlyData {
  month: string
  receita: number
  despesas: number
}

const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(217, 91%, 60%)', // azul
  },
  despesas: {
    label: 'Despesas',
    color: 'hsl(0, 72%, 51%)', // vermelho
  },
} satisfies ChartConfig

export function OverviewChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        Nenhum dado no período
      </div>
    )
  }
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="receita" fill="var(--color-receita)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesas" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
