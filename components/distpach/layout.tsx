import type { ReactNode } from "react"
import { DashboardSidebar } from "./sidebar"
import { Header } from "./header"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/contexts/distpach/ThemeContext"

export function Layout({ children, unreadCount = 0 }: { children: ReactNode; unreadCount?: number }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen w-full">
          <Header unreadCount={unreadCount} />
          <div className="flex flex-1 pt-16 sm:pt-20">
            <DashboardSidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
              <SidebarTrigger className="lg:hidden absolute top-20 sm:top-24 left-4" />
              <div className="w-full h-full">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

