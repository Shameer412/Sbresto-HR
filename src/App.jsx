import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Employeedashboard from "./employess/Employeedashboard";
import Login from "./components/login/Login";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          
          
          
          {/* Login route */}
          <Route 
            path="/" 
            element={<Login />} 
          />
          <Route 
            path="/dashboard" 
            element={<Employeedashboard />}  />
        </Routes>
      </div>
    </Router>
  );
};

export default App;