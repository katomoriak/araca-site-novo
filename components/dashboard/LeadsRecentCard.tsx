'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { CrmDeal } from '@/lib/supabase-crm'

function formatRelativeTime(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return `${diffMins}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d)
}

function dealRef(id: string): string {
  return `D-${id.slice(-4).toUpperCase()}`
}

/** Disparado quando um novo lead é criado pelo AddLeadSheet. */
export const LEAD_ADDED_EVENT = 'lead-added'

export function LeadsRecentCard() {
  const [deals, setDeals] = useState<CrmDeal[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/contacts', { credentials: 'include', cache: 'no-store' })
      if (!res.ok) { setDeals([]); return }
      const data = await res.json() as { docs?: CrmDeal[] }
      setDeals(data.docs ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener(LEAD_ADDED_EVENT, handler)
    return () => window.removeEventListener(LEAD_ADDED_EVENT, handler)
  }, [refetch])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads recentes</CardTitle>
        <CardDescription>
          Todos os deals cadastrados, do mais recente ao mais antigo. Dados do ERP Aracá.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            Carregando…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum lead cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-mono text-muted-foreground">
                      {dealRef(deal.id)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>{deal.contacts?.name ?? '—'}</div>
                      <div className="text-xs text-muted-foreground">{deal.contacts?.email ?? deal.contacts?.phone ?? ''}</div>
                    </TableCell>
                    <TableCell>{deal.project_name}</TableCell>
                    <TableCell>
                      <Badge variant={deal.project_type === 'Comercial' ? 'default' : 'outline'}>
                        {deal.project_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{deal.contacts?.origin ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(deal.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
