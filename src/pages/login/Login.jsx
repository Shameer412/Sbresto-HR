import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice'; // Path check kar lena

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Redux Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Global State se data nikalein
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // 1. Redirect Logic: Agar user login ho jaye, dashboard bhejo
  useEffect(() => {
    if (user) {
      navigate('/dashboard/overview'); // Redirect to main dashboard
    }
  }, [user, navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 2. Dispatch Login Action
    const credentials = {
      email: formData.email,
      password: formData.password
    };
    
    dispatch(loginUser(credentials));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920')`
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-blue-500/30 backdrop-blur-[2px]"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 p-8 transform transition-all hover:scale-[1.01] duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-3 animate-bounce-slow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">HR Portal</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome Back <span className="inline-block animate-wiggle">👋</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please enter your details to sign in
          </p>
        </div>

        {/* 3. ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="group animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</label>
            <div className="relative transition-all duration-300 focus-within:scale-105">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all outline-none text-sm"
                placeholder="hello@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
            <div className="relative transition-all duration-300 focus-within:scale-105">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all outline-none text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.83 3.83" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button with Loading State */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Signing In...
                </div>
              ) : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;