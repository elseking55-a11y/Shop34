import React from "react";
import { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle, ArrowLeft, Mail, MessageCircle, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const { cart, cartTotal, placeOrder, clearCart, appliedVoucher } = useStore();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'card' | 'crypto'>('mpesa');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp'>('email');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartTotal();
  
  const getDiscountAmount = () => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.discountType === 'percentage') {
      return subtotal * (appliedVoucher.discountValue / 100);
    }
    return Math.min(subtotal, appliedVoucher.discountValue);
  };
  
  const discount = getDiscountAmount();
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // API Integration Routing Logic (Conceptual)
    if (['mpesa', 'airtel', 'card'].includes(paymentMethod)) {
        // Route to Paystack API using VITE_PAYSTACK_PUBLIC_KEY & PAYSTACK_SECRET_KEY
        console.log("Processing via Paystack API (M-Pesa / Airtel Money / Card)...");
    } else if (paymentMethod === 'crypto') {
        // Route to Binance API using VITE_BINANCE_API_KEY & BINANCE_SECRET_KEY
        console.log("Processing via Binance API (Crypto)...");
    }

    // Simulate API delay
    setTimeout(() => {
      placeOrder({
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        deliveryMethod,
        whatsappNumber: deliveryMethod === 'whatsapp' ? whatsappNumber : undefined
      });
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/account?tab=orders');
      }, 3000);
    }, 2000);
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-amber-950 mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-orange-600 font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-amber-50/30 p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl shadow-amber-900/5 text-center max-w-md border border-amber-900/10"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-amber-950 mb-4">Order Confirmed!</h2>
          <p className="text-amber-900/70 mb-8 leading-relaxed">
            Thank you for your purchase. Your authentic East African goods are being prepared for shipment.
          </p>
          <p className="text-sm text-amber-900/50 mb-4">Redirecting to your orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/cart" className="inline-flex items-center gap-2 text-amber-900 hover:text-orange-600 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="font-serif text-4xl font-bold text-amber-950 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-8">
              {/* Shipping Details */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-900/10">
                <h2 className="font-bold text-xl text-amber-950 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-amber-950">First Name</label>
                    <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-amber-950">Last Name</label>
                    <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-amber-950">Email Address</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-amber-950">Shipping Address</label>
                    <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                </div>
              </div>

              {/* Delivery Notifications */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-900/10">
                <h2 className="font-bold text-xl text-amber-950 mb-6">Delivery Updates</h2>
                <div className="space-y-4">
                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === 'email' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="deliveryMethod" value="email" checked={deliveryMethod === 'email'} onChange={() => setDeliveryMethod('email')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">Email Notifications</span>
                        <Mail className="text-blue-500" />
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === 'whatsapp' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="deliveryMethod" value="whatsapp" checked={deliveryMethod === 'whatsapp'} onChange={() => setDeliveryMethod('whatsapp')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">WhatsApp Updates</span>
                        <MessageCircle className="text-green-500" />
                      </div>
                    </div>
                    {deliveryMethod === 'whatsapp' && (
                      <div className="mt-4 pl-9">
                        <input type="text" required value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="WhatsApp Number (e.g., +254 712 345 678)" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-900/10">
                <h2 className="font-bold text-xl text-amber-950 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  
                  {/* M-Pesa */}
                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">M-Pesa</span>
                        <Smartphone className="text-green-600" />
                      </div>
                    </div>
                    {paymentMethod === 'mpesa' && (
                      <div className="mt-4 pl-9">
                        <input type="text" placeholder="Phone Number (e.g., 0712 345 678)" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                      </div>
                    )}
                  </label>

                  {/* Airtel Money (Paystack) */}
                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'airtel' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="airtel" checked={paymentMethod === 'airtel'} onChange={() => setPaymentMethod('airtel')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">Airtel Money</span>
                        <Smartphone className="text-red-600" />
                      </div>
                    </div>
                    {paymentMethod === 'airtel' && (
                      <div className="mt-4 pl-9">
                        <input type="text" placeholder="Phone Number (e.g., 0733 123 456)" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                      </div>
                    )}
                  </label>

                  {/* Credit Card (Paystack placeholder) */}
                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">Credit or Debit Card</span>
                        <div className="flex gap-2">
                          <CreditCard className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="mt-4 pl-9 space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                          <input type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Crypto (Binance Pay placeholder) */}
                  <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'crypto' ? 'border-orange-500 bg-orange-50' : 'border-amber-900/10 hover:border-amber-900/30'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-bold text-amber-950">Crypto (Binance Pay)</span>
                        <span className="font-bold text-yellow-500">₿</span>
                      </div>
                    </div>
                    {paymentMethod === 'crypto' && (
                      <div className="mt-4 pl-9 text-sm text-amber-900/70">
                        You will be redirected to Binance Pay to complete your transaction securely.
                      </div>
                    )}
                  </label>

                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm border border-amber-900/10 p-8 sticky top-24">
              <h2 className="font-bold text-xl text-amber-950 mb-6">Order Summary</h2>
              
              <ul className="space-y-4 mb-6 border-b border-amber-900/10 pb-6">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-amber-50" />
                      <div>
                        <p className="font-bold text-sm text-amber-950 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-amber-900/60">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-amber-950">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-amber-900/80">
                  <span>Subtotal</span>
                  <span className="font-medium text-amber-950">${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600 font-medium bg-green-50 p-2 rounded-lg -mx-2">
                    <span className="flex items-center gap-1"><Tag size={14} /> Discount ({appliedVoucher.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-amber-900/10 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-amber-950">Total</span>
                  <span className="font-serif text-3xl font-bold text-amber-950">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-amber-950 hover:bg-amber-900 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors shadow-lg"
              >
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
