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
import type { PayloadLead, LeadStatus, LeadSource } from '@/lib/payload'

const STATUS_LABELS: Record<LeadStatus, string> = {
  contacted: 'Contatado',
  qualified: 'Qualificado',
  proposal_sent: 'Proposta enviada',
  negotiation: 'Negociação',
  won: 'Ganho',
  lost: 'Perdido',
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Site',
  social: 'Redes sociais',
  referral: 'Indicação',
  other: 'Outro',
}

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
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

function leadRef(id: string | number | undefined | null): string {
  const s = id != null ? String(id) : ''
  const num = s.replace(/\D/g, '').slice(-4) || s.slice(-4) || '—'
  return `L-${num}`
}

const LEADS_API = '/api/leads?limit=500&sort=-createdAt'

async function fetchLeads(): Promise<PayloadLead[]> {
  const res = await fetch(LEADS_API, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) return []
  const data = (await res.json()) as { docs?: PayloadLead[] }
  return data.docs ?? []
}

/** Disparado quando um novo lead é criado (ex.: pelo AddLeadSheet). */
export const LEAD_ADDED_EVENT = 'lead-added'

export function LeadsRecentCard() {
  const [leads, setLeads] = useState<PayloadLead[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchLeads()
      setLeads(list)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener(LEAD_ADDED_EVENT, handler)
    return () => window.removeEventListener(LEAD_ADDED_EVENT, handler)
  }, [refetch])

  const sorted = [...leads].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return db - da
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads recentes</CardTitle>
        <CardDescription>
          Todos os leads adicionados, do mais recente ao mais antigo.
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
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Última atividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum lead cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((lead: PayloadLead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-mono text-muted-foreground">
                      {leadRef(lead.id)}
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company ?? '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.status === 'won'
                            ? 'success'
                            : lead.status === 'lost'
                              ? 'error'
                              : 'default'
                        }
                      >
                        {STATUS_LABELS[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{SOURCE_LABELS[lead.source ?? 'other']}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(lead.lastActivity ?? lead.createdAt)}
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
