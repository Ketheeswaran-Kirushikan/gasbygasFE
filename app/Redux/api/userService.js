import axios from "axios";

// Base URL configuration for Axios
const API = axios.create({
  baseURL: "http://localhost:3004/api/users", // Replace with your backend URL
});

// Create User
export const createUser = async (userData, imageFile) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await API.post(`/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update User by ID
export const updateUser = async (id, userData, imageFile) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await API.put(`/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete User by ID
export const deleteUser = async (id) => {
  const response = await API.delete(`/delete/${id}`);
  return response.data;
};

// Get User by ID
export const getUserById = async (id) => {
  const response = await API.get(`/get/${id}`);
  return response.data;
};

// Get All Users
export const getAllUsers = async () => {
  const response = await API.get(`/getall`);
  return response.data;
};
