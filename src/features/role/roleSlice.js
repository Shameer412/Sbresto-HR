import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// --- FETCH ROLES ---
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      // Endpoint: leads/user/roles
      const response = await api.get("/leads/user/roles");
      
      // Response Structure: { message: "...", data: [ ...array ] }
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;