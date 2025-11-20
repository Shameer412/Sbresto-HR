import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './pages/login/Login';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* 1. Public Route */}
        <Route path="/" element={!token ? <Login /> : <Navigate to="/dashboard" />} />

        
        <Route path="/dashboard/*" element={<DashboardLayout />} />

        {/* 3. Catch All - Redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;