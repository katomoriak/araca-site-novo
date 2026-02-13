'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/Button'
import { SidebarFooter } from '@/components/ui/sidebar'

interface DashboardUser {
  id: string
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return '?'
}

export function SidebarUser() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/users/me?depth=1', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // Payload pode retornar o user no top-level ou em data.user
        setUser(data?.user ?? data ?? null)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
      router.replace('/dashboard/login')
      router.refresh()
    } catch {
      router.replace('/dashboard/login')
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading || !user) {
    return (
      <SidebarFooter className="border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="size-9 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </SidebarFooter>
    )
  }

  return (
    <SidebarFooter className="border-t border-sidebar-border mt-auto">
      <div className="flex items-center gap-2 px-2 py-2">
        <Avatar className="size-9 shrink-0">
          {user.avatarUrl && (
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name ?? undefined}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-xs font-medium">
            {getInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm font-medium truncate" title={user.name ?? user.email ?? undefined}>
            {user.name || user.email || 'Usuário'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="size-7 shrink-0 p-0"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Sair"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </SidebarFooter>
  )
}
