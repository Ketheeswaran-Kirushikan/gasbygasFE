"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { login } from "@/app/Redux/features/authSlice"; // Import your login thunk
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

export default function AdminLogin() {
  const [role, setRole] = useState("Outlet");
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrAdminName, setEmailOrAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const dispatch = useDispatch();
  const router = useRouter(); // Initialize Next.js router for navigation

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 1. Dispatch the login thunk
      const actionResult = await dispatch(
        login({ emailOrAdminName, password })
      );
      const result = actionResult.payload; // Directly access payload
      if (!result?.user) throw new Error("User data missing!");
      // 2. Extract userType and id
      const { userType, id } = result.user;
      // 3. Redirect with userType as a query param
      if (userType === "dispatch") {
        router.push(`/dispatch/${id}?userType=${userType}`);
      } else if (userType === "outlet") {
        router.push(`/outlets/${id}?userType=${userType}`);
      } else {
        throw new Error("Invalid user type. Please contact support.");
      }
      // 4. Clear form fields
      setEmailOrAdminName("");
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black">
      <ToastContainer /> {/* Toast Container for alerts */}
      <Card className="w-full max-w-md p-6 bg-[#1C1C1C] shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {role === "Outlet" ? "Outlet Login" : "Dispatch Login"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="text-sm font-semibold text-white">Select Role</label>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-[#2C2C2C] text-white border border-gray-500 hover:bg-gray-700">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#2C2C2C] text-white">
                <SelectItem value="Outlet">Outlet</SelectItem>
                <SelectItem value="Dispatch">Dispatch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Email Input */}
          <div>
            <label className="text-sm font-semibold text-white">Email or Admin Name</label>
            <Input 
              type="text" 
              placeholder="Enter your email or admin name" 
              value={emailOrAdminName} 
              onChange={(e) => setEmailOrAdminName(e.target.value)} 
              className="bg-[#2C2C2C] text-white border border-gray-500 focus:border-red-600"
            />
          </div>
          {/* Password Input */}
          <div>
            <label className="text-sm font-semibold text-white">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-[#2C2C2C] text-white border border-gray-500 focus:border-red-600"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
          {/* Login Button */}
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
            disabled={isLoading}
            onClick={handleLogin}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}