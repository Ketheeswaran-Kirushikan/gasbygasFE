"use client";

import { useSidebar } from "@/components/distpach/ui/sidebar"; // ✅ Ensure correct import
import { Bell, Search, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/distpach/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const { toggleSidebar } = useSidebar(); // ✅ This will work if SidebarProvider is wrapped
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex h-14 items-center justify-between border-b px-4">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-bold">Dashboard</h1>
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </header>
  );
}
