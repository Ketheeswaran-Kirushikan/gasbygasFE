import axios from "axios";

// Base URL configuration for Axios
const API = axios.create({
  baseURL: "http://localhost:3004/api", // Replace with your backend URL
});

// Login API call
export const loginUser = async (emailOrAdminName, password) => {
  try {
    const response = await API.post("/auth/login", { emailOrAdminName, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

// Logout API call
export const logoutUser = async (token) => {
  try {
    const response = await API.post("/auth/logout", {}, { headers: { token } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};
