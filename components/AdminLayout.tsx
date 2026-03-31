import React, { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Users, FileText, Home, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/leads', icon: Users, label: 'Leads (CRM)' },
    { path: '/admin/blog', icon: FileText, label: 'Blog (CMS)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-black text-brand-blue italic tracking-tight">RABELLO<span className="text-brand-green">ADS</span></span>
          <span className="ml-2 text-[10px] font-black tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase">Admin</span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-brand-blue'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            Sair do Painel
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-gray-600 hover:bg-gray-200">
            <Home className="w-5 h-5" />
            Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
