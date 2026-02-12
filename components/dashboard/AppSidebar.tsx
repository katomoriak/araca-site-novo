'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Wallet,
  ImageIcon,
  BookOpen,
  ChevronDown,
  UserCog,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { SidebarUser } from './SidebarUser'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useHasPermission } from './DashboardAuthContext'

const navItems = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard, permission: null as 'blog' | 'finance' | 'crm' | 'projetos' | 'users' | null },
  { href: '/dashboard/crm', label: 'CRM', icon: Users, permission: 'crm' as const },
  { href: '/dashboard/finance', label: 'Financeiro', icon: Wallet, permission: 'finance' as const },
  { href: '/dashboard/users', label: 'Usuários', icon: UserCog, permission: 'users' as const },
]

const projetoItems = [
  { href: '/dashboard/projetos', label: 'Projetos' },
  { href: '/dashboard/projetos/midias', label: 'Mídias' },
]

const blogItems = [
  { href: '/dashboard/blog/posts', label: 'Posts' },
  { href: '/dashboard/blog/categories', label: 'Categorias' },
  { href: '/dashboard/blog/authors', label: 'Autores' },
  { href: '/dashboard/blog/media', label: 'Mídias' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isBlogActive = pathname.startsWith('/dashboard/blog')
  const canAccessBlog = useHasPermission('blog')
  const canAccessProjetos = useHasPermission('projetos')
  const canAccessCRM = useHasPermission('crm')
  const canAccessFinance = useHasPermission('finance')
  const canAccessUsers = useHasPermission('users')
  
  const showNavItem = (permission: typeof navItems[number]['permission']) => {
    if (permission === null) return true
    if (permission === 'crm') return canAccessCRM
    if (permission === 'finance') return canAccessFinance
    if (permission === 'users') return canAccessUsers
    return false
  }
  
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logotipos/LOGOTIPO_LATERAL@300x.png"
            alt="Aracá Interiores"
            width={140}
            height={56}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-araca-cafe-escuro text-sm font-semibold">Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (!showNavItem(item.permission)) return null
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {canAccessProjetos && (
              <Collapsible defaultOpen={pathname.startsWith('/dashboard/projetos')} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={pathname.startsWith('/dashboard/projetos')}>
                      <ImageIcon className="size-4" />
                      <span>Gestão de Projetos</span>
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {projetoItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={item.href}>
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              )}
              
              {canAccessBlog && (
              <Collapsible defaultOpen={isBlogActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isBlogActive}>
                      <BookOpen className="size-4" />
                      <span>Gestão do Blog</span>
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {blogItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={item.href}>
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarUser />
    </Sidebar>
  )
}
