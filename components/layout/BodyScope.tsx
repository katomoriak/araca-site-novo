'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { LiquidGlassCursor } from '@/components/ui'

const PAYLOAD_PREFIXES = ['/admin', '/api']

function isPayloadRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return PAYLOAD_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
}

export function BodyScope({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPayload = isPayloadRoute(pathname)

  useEffect(() => {
    const body = document.body
    if (isPayload) {
      body.setAttribute('data-payload-admin', 'true')
      body.classList.remove('font-body', 'antialiased', 'min-h-screen')
    } else {
      body.removeAttribute('data-payload-admin')
      body.classList.add('font-body', 'antialiased', 'min-h-screen')
    }
    return () => {
      body.removeAttribute('data-payload-admin')
      body.classList.remove('font-body', 'antialiased', 'min-h-screen')
    }
  }, [isPayload])

  return (
    <>
      {!isPayload && <LiquidGlassCursor />}
      {children}
    </>
  )
}
