"use client"

import { Home, Truck, Calendar, BarChart, FileText, Users, UserCog, Bell, Settings, LogOut, Share2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Truck, label: "Delivery Requests", href: "/delivery-requests" },
  { icon: Calendar, label: "Scheduled Deliveries", href: "/scheduled-deliveries" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Driver Details", href: "/driver-details" },
  { icon: UserCog, label: "User Management", href: "/user-management" },
  { icon: Share2, label: "Allocation", href: "/allocation" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-0 lg:block">
      <SidebarHeader className="border-b p-4 flex justify-center items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-yad2Uj5KQQJ3xvxC5TrYXtEqDE4axk.png"
          alt="GAS GAS BY Logo"
          className="h-8 sm:h-12 w-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="text-gray-600 hover:text-foreground hover:bg-accent px-4 sm:px-6 py-2 sm:py-3 w-full"
                  >
                    <Link href={item.href} className="flex items-center gap-2 sm:gap-4">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

