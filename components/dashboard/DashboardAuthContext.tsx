'use client'

import { createContext, useContext } from 'react'
import type { DashboardUser } from '@/lib/dashboard-auth'

export type Permission = 'blog' | 'finance' | 'crm' | 'projetos' | 'users'

const DashboardAuthContext = createContext<DashboardUser | null>(null)

export function DashboardAuthProvider({
  user,
  children,
}: {
  user: DashboardUser | null
  children: React.ReactNode
}) {
  return (
    <DashboardAuthContext.Provider value={user}>
      {children}
    </DashboardAuthContext.Provider>
  )
}

export function useDashboardAuth() {
  return useContext(DashboardAuthContext)
}

export function useHasPermission(perm: Permission): boolean {
  const user = useDashboardAuth()
  if (!user) return false
  if (user.role === 'admin') return true
  return Array.isArray(user.permissions) && user.permissions.includes(perm)
}
