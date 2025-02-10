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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Home, UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function Header({ outlet }) {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Ensure valid display name based on outlet data
  const displayName = outlet?.outletName || "Outlet";
  const email = outlet?.emailAddress || "";
  const outletImage = outlet?.image || ""; // Ensure image handling

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Logo section */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-c5kvOKVQpChQoykFwTBvuASMfQxh9V.png"
            alt="GAS BY GAS"
            className="h-12 w-auto hidden sm:block"
            crossOrigin="anonymous"
          />
        </Link>

        {/* Notifications and Profile Dropdown */}
        <div className="flex items-center gap-4">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative flex h-10 w-10 items-center justify-center rounded-full p-0 border border-gray-300 dark:border-gray-600">
                {outletImage ? (
                  <img
                    src={outletImage} // Corrected Image URL handling
                    alt="Outlet Image"
                    className="h-full w-full rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{displayName}</p>
                  {email && (
                    <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
                      {email}
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
              <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                <TranslatedText text="Logout" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <TranslatedText text="Confirm Logout" />
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            <TranslatedText text="Are you sure you want to log out? You will be redirected to the login page." />
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              <TranslatedText text="Cancel" />
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <TranslatedText text="Logout" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
