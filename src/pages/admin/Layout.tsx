import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Megaphone, Menu, X, Tag, Mail, Sliders, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../../store';

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const { adminToken, loginAdmin, logoutAdmin, loadProducts, loadOrders } = useStore();

  useEffect(()=>{ if(adminToken){ loadProducts(); loadOrders(); } },[adminToken,loadProducts,loadOrders]);

  if(!adminToken) return <div className="min-h-screen bg-amber-50 flex items-center justify-center p-5">
    <form onSubmit={async e=>{e.preventDefault();setError('');const ok=await loginAdmin(email,password);if(!ok)setError('Invalid admin credentials or backend is not configured.');}} className="bg-white rounded-3xl shadow-xl border border-amber-900/10 p-8 w-full max-w-md">
      <h1 className="text-3xl font-serif font-bold text-amber-950 mb-2">Shop34 Admin</h1>
      <p className="text-sm text-amber-900/60 mb-6">Sign in to manage real products and orders.</p>
      <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" className="w-full p-3 rounded-xl border mb-3"/>
      <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password" className="w-full p-3 rounded-xl border mb-4"/>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <button className="w-full bg-amber-950 text-white py-3 rounded-full font-bold">Sign in</button>
      <Link to="/" className="block text-center mt-4 text-orange-600 font-bold">Back to shop</Link>
    </form>
  </div>;

  const navItems=[
    {path:'/admin',icon:LayoutDashboard,label:'Dashboard'},
    {path:'/admin/products',icon:Package,label:'Products'},
    {path:'/admin/users',icon:Users,label:'Users'},
    {path:'/admin/orders',icon:ShoppingCart,label:'Orders'},
    {path:'/admin/messages',icon:MessageSquare,label:'Messages'},
    {path:'/admin/news',icon:Megaphone,label:'News'},
    {path:'/admin/vouchers',icon:Tag,label:'Vouchers'},
    {path:'/admin/emails',icon:Mail,label:'Email Users'},
    {path:'/admin/settings',icon:Sliders,label:'Site Settings'}
  ];

  return <div className="flex h-screen bg-amber-50/50 w-full overflow-hidden absolute inset-0 z-[100]">
    {isSidebarOpen && <div className="fixed inset-0 bg-amber-950/20 z-40 lg:hidden" onClick={()=>setIsSidebarOpen(false)}/>}
    <aside className={'w-64 bg-amber-950 text-amber-50 flex flex-col shrink-0 absolute lg:relative z-50 h-full transition-transform duration-300 '+(isSidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0')}>
      <div className="p-6 flex justify-between items-center"><h2 className="text-2xl font-serif font-bold text-orange-400">Shop34 Admin</h2><button onClick={()=>setIsSidebarOpen(false)} className="lg:hidden"><X size={24}/></button></div>
      <nav className="flex-1 px-4 space-y-2 mt-4">{navItems.map(item=>{const Icon=item.icon;return <Link key={item.path} to={item.path} onClick={()=>setIsSidebarOpen(false)} className={'flex items-center gap-3 px-4 py-3 rounded-xl '+(location.pathname===item.path?'bg-orange-600 text-white':'hover:bg-amber-900/50 text-amber-50/80')}><Icon size={20}/><span className="font-medium">{item.label}</span></Link>})}</nav>
      <div className="p-4 border-t border-amber-900"><button onClick={logoutAdmin} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-900/50 text-amber-50/80 w-full"><LogOut size={20}/> Sign out</button></div>
    </aside>
    <main className="flex-1 overflow-y-auto bg-amber-50/50">
      <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between"><h1 className="font-serif font-bold text-amber-950">Admin</h1><button onClick={()=>setIsSidebarOpen(true)}><Menu size={24}/></button></div>
      <div className="min-h-full"><Outlet/></div>
    </main>
  </div>;
}
