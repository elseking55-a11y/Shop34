import { useEffect, useState } from 'react';
import { Radio, RefreshCw, ShoppingBag, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem, Product } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function Live() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [settingsRes, productsRes] = await Promise.all([
        fetch(API_URL + '/api/site-settings'),
        fetch(API_URL + '/api/products')
      ]);
      const settings = settingsRes.ok ? await settingsRes.json() : {};
      const productsData = productsRes.ok ? await productsRes.json() : [];
      const liveNews = Array.isArray(settings.liveNews) ? settings.liveNews : [];
      setAnnouncement(settings.announcementEnabled ? String(settings.announcementText || '') : '');
      setNews(liveNews.filter((n: NewsItem) => new Date(n.date) <= new Date()).slice(0, 20));
      setProducts(productsData.slice(0, 8));
      setUpdated(new Date().toLocaleTimeString());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="min-h-screen bg-amber-50/40 py-10">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-red-600 font-black text-sm"><span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"/> LIVE</div>
          <h1 className="font-serif text-4xl font-black text-amber-950 mt-2">Live Updates</h1>
          <p className="text-amber-900/65 mt-2">Official store updates and products currently available.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-900/10 font-bold"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button>
      </div>
      <div className="text-xs text-amber-900/50 mb-6">Last synchronized: {updated || 'connecting…'} • Auto-refresh every 15 seconds</div>
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-amber-900/10 p-6">
          <h2 className="font-bold text-xl text-amber-950 flex items-center gap-2 mb-5"><Megaphone size={19} className="text-orange-600"/> Live Announcements</h2>
          {announcement && <div className="mb-4 p-4 rounded-2xl bg-orange-50 border border-orange-200"><p className="text-xs font-black text-orange-600 uppercase">Official live announcement</p><p className="font-bold text-amber-950 mt-1">{announcement}</p></div>}
          {news.length ? <div className="space-y-4">{news.map(n => <article key={n.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-900/10">{n.imageUrl && <img src={n.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-3"/>}<p className="text-xs text-orange-600 font-bold">{new Date(n.date).toLocaleString()}</p><h3 className="font-black text-amber-950 mt-1">{n.title}</h3><p className="text-sm text-amber-900/70 mt-2 whitespace-pre-wrap">{n.content}</p></article>)}</div> : <p className="text-sm text-amber-900/50">No live announcements have been published yet.</p>}
        </div>
        <div className="bg-white rounded-3xl border border-amber-900/10 p-6">
          <h2 className="font-bold text-xl text-amber-950 flex items-center gap-2 mb-5"><ShoppingBag size={19} className="text-orange-600"/> Store Live Now</h2>
          {products.length ? <div className="grid grid-cols-2 gap-3">{products.map(p => <Link key={p.id} to={'/product/'+p.id} className="rounded-2xl border border-amber-900/10 overflow-hidden hover:shadow-md transition"><img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover"/><div className="p-3"><p className="font-bold text-sm text-amber-950 line-clamp-2">{p.name}</p><p className="text-orange-600 font-black mt-1">KES {Number(p.price).toFixed(2)}</p></div></Link>)}</div> : <p className="text-sm text-amber-900/50">No products are currently available.</p>}
        </div>
      </section>
      <div className="mt-8 text-center"><Link to="/shop" className="inline-flex items-center px-6 py-3 rounded-full bg-amber-950 text-white font-bold">Open Shop</Link></div>
    </div>
  </div>;
}