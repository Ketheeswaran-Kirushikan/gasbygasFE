import axios from "axios";


const API = axios.create({
  baseURL: "https://gasbygasbe-production.up.railway.app/api/dispatch//gasrequest", // Ensure 'https://' is included
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
  console.log(id)
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

  // Get all gas requests by user ID
export const getAllGasRequestsByDispatch = async (id) => {
  const response = await API.get(`/getall/dispatch/${id}`);
  return response.data;
};