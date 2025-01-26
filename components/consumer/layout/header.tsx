"use client";

import { Button } from "@/components/consumer/ui/button";
import { TranslatedText } from "@/components/consumer/ui/translated-text";
import { Notifications } from "@/components/consumer/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header({ user }: { user: { firstName?: string; email?: string; profileImage?: string } | null }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Logo section, hidden on small screens */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-c5kvOKVQpChQoykFwTBvuASMfQxh9V.png"
          alt="GAS BY GAS"
          className="h-12 w-auto hidden sm:block" // Hide on mobile
          crossOrigin="anonymous"
        />
      </Link>

      {/* Notifications and Profile Dropdown */}
      <div className="flex items-center gap-4">
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.firstName || "Profile"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.firstName && (
                  <p className="font-medium">{user.firstName}</p>
                )}
                {user?.email && (
                  <p className="w-[200px] truncate text-sm text-gray-600">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <UserIcon className="mr-2 h-4 w-4" />
              <TranslatedText text="Account Settings" />
            </DropdownMenuItem>
            <Link href="/" passHref>
              <DropdownMenuItem>
                <Home className="mr-2 h-4 w-4" />
                <TranslatedText text="Go to Website" />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <TranslatedText text="Logout" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
