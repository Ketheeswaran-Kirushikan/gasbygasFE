import axios from "axios";

// Base URL configuration for Axios
const API = axios.create({
  baseURL: "http://gasbygasbe-production.up.railway.app/api/outlet", // Replace with your backend URL
});

// Create Outlet
export const createOutlet = async (formData) => {
  const response = await API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update Outlet by ID
export const updateOutletById = async (id, formData) => {
  const response = await API.put(`/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete Outlet by ID
export const deleteOutletById = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};

// Get Outlet by ID
export const getOutletById = async (id) => {
  const response = await API.get(`/get/${id}`);
  return response.data;
};

// Get All Outlets
export const getAllOutlets = async () => {
  const response = await API.get("/getall");
  return response.data;
};
