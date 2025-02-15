import axios from "axios";

// Base URL for the backend
const API = axios.create({
  baseURL: "https://gasbygasbe-production.up.railway.app/api/gas", // Update with your backend URL
});
// Create Gas
export const createGas = async (gasData) => {
  const response = await API.post(`/create`, gasData);
  return response.data;
};

// Update Gas by ID
export const updateGas = async (id, gasData) => {
  const response = await API.put(`/update/${id}`, gasData);
  return response.data;
};

// Delete Gas by ID
export const deleteGas = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};

// Get Gases by Type
export const getGasByType = async (type) => {
  const response = await API.get(`/type/${type}`);
  return response.data;
};

// Get All Gases
export const getAllGases = async () => {
  const response = await API.get(`/all`);
  return response.data;
};
