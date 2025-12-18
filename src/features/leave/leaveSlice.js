import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// ✅ POST: hr/employee/leave/request
export const requestLeave = createAsyncThunk(
  "leave/request",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/hr/employee/leave/request", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Leave request failed"
      );
    }
  }
);

// ✅ GET: hr/employee/{id}/leave/requests
export const fetchLeaveRequests = createAsyncThunk(
  "leave/fetchRequests",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/hr/employee/${employeeId}/leave/requests`);
      return res.data; // { success, message, data }
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch leave requests"
      );
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    successMessage: null,
  },
  reducers: {
    clearLeaveMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearLeaveState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(requestLeave.pending, (s) => {
      s.status = "loading";
      s.error = null;
      s.successMessage = null;
    })
      .addCase(requestLeave.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.successMessage =
          a.payload?.message || "Leave requested successfully.";
        // optional: agar API new record return kare to push
        if (a.payload?.data) s.items.unshift(a.payload.data);
      })
      .addCase(requestLeave.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      .addCase(fetchLeaveRequests.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (s, a) => {
        s.status = "succeeded";
        // most common: res.data.data = array
        s.items = a.payload?.data?.data || a.payload?.data || [];
      })
      .addCase(fetchLeaveRequests.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });
  },
});

export const { clearLeaveMessages, clearLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
