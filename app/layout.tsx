"use client";

import { Inter } from "next/font/google";
import "./globals.css"; // Landing page styles
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Provider } from "react-redux";
import { store } from "@/app/Redux/store/store"; // Path to your Redux store
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5EDED]`}>
        {/* Wrap the entire layout with Redux Provider */}
        <Provider store={store}>
          {/* Navigation Bar */}
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
          <main className="">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
