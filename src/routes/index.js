import { lazy } from "react";
import { ROLES } from "../config/navigation";

const Overview = lazy(() =>
  import("../components/superAdmin/overview/Overview")
);
const UserManagement = lazy(() =>
  import("../components/superAdmin/userManagement/UserMangement")
);
const TeamManagement = lazy(() =>
  import("../components/departmentPanel/team/UserManagement")
);
const Attendance = lazy(() =>
  import("../components/employeePanel/attendance/Attendance")
);
const AttendanceReview = lazy(() =>
  import("../components/superAdmin/attendance/Attendance")
);

const MyLeaves = lazy(() =>
  import("../components/employeePanel/leaves/MyLeaves")
);
const MyLoans = lazy(() => import("../components/employeePanel/loans/MyLoans"));
const coreRoutes = [
  {
    path: "overview",
    title: "Overview",
    component: Overview,

    roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.DEPT_MANAGER, ROLES.EMPLOYEE],
  },

  {
    path: "users",
    title: "User Management",
    component: UserManagement,

    roles: [ROLES.SUPER_ADMIN, ROLES.HR],
  },
  {
    path: "team",
    title: "User Management",
    component: TeamManagement,

    roles: [ROLES.DEPT_MANAGER],
  },
  {
    path: "attendance",
    title: "Attendance",
    component: Attendance,

    roles: [ROLES.EMPLOYEE, ROLES.DEPT_MANAGER, ROLES.HR],
  },
  {
    path: "attendanceReview",
    title: "Attendance",
    component: AttendanceReview,

    roles: [ROLES.SUPER_ADMIN, ROLES.HR],
  },

  {
    path: "myLeaves",
    title: "Leave",
    component: MyLeaves,
    roles: [ROLES.EMPLOYEE, ROLES.DEPT_MANAGER, ROLES.HR], // jo bhi access chaho
  },
  {
    path: "myLoans",
    title: "Loan",
    component: MyLoans,
    roles: [ROLES.EMPLOYEE, ROLES.DEPT_MANAGER, ROLES.HR],
  },
];

export default coreRoutes;
