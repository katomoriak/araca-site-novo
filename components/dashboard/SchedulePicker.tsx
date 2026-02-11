'use client'

import { useState } from 'react'
import { format, addHours, addDays, setHours, setMinutes, setSeconds, nextMonday, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/Input'

interface SchedulePickerProps {
  value: string | null
  onChange: (isoDate: string | null) => void
  onStatusChange?: (status: 'draft' | 'published') => void
  /** Chamado após o usuário confirmar data (preset ou custom). Recebe a data ISO. */
  onConfirm?: (isoDate: string) => void
  minDate?: Date
  disabled?: boolean
  /** Quando true, esconde "Postar agora" (para usar no footer) */
  hidePostNow?: boolean
  /** Variante do botão trigger - 'outline' ou 'ghost' para opção secundária */
  triggerVariant?: 'default' | 'outline' | 'ghost'
}

const QUICK_PRESETS = [
  {
    label: 'Em 1 hora',
    getDate: () => addHours(new Date(), 1),
  },
  {
    label: 'Hoje às 18h',
    getDate: () => {
      const d = new Date()
      return setSeconds(setMinutes(setHours(d, 18), 0), 0)
    },
  },
  {
    label: 'Hoje às 21h',
    getDate: () => {
      const d = new Date()
      return setSeconds(setMinutes(setHours(d, 21), 0), 0)
    },
  },
  {
    label: 'Amanhã às 9h',
    getDate: () => {
      const d = addDays(new Date(), 1)
      return setSeconds(setMinutes(setHours(startOfDay(d), 9), 0), 0)
    },
  },
  {
    label: 'Amanhã às 21h',
    getDate: () => {
      const d = addDays(new Date(), 1)
      return setSeconds(setMinutes(setHours(startOfDay(d), 21), 0), 0)
    },
  },
  {
    label: 'Segunda às 9h',
    getDate: () => {
      const monday = nextMonday(new Date())
      return setSeconds(setMinutes(setHours(startOfDay(monday), 9), 0), 0)
    },
  },
]

export function SchedulePicker({
  value,
  onChange,
  onStatusChange,
  onConfirm,
  minDate = new Date(),
  disabled = false,
  hidePostNow = false,
  triggerVariant = 'outline',
}: SchedulePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [timeValue, setTimeValue] = useState(() => {
    if (!value) return '21:00'
    const d = new Date(value)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  })

  const applyQuickPreset = (getDate: () => Date) => {
    const date = getDate()
    const iso = date.toISOString()
    onChange(iso)
    onStatusChange?.('published')
    setSelectedDate(date)
    setTimeValue(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)
    setOpen(false)
    onConfirm?.(iso)
  }

  const applyCustomDateTime = () => {
    if (!selectedDate) return
    const [hours, minutes] = timeValue.split(':').map(Number)
    const finalDate = setSeconds(setMinutes(setHours(selectedDate, hours ?? 21), minutes ?? 0), 0)
    if (finalDate >= minDate) {
      const iso = finalDate.toISOString()
      onChange(iso)
      onStatusChange?.('published')
      setOpen(false)
      onConfirm?.(iso)
    }
  }

  const handlePostNow = () => {
    const now = new Date()
    onChange(now.toISOString())
    onStatusChange?.('published')
    setOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value)
  }

  const combinedDateTime = selectedDate
    ? (() => {
        const [h, m] = timeValue.split(':').map(Number)
        return setSeconds(setMinutes(setHours(new Date(selectedDate), h ?? 21), m ?? 0), 0)
      })()
    : null

  const isCustomValid = selectedDate && combinedDateTime && combinedDateTime >= minDate

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {!hidePostNow && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handlePostNow}
            disabled={disabled}
            className="gap-2"
          >
            <Send className="size-4" />
            Postar agora
          </Button>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={triggerVariant}
              size="sm"
              disabled={disabled}
              className={cn(
                'gap-2',
                !value && !hidePostNow && 'border-dashed'
              )}
            >
              <CalendarIcon className="size-4" />
              Programar postagem
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col">
              <div className="border-b p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Ações rápidas
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 justify-start text-xs font-normal"
                      onClick={() => applyQuickPreset(preset.getDate)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="p-3 border-b">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Escolher data e hora
                </p>
                <div className="flex gap-2 items-start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{ before: startOfDay(minDate) }}
                    locale={ptBR}
                    captionLayout="dropdown"
                    className="rounded-md border-0"
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <Input
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                        className="w-28 h-8 text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={applyCustomDateTime}
                      disabled={!isCustomValid}
                      className="w-full"
                    >
                      Agendar
                    </Button>
                  </div>
                </div>
              </div>
              {value && (
                <div className="p-2 px-3 bg-muted/30 text-xs text-muted-foreground">
                  Programado para:{' '}
                  <span className="font-medium text-foreground">
                    {format(new Date(value), "EEEE, d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {format(new Date(value), "EEEE, d 'de' MMM 'às' HH:mm", { locale: ptBR })}
          <button
            type="button"
            className="underline text-primary hover:no-underline"
            onClick={() => {
              onChange(null)
              setSelectedDate(undefined)
            }}
          >
            Limpar
          </button>
        </p>
      )}
    </div>
  )
}
