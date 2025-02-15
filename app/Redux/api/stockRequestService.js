import axios from "axios";

// Base URL for the backend
const API = axios.create({
  baseURL: "https://gasbygasbe-production.up.railway.app/api/stockrequest", // Update with your backend URL
});

// Create Stock Request
export const createStockRequest = async (formData) => {
  const response = await API.post("/create", formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Update Stock Request by ID
export const updateStockRequestById = async (id, formData) => {
  console.log(id, formData);
  const response = await API.put(`/update/${id}`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Delete Stock Request
export const deleteStockRequestById = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};

// Get Stock Request by ID
export const getStockRequestById = async (id) => {
  const response = await API.get(`/getbyid/${id}`);
  return response.data;
};

// Get All Stock Requests
export const getAllStockRequests = async () => {
  const response = await API.get(`/getall`);
  return response.data;
};

// Get Stock Requests by Outlet ID
export const getStockRequestsByOutlet = async (outletId) => {
  const response = await API.get(`/getbyid/outlet/${outletId}`);
  return response.data;
};

// Get Stock Requests by Dispatch ID
export const getStockRequestsByDispatch = async (dispatchId) => {
  const response = await API.get(`/getbyid/dispatch/${dispatchId}`);
  return response.data;
};
