'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Repeat, Check, Minus } from 'lucide-react'
import type { PayloadTransaction } from '@/lib/payload'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/Button'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function TransactionsTable({
  transactions,
  onExecutadaChange,
}: {
  transactions: PayloadTransaction[]
  onExecutadaChange?: () => void
}) {
  const router = useRouter()
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmFixed, setConfirmFixed] = useState<PayloadTransaction | null>(null)

  const handleDeleteClick = (t: PayloadTransaction) => {
    if (t.fixedExpenseGroupId) {
      setConfirmFixed(t)
      return
    }
    if (window.confirm('Apagar esta transação?')) {
      doDelete(t.id, false)
    }
  }

  const toggleExecutada = async (t: PayloadTransaction) => {
    const next = !(t.executada !== false)
    setTogglingId(t.id)
    try {
      const res = await fetch(`/api/dashboard/transactions/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executada: next }),
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message ?? 'Erro ao atualizar.')
        return
      }
      onExecutadaChange?.() ?? router.refresh()
    } catch {
      alert('Erro ao atualizar.')
    } finally {
      setTogglingId(null)
    }
  }

  const doDelete = async (id: string, deleteFutureFixed: boolean) => {
    setDeletingId(id)
    try {
      const url = `/api/dashboard/transactions/${id}${deleteFutureFixed ? '?deleteFutureFixed=true' : ''}`
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message ?? 'Erro ao apagar.')
        return
      }
      setConfirmFixed(null)
      onExecutadaChange?.() ?? router.refresh()
    } catch {
      alert('Erro ao apagar.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-24 text-center">Executada?</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Nenhuma transação cadastrada.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((t) => {
              const executada = t.executada !== false
              return (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        t.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {t.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                    {t.fixedExpenseGroupId && (
                      <span className="ml-1.5 text-muted-foreground" title="Série fixa mensal">
                        <Repeat className="inline h-3.5 w-3.5" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell className="text-muted-foreground">{t.category ?? '—'}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleExecutada(t)}
                      disabled={togglingId !== null}
                      aria-label={executada ? 'Marcar como não executada' : 'Marcar como executada'}
                      title={executada ? 'Sim' : 'Não'}
                    >
                      {executada ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                      onClick={() => handleDeleteClick(t)}
                      disabled={deletingId !== null}
                      aria-label="Apagar transação"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {confirmFixed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-fixed-title"
        >
          <div className="bg-araca-creme dark:bg-araca-cafe-escuro border border-araca-bege-medio/30 rounded-lg shadow-xl max-w-md w-full p-5 text-araca-cafe-escuro dark:text-araca-creme">
            <h3 id="confirm-fixed-title" className="font-semibold text-lg mb-2">
              Série fixa mensal
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Esta transação faz parte de uma série fixa mensal. Deseja apagar apenas esta ou
              também as transações futuras desta série (a partir desta data)?
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmFixed(null)}
                disabled={deletingId !== null}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => doDelete(confirmFixed.id, false)}
                loading={deletingId === confirmFixed.id}
                disabled={deletingId !== null}
              >
                Só esta
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => doDelete(confirmFixed.id, true)}
                loading={deletingId === confirmFixed.id}
                disabled={deletingId !== null}
              >
                Esta e as futuras
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
