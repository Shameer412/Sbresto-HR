import { lazy } from 'react';
import { ROLES } from '../config/navigation';

const Overview = lazy(() => import('../components/superAdmin/overview/Overview'));
const UserManagement = lazy(() => import('../components/superAdmin/userManagement/UserMangement'));



const coreRoutes = [
  
  {
    path: 'overview',
    title: 'Overview',
    component: Overview,
   
    roles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.DEPT_MANAGER, ROLES.EMPLOYEE],
  },

  
  {
    path: 'users',
    title: 'User Management',
    component: UserManagement,
 
    roles: [ROLES.SUPER_ADMIN],
  },

  
];

export default coreRoutes;