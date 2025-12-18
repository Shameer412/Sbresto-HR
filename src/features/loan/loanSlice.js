import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// ✅ POST: hr/employee/loan/request
export const requestLoan = createAsyncThunk(
  "loan/request",
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { employee_id, amount, reason }
      const res = await api.post("/hr/employee/loan/request", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to request loan"
      );
    }
  }
);

// ✅ GET: hr/employee/{id}/loan/requests
export const fetchLoanRequests = createAsyncThunk(
  "loan/fetchRequests",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/hr/employee/${employeeId}/loan/requests`);
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch loan requests"
      );
    }
  }
);

const loanSlice = createSlice({
  name: "loan",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    successMessage: null,
  },
  reducers: {
    clearLoanMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearLoanState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(requestLoan.pending, (s) => {
      s.status = "loading";
      s.error = null;
      s.successMessage = null;
    })
      .addCase(requestLoan.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.successMessage = a.payload?.message || "Loan requested successfully.";
        if (a.payload?.data) s.items.unshift(a.payload.data);
      })
      .addCase(requestLoan.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      .addCase(fetchLoanRequests.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchLoanRequests.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload?.data?.data || a.payload?.data || [];
      })
      .addCase(fetchLoanRequests.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });
  },
});

export const { clearLoanMessages, clearLoanState } = loanSlice.actions;
export default loanSlice.reducer;
