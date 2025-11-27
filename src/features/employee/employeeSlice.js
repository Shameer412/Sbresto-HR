import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// --- 1. CREATE EMPLOYEE ---
export const createEmployee = createAsyncThunk(
  "employees/create",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/employees", employeeData);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create employee");
    }
  }
);

// --- 2. FETCH ALL EMPLOYEES ---
export const fetchEmployees = createAsyncThunk(
    "employees/fetchAll",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/hr/employees");
        return response.data.data.data; 
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

// --- 3. FETCH SINGLE EMPLOYEE ---
export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hr/employees/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch employee details");
    }
  }
);

// --- 4. UPDATE EMPLOYEE ---
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hr/employees/${id}`, data);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update employee");
    }
  }
);

// --- 5. DELETE EMPLOYEE ---
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/hr/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete employee");
    }
  }
);

// --- 6. CREATE EMPLOYEE USER (LOGIN) 🔥 NEW ---
export const createEmployeeUser = createAsyncThunk(
  "employees/createUser",
  async ({ id, ...credentials }, { rejectWithValue }) => {
    try {
      // API: employees/{id}/create-user
      const response = await api.post(`/hr/employees/${id}/create-user`, credentials);
      return { id, message: response.data.message }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create user login");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    items: [],
    selectedEmployee: null,
    status: "idle",
    error: null,
    successMessage: null, // 🔥 For success notifications
  },
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      
      // FETCH ALL
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload;
      })

      // UPDATE
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // DELETE
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((emp) => emp.id !== action.payload);
      })

      // CREATE USER (LOGIN) 🔥
      .addCase(createEmployeeUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createEmployeeUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message || "User login created successfully!";
        // Optional: Update UI to show this employee now has login access
        const index = state.items.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
            state.items[index].login_enabled = true; // Hypothetical field
        }
      })
      .addCase(createEmployeeUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEmployee, clearMessages } = employeeSlice.actions;
export default employeeSlice.reducer;