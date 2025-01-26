import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../api/authService";
import { toast } from "react-toastify";

// Async Thunk for Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ emailOrAdminName, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(emailOrAdminName, password);
      toast.success("Login successful");
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (token, { rejectWithValue }) => {
    try {
      const response = await logoutUser(token);
      toast.success("Logout successful");
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Reducers
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout Reducers
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
