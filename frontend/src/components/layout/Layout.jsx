import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingDown, Network, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Layout({ user, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employee Details' },
    { path: '/exit-trends', icon: TrendingDown, label: 'Exit Trends' },
    { path: '/teams', icon: Network, label: 'Team Wise Count' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ironman-darker via-ironman-dark to-black">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-ironman-dark/95 to-ironman-darker/95 backdrop-blur-xl border-r border-ironman-red/30 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6">
          <div className={`flex items-center mb-8 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-ironman-red to-ironman-gold bg-clip-text text-transparent flex-shrink-0 max-w-[120px] truncate">
                EMS Pro
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-ironman-red/20 transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-ironman-gold" /> : <Menu className="w-5 h-5 text-ironman-gold" />}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-link w-full ${!sidebarOpen ? 'justify-center' : ''} ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 text-ironman-gold flex-shrink-0" />
                  {sidebarOpen && <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-ironman-red/30">
          <div className={`flex flex-col gap-4 ${!sidebarOpen ? 'items-center' : ''}`}>
            <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-ironman-red to-ironman-gold flex items-center justify-center text-white font-bold shadow-glossy">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-ironman-gold truncate capitalize">{user?.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`sidebar-link w-full ${!sidebarOpen ? 'justify-center' : ''} hover:bg-red-500/20`}
            >
              <LogOut className="w-5 h-5 text-red-400 flex-shrink-0" />
              {sidebarOpen && <span className="text-red-400 whitespace-nowrap overflow-hidden text-ellipsis">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
