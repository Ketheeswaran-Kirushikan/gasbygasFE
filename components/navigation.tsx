"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignupModal } from "../app/signUp/page";
import { LoginModal } from "../app/login/page"; // Import LoginModal

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State for Login modal
  const [isSignupOpen, setIsSignupOpen] = useState(false); // State for Signup modal

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#000000]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-auto h-12 sm:h-16 bg-[#000000] rounded-lg flex items-center justify-center px-2 sm:px-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-JFoEHAn4os67f0pYGOkpLUKv45Vull.png"
                  alt="GAS GAS BY Logo"
                  width={60}
                  height={30}
                  className="object-contain sm:w-[80px] sm:h-[40px]"
                />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        pathname === item.href
                          ? "text-[#D72323] bg-[#3E3636]"
                          : "text-[#F5EDED] hover:text-[#D72323] hover:bg-[#3E3636]"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Input
                type="search"
                placeholder="Search"
                className="w-[200px] sm:w-[250px] rounded-full border-[#D72323] focus:ring-[#D72323] focus:border-[#D72323] bg-[#3E3636] text-[#F5EDED] placeholder:text-[#F5EDED]/50"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-[#F5EDED]" />
            </div>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#F5EDED] hover:text-[#D72323] hover:bg-[#3E3636] px-2 sm:px-4"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="bg-[#D72323] text-[#F5EDED] hover:bg-[#D72323]/90 px-2 sm:px-4"
                  onClick={() => setIsSignupOpen(true)}
                >
                  Signup
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.png" alt="User avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#3E3636] border-[#D72323]">
                  <DropdownMenuItem className="text-[#F5EDED] hover:text-[#D72323] focus:text-[#D72323] focus:bg-[#000000]">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#F5EDED] hover:text-[#D72323] focus:text-[#D72323] focus:bg-[#000000]"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignupOpen={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true); // Open Signup modal when navigating from Login modal
        }}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginOpen={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true); // Open Login modal when navigating from Signup modal
        }}
      />
    </header>
  );
}
