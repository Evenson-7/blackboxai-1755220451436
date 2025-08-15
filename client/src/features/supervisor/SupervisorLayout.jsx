// src/layouts/SupervisorLayout.jsx
import { useState, useEffect } from 'react';
import { BarChart2, Users, Clipboard, Clock, Menu, ChevronLeft, Calendar, User } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const SupervisorLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  // Get user data from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path) {
      setActiveItem(path);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(`/supervisor/${path}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const navItems = [
    { icon: BarChart2, label: 'Dashboard', path: 'dashboard' },
    { icon: Users, label: 'Manage Interns', path: 'manage-interns' },
    { icon: Clipboard, label: 'Timesheet Edit', path: 'timesheet-approvals' },
    { icon: Clock, label: 'Report Approvals', path: 'report-approvals' },
    { icon: Calendar, label: 'Leave Requests', path: 'leave-approvals' },
    { icon: BarChart2, label: 'Performance Overview', path: 'performance-overview' }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out bg-gray-800 text-white flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className={`p-4 bg-gray-900 font-bold text-lg flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && <span>OJT MANAGER</span>}
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none flex-shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1">
          {navItems.map(({ icon: Icon, label, path }, idx) => (
            <div 
              key={idx} 
              className={`${
                activeItem === path ? 'bg-blue-500' : 'hover:bg-gray-700'
              } p-4 flex items-center cursor-pointer`}
              onClick={() => handleNavigation(path)}
            >
              {isSidebarOpen ? (
                <div className="flex items-center">
                  <Icon size={18} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ) : (
                <div className="mx-auto">
                  <Icon size={20} />
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* User Info and Logout Button - Only visible when sidebar is open */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            {/* User Info Section */}
            {currentUser && (
              <div className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md">
                <div className="bg-blue-500 p-2 rounded-full">
                  <User size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-300 truncate">{currentUser.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SupervisorLayout;