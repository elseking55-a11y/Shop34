
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock, Smartphone, CreditCard } from 'lucide-react';
import { useStore } from '../store';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function Checkout() {
  const { cart, cartTotal, appliedVoucher, clearCart } = useStore();
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
  const [address,setAddress]=useState('');
  const [phone,setPhone]=useState('');
  const [whatsapp,setWhatsapp]=useState('');
  const [error,setError]=useState('');
  const [processing,setProcessing]=useState(false);

  const subtotal=cartTotal();
  const discount=appliedVoucher
    ? appliedVoucher.discountType==='percentage'
      ? subtotal*(appliedVoucher.discountValue/100)
      : Math.min(subtotal,appliedVoucher.discountValue)
    : 0;
  const total=Math.max(0,subtotal-discount);

  const pay=async(e:React.FormEvent)=>{
    e.preventDefault();
    setError('');
    if(!cart.length){setError('Your cart is empty.');return;}
    setProcessing(true);
    try{
      const response=await fetch(API_URL+'/api/payments/initialize',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:(firstName+' '+lastName).trim(),
          email,address,phone,deliveryMethod:'email',
          whatsappNumber:whatsapp || undefined,
          items:cart.map(item=>({productId:item.product.id,quantity:item.quantity}))
        })
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to start payment.');
      clearCart();
      window.location.assign(data.authorizationUrl);
    }catch(err){
      setError(err instanceof Error ? err.message : 'Unable to start payment.');
      setProcessing(false);
    }
  };

  if(!cart.length) return <div className="min-h-[60vh] flex flex-col items-center justify-center p-6"><h2 className="text-2xl font-bold text-amber-950">Your cart is empty</h2><Link to="/shop" className="mt-4 text-orange-600 font-bold">Return to Shop</Link></div>;

  return <div className="bg-amber-50/30 min-h-screen py-10">
    <div className="max-w-6xl mx-auto px-4">
      <Link to="/cart" className="inline-flex items-center gap-2 text-amber-900 mb-8"><ArrowLeft size={16}/> Back to Cart</Link>
      <h1 className="font-serif text-4xl font-bold text-amber-950 mb-8">Secure Checkout</h1>
      <form onSubmit={pay} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-amber-900/10 p-6">
            <h2 className="font-bold text-xl text-amber-950 mb-5">Customer & Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name" className="p-3 rounded-xl border border-amber-900/20"/>
              <input required value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last name" className="p-3 rounded-xl border border-amber-900/20"/>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="p-3 rounded-xl border border-amber-900/20 sm:col-span-2"/>
              <input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="p-3 rounded-xl border border-amber-900/20"/>
              <input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp number (optional)" className="p-3 rounded-xl border border-amber-900/20"/>
              <textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Delivery address" rows={4} className="p-3 rounded-xl border border-amber-900/20 sm:col-span-2"/>
            </div>
          </section>
          <section className="bg-white rounded-3xl border border-amber-900/10 p-6">
            <h2 className="font-bold text-xl text-amber-950 mb-4">Real Payment</h2>
            <div className="rounded-2xl bg-amber-50 p-5 border border-amber-900/10">
              <div className="flex items-center gap-3 font-bold text-amber-950"><Lock size={18}/> Pay securely through Paystack</div>
              <p className="text-sm text-amber-900/70 mt-2">The secure checkout uses the payment methods enabled on your Paystack account, including supported card and Kenyan mobile-money options.</p>
              <div className="flex gap-3 mt-4 text-sm font-bold text-amber-900/70"><CreditCard size={18}/> Card <Smartphone size={18}/> Mobile Money</div>
            </div>
            {error && <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>}
          </section>
        </div>
        <aside className="bg-white rounded-3xl border border-amber-900/10 p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-bold text-xl text-amber-950 mb-5">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map(item=><div key={item.product.id} className="flex justify-between gap-3 text-sm"><span>{item.product.name} × {item.quantity}</span><b>\${(item.product.price*item.quantity).toFixed(2)}</b></div>)}
          </div>
          {discount>0 && <div className="flex justify-between text-green-700 mb-3"><span>Discount</span><span>-\${discount.toFixed(2)}</span></div>}
          <div className="border-t pt-4 flex justify-between text-lg font-bold text-amber-950"><span>Total</span><span>\${total.toFixed(2)}</span></div>
          <button disabled={processing} className="w-full mt-6 bg-amber-950 hover:bg-amber-900 disabled:opacity-60 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2">
            {processing?<><Loader2 className="animate-spin" size={18}/> Starting secure payment…</>:<>Pay \${total.toFixed(2)}</>}
          </button>
          <p className="text-xs text-center text-amber-900/50 mt-3">No order is marked paid until the payment provider confirms it.</p>
        </aside>
      </form>
    </div>
  </div>;
}
