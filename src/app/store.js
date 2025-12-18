import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "../features/attendance/attendanceSlice";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";
import workSettingsReducer from "../features/employee/workSettingsSlice";
import leaveReducer from "../features/leave/leaveSlice";
import loanReducer from "../features/loan/loanSlice";
import roleReducer from "../features/role/roleSlice";
import teamReducer from "../features/team/teamSlice";
export const store = configureStore({
  reducer: {
    leave: leaveReducer,
    loan: loanReducer,
    auth: authReducer,
    teams: teamReducer,
    employees: employeeReducer,
    roles: roleReducer,
    attendance: attendanceReducer,
    workSettings: workSettingsReducer,
  },
});
