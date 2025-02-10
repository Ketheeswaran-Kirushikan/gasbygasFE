"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Home,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/consumer/language-context";
import { TranslatedText } from "@/components/consumer/ui/translated-text";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store/store";
import { getUserByIdThunk } from "@/app/Redux/features/userSlice";
import { logout } from "@/app/Redux/features/authSlice";

export function Sidebar() {
  const { translate } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Get `id` from URL parameters
  const { id } = useParams();

  // Fetch user data from Redux
  const user = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  // Determine the auth token for logout
  const token = localStorage.getItem("authToken");

  // Fetch user details on mount
  useEffect(() => {
    if (id) {
      dispatch(getUserByIdThunk(id));
    }
  }, [dispatch, id]);

  // Determine the name to display based on userType
  const displayName =
    user?.userType === "businessIndustry"
      ? user?.companyName
      : user?.firstName;

  // Navigation items with dynamic paths using `id`
  const navigation = id
    ? [
        { name: "Home", href: `/consumers/${id}`, icon: Home },
        { name: "My Requests", href: `/consumers/${id}/my-requests`, icon: ClipboardList },
        { name: "Notifications", href: `/consumers/${id}/notification`, icon: Bell },
        { name: "Settings", href: `/consumers/${id}/setting`, icon: Settings },
      ]
    : [];

  // Close sidebar on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logout(token)).unwrap();
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("authToken"); // Remove token from local storage
      router.push("/"); // Navigate to the landing page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1C2127] transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative dark:bg-gray-900",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* User Information */}
          <div className="h-16 flex items-center px-6">
            {isLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : user ? (
              <div className="flex items-center gap-3 text-white">
                <User className="h-6 w-6 text-gray-400" />
                <p className="text-lg font-bold">{displayName || "Guest"}</p>
              </div>
            ) : (
              <p className="text-gray-400">Guest</p>
            )}
          </div>

          {/* Search Input */}
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

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <TranslatedText text={item.name} />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout and Back to Home */}
          <div className="border-t border-gray-700 p-4 space-y-4">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
              >
                <Home className="h-5 w-5" />
                <TranslatedText text="Back to Home" />
              </Button>
            </Link>
            <Dialog
              open={showLogoutConfirmation}
              onOpenChange={setShowLogoutConfirmation}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  <TranslatedText text="Logout" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <TranslatedText text="Confirm Logout" />
                  </DialogTitle>
                  <DialogDescription>
                    <TranslatedText text="Are you sure you want to log out? You will be redirected to the home page." />
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutConfirmation(false)}
                  >
                    <TranslatedText text="Cancel" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <TranslatedText text="Logout" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Toggle Button for Sidebar (Mobile Only) */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay for Sidebar on Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
