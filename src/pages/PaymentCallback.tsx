import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get('reference');
  const clearCart = useStore(state => state.clearCart);
  const [status,setStatus]=useState<'loading'|'success'|'failed'>('loading');
  const [message,setMessage]=useState('Verifying your payment securely…');

  useEffect(()=>{
    if(!reference){setStatus('failed');setMessage('No payment reference was returned.');return;}
    fetch(API_URL+'/api/payments/verify/'+encodeURIComponent(reference))
      .then(async r=>{const d=await r.json(); if(!r.ok) throw new Error(d.error || 'Payment verification failed.'); return d;})
      .then(d=>{
        if(d.status==='success'){clearCart();setStatus('success');setMessage('Payment confirmed. Your order has been received.');}
        else {setStatus('failed');setMessage('The payment was not completed. No paid order was created.');}
      })
      .catch(e=>{setStatus('failed');setMessage(e instanceof Error?e.message:'Payment verification failed.');});
  },[reference]);

  return <div className="min-h-[70vh] flex items-center justify-center p-6 bg-amber-50/30">
    <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xl p-10 max-w-md w-full text-center">
      {status==='loading' && <Loader2 size={52} className="mx-auto text-orange-600 animate-spin"/>}
      {status==='success' && <CheckCircle size={58} className="mx-auto text-green-600"/>}
      {status==='failed' && <XCircle size={58} className="mx-auto text-red-600"/>}
      <h1 className="text-2xl font-bold text-amber-950 mt-5">{status==='success'?'Payment confirmed':status==='failed'?'Payment not confirmed':'Checking payment'}</h1>
      <p className="text-amber-900/70 mt-3">{message}</p>
      <div className="mt-7 flex gap-3 justify-center">
        <Link to="/shop" className="px-5 py-3 rounded-full bg-amber-950 text-white font-bold">Continue Shopping</Link>
        {status==='success' && <Link to="/account?tab=orders" className="px-5 py-3 rounded-full border border-amber-900/20 text-amber-950 font-bold">My Orders</Link>}
      </div>
    </div>
  </div>;
}
