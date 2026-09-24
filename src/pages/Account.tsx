import { useStore } from '../store';
import { Package, Heart, Users, CreditCard, ChevronRight, FileDown, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

function OrderProgressBar({ status }: { status: Order['status'] }) {
  const steps = [
    { key: 'processing', label: 'Processing', icon: Package, desc: 'Order confirmed & preparing' },
    { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'Dispatched with carrier' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, desc: 'In transit to destination' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Package delivered' },
  ];

  const getStepIndex = (st: Order['status']) => {
    switch (st) {
      case 'pending':
      case 'processing': return 0;
      case 'shipped': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-3">
        <span className="flex items-center gap-1.5 text-orange-600">
          <Truck size={16} /> Live Shipping Tracker
        </span>
        <span className="text-amber-900/60 uppercase text-[11px] bg-amber-100 px-2.5 py-0.5 rounded-full">
          Status: {status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="relative my-4 px-2">
        {/* Track Line Background */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-amber-900/10 -translate-y-1/2 rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-orange-500 to-orange-600 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `calc(${progressPercent}% * 0.82)` }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between items-start">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[100px]">
                <div 
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/20' 
                      : 'bg-white border-amber-900/20 text-amber-900/30'
                  } ${isCurrent ? 'ring-4 ring-orange-500/20 scale-105' : ''}`}
                >
                  <Icon size={18} className={isCurrent ? 'animate-pulse' : ''} />
                </div>
                
                <div className="mt-2">
                  <div className={`text-[11px] sm:text-xs font-bold leading-tight ${isCompleted ? 'text-amber-950' : 'text-amber-900/40'}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-amber-900/50 hidden sm:block mt-0.5 leading-snug">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { currentUser, orders, products, favorites } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';

  const userOrders = orders.filter(o => o.email === currentUser?.email);
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'referral', label: 'Refer a Friend', icon: Users },
  ];

  const downloadPDFSummary = () => {
    if (!currentUser) return;
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.text('Order History Summary', 14, 22);
    
    // Add Customer Info
    doc.setFontSize(12);
    doc.text(`Customer Name: ${currentUser.name}`, 14, 32);
    doc.text(`Email: ${currentUser.email}`, 14, 38);
    
    // Table
    const tableData = userOrders.map(order => [
      order.id,
      new Date(order.date).toLocaleDateString(),
      order.items.toString(),
      order.status,
      `$${order.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Order ID', 'Date', 'Items', 'Status', 'Total']],
      body: tableData,
    });
    
    doc.save(`${currentUser.name.replace(/\s+/g, '_')}_Order_History.pdf`);
  };

  if (!currentUser) return <div>Please log in</div>;

  return (
    <div className="bg-amber-50/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-4xl font-bold text-amber-950 mb-10">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-6">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-amber-900/10">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-serif text-2xl font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-amber-950">{currentUser.name}</h2>
                  <p className="text-sm text-amber-900/60">{currentUser.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSearchParams({ tab: tab.id })}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isActive ? 'bg-orange-50 text-orange-600 font-bold' : 'text-amber-950 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight size={16} className={isActive ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {currentTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-amber-950">Order History</h2>
                  {userOrders.length > 0 && (
                    <button 
                      onClick={downloadPDFSummary}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                    >
                      <FileDown size={18} />
                      Download PDF Summary
                    </button>
                  )}
                </div>
                {userOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-amber-900/10">
                    <Package size={48} className="mx-auto text-amber-900/20 mb-4" />
                    <h3 className="font-bold text-xl text-amber-950 mb-2">No orders yet</h3>
                    <p className="text-amber-900/70 mb-6">You haven't placed any orders with us.</p>
                    <Link to="/shop" className="text-orange-600 font-bold hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-6 md:p-8 space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-900/10 pb-4">
                        <div>
                          <div className="text-sm text-amber-900/60 mb-1">Order {order.id}</div>
                          <div className="font-bold text-amber-950">{new Date(order.date).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                          <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase mb-2 ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' || order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <div className="font-bold text-amber-950">${order.total.toFixed(2)}</div>
                          {order.discountApplied && order.discountApplied > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              Saved ${order.discountApplied.toFixed(2)} ({order.voucherCode})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Shipping Progress Bar */}
                      <OrderProgressBar status={order.status} />

                      <div className="text-sm text-amber-900/70 flex justify-between items-center pt-2 border-t border-amber-900/10">
                        <span>{order.items} items purchased</span>
                        {order.deliveryMethod === 'whatsapp' ? (
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                            WhatsApp Delivery
                          </span>
                        ) : (
                          <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                            Email Digital Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {currentTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-amber-950 mb-6">Saved Items</h2>
                {favoriteProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-amber-900/10">
                    <Heart size={48} className="mx-auto text-amber-900/20 mb-4" />
                    <h3 className="font-bold text-xl text-amber-950 mb-2">No favorites yet</h3>
                    <p className="text-amber-900/70 mb-6">Save items you love to your favorites list.</p>
                    <Link to="/shop" className="text-orange-600 font-bold hover:underline">Explore Shop</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favoriteProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Referral Tab */}
            {currentTab === 'referral' && (
              <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-8 text-center">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-amber-950 mb-4">Give $10, Get $10</h2>
                <p className="text-amber-900/80 mb-8 max-w-md mx-auto leading-relaxed">
                  Share the taste of East Africa with your friends. Give them $10 off their first order, and get $10 in store credit when they purchase.
                </p>
                <div className="max-w-sm mx-auto bg-amber-50 p-4 rounded-xl border border-amber-900/20 mb-8 flex justify-between items-center">
                  <span className="font-mono text-amber-950 font-bold">EASTAFRICA10</span>
                  <button className="text-orange-600 font-bold hover:underline text-sm">Copy</button>
                </div>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md">
                  Invite Friends
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
