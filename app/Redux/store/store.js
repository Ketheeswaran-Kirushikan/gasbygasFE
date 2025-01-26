import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; // Auth slice
import userReducer from "../features/userSlice"; // User slice
import outletReducer from "../features/outletSlice"; //
import gasRequestReducer from "../features/gasRequestSlice"; // gas request reduction
import gasReducer from "../features/gasSlice"; // gas
import notificationReducer from "../features/notificationSlice"; //

export const store = configureStore({
  reducer: {
    auth: authReducer, // Auth slice
    user: userReducer, // User slice
    outlets: outletReducer,
    gasRequests: gasRequestReducer,
    gas : gasReducer,
    notifications: notificationReducer, //
  },
});
