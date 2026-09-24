import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin imports
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminMessages from './pages/admin/Messages';
import AdminUsers from './pages/admin/Users';
import AdminNews from './pages/admin/News';
import AdminVouchers from './pages/admin/Vouchers';
import AdminEmails from './pages/admin/EmailUsers';
import AdminSiteSettings from './pages/admin/SiteSettings';
import AdminBinUnlockCodes from './pages/admin/BinUnlockCodes';
import LiveChat from './components/LiveChat';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';
import Live from './pages/Live';
import Broadcast from './pages/Broadcast';
import BinGenerator from './pages/BinGenerator';

export default function App() {
  const theme = useStore(state => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans text-amber-900 dark:text-zinc-100 selection:bg-orange-200 transition-colors duration-200">
        <Toast />
        <Routes>
          {/* Admin Routes - Nested under Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="vouchers" element={<AdminVouchers />} />
            <Route path="bin-codes" element={<AdminBinUnlockCodes />} />
            <Route path="emails" element={<AdminEmails />} />
            <Route path="settings" element={<AdminSiteSettings />} />
          </Route>

          {/* Public Routes - With Navbar & Footer */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen w-full pb-16 sm:pb-0 bg-white dark:bg-zinc-950 text-amber-900 dark:text-zinc-100 transition-colors duration-200">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/live" element={<Live />} />
                  <Route path="/broadcast" element={<Broadcast />} />
                  <Route path="/bin-generator" element={<BinGenerator />} />
                </Routes>
              </main>
              <Footer />
              <LiveChat />
              <MobileBottomNav />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}
