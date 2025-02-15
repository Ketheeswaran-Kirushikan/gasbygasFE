import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createDispatch,
  getAllDispatches,
  getDispatchById,
  updateDispatch,
  deleteDispatch,
  addGasStock,
  deleteGasStock,
} from "@/app/Redux/api/dipatchService";

// ✅ Create Dispatch Admin
export const createDispatchThunk = createAsyncThunk(
  "dispatch/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createDispatch(data);
      toast.success("Dispatch admin created successfully.");
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create dispatch admin.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Get All Dispatch Admins
export const getAllDispatchesThunk = createAsyncThunk(
  "dispatch/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllDispatches();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dispatch admins.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Get Dispatch Admin by ID
export const getDispatchByIdThunk = createAsyncThunk(
  "dispatch/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await getDispatchById(id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dispatch admin.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Update Dispatch Admin
export const updateDispatchThunk = createAsyncThunk(
  "dispatch/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateDispatch(id, data);
      toast.success("Dispatch admin updated successfully.");
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update dispatch admin.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Delete Dispatch Admin
export const deleteDispatchThunk = createAsyncThunk(
  "dispatch/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDispatch(id);
      toast.success("Dispatch admin deleted successfully.");
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete dispatch admin.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Add Gas Stock to Dispatch
export const addGasStockThunk = createAsyncThunk(
  "dispatch/addGasStock",
  async ({ dispatchId, gasStockData }, { rejectWithValue }) => {
    try {
      const response = await addGasStock(dispatchId, gasStockData);
      toast.success("Gas stock added successfully.");
      return { dispatchId, gasStock: response.updatedGasStock };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add gas stock.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Delete Gas Stock from Dispatch
export const deleteGasStockThunk = createAsyncThunk(
  "dispatch/deleteGasStock",
  async ({ dispatchId, gasStockData }, { rejectWithValue }) => {
    try {
      await deleteGasStock(dispatchId, gasStockData);
      toast.success("Gas stock deleted successfully.");
      return { dispatchId, gasStockData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete gas stock.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Initial State
const initialState = {
  dispatchList: [],
  dispatchDetails: null,
  loading: false,
  error: null,
};

// ✅ Dispatch Slice
const dispatchSlice = createSlice({
  name: "dispatch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Create Dispatch Admin
      .addCase(createDispatchThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDispatchThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchList.push(action.payload);
      })
      .addCase(createDispatchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Get All Dispatch Admins
      .addCase(getAllDispatchesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDispatchesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchList = action.payload;
      })
      .addCase(getAllDispatchesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Get Dispatch Admin by ID
      .addCase(getDispatchByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDispatchByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchDetails = action.payload;
      })
      .addCase(getDispatchByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Gas Stock
      .addCase(addGasStockThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGasStockThunk.fulfilled, (state, action) => {
        state.loading = false;
        const dispatch = state.dispatchList.find((d) => d._id === action.payload.dispatchId);
        if (dispatch) {
          dispatch.gasStock = action.payload.gasStock;
        }
      })
      .addCase(addGasStockThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete Gas Stock
      .addCase(deleteGasStockThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGasStockThunk.fulfilled, (state, action) => {
        state.loading = false;
        const dispatch = state.dispatchList.find((d) => d._id === action.payload.dispatchId);
        if (dispatch) {
          dispatch.gasStock = dispatch.gasStock.filter(
            (stock) => !(stock.gasType === action.payload.gasStockData.gasType && stock.weight === action.payload.gasStockData.weight)
          );
        }
      })
      .addCase(deleteGasStockThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export Reducer
export default dispatchSlice.reducer;
