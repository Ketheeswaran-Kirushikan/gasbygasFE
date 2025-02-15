"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/dispatch/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  unreadCount?: number;
}

export function Header({ unreadCount = 0 }: HeaderProps) {
  const { toggleSidebar } = useSidebar();
  const { language, setLanguage } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults([
        { type: "delivery", id: "D001", title: "Delivery Request #001" },
        { type: "driver", id: "DR001", title: "John Driver" },
        { type: "outlet", id: "O001", title: "Central Gas Station" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex h-14 sm:h-16 items-center justify-between border-b bg-black px-2 sm:px-4 lg:px-6 w-full z-50">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-yad2Uj5KQQJ3xvxC5TrYXtEqDE4axk.png"
          alt="GAS GAS BY Logo"
          className="h-6 sm:h-8 w-auto"
        />
        <div className="hidden sm:block ml-4 text-sm sm:text-base lg:text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px] lg:max-w-none">
          Head Office Dispatch Team
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar - Always Visible */}
        <div className="relative flex items-center border border-gray-300 rounded-md bg-white h-12 px-3 w-60 sm:w-72">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <form onSubmit={handleSearchSubmit} className="flex-grow">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-full border-none focus:ring-0 focus:outline-none text-gray-800"
            />
          </form>
          {searchResults.length > 0 && (
            <div
              ref={searchRef}
              className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-50 mt-1"
            >
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/${result.type}s/${result.id}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-all rounded-lg"
                  onClick={() => setSearchQuery("")}
                >
                  {result.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <Select value={language} onValueChange={(value: string) => setLanguage(value as "light" | "dark")}>
          <SelectTrigger className="w-[80px] sm:w-[100px] text-xs sm:text-sm bg-white text-black border border-gray-300 rounded-md px-2 h-12">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
            <SelectItem value="sinhala">Sinhala</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-white" onClick={() => router.push("/notifications")}>
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-md p-2">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1 text-gray-700">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings?tab=profile" className="hover:bg-gray-100 rounded-md px-3 py-2 flex items-center gap-2">
                <UserCircle className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 rounded-md px-3 py-2 flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
