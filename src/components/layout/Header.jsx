import React from 'react';
import { Menu, Bell, Search, Moon } from 'lucide-react';

const Header = ({ toggleSidebar, title }) => {
  return (
    // Floating Header Container
    <header className="sticky top-4 z-30 mx-4 lg:mx-8 mb-8">
      
      {/* Glassmorphism Box */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl px-6 py-4 flex items-center justify-between">
        
        {/* Left Side: Toggle & Search */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleSidebar} 
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 lg:hidden text-slate-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Expandable Search Bar */}
          <div className="hidden md:flex items-center bg-slate-50 rounded-full px-4 py-2.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 w-64 focus-within:w-80">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Side: Title & Actions */}
        <div className="flex items-center gap-6">
          
          {/* Page Title (Hidden on mobile for space) */}
          <h2 className="hidden lg:block text-lg font-bold text-slate-800 bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
            {title}
          </h2>

          <div className="h-8 w-[1px] bg-slate-200 hidden lg:block"></div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle (Visual) */}
            <button className="p-3 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
                <Moon className="w-5 h-5" />
            </button>

            {/* Notification Bell with Pulse */}
            <button className="relative p-3 bg-white border border-slate-100 rounded-full hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;