import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// ------------------------------------------------------------------
// 1. & 3. CREATE PAYROLL (Single & Bulk)
// Note: Postman mein Single aur Bulk dono ka endpoint same hai (hr/payrolls)
// ------------------------------------------------------------------
export const createPayroll = createAsyncThunk(
  "payroll/createPayroll",
  async (payrollData, { rejectWithValue }) => {
    try {
      // Yeh Single aur Bulk dono ke liye kaam karega
      const response = await api.post("/hr/payrolls", payrollData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payroll",
      );
    }
  },
);

// ------------------------------------------------------------------
// 2. FETCH PAYROLL LIST
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// 2. FETCH PAYROLL LIST
// ------------------------------------------------------------------
export const fetchPayrolls = createAsyncThunk(
  "payroll/fetchPayrolls",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hr/payrolls?page=${page}`);
      // Return full object if pagination exists, else just data
      if (response.data?.data?.data) {
           return {
               items: response.data.data.data,
               pagination: {
                   currentPage: response.data.data.current_page,
                   lastPage: response.data.data.last_page,
                   total: response.data.data.total
               }
           };
      }
      return { items: response.data.data || response.data, pagination: null };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payrolls",
      );
    }
  },
);

// ------------------------------------------------------------------
// 4. CREATE LOAN REQUEST
// Endpoint: hr/employee/loan/request
// ------------------------------------------------------------------
export const createLoan = createAsyncThunk(
  "payroll/createLoan",
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/employee/loan/request", loanData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request loan",
      );
    }
  },
);

// ------------------------------------------------------------------
// 5. GET LOAN REQUESTS (For a specific employee)
// Endpoint: hr/employee/{id}/loan/requests
// ------------------------------------------------------------------
export const fetchEmployeeLoans = createAsyncThunk(
  "payroll/fetchEmployeeLoans",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/hr/employee/${employeeId}/loan/requests`,
      );
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

// ------------------------------------------------------------------
// 6. UPDATE PAYROLL STATUS
// Endpoint: hr/payrolls/{id}/status (Hypothetical, adjusting to standard)
// ------------------------------------------------------------------
export const updatePayrollStatus = createAsyncThunk(
  "payroll/updatePayrollStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // Assuming a generic update or specific status endpoint
      const response = await api.put(`/hr/payrolls/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
  },
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    payrolls: [],
    pagination: { // Store Pagination Info
        currentPage: 1,
        lastPage: 1,
        total: 0
    },
    loans: [],
    status: "idle",
    createStatus: "idle",
    error: null,
  },
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Payrolls ---
      .addCase(fetchPayrolls.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Handle structure change
        if (action.payload.pagination) {
            state.payrolls = action.payload.items;
            state.pagination = action.payload.pagination;
        } else {
            state.payrolls = action.payload.items || action.payload; // Fallback
        }
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
// ... rest of reducers

      // --- Create Payroll (Single/Bulk) ---
      .addCase(createPayroll.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createPayroll.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      })

      // --- Create Loan ---
      .addCase(createLoan.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createLoan.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      })

      // --- Fetch Loans ---
      .addCase(fetchEmployeeLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployeeLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans = action.payload;
      })
      .addCase(fetchEmployeeLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Update Payroll Status ---
      .addCase(updatePayrollStatus.fulfilled, (state, action) => {
        // Optimistic update or update from server response
        // Assuming payload.data contains the updated record
        const updatedItem = action.payload.data || action.payload;
        const index = state.payrolls.findIndex(p => p.id === updatedItem.id);
        if (index !== -1) {
             state.payrolls[index] = { ...state.payrolls[index], status: updatedItem.status };
        }
      });
  },
});

export const { resetCreateStatus } = payrollSlice.actions;
export default payrollSlice.reducer;
