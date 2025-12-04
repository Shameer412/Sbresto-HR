import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// --- 1. CLOCK IN ---
export const clockInEmployee = createAsyncThunk(
  "attendance/clockIn",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/attendance/clock-in", { employee_id: employeeId });
      if (response.data.success === false) return rejectWithValue(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Clock In failed");
    }
  }
);

// --- 2. CLOCK OUT ---
export const clockOutEmployee = createAsyncThunk(
  "attendance/clockOut",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/attendance/clock-out", { employee_id: employeeId });
      if (response.data.success === false) return rejectWithValue(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Clock Out failed");
    }
  }
);

// --- 3. FETCH TODAY'S ATTENDANCE (Check Status) ---
export const fetchTodayAttendance = createAsyncThunk(
  "attendance/fetchToday",
  async (employeeId, { rejectWithValue }) => {
    try {
      // API: hr/attendance/today?employee_id=33
      const response = await api.get(`/hr/attendance/today?employee_id=${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch today's status");
    }
  }
);

// --- 4. FETCH HISTORY ---
export const fetchAttendanceHistory = createAsyncThunk(
  "attendance/fetchHistory",
  async (employeeId, { rejectWithValue }) => {
    try {
      // API: hr/attendance/history?employee_id=33
      const response = await api.get(`/hr/attendance/history?employee_id=${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch history");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    record: null,           // Today's active record
    history: [],            // Past records list
    currentStatus: 'unknown', // 'clocked_in', 'clocked_out', 'unknown'
    status: "idle",         
    error: null,
    message: null,
  },
  reducers: {
    clearAttendanceMessage: (state) => {
      state.message = null;
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // --- CLOCK IN ---
      .addCase(clockInEmployee.pending, (state) => { state.status = "loading"; })
      .addCase(clockInEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.record = action.payload.data;
        state.currentStatus = 'clocked_in';
        state.message = action.payload.message || "Clocked In Successfully!";
        // History update logic optional here
      })
      .addCase(clockInEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- CLOCK OUT ---
      .addCase(clockOutEmployee.pending, (state) => { state.status = "loading"; })
      .addCase(clockOutEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.record = action.payload.data;
        state.currentStatus = 'clocked_out';
        state.message = action.payload.message || "Clocked Out Successfully!";
        // Add to history immediately for UI update
        if (state.record) state.history.unshift(state.record);
      })
      .addCase(clockOutEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- FETCH TODAY ---
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.record = action.payload.data; 
        // Logic to determine status based on API data
        if (!state.record) {
            state.currentStatus = 'unknown'; // Not started yet
        } else if (state.record.clock_in && !state.record.clock_out) {
            state.currentStatus = 'clocked_in';
        } else if (state.record.clock_in && state.record.clock_out) {
            state.currentStatus = 'clocked_out';
        }
      })

      // --- FETCH HISTORY ---
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.history = action.payload.data || [];
      });
  },
});

export const { clearAttendanceMessage } = attendanceSlice.actions;
export default attendanceSlice.reducer;