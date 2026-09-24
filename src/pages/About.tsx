import { ArrowRight, Target, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store';

export default function About() {
  const siteSettings = useStore(state => state.siteSettings);

  return (
    <div className="flex flex-col min-h-screen bg-amber-50/30 dark:bg-zinc-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative bg-amber-950 text-amber-50 overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000" 
            alt="Trading algorithms" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-950/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: siteSettings.motionEffectsEnabled ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: siteSettings.animationSpeed === 'fast' ? 0.3 : siteSettings.animationSpeed === 'slow' ? 1.0 : siteSettings.animationSpeed === 'minimal' ? 0.1 : 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {siteSettings.aboutHeadline || 'Data-Driven Excellence'}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-amber-50/80 leading-relaxed">
              {siteSettings.aboutSubtitle || 'We started with a simple belief: the retail trading world needs actual, unfiltered truth. No fake gurus, no hidden losses—just math, data, and algorithms.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-b border-amber-900/10 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-orange-50 dark:bg-zinc-800/60 border border-orange-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
                <Target size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-amber-950 dark:text-zinc-100 mb-3">Our Mission</h3>
              <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed font-medium">
                {siteSettings.ourMission || 'To eliminate fake influencer hype and empower retail traders with transparent, automated algorithmic tools that deliver consistent risk-managed results.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-amber-950 dark:bg-amber-800 text-amber-50 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                <Compass size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-amber-950 dark:text-zinc-100 mb-3">Our Vision</h3>
              <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed font-medium">
                {siteSettings.ourVision || 'To become the premier algorithmic trading hub in East Africa, democratizing access to high-grade quantitative trading software.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950 dark:text-zinc-100 mb-6">
                {siteSettings.ourStoryTitle || 'Our Story: Fighting the Influence'}
              </h2>
              <p className="text-lg text-amber-900/80 dark:text-zinc-300 mb-8 leading-relaxed whitespace-pre-line">
                {siteSettings.ourStoryContent || 'The trading space is saturated with fake gurus, rented supercars, and photoshopped profit screenshots. They sell dreams, while their followers suffer the reality of blown accounts. We bypass the industry standard of selling illusions. Instead, we equip traders with rigorously back-tested bots, real-time software, and algorithms that actually work in live markets.'}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-900/10 dark:border-zinc-800">
                <div>
                  <div className="font-serif text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">{siteSettings.statTradersCount || '1,500+'}</div>
                  <div className="font-bold text-amber-950 dark:text-zinc-100">Active Traders</div>
                </div>
                <div>
                  <div className="font-serif text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">{siteSettings.statAlgorithmsCount || '8'}</div>
                  <div className="font-bold text-amber-950 dark:text-zinc-100">Proven Algorithms</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1531281816503-4f938d8ceccb?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-zinc-900 border-t border-amber-900/10 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950 dark:text-zinc-100 mb-4">What We Stand For</h2>
            <p className="text-lg text-amber-900/70 dark:text-zinc-400">Our core values guide every decision we make, from algorithm design to customer support.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-amber-50 dark:bg-zinc-800 p-8 rounded-3xl text-center border border-amber-900/5 dark:border-zinc-700">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="font-bold text-xl text-amber-950 dark:text-zinc-100 mb-4">{siteSettings.value1Title || 'Transparency'}</h3>
              <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed">{siteSettings.value1Text || 'We provide real backtests, live account tracking, and verified results. No hidden metrics.'}</p>
            </div>
            <div className="bg-amber-50 dark:bg-zinc-800 p-8 rounded-3xl text-center border border-amber-900/5 dark:border-zinc-700">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="font-bold text-xl text-amber-950 dark:text-zinc-100 mb-4">{siteSettings.value2Title || 'Performance'}</h3>
              <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed">{siteSettings.value2Text || 'Our algorithms are optimized for consistent execution in volatile environments, maximizing risk-adjusted returns.'}</p>
            </div>
            <div className="bg-amber-50 dark:bg-zinc-800 p-8 rounded-3xl text-center border border-amber-900/5 dark:border-zinc-700">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="font-bold text-xl text-amber-950 dark:text-zinc-100 mb-4">{siteSettings.value3Title || 'Reliability'}</h3>
              <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed">{siteSettings.value3Text || 'Code that works. Our bots are built to run 24/5 on VPS environments with zero downtime.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-950 dark:text-zinc-100 mb-6">Automate Your Edge</h2>
          <p className="text-lg text-amber-900/80 dark:text-zinc-300 mb-10 leading-relaxed">
            Ready to explore our collection of high-performance trading bots and software?
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:gap-4 hover:shadow-lg hover:shadow-orange-900/20"
          >
            Explore the Shop <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
