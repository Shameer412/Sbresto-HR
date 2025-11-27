import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utlis/api";

// --- 1. FETCH ALL TEAMS ---
export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hr/departments");
      
      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch teams");
    }
  }
);

// --- 2. ADD TEAM ---
export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async (name, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/store/department", { name });
      
      // Response: { success: true, data: 9, message: "..." }
      // Server sirf ID (9) bhej raha hai. State update karne ke liye hum object khud banayenge.
      return { 
        id: response.data.data, 
        name: name,
        status: 'Active' // Optional default
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add team");
    }
  }
);

// --- 3. UPDATE TEAM (Updated Logic) ---
export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      // Endpoint: hr/departments/{id}
      const response = await api.put(`/hr/departments/${id}`, { name });

      // Response: { success: true, data: { id: 1, name: "Updated Name", ... } }
      // Server pura updated object bhej raha hai, jo bohot achi baat hai.
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update team");
    }
  }
);

// --- 4. DELETE TEAM ---
export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (id, { rejectWithValue }) => {
    try {
      // Endpoint: hr/departments/{id}
      await api.delete(`/hr/departments/${id}`);
      
      // Server se success aane par humein bas ID chahiye taaki list se nikaal sakein
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete team");
    }
  }
);

// --- SLICE CONFIGURATION ---
const teamSlice = createSlice({
  name: "teams",
  initialState: {
    items: [],       // Saari teams yahan store hongi
    status: "idle",  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH CASES ---
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // API se aayi hui array set kar di
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- ADD CASES ---
      .addCase(addTeam.fulfilled, (state, action) => {
        state.items.push(action.payload); // Naya team list mein add kiya
      })

      // --- UPDATE CASES ---
      .addCase(updateTeam.fulfilled, (state, action) => {
        // Find index of the team being updated
        const index = state.items.findIndex((team) => team.id === action.payload.id);
        if (index !== -1) {
          // Replace old object with new updated object from server
          state.items[index] = action.payload;
        }
      })

      // --- DELETE CASES ---
      .addCase(deleteTeam.fulfilled, (state, action) => {
        // Jo ID delete hui, usko chhor kar baaki sab rakh lo
        state.items = state.items.filter((team) => team.id !== action.payload);
      });
  },
});

export default teamSlice.reducer;