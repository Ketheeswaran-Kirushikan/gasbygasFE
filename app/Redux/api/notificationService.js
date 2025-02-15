import axios from "axios";

const BASE_URL = "http://gasbygasbe-production.up.railway.app/api/notifications"; // Adjust based on your server

// Get Notification by ID
export const getNotificationById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Get Notifications by User ID
export const getNotificationsByUserId = async (userId) => {
  const response = await axios.get(`${BASE_URL}/getall/${userId}`);
  return response.data;
};

// Delete Notification by ID
export const deleteNotificationById = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Update Notification by ID
export const updateNotificationById = async (id, data) => {
    console.log("API Call - PUT Request Data:", { id, data }); // Log the request data
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    console.log("API Response:", response.data); // Log the response from the server
    return response.data;
  };
  
