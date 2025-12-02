import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './pages/login/Login';
import DashboardLayout from './components/layout/DashboardLayout';

// --- 1. Protected Route Wrapper ---
// Ye check karega: Agar token nahi hai, toh Dashboard mat kholo, wapas Login pe bhejo.
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- 2. Public Route Wrapper ---
// Ye check karega: Agar user pehle se logged in hai, toh Login page mat dikhao, Dashboard pe bhejo.
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
if (token) {
  return <Navigate to="/dashboard/overview" replace />;
}
return children;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* CASE 1: Login Screen  */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* CASE 2: Dashboard (Protected) */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />

        {/* CASE 3: Unknown URL (Redirect to Login) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;