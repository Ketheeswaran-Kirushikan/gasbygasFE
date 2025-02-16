"use client";

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/outlet/app-context";
import { Sidebar } from "@/components/outlet/sidebar";
import { TopBar } from "@/components/outlet/top-bar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { usePathname } from "next/navigation";
import { RootState } from "@/app/Redux/store/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // ✅ Extract outlet ID only if pathname exists
  const outletId = pathname?.split("/")?.[2] ?? "";

  // ✅ Dispatch Redux action only if outletId is valid
  useEffect(() => {
    if (outletId) {
      dispatch(getOutletByIdThunk(outletId));
    }
  }, [dispatch, outletId]);

  // ✅ Get Redux state (avoid unnecessary re-renders)
  const { outlet, loading, error } = useSelector((state: RootState) => state.outlets);

  // ✅ Prevent hydration issues (Render only on client)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading...</div>; // Prevent hydration error

  return (
    // ❌ Remove <html> and <body> (They belong in `_document.tsx`)
    <AppProvider
      initialData={{
        users: [],
        requests: [],
        stock: outlet?.gasStock || [],
      }}
    >
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* ✅ Sidebar */}
        <Sidebar outlet={outlet?.outlet} loading={loading} error={error} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ✅ TopBar */}
          <TopBar outlet={outlet?.outlet} loading={loading} error={error} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
