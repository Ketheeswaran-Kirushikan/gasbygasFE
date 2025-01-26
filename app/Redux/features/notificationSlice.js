import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationById,
  getNotificationsByUserId,
  deleteNotificationById,
  updateNotificationById,
} from "../api/notificationService";

// Thunks
export const fetchNotificationByIdThunk = createAsyncThunk(
  "notifications/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getNotificationById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNotificationsByUserIdThunk = createAsyncThunk(
  "notifications/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      return await getNotificationsByUserId(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteNotificationById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateNotificationThunk = createAsyncThunk(
    "notifications/update",
    async ({ id, ...data }, { rejectWithValue }) => {
      try {
        console.log("Payload sent to API:", { id, ...data }); // Log the payload before sending
        const response = await updateNotificationById(id, data);
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

// Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    notification: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Notification by ID
      .addCase(fetchNotificationByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload;
      })
      .addCase(fetchNotificationByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Notifications by User ID
      .addCase(fetchNotificationsByUserIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsByUserIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsByUserIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Notification
      .addCase(deleteNotificationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.meta.arg
        );
      })
      .addCase(deleteNotificationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Notification
      .addCase(updateNotificationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Updated notification in state:", action.payload); // Log updated notification
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.meta.arg.id ? action.payload : notification
        );
      
      })
      .addCase(updateNotificationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
