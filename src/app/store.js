import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teamReducer from '../features/team/teamSlice';
import employeeReducer from '../features/employee/employeeSlice';
import roleReducer from '../features/role/roleSlice'; 

// 🔥 1. IMPORT THE NEW SLICE (Path check kar lena)
import workSettingsReducer from '../features/employee/workSettingsSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,           
    teams: teamReducer,
    employees: employeeReducer,
    roles: roleReducer, 

    // 🔥 2. REGISTER THE REDUCER
    // Iska naam exactly 'workSettings' hona chahiye kyunki component mein 
    // hum state.workSettings use kar rahe hain.
    workSettings: workSettingsReducer, 
  },
});