import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata data para exibição em pt-BR. */
export function formatDate(
  value: string | Date | number | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (value == null) return ''
  const d = typeof value === 'object' && 'getTime' in value ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(d)
}
