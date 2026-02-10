'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDownCircle, ArrowUpCircle, Repeat } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type TransactionType = 'income' | 'expense'

interface AddTransactionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: TransactionType
}

const defaultDate = () => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function AddTransactionSheet({
  open,
  onOpenChange,
  type,
}: AddTransactionSheetProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: defaultDate(),
    category: '',
    fixedExpense: false,
  })

  const isIncome = type === 'income'
  const title = isIncome ? 'Adicionar receita' : 'Adicionar despesa'
  const description = isIncome
    ? 'Preencha os dados da nova receita.'
    : 'Preencha os dados da nova despesa.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const amount = Number(form.amount.replace(',', '.').trim())
    if (!form.description.trim()) {
      setError('Descrição é obrigatória.')
      return
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Informe um valor válido (maior que zero).')
      return
    }
    if (!form.date) {
      setError('Data é obrigatória.')
      return
    }
    setLoading(true)
    try {
      const isFixedRecurring = form.fixedExpense
      const url = isFixedRecurring ? '/api/dashboard/transactions' : '/api/transactions'
      const body: Record<string, unknown> = {
        type,
        description: form.description.trim(),
        amount,
        date: form.date,
        category: form.category.trim() || undefined,
      }
      if (isFixedRecurring) body.fixedExpense = true

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.errors?.[0]?.message ?? data.message ?? `Erro ${res.status}`)
      }
      setForm({ description: '', amount: '', date: defaultDate(), category: '', fixedExpense: false })
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) setError(null)
    onOpenChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-md border-araca-bege-medio/30 bg-araca-creme text-araca-cafe-escuro shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-araca-cafe-escuro">{title}</SheetTitle>
          <SheetDescription className="text-araca-chocolate-amargo/90">
            {description}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-6">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição *
            </label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Ex.: Pagamento projeto X"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Valor (R$) *
            </label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  amount: e.target.value.replace(/[^\d,.]/g, ''),
                }))
              }
              placeholder="0,00"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Data *
            </label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoria (opcional)
            </label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              placeholder="Ex.: Projeto X, Marketing"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="fixedExpense"
              type="checkbox"
              checked={form.fixedExpense}
              onChange={(e) => setForm((p) => ({ ...p, fixedExpense: e.target.checked }))}
              className="h-4 w-4 rounded border-input"
            />
            <label
              htmlFor="fixedExpense"
              className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
            >
              <Repeat className="h-4 w-4 text-muted-foreground" />
              {isIncome ? 'Receita' : 'Despesa'} fixa (repetir mensalmente daqui em diante)
            </label>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              Salvar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function AddTransactionButtons() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetType, setSheetType] = useState<TransactionType>('income')

  const openSheet = (type: TransactionType) => {
    setSheetType(type)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => openSheet('income')}
          className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Adicionar receita
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => openSheet('expense')}
        >
          <ArrowDownCircle className="h-4 w-4" />
          Adicionar despesa
        </Button>
      </div>
      <AddTransactionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        type={sheetType}
      />
    </>
  )
}
