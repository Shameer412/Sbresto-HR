import React, { Suspense, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import coreRoutes from './index'; 

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  
  const userRole = user?.role && typeof user.role === 'object' ? user.role.name : user?.role;

  const allowedRoutes = useMemo(() => {
    if (!user) return [];
    
  

    return coreRoutes.filter((route) => route.roles.includes(userRole));
  }, [user, userRole]);

  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading...</div>}>
      <Routes>
        {allowedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}
        {/* Default Route */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;