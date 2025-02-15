"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css"; // Landing page styles
import { Provider } from "react-redux";
import { store } from "@/app/Redux/store/store"; // Path to your Redux store
import dynamic from "next/dynamic";

// Dynamically import ToastContainer to prevent hydration errors
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#F5EDED]`}>
        {/* Wrap inside a hydration-safe check */}
        {mounted && (
          <Provider store={store}>
            {/* Toast Container for Toast Notifications */}
            <ToastContainer 
              position="top-right" 
              autoClose={5000} 
              hideProgressBar={false} 
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
              theme="light" 
            />

            {/* Main Content */}
            <main>{children}</main>
          </Provider>
        )}
      </body>
    </html>
  );
}
