import { ShoppingBag, Menu, Search, X, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = useStore(state => state.cartCount());
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const siteSettings = useStore(state => state.siteSettings);
  
  // Ticker Data
  const offersTitle = useStore(state => state.offersTitle);
  const news = useStore(state => state.news).filter(n => new Date(n.date) <= new Date());

  const tickerItems = [];
  if (siteSettings.announcementEnabled && siteSettings.announcementText) tickerItems.push(siteSettings.announcementText);
  if (offersTitle) tickerItems.push(`🔥 ${offersTitle}`);
  if (news.length > 0) tickerItems.push(`📢 ${news[0].title}`);

  return (
    <>
      {tickerItems.length > 0 && (
        <div className="bg-orange-600 text-white py-1.5 overflow-hidden flex items-center text-sm font-bold tracking-wide">
          <div className="animate-marquee min-w-full">
            <span className="mx-8">{tickerItems.join('   |   ')}</span>
            <span className="mx-8">{tickerItems.join('   |   ')}</span>
          </div>
        </div>
      )}
      <nav className="sticky top-0 z-50 bg-amber-50/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-amber-900/10 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-amber-900 dark:text-zinc-100 hover:text-amber-700 p-2"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center sm:justify-start">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-amber-900 dark:text-amber-400">
                {siteSettings.siteName || 'East Africa Store'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-amber-900 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium">Home</Link>
            <Link to="/shop" className="text-amber-900 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium">Shop</Link>
            <Link to="/about" className="text-amber-900 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium">About</Link>
            <Link to="/contact" className="text-amber-900 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium">Contact</Link>
            <Link to="/admin" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-bold ml-2">Admin Panel</Link>
          </div>

          {/* Icons & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-amber-900 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-zinc-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-amber-900" />}
            </button>

            <Link to="/account" className="text-amber-900 dark:text-zinc-200 hover:text-amber-700 p-2 hidden sm:block">
              <User size={20} />
            </Link>
            <Link to="/cart" className="text-amber-900 dark:text-zinc-200 hover:text-amber-700 p-2 relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden bg-amber-50 dark:bg-zinc-900 border-b border-amber-900/10 dark:border-zinc-800">
          <div className="px-3 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-amber-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-zinc-800 rounded-md">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-amber-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-zinc-800 rounded-md">Shop</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-amber-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-zinc-800 rounded-md">About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-amber-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-zinc-800 rounded-md">Contact</Link>
            <Link to="/account" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-amber-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-zinc-800 rounded-md">My Account</Link>
            
            <div className="flex justify-between items-center px-3 py-3 border-t border-amber-900/10 dark:border-zinc-800 mt-2">
              <span className="text-sm font-bold text-amber-900 dark:text-zinc-200">Theme Mode</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-zinc-800 text-amber-950 dark:text-amber-400 font-bold text-xs rounded-xl"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
            </div>

            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-zinc-800 rounded-md">Admin Panel</Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
