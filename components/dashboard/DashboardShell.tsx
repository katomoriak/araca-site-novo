'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from './AppSidebar'
import { SilkDynamic } from './SilkDynamic'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--header-height': '3rem',
        } as React.CSSProperties
      }
    >
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <SilkDynamic
          speed={5}
          scale={1}
          color="#E8E0D5"
          noiseIntensity={1.2}
          rotation={0}
        />
      </div>
      <div className="relative z-10 flex min-h-svh w-full flex-1 p-2 md:p-3">
        <AppSidebar />
        <SidebarInset className="!m-0 min-w-0 flex-1 rounded-xl bg-white/80 shadow-sm backdrop-blur-sm dark:bg-background/85 md:ml-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            Menu do dashboard
          </span>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 rounded-b-xl p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
