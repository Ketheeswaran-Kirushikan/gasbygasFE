"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Ensure SidebarContext is only created once
const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
} | null>(null);

// ✅ SidebarProvider wraps the sidebar state
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ✅ useSidebar Hook
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
