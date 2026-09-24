import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Tag, Megaphone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store';
import { motion } from 'motion/react';

export default function Home() {
  const products = useStore(state => state.products);
  const rawNews = useStore(state => state.news);
  const siteSettings = useStore(state => state.siteSettings);

  const news = rawNews.filter(n => new Date(n.date) <= new Date());
  const offersTitle = useStore(state => state.offersTitle);
  const featuredProducts = products.filter(p => p.featured);
  const offerProducts = products.filter(p => p.offerLabel);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-amber-950 text-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={siteSettings.heroImageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000"} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-950/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-48">
          <motion.div 
            initial={{ opacity: 0, y: siteSettings.motionEffectsEnabled ? 30 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: siteSettings.animationSpeed === 'fast' ? 0.3 : siteSettings.animationSpeed === 'slow' ? 1.0 : siteSettings.animationSpeed === 'minimal' ? 0.1 : 0.6 }}
            className="max-w-2xl"
          >
            {siteSettings.heroBadge && (
              <div className="inline-flex items-center gap-2 text-orange-200 text-[11px] sm:text-xs font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border uppercase tracking-wider mb-5" style={{ backgroundColor: "color-mix(in srgb, var(--shop-accent) 30%, transparent)", borderColor: "color-mix(in srgb, var(--shop-accent) 50%, transparent)" }}>
                <Cpu size={14} className="text-orange-400" /> {siteSettings.heroBadge}
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              {siteSettings.heroTitle || 'Automate Your Trading Edge with Verified EAs'}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-amber-50/80 mb-6 sm:mb-10 leading-relaxed max-w-xl">
              {siteSettings.heroSubtitle || 'Empowering traders across East Africa and globally with back-tested bots, automated risk managers, and real-time live streams.'}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link 
                to={siteSettings.heroCtaLink || "/shop"} 
                className="inline-flex items-center gap-2 text-white" style={{ backgroundColor: "var(--shop-accent)" }} px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all hover:gap-4 hover:shadow-lg hover:shadow-orange-900/20"
              >
                {siteSettings.heroCtaText || "Explore Verified EAs"} <ArrowRight size={18} />
              </Link>
              {siteSettings.heroSecondaryCtaText && (
                <Link 
                  to={siteSettings.heroSecondaryCtaLink || "/live"} 
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all border border-white/20"
                >
                  {siteSettings.heroSecondaryCtaText}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offers / Deals of the Day (Top/Onward) */}
      {offerProducts.length > 0 && (
        <section className="py-16 bg-orange-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-orange-600 text-white p-2 rounded-xl"><Tag size={24} /></div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950">{offersTitle || 'Special Offers'}</h2>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar">
              {offerProducts.map((product) => (
                <div key={product.id} className="relative shrink-0 w-[280px] sm:w-[320px] snap-start">
                  <div className="absolute -top-3 -right-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-3">
                    {product.offerLabel}
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950 mb-4">Top Performing Bots</h2>
              <p className="text-amber-900/70 max-w-2xl">Our most successful automated tools for Forex and Deriv platforms.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Artisan Highlight -> Mission Highlight */}
      <section className="py-24 bg-amber-900 text-amber-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                alt="Data analysis"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6">Fighting the Scum of Influence</h2>
              <p className="text-lg text-amber-50/80 mb-8 leading-relaxed">
                The trading space is filled with fake gurus selling dreams. We don't sell dreams; we sell software. Real algorithms, transparent backtesting, and tools built to give retail traders a fighting chance.
              </p>
              <Link to="/about" className="inline-block border-2 border-amber-50 text-amber-50 hover:bg-amber-50 hover:text-amber-950 px-8 py-3 rounded-full font-bold transition-colors">
                Read Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News & Announcements (Downward) */}
      {news.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="text-orange-600"><Megaphone size={32} /></div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950">News & Announcements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map(item => (
                <div key={item.id} className="bg-amber-50/50 p-8 rounded-3xl border border-amber-900/10 hover:border-orange-200 transition-colors flex flex-col">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-6 shadow-sm" />
                  )}
                  {item.videoUrl && !item.imageUrl && (
                    <video src={item.videoUrl} controls className="w-full h-48 object-cover rounded-xl mb-6 shadow-sm" />
                  )}
                  <div className="text-orange-600 text-sm font-bold mb-3">{new Date(item.date).toLocaleDateString()}</div>
                  <h3 className="text-xl font-bold text-amber-950 mb-4">{item.title}</h3>
                  <p className="text-amber-900/70 whitespace-pre-wrap flex-1">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
