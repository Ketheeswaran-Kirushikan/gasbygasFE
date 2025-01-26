"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { LanguageProvider } from "@/contexts/consumer/language-context";
import { Sidebar } from "@/components/consumer/layout/sidebar";
import { Header } from "@/components/consumer/layout/header";
import { getUserByIdThunk } from "@/app/Redux/features/userSlice"; // Thunk to fetch user data
import { RootState } from "@/app/Redux/store/store"; // Import RootState type
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import '@fortawesome/fontawesome-svg-core/styles.css';


export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { id: userID } = useParams(); // Extract userID from URL

  // Fetch user data and loading/error state from Redux
  const user = useSelector((state: RootState) => state.user.user); // User data
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);

  // Fetch user details when component mounts or when userID changes
  useEffect(() => {
    if (userID) {
      dispatch(getUserByIdThunk(userID));
    }
  }, [userID, dispatch]);

  return (
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
        {/* Pass user data to Sidebar */}
        <Sidebar user={user} isLoading={isLoading} error={error} />
        <div className="flex-1 flex flex-col">
          {/* Pass user data to Header */}
          <Header user={user} isLoading={isLoading} error={error} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  );
}
