import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";

const adminLogin = createAsyncThunk("auth/adminLogin", async (secretKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${server}/api/v1/admin/verify`,
      { secretKey },
      config,
    );
    return data.message;
  } catch (error) {
    console.log(error.response?.data?.message);
    throw error.response?.data?.message || "Login failed";
  }
});

const getAdmin = createAsyncThunk(
  "auth/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(`${server}/api/v1/admin/`, config);
      return data;
    } catch (error) {
      // If it's a 404 or network error (no backend response), just reject silently
      // If it's a 401, the token is invalid, also reject
      console.log("getAdmin error:", error.response?.status);
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated",
      );
    }
  },
);
const adminLogout = createAsyncThunk("auth/adminLogout", async () => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(`${server}/api/v1/admin/logout`, config);
    return data.message;
  } catch (error) {
    console.log("getAdmin error:", error.response?.status);
    throw error.response?.data?.message || "Logout failed";
  }
});

export { adminLogin, getAdmin, adminLogout };
