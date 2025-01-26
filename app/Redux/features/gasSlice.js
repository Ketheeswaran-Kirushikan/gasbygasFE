import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createGas,
  updateGas,
  deleteGas,
  getGasByType,
  getAllGases,
} from "../api/gasService";

// Async Thunks
export const createGasThunk = createAsyncThunk(
  "gas/createGas",
  async (gasData, { rejectWithValue }) => {
    try {
      const data = await createGas(gasData);
      toast.success("Gas created successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to create gas.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateGasThunk = createAsyncThunk(
  "gas/updateGas",
  async ({ id, gasData }, { rejectWithValue }) => {
    try {
      const data = await updateGas(id, gasData);
      toast.success("Gas updated successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to update gas.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteGasThunk = createAsyncThunk(
  "gas/deleteGas",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGas(id);
      toast.success("Gas deleted successfully!");
      return id; // Return the deleted gas ID
    } catch (error) {
      toast.error("Failed to delete gas.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getGasByTypeThunk = createAsyncThunk(
  "gas/getGasByType",
  async (type, { rejectWithValue }) => {
    try {
      const data = await getGasByType(type);
      return data;
    } catch (error) {
      toast.error("Failed to fetch gas by type.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllGasesThunk = createAsyncThunk(
  "gas/getAllGases",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllGases();
      return data;
    } catch (error) {
      toast.error("Failed to fetch all gases.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const gasSlice = createSlice({
  name: "gas",
  initialState: {
    gases: [],
    gas: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Gas
      .addCase(createGasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGasThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gases.push(action.payload);
      })
      .addCase(createGasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Gas
      .addCase(updateGasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGasThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gases = state.gases.map((gas) =>
          gas._id === action.payload._id ? action.payload : gas
        );
      })
      .addCase(updateGasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Gas
      .addCase(deleteGasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGasThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gases = state.gases.filter((gas) => gas._id !== action.payload);
      })
      .addCase(deleteGasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Gas by Type
      .addCase(getGasByTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGasByTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gases = action.payload;
      })
      .addCase(getGasByTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Gases
      .addCase(getAllGasesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGasesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.gases = action.payload;
      })
      .addCase(getAllGasesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gasSlice.reducer;
