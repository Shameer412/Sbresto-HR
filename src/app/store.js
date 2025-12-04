import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teamReducer from '../features/team/teamSlice';
import employeeReducer from '../features/employee/employeeSlice';
import roleReducer from '../features/role/roleSlice'; 
import workSettingsReducer from '../features/employee/workSettingsSlice'; 
import attendanceReducer from '../features/attendance/attendanceSlice'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,           
    teams: teamReducer,
    employees: employeeReducer,
    roles: roleReducer, 
    attendance: attendanceReducer,
    workSettings: workSettingsReducer, 
  },
});