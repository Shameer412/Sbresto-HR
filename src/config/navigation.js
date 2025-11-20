import { 
  LayoutDashboard, 
  Users, 
} from 'lucide-react';

export const ROLES = {
  
  SUPER_ADMIN: 'admin',     
  HR: 'HR',                        
  DEPT_MANAGER: 'Department Manager', 
  EMPLOYEE: 'Employee',
};

export const ROLE_NAV_ITEMS = {
  
  // --- SUPER ADMIN  ---
  [ROLES.SUPER_ADMIN]: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
  ],

  // --- HR ---
  [ROLES.HR]: [
    { id: 'overview', label: 'HR Dashboard', icon: LayoutDashboard },
  ],

  // --- DEPT MANAGER ---
  [ROLES.DEPT_MANAGER]: [
    { id: 'overview', label: 'Team Overview', icon: LayoutDashboard },
  ],

  // --- EMPLOYEE  ---
  [ROLES.EMPLOYEE]: [
    { id: 'overview', label: 'My Dashboard', icon: LayoutDashboard },
  ],
};