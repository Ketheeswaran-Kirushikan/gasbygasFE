import axios from "axios";

const BASE_URL = "https://gasbygasbe-production.up.railway.app/api/notifications"; 

// const BASE_URL = "http://localhost:3004/api/notifications"

const API = axios.create({
  baseURL: BASE_URL, // Ensuring consistency
});

// ✅ Get Notification by ID
export const getNotificationById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification by ID:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Notifications by User ID
export const getNotificationsByUserId = async (userId) => {
  console.log("Getting notifications",userId)
  try {
    const response = await API.get(`/getall/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications by user ID:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete Notification by ID
export const deleteNotificationById = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update Notification by ID
export const updateNotificationById = async (id, data) => {
  try {
    console.log("🔹 API Call - PUT Request Data:", { id, data }); // Log request data
    const response = await API.put(`/${id}`, data);
    console.log("🔹 API Response:", response.data); // Log response from the server
    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error.response?.data || error.message);
    throw error;
  }
};
