"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/business/ui/button"
import { Input } from "@/components/business/ui/input"
import { cn } from "@/lib/business/utils"
import { Home, BarChart2, FuelIcon as GasPump, ClipboardList, Bell, Settings, LogOut, Search, Menu, X } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/business/ui/dialog"
import { useRouter } from 'next/navigation'
import { useLanguage } from "@/contexts/business/language-context"
import { TranslatedText } from "@/components/business/ui/translated-text"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Overview", href: "/overview", icon: BarChart2 },
  { name: "Gas Request", href: "/gas-request", icon: GasPump },
  { name: "My Requests", href: "/my-requests", icon: ClipboardList },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const { translate } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const router = useRouter()

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1C2127] transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 dark:bg-gray-900",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="h-16" />

          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={translate("Search...")}
                className="w-full bg-gray-700 pl-8 text-white placeholder:text-gray-400 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-red-600 text-white" : "text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <TranslatedText text={item.name} />
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-gray-700 p-4 space-y-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white">
                <Home className="h-5 w-5" />
                <TranslatedText text="Back to Home" />
              </Button>
            </Link>
            <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white">
                  <LogOut className="h-5 w-5" />
                  <TranslatedText text="Logout" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><TranslatedText text="Confirm Logout" /></DialogTitle>
                  <DialogDescription>
                    <TranslatedText text="Are you sure you want to log out? You will be redirected to the login page." />
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowLogoutConfirmation(false)}>
                    <TranslatedText text="Cancel" />
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    localStorage.removeItem('currentUserId');
                    router.push('/login');
                    setShowLogoutConfirmation(false);
                  }}>
                    <TranslatedText text="Logout" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
    </>
  )
}

