import axios from "axios";

// ✅ Base API URL

const API = axios.create({
    baseURL: "https://gasbygasbe-production.up.railway.app/api/dispatch", // Ensure 'https://' is included
  });
// const API = axios.create({
//   baseURL: "http://localhost:3004/api/dispatch", // Update with your backend URL
// });

// ✅ Add Gas Stock to Existing Dispatch Admin
export const addGasStock = async (dispatchId, gasStockData) => {
  const response = await API.post(`/${dispatchId}/add-gas`, gasStockData);
  return response.data;
};

// ✅ Delete Gas Stock from Dispatch Admin
export const deleteGasStock = async (dispatchId, gasStockData) => {
  const response = await API.delete(`/${dispatchId}/delete-gas`, { data: gasStockData });
  return response.data;
};

// ✅ Create Dispatch Admin
export const createDispatch = async (data) => {
  const response = await API.post("/create", data);
  return response.data;
};

// ✅ Get All Dispatch Admins
export const getAllDispatches = async () => {
  const response = await API.get("/getall");
  return response.data;
};

// ✅ Get Dispatch Admin by ID
export const getDispatchById = async (id) => {
  const response = await API.get(`/get/${id}`);
  return response.data;
};

// ✅ Update Dispatch Admin
export const updateDispatch = async (id, data) => {
  const response = await API.put(`/update/${id}`, data);
  return response.data;
};

// ✅ Delete Dispatch Admin
export const deleteDispatch = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};
