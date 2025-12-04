import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// --- 1. SAVE/UPDATE WORK SETTINGS (POST) ---
// Endpoint: hr/employee/work-settings
export const saveWorkSettings = createAsyncThunk(
  "workSettings/save",
  async (settingsData, { rejectWithValue }) => {
    try {
      // settingsData structure: { employee_id, working_hours_per_day, working_days_per_month }
      const response = await api.post("/hr/employee/work-settings", settingsData);
      return response.data; // Returns full response object including message & data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save work settings"
      );
    }
  }
);

// --- 2. FETCH WORK SETTINGS BY EMPLOYEE ID (GET) ---
// Endpoint: hr/employee/{id}/work-settings
export const fetchWorkSettings = createAsyncThunk(
  "workSettings/fetchByEmployeeId",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hr/employee/${employeeId}/work-settings`);
      return response.data.data; // Returns the settings object (id, per_hour_rate, etc.)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch work settings"
      );
    }
  }
);

const workSettingsSlice = createSlice({
  name: "workSettings",
  initialState: {
    currentSettings: null, // Stores the specific employee's settings object
    status: "idle",        // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    successMessage: null,  // To show toast notifications on save
  },
  reducers: {
    // Jab modal close karein ya page change karein to data clean karne ke liye
    clearWorkSettingsState: (state) => {
      state.currentSettings = null;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
    // Sirf messages clear karne ke liye
    clearSettingsMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- SAVE SETTINGS HANDLERS ---
      .addCase(saveWorkSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveWorkSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        // API response structure: { success: true, data: {...}, message: "..." }
        state.currentSettings = action.payload.data; 
        state.successMessage = action.payload.message || "Work settings saved successfully.";
      })
      .addCase(saveWorkSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- FETCH SETTINGS HANDLERS ---
      .addCase(fetchWorkSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
        // Note: Hum purana data clear nahi kar rahe taake UI flicker na kare, 
        // agar zaroorat ho to yahan state.currentSettings = null kar sakte hain.
      })
      .addCase(fetchWorkSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentSettings = action.payload; // Ye object update ho jayega (rate, hours, etc.)
      })
      .addCase(fetchWorkSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearWorkSettingsState, clearSettingsMessages } = workSettingsSlice.actions;
export default workSettingsSlice.reducer;