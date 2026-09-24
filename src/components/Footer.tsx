import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Footer() {
  const appViews = useStore(state => state.appViews);
  const siteSettings = useStore(state => state.siteSettings);

  return (
    <footer className="bg-amber-950 dark:bg-zinc-900 text-amber-50/80 dark:text-zinc-300 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-amber-50">{siteSettings.siteName || 'East Africa Store'}</h3>
            <p className="text-sm leading-relaxed">
              {siteSettings.tagline || 'Equipping retail traders with the algorithms, indicators, and tools they need to succeed.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-amber-200/80 font-semibold">
              <Eye size={16} className="text-orange-400" />
              <span>{appViews.toLocaleString()} Total App Views</span>
            </div>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-amber-50 mb-4 uppercase tracking-wider text-sm">Shop & Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=FOREX BOTS" className="hover:text-white transition-colors">Forex Bots</Link></li>
              <li><Link to="/shop?category=DERIV BOTS" className="hover:text-white transition-colors">Deriv Bots</Link></li>
              <li><Link to="/bin-generator" className="hover:text-white text-orange-400 font-bold transition-colors">💳 BIN Generator & Checker</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-amber-50 mb-4 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-amber-50 mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>{siteSettings.supportAddress || 'Nairobi Financial Centre, Kenya'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>{siteSettings.supportPhone || '+254 700 123 456'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>{siteSettings.supportEmail || 'support@eastafricastore.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-amber-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} {siteSettings.siteName || 'East Africa Store'}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
