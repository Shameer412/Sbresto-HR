import React from 'react';
import { LayoutDashboard, LogOut, Rocket, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar, activeTab, setActiveTab, menuItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux se User data le rahe hain (Name/Role show karne k liye)
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay (Sirf mobile pe dikhega jab menu open ho) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 
          m-0 lg:m-4 rounded-none lg:rounded-3xl 
          bg-gradient-to-b from-slate-900 to-indigo-950 text-white
          shadow-2xl shadow-indigo-900/20
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          lg:relative lg:translate-x-0 flex flex-col justify-between
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Glow Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        <div>
          {/* Logo Area */}
          <div className="h-24 flex items-center justify-between px-8 pt-4">
            <div className="flex items-center gap-3 font-bold text-2xl tracking-wide">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NEXUS
              </span>
            </div>
            {/* Mobile Close Button */}
            <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <X />
            </button>
          </div>

          {/* Dynamic Menu Items */}
          <nav className="px-4 space-y-2 mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); closeSidebar(); }}
                  className={`
                    group relative flex items-center w-full px-5 py-4 rounded-2xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-2' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-7'}
                  `}
                >
                  <Icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  {item.label}
                  
                  {/* Active Dot Indicator */}
                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Upgrade & User Profile */}
        <div className="p-5 space-y-4">
          
          {/* Pro Card (Creative Widget) */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden group cursor-pointer">
             <div className="relative z-10">
               <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                 <Rocket className="w-5 h-5 text-white" />
               </div>
               <h4 className="font-bold text-sm">System Status</h4>
               <p className="text-xs text-slate-400 mt-1">All systems operational.</p>
             </div>
             {/* Background Blur Effect */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 px-2">
            <div className="flex items-center gap-3">
               {/* User Avatar */}
               <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold border-2 border-indigo-400 uppercase">
                 {user?.name ? user.name.charAt(0) : 'U'}
               </div>
               <div className="text-xs">
                 <p className="font-bold text-white truncate w-24">{user?.name || 'User'}</p>
                <p className="text-indigo-300 capitalize">
  {user?.role?.display_name || user?.role?.name || 'Guest'}
</p>
               </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;