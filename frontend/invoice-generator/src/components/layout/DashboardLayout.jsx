import { useState, useEffect } from "react";
import {
  Briefcase,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import ProfileDropdown from "../../components/layout/ProfileDropdown.jsx";
import { NAVIGATION_MENU } from "../../utils/data.js";



const NavigationItem = ({ item, isActive, onClick, sidebarCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 font-medium transition-all duration-200 rounded-lg group
        ${isActive
          ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-900" : "text-gray-600"}`} />
      {!sidebarCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  )
}


const DashboardLayout = ({ children, activeMenu }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive: detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      { /* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 transform ${isMobile
        ? sidebarOpen
          ? 'translate-x-0'
          : '-translate-x-full'
        : "translate-x-0"
        } ${sidebarCollapsed ? "w-16" : "w-64"} 
            bg-white border-r border-gray-200`}
      >
        { /* Company Logo */}
        <div className="flex item-center h-16 border-b border-gray-200 px-6">
          <Link className="flex items-center space-x-3" to="/dashboard">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && <span className="text-gray-900 font-bold text-xl">AI Invoice App</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              sidebarCollapsed={sidebarCollapsed}
            />
          ))}

        </nav>

        {/* Logout — pinned to the bottom */}
        <div className="mt-auto border-t border-gray-200 p-4">
          <button
            className="w-full rounded-lg flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/10 bg-opacity-25 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 min-w-0 min-h-0 transition-all duration-300 ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>

        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-200 hover:text-blue-700 transition-colors duration-200"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold text-gray-900">Welcome back {user?.name}</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Here's your invoice overview.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Main Content area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
};


export default DashboardLayout;
