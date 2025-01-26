"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Menu, LogOut, Settings, UserCircle, Shield } from "lucide-react"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { useSidebar } from "@/components/distpach/ui/sidebar"
import { useTheme } from "@/contexts/distpach/ThemeContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/distpach/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/distpach/ui/avatar"
import { Badge } from "@/components/distpach/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HeaderProps {
  unreadCount?: number
}

export function Header({ unreadCount = 0 }: HeaderProps) {
  const { toggleSidebar } = useSidebar()
  const { language, setLanguage } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Simulate search results
    if (query.trim()) {
      setSearchResults([
        { type: "delivery", id: "D001", title: "Delivery Request #001" },
        { type: "driver", id: "DR001", title: "John Driver" },
        { type: "outlet", id: "O001", title: "Central Gas Station" },
      ])
    } else {
      setSearchResults([])
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search submission logic here
    console.log("Search submitted:", searchQuery)
    setIsSearchOpen(false)
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...")
    router.push("/login") // Redirect to login page
  }

  return (
    <header className="fixed top-0 left-0 right-0 flex h-14 sm:h-16 items-center justify-between border-b bg-background px-2 sm:px-4 lg:px-6 w-full z-50">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-yad2Uj5KQQJ3xvxC5TrYXtEqDE4axk.png"
          alt="GAS GAS BY Logo"
          className="h-6 sm:h-8 w-auto"
        />
        <div className="hidden sm:block ml-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px] lg:max-w-none">
          Head Office Dispatch Team
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-background border rounded-md shadow-lg z-50">
              <form onSubmit={handleSearchSubmit} className="p-2">
                <Input
                  placeholder="Search deliveries, drivers, or outlets..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </form>
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/${result.type}s/${result.id}`}
                      className="block px-4 py-2 hover:bg-accent"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <span className="text-sm">{result.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Select value={language} onValueChange={(value: string) => setLanguage(value as "light" | "dark")}>
          <SelectTrigger className="w-[80px] sm:w-[100px] text-xs sm:text-sm">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
            <SelectItem value="sinhala">Sinhala</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/notifications")}>
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=profile">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Shield className="mr-2 h-4 w-4" />
              <span>Role: Admin</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

