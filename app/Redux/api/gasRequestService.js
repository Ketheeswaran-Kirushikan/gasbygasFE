import axios from "axios";

// Base URL for the backend
const API = axios.create({
  baseURL: "http://localhost:3004/api/gasrequest", // Update with your backend URL
});

// Create Gas Request
export const createGasRequest = async (formData) => {
  const response = await API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update Gas Request
export const updateGasRequestById = async (referenceNumber, formData) => {
    console.log(referenceNumber, formData);
    const response = await API.put(`/update/${referenceNumber}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

// Delete Gas Request
export const deleteGasRequestById = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};

// Get Gas Request by ID
export const getGasRequestById = async (id) => {
  const response = await API.get(`/get/${id}`);
  return response.data;
};

// Get All Gas Requests by Outlet ID
export const getAllGasRequestsByOutlet = async (outletId) => {
  const response = await API.get(`/getall/outlet/${outletId}`);
  return response.data;
};


// Get all gas requests by user ID
export const getAllGasRequestsByUser = async (userId) => {
    const response = await API.get(`/getall/user/${userId}`);
    return response.data;
  };