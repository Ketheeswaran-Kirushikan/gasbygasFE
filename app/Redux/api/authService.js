import axios from "axios";

// Base URL configuration for Axios
const API = axios.create({
  baseURL: "https://gasbygasbe-production.up.railway.app/api", // Ensure 'https://' is included
  
});


// ✅ Login API call (Store token in localStorage)
export const loginUser = async (emailOrAdminName, password) => {
  try {
    const response = await API.post("/auth/login", { emailOrAdminName, password });
console.log(response)
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token); // Store token in localStorage
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

// ✅ Logout API call (Remove token from localStorage)
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) {
      throw new Error("No token found.");
    }

    const response = await API.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });

    localStorage.removeItem("authToken"); // Remove token from localStorage on logout

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

// ✅ Get Token from localStorage (For Auth Headers)
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
