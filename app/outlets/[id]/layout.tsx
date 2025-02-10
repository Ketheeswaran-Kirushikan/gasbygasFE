"use client";

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/outlet/app-context";
import { Sidebar } from "@/components/outlet/sidebar";
import { TopBar } from "@/components/outlet/top-bar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { usePathname } from "next/navigation";
import { RootState } from "@/app/Redux/store/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Extract outlet ID from pathname safely
  const outletId = pathname?.split("/")?.[2] ?? "";

  // Ensure outlet ID is valid before dispatching
  useEffect(() => {
    if (outletId) {
      dispatch(getOutletByIdThunk(outletId));
    }
  }, [dispatch, outletId]);

  // Fetch outlet data from Redux store
  const { outlet, loading, error } = useSelector((state: RootState) => state.outlets);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Provide default initialData in AppProvider */}
        <AppProvider
          initialData={{
            users: [],
            requests: [],
            stock: outlet?.gasStock || [],
          }}
        >
          <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar with outlet data */}
            <Sidebar outlet={outlet?.outlet} loading={loading} error={error} />
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* TopBar with outlet data */}
              <TopBar outlet={outlet?.outlet} loading={loading} error={error} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
