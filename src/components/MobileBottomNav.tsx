import { Home, ShoppingBag, Radio, User, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function MobileBottomNav() {
  const location = useLocation();
  const cartCount = useStore(state => state.cartCount());
  const liveStreams = useStore(state => state.liveStreams).filter(s => s.isActive);
  const currentUser = useStore(state => state.currentUser);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-amber-900/10 dark:border-zinc-800 shadow-lg px-2 py-1.5 flex justify-around items-center transition-colors duration-200">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
          isActive('/') && location.pathname === '/' ? 'text-orange-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
        }`}
      >
        <Home size={20} />
        <span className="text-[10px] mt-0.5 font-medium">Home</span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
          isActive('/shop') || isActive('/product') ? 'text-orange-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
        }`}
      >
        <ShoppingBag size={20} />
        <span className="text-[10px] mt-0.5 font-medium">Shop</span>
      </Link>

      <Link
        to="/live"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl relative transition-all ${
          isActive('/live') || isActive('/broadcast') ? 'text-red-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
        }`}
      >
        <div className="relative">
          <Radio size={20} />
          {liveStreams.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Live</span>
      </Link>

      <Link
        to="/cart"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl relative transition-all ${
          isActive('/cart') || isActive('/checkout') ? 'text-orange-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
        }`}
      >
        <div className="relative">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 flex items-center justify-center h-4 w-4 rounded-full bg-orange-600 text-white text-[9px] font-bold">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Cart</span>
      </Link>

      {currentUser?.role === 'admin' ? (
        <Link
          to="/admin"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
            isActive('/admin') ? 'text-orange-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
          }`}
        >
          <Shield size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Admin</span>
        </Link>
      ) : (
        <Link
          to="/account"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
            isActive('/account') ? 'text-orange-600 font-bold' : 'text-amber-900/60 dark:text-zinc-400 hover:text-amber-950 dark:hover:text-zinc-100'
          }`}
        >
          <User size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Account</span>
        </Link>
      )}
    </div>
  );
}
