import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. Async Thunk for API Call
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch("https://app.sbresto.com/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      // Agar API success: false return kare ya status code error ho
      if (!response.ok || data.success === false) {
        return rejectWithValue(data.message || "Login failed");
      }

      // LocalStorage mein token save karein (Browser refresh par data na uraane k liye)
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data; // Yeh payload ban jayega
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State check karein ke pehle se user logged in hai ya nahi
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
    // Logout action: State aur LocalStorage clear karne k liye
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
      // --- REQUEST STARTED ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // --- REQUEST SUCCESS ---
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Aapke provided JSON structure ke mutabiq data set kar rahe hain
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.successMessage = action.payload.message;
      })
      // --- REQUEST FAILED ---
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;