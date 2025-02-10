import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createGasRequest,
  updateGasRequestById,
  deleteGasRequestById,
  getGasRequestById,
  getAllGasRequestsByOutlet,
  getAllGasRequestsByUser 
} from "../api/gasRequestService";

// Async Thunks
export const createGasRequestThunk = createAsyncThunk(
  "gasRequests/createGasRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createGasRequest(formData);
      toast.success("Gas request created successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to create gas request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateGasRequestThunk = createAsyncThunk(
    "gasRequests/updateGasRequest",
    async ({ referenceNumber, formData }, { rejectWithValue }) => {
      try {
        const data = await updateGasRequestById(referenceNumber, formData);
        toast.success("Gas request updated successfully!");
        return data;
      } catch (error) {
        toast.error("Failed to update gas request.");
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const deleteGasRequestThunk = createAsyncThunk(
  "gasRequests/deleteGasRequest",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteGasRequestById(id);
      toast.success("Gas request deleted successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to delete gas request.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getGasRequestByIdThunk = createAsyncThunk(
  "gasRequests/getGasRequestById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getGasRequestById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllGasRequestsByOutletThunk = createAsyncThunk(
  "gasRequests/getAllGasRequestsByOutlet",
  async (outletId, { rejectWithValue }) => {
    try {
      const data = await getAllGasRequestsByOutlet(outletId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to fetch gas requests by user ID
export const getAllGasRequestsByUserThunk = createAsyncThunk(
    "gasRequests/getAllGasRequestsByUser",
    async (userId, { rejectWithValue }) => {
      try {
        const data = await getAllGasRequestsByUser(userId);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Slice
const gasRequestSlice = createSlice({
  name: "gasRequests",
  initialState: {
    gasRequests: [],
    gasRequest: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Gas Request
      .addCase(createGasRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGasRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequests.push(action.payload);
      })
      .addCase(createGasRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Gas Request
      .addCase(updateGasRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGasRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequests = state.gasRequests.map((request) =>
          request.id === action.payload.id ? action.payload : request
        );
      })
      .addCase(updateGasRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Gas Request
      .addCase(deleteGasRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGasRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequests = state.gasRequests.filter(
          (request) => request.id !== action.meta.arg
        );
      })
      .addCase(deleteGasRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Gas Request by ID
      .addCase(getGasRequestByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGasRequestByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequest = action.payload;
      })
      .addCase(getGasRequestByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Gas Requests by Outlet
      .addCase(getAllGasRequestsByOutletThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGasRequestsByOutletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequests = action.payload;
      })
      .addCase(getAllGasRequestsByOutletThunk.rejected, (state, action) => {
        state.loading = false;
      })

       // Get all gas requests by user - pending
       .addCase(getAllGasRequestsByUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Get all gas requests by user - fulfilled
      .addCase(getAllGasRequestsByUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gasRequests = action.payload;
      })
      // Get all gas requests by user - rejected
      .addCase(getAllGasRequestsByUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gasRequestSlice.reducer;
