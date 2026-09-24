import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const API_URL=(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function Account(){
  const [reference,setReference]=useState('');
  const [email,setEmail]=useState('');
  const [order,setOrder]=useState<any>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [user,setUser]=useState<any>(null);
  const [myOrders,setMyOrders]=useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('shop34_customer_token');
    const saved = localStorage.getItem('shop34_customer_user');
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
    if (token) {
      fetch(API_URL + '/api/customer/orders', { headers: { Authorization: 'Bearer ' + token } })
        .then(async r => { if (r.ok) setMyOrders(await r.json()); })
        .catch(() => {});
    }
  }, []);

  const signOut=()=>{
    localStorage.removeItem('shop34_customer_token');
    localStorage.removeItem('shop34_customer_user');
    window.dispatchEvent(new Event('shop34-auth-changed'));
    setUser(null);
    setMyOrders([]);
  };

  const lookup=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);setError('');setOrder(null);
    try{
      const r=await fetch(API_URL+'/api/orders/lookup?reference='+encodeURIComponent(reference.trim())+'&email='+encodeURIComponent(email.trim()));
      const d=await r.json();
      if(!r.ok) throw new Error(d.error || 'Order lookup failed.');
      setOrder(d);
    }catch(err){setError(err instanceof Error?err.message:'Order lookup failed.');}
    finally{setLoading(false);}
  };

  return <div className="bg-amber-50/30 min-h-screen py-12">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="font-serif text-4xl font-bold text-amber-950 mb-3">Track Your Order</h1>
      <p className="text-amber-900/70 mb-8">Use the order ID from your payment confirmation and the email used at checkout.</p>
      {user ? <div className="mb-6 bg-white rounded-3xl border border-amber-900/10 p-5 flex flex-col sm:flex-row justify-between gap-4">
        <div><p className="text-xs uppercase font-bold text-orange-600">Customer account</p><p className="font-black text-amber-950">{user.name}</p><p className="text-sm text-amber-900/60">{user.email}</p></div>
        <button onClick={signOut} className="self-start px-4 py-2 rounded-xl border border-amber-900/15 font-bold text-sm">Sign Out</button>
      </div> : <div className="mb-6 rounded-2xl bg-white border border-amber-900/10 p-4"><span className="text-sm text-amber-900/70">Have an account?</span> <Link to="/auth?mode=signin" className="font-bold text-orange-600">Sign in</Link> or <Link to="/auth?mode=signup" className="font-bold text-orange-600">Sign up</Link> to keep your orders together.</div>}
      {user && myOrders.length > 0 && <div className="mb-8 bg-white rounded-3xl border border-amber-900/10 p-6">
        <h2 className="font-bold text-xl text-amber-950 mb-4">My Orders</h2>
        <div className="space-y-3">{myOrders.map(o => <div key={o.id} className="flex justify-between gap-4 p-3 rounded-xl bg-amber-50"><div><b>{o.id}</b><p className="text-xs text-amber-900/60">{new Date(o.date).toLocaleString()}</p></div><div className="text-right"><b>KES {Number(o.total).toFixed(2)}</b><p className="text-xs font-bold uppercase text-orange-600">{String(o.status).replace(/_/g,' ')}</p></div></div>)}</div>
      </div>}

      <form onSubmit={lookup} className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <input required value={reference} onChange={e=>setReference(e.target.value)} placeholder="Order ID e.g. ORD-ABC12345" className="p-3 rounded-xl border border-amber-900/20"/>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Checkout email" className="p-3 rounded-xl border border-amber-900/20"/>
        </div>
        {error && <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <button disabled={loading} className="mt-5 bg-amber-950 disabled:opacity-60 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2">
          <Search size={17}/>{loading?'Checking…':'Find Order'}
        </button>
      </form>

      {order && <div className="mt-8 bg-white rounded-3xl border border-amber-900/10 p-6">
        <div className="flex justify-between items-start gap-4 border-b pb-5">
          <div><p className="text-sm text-amber-900/50">Order</p><h2 className="text-2xl font-bold text-amber-950">{order.id}</h2></div>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">{String(order.status).replace(/_/g,' ')}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 py-5">
          <div><p className="text-xs text-amber-900/50">Payment</p><p className="font-bold text-green-700">{order.paymentStatus}</p></div>
          <div><p className="text-xs text-amber-900/50">Total</p><p className="font-bold text-amber-950">KES {Number(order.total).toFixed(2)}</p></div>
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-amber-950 pt-5 border-t">
          <span><Package size={17} className="inline mr-1"/> Order received</span>
          <span><Truck size={17} className="inline mr-1"/> Delivery status: {order.status}</span>
        </div>
        {order.status==='delivered' && <p className="mt-5 text-green-700 font-bold flex items-center gap-2"><CheckCircle2 size={18}/> Delivered</p>}
        {order.status==='pending' && <p className="mt-5 text-amber-700 font-bold flex items-center gap-2"><Clock size={18}/> Waiting for payment/order processing</p>}
      </div>}

      <div className="text-center mt-8"><Link to="/shop" className="text-orange-600 font-bold">Continue Shopping</Link></div>
    </div>
  </div>;
}
