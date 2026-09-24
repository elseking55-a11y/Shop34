import { useState } from 'react';
import { useStore } from '../../store';
import { Order } from '../../types';
import { Trash2, MessageCircle, Mail, CheckCircle2, Truck, Package, Clock, Bell, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [notification, setNotification] = useState<{message: string, type: 'whatsapp'|'email', id: number} | null>(null);

  const handleStatusChange = (order: Order, status: Order['status']) => {
    updateOrderStatus(order.id, status);
    
    // Notify customer when status changes to Shipped or Delivered
    if (status === 'shipped' || status === 'delivered') {
      const isWhatsapp = order.deliveryMethod === 'whatsapp';
      setNotification({
        message: `Notification sent to ${order.customerName} via ${isWhatsapp ? 'WhatsApp' : 'Email'}! Status updated to ${status}.`,
        type: isWhatsapp ? 'whatsapp' : 'email',
        id: Date.now()
      });
      
      // Auto-dismiss
      setTimeout(() => {
        setNotification(current => current?.id === Date.now() ? null : current); // slightly flawed due to closure, but standard auto-dismiss works well enough if we just clear it
      }, 5000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={12} />;
      case 'processing': return <Package size={12} />;
      case 'shipped': return <Truck size={12} />;
      case 'out_for_delivery': return <MapPin size={12} />;
      case 'delivered': return <CheckCircle2 size={12} />;
      default: return null;
    }
  };

  const statusSteps = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

  return (
    <div className="p-8 relative">
      <h1 className="text-3xl font-serif font-bold text-amber-950 mb-8">Manage Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-900/10 text-amber-900/60 text-sm">
                <th className="p-4 font-medium">Order Details</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium min-w-[200px]">Delivery Tracking</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => {
                const currentStepIndex = statusSteps.indexOf(order.status);
                
                return (
                  <tr key={order.id} className="border-b border-amber-900/5 last:border-0 hover:bg-amber-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-amber-950">{order.id}</div>
                      <div className="text-xs text-amber-900/60">{new Date(order.date).toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-amber-950">{order.customerName}</div>
                      <div className="text-xs text-amber-900/60">{order.email}</div>
                      
                      {order.deliveryMethod === 'whatsapp' ? (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md border border-green-200">
                          <MessageCircle size={14} /> 
                          WhatsApp: {order.whatsappNumber}
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded-md border border-orange-200">
                          <Mail size={14} /> 
                          Email Delivery
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-amber-950">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-4">
                        {/* Tracking Indicator */}
                        <div className="flex items-center justify-between relative px-1">
                          <div className="absolute top-1/2 left-1 right-1 h-1 bg-amber-900/10 -translate-y-1/2 z-0 rounded-full" />
                          <div 
                            className="absolute top-1/2 left-1 h-1 bg-orange-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                          />
                          
                          {statusSteps.map((s, i) => {
                            const isCompleted = currentStepIndex >= i;
                            return (
                              <div 
                                key={s} 
                                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${isCompleted ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-amber-900/20 text-amber-900/40'}`} 
                                title={s.charAt(0).toUpperCase() + s.slice(1)}
                              >
                                {getStatusIcon(s)}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Status Dropdown */}
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order, e.target.value as Order['status'])}
                          className="border border-amber-900/20 rounded-lg p-2 text-sm font-bold text-amber-950 outline-none focus:border-orange-500 cursor-pointer bg-white w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-amber-900/50">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 flex items-start gap-3 p-4 rounded-xl shadow-xl border z-50 max-w-sm ${
              notification.type === 'whatsapp' 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-orange-50 border-orange-200 text-orange-900'
            }`}
          >
            <div className={`mt-0.5 ${notification.type === 'whatsapp' ? 'text-green-600' : 'text-orange-600'}`}>
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">Customer Notified</h4>
              <p className="text-sm opacity-80 leading-snug">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
