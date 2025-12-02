import { lazy } from 'react';
import { ROLES } from '../config/navigation';

const Overview = lazy(() => import('../components/superAdmin/overview/Overview'));
const UserManagement = lazy(() => import('../components/superAdmin/userManagement/UserMangement'));
const TeamManagement = lazy(() => import('../components/departmentPanel/team/UserManagement'));


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
 
    roles: [ROLES.SUPER_ADMIN,ROLES.HR],
  },
   {
    path: 'team',
    title: 'User Management',
    component: TeamManagement,
 
    roles: [ROLES.DEPT_MANAGER],
  },

  
];

export default coreRoutes;