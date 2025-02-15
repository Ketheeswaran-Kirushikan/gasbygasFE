import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from "../api/userService";
import { toast } from "react-toastify";

// Async Thunks

// Create User
export const createUserThunk = createAsyncThunk(
  "users/createUser",
  async ({ userData, imageFile }, { rejectWithValue }) => {
    try {
      const response = await createUser(userData, imageFile);
      toast.success("User created successfully!");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create user");
      return rejectWithValue(error.response?.data?.error || "Failed to create user");
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData, imageFile }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, userData, imageFile);
      toast.success("User updated successfully!");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update user");
      return rejectWithValue(error.response?.data?.error || "Failed to update user");
    }
  }
);


// Delete User by ID
export const deleteUserThunk = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUser(id);
      toast.success("User deleted successfully!");
      return id; // Return the deleted user's ID to remove from Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete user");
    }
  }
);


// Get User by ID
export const getUserByIdThunk = createAsyncThunk(
  "users/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserById(id);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch user");
      return rejectWithValue(error.response?.data?.error || "Failed to fetch user");
    }
  }
);

// Get All Users
export const getAllUsersThunk = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch users");
      return rejectWithValue(error.response?.data?.error || "Failed to fetch users");
    }
  }
);

// Initial State
const initialState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
};

// User Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create User
      .addCase(createUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        console.log("Deleted User ID:", action.payload); // Debugging Log
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get User by ID
      .addCase(getUserByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get All Users
      .addCase(getAllUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
