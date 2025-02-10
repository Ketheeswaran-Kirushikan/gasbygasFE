import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as stockRequestAPI from "../api/stockRequestService";
import { toast } from "react-toastify";

// ✅ Create a new stock request
export const createStockRequest = createAsyncThunk(
  "stockRequest/createStockRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.createStockRequest(data);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create stock request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update stock request by ID
export const updateStockRequestById = createAsyncThunk(
  "stockRequest/updateStockRequestById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.updateStockRequestById(id, data);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update stock request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete stock request by ID
export const deleteStockRequestById = createAsyncThunk(
  "stockRequest/deleteStockRequestById",
  async (id, { rejectWithValue }) => {
    try {
      await stockRequestAPI.deleteStockRequestById(id);
      toast.success("Stock request deleted successfully!");
      return id; // Return deleted request ID for filtering
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete stock request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get all stock requests
export const getAllStockRequests = createAsyncThunk(
  "stockRequest/getAllStockRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.getAllStockRequests();
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch stock requests.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get stock request by ID
export const getStockRequestById = createAsyncThunk(
  "stockRequest/getStockRequestById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.getStockRequestById(id);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch stock request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get stock requests by Outlet ID
export const getStockRequestsByOutlet = createAsyncThunk(
  "stockRequest/getStockRequestsByOutlet",
  async (outletId, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.getStockRequestsByOutlet(outletId);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch stock requests.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get stock requests by Dispatch ID
export const getStockRequestsByDispatch = createAsyncThunk(
  "stockRequest/getStockRequestsByDispatch",
  async (dispatchId, { rejectWithValue }) => {
    try {
      const response = await stockRequestAPI.getStockRequestsByDispatch(dispatchId);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch stock requests.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Stock Request Slice
const stockRequestSlice = createSlice({
  name: "stockRequest",
  initialState: {
    stockRequests: [],
    currentStockRequest: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get All Stock Requests
      .addCase(getAllStockRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStockRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.stockRequests = action.payload;
      })
      .addCase(getAllStockRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create Stock Request
      .addCase(createStockRequest.fulfilled, (state, action) => {
        state.stockRequests.push(action.payload);
      })

      // ✅ Update Stock Request by ID
      .addCase(updateStockRequestById.fulfilled, (state, action) => {
        state.stockRequests = state.stockRequests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        );
      })

      // ✅ Delete Stock Request
      .addCase(deleteStockRequestById.fulfilled, (state, action) => {
        state.stockRequests = state.stockRequests.filter(
          (req) => req._id !== action.payload
        );
      })

      // ✅ Get Stock Request by ID
      .addCase(getStockRequestById.fulfilled, (state, action) => {
        state.currentStockRequest = action.payload;
      })

      // ✅ Get Stock Requests by Outlet ID
      .addCase(getStockRequestsByOutlet.fulfilled, (state, action) => {
        state.stockRequests = action.payload;
      })

      // ✅ Get Stock Requests by Dispatch ID
      .addCase(getStockRequestsByDispatch.fulfilled, (state, action) => {
        state.stockRequests = action.payload;
      })

      // ✅ Handle errors for all cases
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default stockRequestSlice.reducer;
