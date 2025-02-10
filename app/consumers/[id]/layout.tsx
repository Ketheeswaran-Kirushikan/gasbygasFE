"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { LanguageProvider } from "@/contexts/consumer/language-context";
import { ThemeProvider } from "@/contexts/consumer/theme-context";
import { Sidebar } from "@/components/consumer/layout/sidebar";
import { Header } from "@/components/consumer/layout/header";
import { getUserByIdThunk } from "@/app/Redux/features/userSlice";
import { RootState } from "@/app/Redux/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const params = useParams();
  const userID = params?.id as string | undefined; // Ensure `id` is extracted safely

  // State to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Fetch user data from Redux store
  const { user, isLoading, error } = useSelector((state: RootState) => state.user);

  // Ensure this runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user details when `userID` is available
  useEffect(() => {
    if (userID) {
      dispatch(getUserByIdThunk(userID));
    }
  }, [userID, dispatch]);

  if (!isClient) return null; // Avoid hydration errors

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex h-screen">
          {/* Toast Container for notifications */}
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
          {/* Sidebar with user data */}
          <Sidebar user={user} isLoading={isLoading} error={error} />
          <div className="flex-1 flex flex-col">
            {/* Header with user data */}
            <Header user={user} isLoading={isLoading} error={error} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
