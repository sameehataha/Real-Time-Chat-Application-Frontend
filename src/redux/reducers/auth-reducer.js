import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, getAdmin, adminLogout } from "../thunks/admin";
import { toast } from "react-hot-toast";

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
  adminLoader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.adminLoader = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        state.adminLoader = false;
        toast.success(action.payload);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        state.adminLoader = false;
        toast.error(action.error.message);
      })
      // Get Admin (Check if already logged in)
      .addCase(getAdmin.pending, (state) => {
        state.adminLoader = true;
      })
      .addCase(getAdmin.fulfilled, (state) => {
        state.isAdmin = true;
        state.adminLoader = false;
      })
      .addCase(getAdmin.rejected, (state) => {
        state.isAdmin = false;
        state.adminLoader = false;
      })
      // Admin Logout
      .addCase(adminLogout.pending, (state) => {
        state.adminLoader = true;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.isAdmin = false;
        state.adminLoader = false;
        state.user = null;
        toast.success(action.payload);
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.adminLoader = false;
        toast.error(action.error.message);
      });
  },
});

export default authSlice;
export const { userExists, userNotExists } = authSlice.actions;
