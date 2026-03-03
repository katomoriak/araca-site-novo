import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { getDashboardUser } from '@/lib/dashboard-auth'

// Configurações do Google Analytics
const propertyId = process.env.GA_PROPERTY_ID
const clientEmail = process.env.GA_CLIENT_EMAIL
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

export async function GET(request: NextRequest) {
    try {
        // 1. Verificação de Autenticação
        const user = await getDashboardUser()
        if (!user) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
        }

        // 2. Verificação de Configuração
        if (!propertyId || !clientEmail || !privateKey) {
            return NextResponse.json(
                {
                    message: 'Configuração do Google Analytics pendente',
                    missingConfig: true,
                    details: {
                        propertyId: !!propertyId,
                        clientEmail: !!clientEmail,
                        privateKey: !!privateKey
                    }
                },
                { status: 200 } // Retornamos 200 para que o frontend lide com o estado de "Setup"
            )
        }

        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        })

        // 3. Execução das Consultas (Promise.all para performance)
        const [mainStats, hourlyTraffic, topPages, deviceStats] = await Promise.all([
            // Métricas Principais (Totais 30 dias)
            analyticsDataClient.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'screenPageViews' },
                    { name: 'bounceRate' },
                    { name: 'averageSessionDuration' },
                ],
            }),

            // Tráfego por Data (Gráfico)
            analyticsDataClient.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
                orderBys: [{ dimension: { dimensionName: 'date' } }],
            }),

            // Páginas Mais Vistas
            analyticsDataClient.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'pagePath' }],
                metrics: [{ name: 'screenPageViews' }],
                limit: 10,
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            }),

            // Dispositivos
            analyticsDataClient.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'deviceCategory' }],
                metrics: [{ name: 'activeUsers' }],
            }),
        ])

        // 4. Formatação dos Dados
        const formattedData = {
            summary: {
                activeUsers: mainStats[0].rows?.[0]?.metricValues?.[0]?.value || '0',
                pageViews: mainStats[0].rows?.[0]?.metricValues?.[1]?.value || '0',
                bounceRate: (parseFloat(mainStats[0].rows?.[0]?.metricValues?.[2]?.value || '0') * 100).toFixed(1) + '%',
                avgSessionDuration: formatDuration(mainStats[0].rows?.[0]?.metricValues?.[3]?.value || '0'),
            },
            traffic: hourlyTraffic[0].rows?.map(row => ({
                date: formatDate(row.dimensionValues?.[0]?.value || ''),
                visitors: parseInt(row.metricValues?.[0]?.value || '0'),
                views: parseInt(row.metricValues?.[1]?.value || '0'),
            })) || [],
            pages: topPages[0].rows?.map(row => ({
                path: row.dimensionValues?.[0]?.value || '',
                views: parseInt(row.metricValues?.[0]?.value || '0'),
            })) || [],
            devices: deviceStats[0].rows?.map(row => ({
                name: row.dimensionValues?.[0]?.value || 'Unknown',
                value: parseInt(row.metricValues?.[0]?.value || '0'),
            })) || [],
        }

        return NextResponse.json(formattedData)
    } catch (error) {
        console.error('[API Analytics] Erro ao buscar dados:', error)
        return NextResponse.json(
            { message: 'Erro ao processar dados do Google Analytics' },
            { status: 500 }
        )
    }
}

// Helpers
function formatDate(dateStr: string) {
    if (dateStr.length !== 8) return dateStr
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}`
}

function formatDuration(seconds: string) {
    const s = parseFloat(seconds)
    const mins = Math.floor(s / 60)
    const secs = Math.round(s % 60)
    return `${mins}m ${secs}s`
}
