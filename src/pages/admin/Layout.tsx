import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Megaphone, Menu, X, Tag, Mail, Sliders, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/news', icon: Megaphone, label: 'News' },
    { path: '/admin/vouchers', icon: Tag, label: 'Vouchers' },
    { path: '/admin/bin-codes', icon: CreditCard, label: 'BIN Unlock Codes' },
    { path: '/admin/emails', icon: Mail, label: 'Email Users' },
    { path: '/admin/settings', icon: Sliders, label: 'Site Settings' },
  ];

  return (
    <div className="flex h-screen bg-amber-50/50 w-full overflow-hidden absolute inset-0 z-[100]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-amber-950/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-amber-950 text-amber-50 flex flex-col shrink-0 absolute lg:relative z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-orange-400">Admin Panel</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-amber-50/80 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-orange-600 text-white' : 'hover:bg-amber-900/50 text-amber-50/80'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-amber-900">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-900/50 text-amber-50/80 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-amber-50/50 flex flex-col">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden bg-white border-b border-amber-900/10 p-4 flex items-center justify-between shrink-0">
          <h1 className="font-serif font-bold text-amber-950 text-xl">Admin</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="text-amber-950 hover:text-orange-600 transition-colors">
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
