import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  theme?: 'dark' | 'light'
  className?: string
  includeJsonLd?: boolean
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.araca.arq.br'

export function Breadcrumbs({
  items,
  theme = 'dark',
  className,
  includeJsonLd = true,
}: BreadcrumbsProps) {
  const isDark = theme === 'dark'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href
        ? {
            item: item.href.startsWith('http')
              ? item.href
              : `${baseUrl}${item.href}`,
          }
        : {}),
    })),
  }

  return (
    <>
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-xs font-medium sm:text-sm',
          isDark ? 'text-white/70' : 'text-neutral-500',
          className
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    isDark ? 'text-white/40' : 'text-neutral-400'
                  )}
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors duration-200',
                    isDark
                      ? 'text-white/80 hover:text-white underline-offset-4 hover:underline'
                      : 'text-neutral-600 hover:text-araca-mineral-green'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'truncate font-semibold',
                    isDark ? 'text-white' : 'text-araca-chocolate-amargo'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
