import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Tag, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Voucher } from '../types';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, vouchers, appliedVoucher, applyVoucher } = useStore();
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  const handleApplyVoucher = () => {
    setVoucherError('');
    if (!voucherInput.trim()) return;

    const voucher = vouchers.find(v => v.code === voucherInput.toUpperCase());
    
    if (!voucher) {
      setVoucherError('Invalid voucher code');
      return;
    }
    
    if (!voucher.isActive) {
      setVoucherError('This voucher is no longer active');
      return;
    }
    
    if (new Date(voucher.expiresAt) < new Date()) {
      setVoucherError('This voucher has expired');
      return;
    }

    applyVoucher(voucher);
    setVoucherInput('');
  };

  const removeVoucher = () => {
    applyVoucher(null);
  };

  const getDiscountAmount = () => {
    if (!appliedVoucher) return 0;
    const subtotal = cartTotal();
    if (appliedVoucher.discountType === 'percentage') {
      return subtotal * (appliedVoucher.discountValue / 100);
    }
    return Math.min(subtotal, appliedVoucher.discountValue); // Cap fixed discount to subtotal
  };

  const getFinalTotal = () => {
    return Math.max(0, cartTotal() - getDiscountAmount());
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-amber-50/30">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
          <Trash2 size={40} className="opacity-50" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-amber-950 mb-4">Your cart is empty</h2>
        <p className="text-amber-900/70 mb-8 max-w-md">Looks like you haven't added any authentic East African goods to your cart yet.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-amber-950 mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-amber-900/10 pb-4 mb-6">
                <span className="font-bold text-amber-950">{cart.length} Items</span>
                <button 
                  onClick={clearCart}
                  className="text-sm text-amber-900/50 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <ul className="space-y-8">
                {cart.map((item) => (
                  <motion.li 
                    layout
                    key={item.product.id} 
                    className="flex flex-col sm:flex-row gap-6"
                  >
                    <Link to={`/product/${item.product.id}`} className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-amber-50 shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                            {item.product.category}
                          </div>
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-bold text-lg text-amber-950 hover:text-orange-600 transition-colors leading-tight">
                              {item.product.name}
                            </h3>
                          </Link>
                        </div>
                        <div className="font-bold text-amber-950 text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="text-amber-900/70 text-sm mb-4">
                        ${item.product.price.toFixed(2)} each
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-amber-900/20 rounded-full p-1 bg-amber-50/50">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-amber-900 hover:text-orange-600 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm text-amber-950 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-amber-900 hover:text-orange-600 hover:bg-white rounded-full transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-amber-900/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-6 md:p-8 sticky top-24">
              <h2 className="font-bold text-xl text-amber-950 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-amber-900/80">
                  <span>Subtotal</span>
                  <span className="font-medium text-amber-950">${cartTotal().toFixed(2)}</span>
                </div>
                
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600 font-medium bg-green-50 p-2 rounded-lg -mx-2">
                    <span className="flex items-center gap-1"><Tag size={14} /> Discount ({appliedVoucher.code})</span>
                    <span>-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Voucher Input */}
              {!appliedVoucher ? (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={voucherInput}
                      onChange={e => setVoucherInput(e.target.value)}
                      placeholder="Promo Code" 
                      className="flex-1 px-4 py-2 rounded-xl border border-amber-900/20 bg-amber-50/50 outline-none focus:border-orange-500 uppercase"
                    />
                    <button 
                      onClick={handleApplyVoucher}
                      className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-xl font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherError && <p className="text-red-500 text-xs font-bold mt-2">{voucherError}</p>}
                </div>
              ) : (
                <div className="mb-6 flex justify-between items-center bg-orange-50 border border-orange-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
                    <CheckCircle size={16} /> Voucher Applied
                  </div>
                  <button onClick={removeVoucher} className="text-xs text-orange-600 hover:underline">Remove</button>
                </div>
              )}

              <div className="border-t border-amber-900/10 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-amber-950">Total</span>
                  <span className="font-serif text-3xl font-bold text-amber-950">
                    ${getFinalTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-amber-900/50 mt-1 text-right">USD</p>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-amber-950 hover:bg-amber-900 text-white font-bold py-4 rounded-full transition-colors shadow-lg"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm font-medium text-orange-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
