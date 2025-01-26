import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createOutlet,
  updateOutletById,
  deleteOutletById,
  getOutletById,
  getAllOutlets,
} from "../api/outletService";

// Async Thunks
export const createOutletThunk = createAsyncThunk(
  "outlets/createOutlet",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createOutlet(formData);
      toast.success("Outlet created successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to create outlet.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOutletThunk = createAsyncThunk(
  "outlets/updateOutlet",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await updateOutletById(id, formData);
      toast.success("Outlet updated successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to update outlet.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOutletThunk = createAsyncThunk(
  "outlets/deleteOutlet",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteOutletById(id);
      toast.success("Outlet deleted successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to delete outlet.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOutletByIdThunk = createAsyncThunk(
  "outlets/getOutletById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getOutletById(id);
      return data;
    } catch (error) {
      toast.error("Failed to fetch outlet.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllOutletsThunk = createAsyncThunk(
  "outlets/getAllOutlets",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllOutlets();
      return data;
    } catch (error) {
      toast.error("Failed to fetch outlets.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const outletSlice = createSlice({
  name: "outlets",
  initialState: {
    outlets: [],
    outlet: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Outlet
      .addCase(createOutletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOutletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.outlets.push(action.payload.outlet);
      })
      .addCase(createOutletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Outlet
      .addCase(updateOutletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOutletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.outlets = state.outlets.map((outlet) =>
          outlet.id === action.payload.outlet.id ? action.payload.outlet : outlet
        );
      })
      .addCase(updateOutletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Outlet
      .addCase(deleteOutletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOutletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.outlets = state.outlets.filter(
          (outlet) => outlet.id !== action.meta.arg
        );
      })
      .addCase(deleteOutletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Outlet by ID
      .addCase(getOutletByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOutletByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.outlet = action.payload;
      })
      .addCase(getOutletByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Outlets
      .addCase(getAllOutletsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOutletsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.outlets = action.payload;
      })
      .addCase(getAllOutletsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default outletSlice.reducer;
