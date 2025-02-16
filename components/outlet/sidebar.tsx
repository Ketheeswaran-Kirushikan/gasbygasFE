"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  Truck,
  Users,
  FileText,
  BarChart,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { useTranslation } from "@/hooks/outlet/use-translation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Sidebar Navigation Items
const navItems = [
  { icon: Home, label: "Dashboard", path: "" },
  { icon: Package, label: "Stock Management", path: "stock" },
  { icon: Truck, label: "Gas Request", path: "deliveries" },
  { icon: Users, label: "User Management", path: "users" },
  { icon: FileText, label: "Reports", path: "reports" },
  { icon: BarChart, label: "Analytics", path: "analytics" },
  { icon: Bell, label: "Notifications", path: "notifications" },
  { icon: Settings, label: "Settings", path: "settings" },
];

export function Sidebar({ outlet }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ✅ Extract outlet ID safely
  const outletId = pathname?.split("/")?.[2] ?? "";

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast.success("Successfully logged out!", { position: "top-right", autoClose: 3000 });

    setTimeout(() => {
      router.push("/logout"); // ✅ Redirect after a short delay
    }, 1500);
  };

  return (
    <div className="w-64 bg-[#1C2434] h-full text-gray-300 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
        <div className="flex items-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-eoRYViBYc9hMaESVZpS1IwT42KGCxZ.png"
            alt="GAS BY GAS"
            className="h-8 w-auto mr-2"
          />
          <span className="font-semibold">{outlet?.outletName || "Outlet"}</span>
        </div>
      </div>

      {/* ✅ Navigation Links */}
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const fullPath = `/outlets/${outletId}/${item.path}`;

          return (
            <Link
              key={item.path}
              href={fullPath}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 transition ${
                pathname.startsWith(fullPath) ? "bg-gray-800 text-white" : ""
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {t(item.label)}
            </Link>
          );
        })}
      </nav>

      {/* ✅ Logout Button */}
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="absolute bottom-0 w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 transition focus:outline-none"
      >
        <LogOut className="h-5 w-5 mr-3" />
        {t("Logout")}
      </button>

      {/* ✅ Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Logout")}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 text-sm">
            {t("Are you sure you want to log out? This action cannot be undone.")}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              {t("Logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
