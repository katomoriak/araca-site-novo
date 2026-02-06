import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classNames com Tailwind merge (evita conflitos de classes)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
