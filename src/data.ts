import { Product } from './types';

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'Pro EA Forex Bot',
    description: 'Advanced automated trading algorithm designed for major Forex pairs. High accuracy and consistent daily returns. Built-in risk management.',
    price: 199.99,
    category: 'FOREX BOTS',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 312,
    likes: 184,
    views: 1420,
    featured: true,
    stock: 15
  },
  {
    id: 'p-2',
    name: 'Deriv Synthetic Indices Sniper',
    description: 'Specialized bot for Deriv synthetic indices (Boom, Crash, Step Index). Ultra-low latency execution and spike detection algorithms.',
    price: 149.50,
    category: 'DERIV BOTS',
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e1497957?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 184,
    likes: 96,
    views: 890,
    featured: true,
    stock: 2
  },
  {
    id: 'p-3',
    name: 'AutoTrade Pro Software',
    description: 'Complete suite of trading tools and indicators for professional traders. Compatible with MT4/MT5. Real-time market analysis.',
    price: 299.00,
    category: 'SOFTWARE',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1642790106117-e829e1497957?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    rating: 4.7,
    reviewsCount: 215,
    likes: 245,
    views: 2310,
    stock: 25
  },
  {
    id: 'p-4',
    name: 'Scalping Master Bot',
    description: 'High-frequency trading bot for aggressive scalping on lower timeframes. Capitalizes on micro-movements in volatile markets.',
    price: 249.00,
    category: 'FOREX BOTS',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 442,
    likes: 310,
    views: 3150,
    featured: true,
    stock: 0
  },
  {
    id: 'p-5',
    name: 'Deriv Volatility Engine',
    description: 'Automated system exclusively for V75 and V100 indices. Features dynamic lot sizing and trailing stops.',
    price: 175.00,
    category: 'DERIV BOTS',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 127,
    likes: 78,
    views: 640,
    stock: 8
  },
  {
    id: 'p-6',
    name: 'Market Analyzer Dashboard',
    description: 'Multi-currency dashboard software that detects strong trends and reversals across 28 pairs simultaneously.',
    price: 120.00,
    category: 'SOFTWARE',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    rating: 4.8,
    reviewsCount: 92,
    likes: 112,
    views: 980,
    stock: 4
  }
];

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getCategories = () => Array.from(new Set(products.map(p => p.category)));
