import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api"; 

// Async Thunk for API Call
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
    
      const response = await api.post("/login", userCredentials);
      
      const data = response.data; // Axios mein data direct .data mein hota hai

      if (data.success === false) {
        return rejectWithValue(data.message || "Login failed");
      }

      // LocalStorage mein token save karein
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      // Error handling for Axios
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Initial State
const token = localStorage.getItem("token");
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
  user: user,
  token: token,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;