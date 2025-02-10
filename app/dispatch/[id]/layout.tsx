"use client";

import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/distpach/sidebar";
import { Header } from "@/components/distpach/header";
import { SidebarProvider } from "@/components/distpach/ui/sidebar"; // ✅ Ensure correct import
import { ThemeProvider } from "@/contexts/distpach/ThemeContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider> {/* ✅ Wrap SidebarProvider at the top */}
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <div className="flex flex-1 pt-16 sm:pt-20">
            <DashboardSidebar /> {/* ✅ Sidebar is now inside the provider */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
