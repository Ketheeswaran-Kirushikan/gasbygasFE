"use client";

import { useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Truck,
  Calendar,
  BarChart,
  FileText,
  Users,
  UserCog,
  Bell,
  Settings,
  LogOut,
  Share2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams(); // Get dynamic dispatch ID from URL
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Ensure ID is available before building routes
  const dispatchBasePath = id ? `/dispatch/${id}` : "/dispatch/[id]";

  // Sidebar menu items
  const menuItems = [
    { icon: Home, label: "Dashboard", href: `${dispatchBasePath}` },
    { icon: Truck, label: "Gas Requests", href: `${dispatchBasePath}/delivery-requests` },
    { icon: Calendar, label: "Stock Requests", href: `${dispatchBasePath}/scheduled-deliveries` },
    { icon: BarChart, label: "Analytics", href: `${dispatchBasePath}/analytics` },
    { icon: FileText, label: "Reports", href: `${dispatchBasePath}/reports` },
    { icon: UserCog, label: "User Management", href: `${dispatchBasePath}/user-management` },
    { icon: UserCog, label: "Outlet Management", href: `${dispatchBasePath}/outlet` },
    { icon: Share2, label: "Allocation", href: `${dispatchBasePath}/allocation` },
    { icon: Bell, label: "Notifications", href: `${dispatchBasePath}/notifications` },
  ];

  // Logout handler
  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      router.push("/admin"); // Redirect to admin login
    }, 1000);
  };

  return (
    <>
      <Sidebar className="lg:block bg-black text-white">
        <SidebarHeader className="flex justify-center items-center">
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
                      isActive={pathname.startsWith(item.href)}
                      className="text-white hover:text-foreground hover:bg-accent px-4 sm:px-6 sm:py-3 w-full"
                    >
                      <Link href={item.href} className="flex items-center gap-2 sm:gap-4">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Logout Button (Triggers Modal) */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="text-white hover:text-red-500 hover:bg-accent px-4 sm:px-6 sm:py-3 w-full cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to log out? You will need to log in again to access your dashboard.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
              Confirm Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
