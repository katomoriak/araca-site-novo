'use client'

import React, { useState, useEffect } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import {
    Users,
    MousePointer2,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    MoreHorizontal,
    Settings,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import GlassSurface from '@/components/ui/GlassSurface/GlassSurface'
import { Button } from '@/components/ui/Button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/Badge'

interface AnalyticsData {
    summary: {
        activeUsers: string
        pageViews: string
        bounceRate: string
        avgSessionDuration: string
    }
    traffic: any[]
    pages: any[]
    devices: any[]
    missingConfig?: boolean
    details?: any
}

interface StatCardProps {
    title: string
    value: string
    icon: React.ElementType
    loading?: boolean
}

const StatCard = ({ title, value, icon: Icon, loading }: StatCardProps) => (
    <GlassSurface
        className="p-6 flex flex-col justify-between"
        width="100%"
        height="160px"
        borderRadius={24}
        brightness={40}
        opacity={0.8}
        blur={15}
    >
        <div className="flex justify-between items-start">
            <div className="p-2 bg-primary/10 rounded-xl">
                <Icon className="w-5 h-5 text-primary" />
            </div>
        </div>
        <div className="mt-4">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {loading ? (
                <div className="h-8 w-24 bg-muted/20 animate-pulse rounded-md mt-1" />
            ) : (
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
            )}
        </div>
    </GlassSurface>
)

export default function AnalyticsPage() {
    const [range, setRange] = useState('30d')
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = await fetch('/api/dashboard/analytics')
                const json = await res.json()
                if (!res.ok) throw new Error(json.message || 'Erro ao carregar dados')
                setData(json)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (data?.missingConfig) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center max-w-2xl mx-auto">
                <GlassSurface
                    className="p-12 flex flex-col items-center"
                    width="100%"
                    height="auto"
                    borderRadius={32}
                    brightness={35}
                >
                    <div className="p-4 bg-amber-500/10 rounded-full mb-6">
                        <Settings className="w-10 h-10 text-amber-500 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Configuração Necessária</h1>
                    <p className="text-muted-foreground mb-8 text-balance">
                        O rastreamento do Google Analytics já está ativo no site, mas para visualizar os relatórios aqui no dashboard, precisamos das credenciais da <strong>Analytics Data API</strong>.
                    </p>

                    <div className="grid grid-cols-1 gap-3 w-full mb-8 text-left">
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${data.details.propertyId ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className={`w-2 h-2 rounded-full ${data.details.propertyId ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium">GA_PROPERTY_ID</span>
                            {!data.details.propertyId && <AlertCircle className="w-4 h-4 ml-auto text-red-500" />}
                        </div>
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${data.details.clientEmail ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className={`w-2 h-2 rounded-full ${data.details.clientEmail ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium">GA_CLIENT_EMAIL</span>
                            {!data.details.clientEmail && <AlertCircle className="w-4 h-4 ml-auto text-red-500" />}
                        </div>
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${data.details.privateKey ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className={`w-2 h-2 rounded-full ${data.details.privateKey ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium">GA_PRIVATE_KEY</span>
                            {!data.details.privateKey && <AlertCircle className="w-4 h-4 ml-auto text-red-500" />}
                        </div>
                    </div>

                    <Button className="w-full py-6 text-lg rounded-2xl shadow-lg shadow-primary/20" onClick={() => window.location.reload()}>
                        Verificar Novamente
                    </Button>
                </GlassSurface>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Análise de Tráfego</h1>
                    <p className="text-muted-foreground mt-1">
                        Dados reais da propriedade do Google Analytics 4.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-md border-muted">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-md">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Visitantes Ativos"
                    value={data?.summary.activeUsers || '0'}
                    icon={Users}
                />
                <StatCard
                    title="Visualizações"
                    value={data?.summary.pageViews || '0'}
                    icon={MousePointer2}
                />
                <StatCard
                    title="Tempo Médio"
                    value={data?.summary.avgSessionDuration || '0'}
                    icon={Clock}
                />
                <StatCard
                    title="Taxa de Rejeição"
                    value={data?.summary.bounceRate || '0%'}
                    icon={ArrowDownRight}
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-2">
                    <GlassSurface
                        className="p-6"
                        width="100%"
                        height="400px"
                        borderRadius={24}
                        brightness={35}
                        opacity={0.85}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg">Visão Geral</h3>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-muted-foreground">Views</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                                    <span className="text-muted-foreground">Visitantes</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.traffic}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3c5945" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3c5945" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888', fontSize: 10 }}
                                        dy={10}
                                        interval={4}
                                    />
                                    <YAxis
                                        hide
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="#3c5945"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="#6b8a75"
                                        strokeWidth={2}
                                        fill="transparent"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassSurface>
                </div>

                {/* Devices Chart */}
                <div className="lg:col-span-1">
                    <GlassSurface
                        className="p-6 flex flex-col"
                        width="100%"
                        height="400px"
                        borderRadius={24}
                        brightness={35}
                        opacity={0.85}
                    >
                        <h3 className="font-semibold text-lg mb-6">Dispositivos</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={data?.devices}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {data?.devices.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#3c5945' : index === 1 ? '#6b8a75' : '#a3bfa8'} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 gap-3 mt-4">
                            {data?.devices.map((device: any, index: number) => (
                                <div key={device.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: index === 0 ? '#3c5945' : index === 1 ? '#6b8a75' : '#a3bfa8' }} />
                                        <span className="text-sm font-medium capitalize">{device.name}</span>
                                    </div>
                                    <span className="text-sm font-bold">{device.value} usuários</span>
                                </div>
                            ))}
                        </div>
                    </GlassSurface>
                </div>
            </div>

            {/* Pages Table */}
            <GlassSurface
                className="p-6"
                width="100%"
                height="auto"
                borderRadius={24}
                brightness={35}
                opacity={0.85}
            >
                <h3 className="font-semibold text-lg mb-6">Páginas mais Visitadas</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-muted-foreground uppercase tracking-widest border-b border-white/5">
                                <th className="pb-4 font-medium">Path</th>
                                <th className="pb-4 font-medium text-right">Visualizações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data?.pages.map((page: any) => (
                                <tr key={page.path} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 text-sm font-medium group-hover:text-primary transition-colors">
                                        {page.path}
                                    </td>
                                    <td className="py-4 text-sm text-right font-bold tabular-nums">
                                        {page.views.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassSurface>
        </div>
    )
}
