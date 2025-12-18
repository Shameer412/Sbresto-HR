import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "../../routes/AppRoutes";
// 🔥 FIX: Yahan 'ROLES' ko bhi import karein
import { ROLE_NAV_ITEMS } from "../../config/navigation";

// UI Components
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Routing Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // 1. SECURITY CHECK
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 2. DYNAMIC MENU LOGIC

  const roleKey =
    user.role && typeof user.role === "object" ? user.role.name : user.role;

  const menuItems = ROLE_NAV_ITEMS[roleKey] || [];

  // 3. Active Tab Logic
  const currentPath = location.pathname.split("/").pop();
  const activeTab =
    menuItems.find((item) => item.id === currentPath)?.id || menuItems[0]?.id;

  // 4. Title Logic
  const getTitle = () => {
    const item = menuItems.find((i) => i.id === activeTab);
    return item ? item.label : "Dashboard";
  };

  const handleNavigation = (tabId) => {
    navigate(`/dashboard/${tabId}`);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleNavigation}
        menuItems={menuItems}
      />

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none"></div>

        {/* --- HEADER --- */}
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          title={getTitle()}
        />

        {/* --- DYNAMIC CONTENT BODY --- */}
        <main className="flex-1 overflow-y-auto p-4 lg:px-8 pb-8 scroll-smooth">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
