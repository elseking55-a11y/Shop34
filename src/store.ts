import { create } from 'zustand';
import { CartItem, Product, Order, User, ContactMessage, NewsItem, ChatMessage, LiveStream, Voucher, EmailCampaign, LiveSettings, LiveComment, SiteSettings, MarketActivityItem, BinAccessCode } from './types';
import { products as initialProducts } from './data';

interface StoreState {
  // Theme Toggle
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Client
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Toast Notifications
  toastNotification: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;

  // Customer features
  currentUser: User | null;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  placeOrder: (orderData: any) => void;
  sendMessage: (messageData: any) => void;

  // Admin Data
  products: Product[];
  orders: Order[];
  users: User[];
  messages: ContactMessage[];
  news: NewsItem[];
  chatMessages: ChatMessage[];
  offersTitle: string;
  liveStreams: LiveStream[];
  liveComments: LiveComment[];
  addLiveComment: (comment: Omit<LiveComment, 'id' | 'timestamp'>) => void;
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  emailCampaigns: EmailCampaign[];
  liveSettings: LiveSettings;
  appViews: number;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  marketActivities: MarketActivityItem[];
  addMarketActivity: (item: Omit<MarketActivityItem, 'id' | 'timestamp'>) => void;
  approveMarketActivity: (id: string) => void;
  deleteMarketActivity: (id: string) => void;

  // BIN Access Control
  binAccessCodes: BinAccessCode[];
  activeBinAccess: BinAccessCode | null;
  createBinAccessCode: (options?: { price?: number; maxGenerations?: number; durationHours?: number }) => BinAccessCode;
  deleteBinAccessCode: (id: string) => void;
  unlockBinAccessWithCode: (code: string) => { success: boolean; message: string };
  decrementBinGeneration: (count?: number) => boolean;
  purchaseBinAccess: () => BinAccessCode;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  incrementProductViews: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  markMessageRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  replyMessage: (messageId: string, reply: string) => void;
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (newsId: string) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setOffersTitle: (title: string) => void;
  setAppViews: (views: number) => void;
  unlockBroadcasting: () => void;
  startStream: (title: string, description?: string, accessType?: 'free' | 'paid', price?: number) => void;
  endStream: (streamId: string) => void;
  updateLiveSettings: (settings: LiveSettings) => void;
  addVoucher: (voucher: Omit<Voucher, 'id'>) => void;
  deleteVoucher: (voucherId: string) => void;
  toggleVoucherActive: (voucherId: string) => void;
  applyVoucher: (voucher: Voucher | null) => void;
  sendEmailCampaign: (campaign: Omit<EmailCampaign, 'id' | 'sentAt'>) => void;
}

// Mock Admin Data
const mockOrders: Order[] = [
  { id: 'ORD-1007', customerName: 'David Miller', email: 'david@example.com', total: 349.99, status: 'processing', date: '2026-09-15T14:20:00Z', items: 2 },
  { id: 'ORD-1006', customerName: 'Emma Watson', email: 'emma@example.com', total: 199.50, status: 'pending', date: '2026-09-15T09:45:00Z', items: 1 },
  { id: 'ORD-1005', customerName: 'Frank Wright', email: 'frank@example.com', total: 420.00, status: 'shipped', date: '2026-09-14T16:10:00Z', items: 3 },
  { id: 'ORD-1004', customerName: 'Grace Lee', email: 'grace@example.com', total: 275.00, status: 'delivered', date: '2026-09-13T11:00:00Z', items: 2 },
  { id: 'ORD-1001', customerName: 'Alice Smith', email: 'alice@example.com', total: 125.50, status: 'delivered', date: '2026-09-12T10:00:00Z', items: 3 },
  { id: 'ORD-1002', customerName: 'Bob Jones', email: 'bob@example.com', total: 310.00, status: 'shipped', date: '2026-09-11T14:30:00Z', items: 2 },
  { id: 'ORD-1003', customerName: 'Carol White', email: 'carol@example.com', total: 189.99, status: 'delivered', date: '2026-09-10T09:15:00Z', items: 1 },
  { id: 'ORD-1000', customerName: 'Henry Ford', email: 'henry@example.com', total: 240.00, status: 'delivered', date: '2026-09-09T18:00:00Z', items: 2 },
];

const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'customer', joinDate: '2026-08-01' },
  { id: 'u2', name: 'Bob Jones', email: 'bob@example.com', role: 'customer', joinDate: '2026-08-15' },
  { id: 'admin1', name: 'Store Admin', email: 'admin@eastafricastore.com', role: 'admin', joinDate: '2026-01-01' }
];

const mockMessages: ContactMessage[] = [
  { id: 'msg1', name: 'Charlie', email: 'charlie@test.com', subject: 'Wholesale', message: 'Do you offer bulk discounts on Coffee?', date: '2026-09-13T08:00:00Z', read: false },
  { id: 'msg2', name: 'Diana', email: 'diana@test.com', subject: 'Order Status', message: 'When will my package arrive?', date: '2026-09-12T16:45:00Z', read: true }
];

const defaultSiteSettings: SiteSettings = {
  // General & Branding
  siteName: 'East Africa Store',
  tagline: 'Authentic Forex Bots, Premium Signals & Market Tools',
  announcementText: '⚡ Limited Offer: Use code LIVE30 for 30% discount on all Forex EAs! Free Instant Email Delivery.',
  announcementEnabled: true,

  // Appearance & Colors
  primaryTheme: 'amber',
  customAccentColor: '#ea580c',
  
  // Animation & Motion
  animationSpeed: 'normal',
  motionEffectsEnabled: true,

  // Hero Section
  heroBadge: 'DATA-DRIVEN ALGORITHMIC TRADING',
  heroTitle: 'Automate Your Trading Edge with Verified EAs',
  heroSubtitle: 'Empowering traders across East Africa and globally with back-tested bots, automated risk managers, and real-time live streams.',
  heroCtaText: 'Explore Verified EAs',
  heroCtaLink: '/shop',
  heroSecondaryCtaText: 'Watch Live Demo',
  heroSecondaryCtaLink: '/live',
  heroImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',

  // About Us & Mission
  aboutHeadline: 'Data-Driven Excellence in Algorithmic Trading',
  aboutSubtitle: 'We started with a simple belief: the retail trading world needs actual, unfiltered truth. No fake gurus, no hidden losses—just math, data, and algorithms.',
  ourStoryTitle: 'Our Story: Fighting the Influence & Selling Truth',
  ourStoryContent: 'The trading space is saturated with fake gurus, rented supercars, and photoshopped profit screenshots. They sell dreams, while followers suffer the reality of blown accounts. We bypass the industry standard of selling illusions. Instead, we equip traders with rigorously back-tested bots, real-time software, and algorithms that actually work in live markets.',
  ourMission: 'To eliminate fake influencer hype and empower retail traders with transparent, automated algorithmic tools that deliver consistent risk-managed results.',
  ourVision: 'To become the premier algorithmic trading hub in East Africa, democratizing access to high-grade quantitative trading software.',
  statTradersCount: '1,500+',
  statAlgorithmsCount: '8',
  value1Title: 'Transparency',
  value1Text: 'We provide real backtests, live account tracking, and verified results. No hidden metrics.',
  value2Title: 'Performance',
  value2Text: 'Our algorithms are optimized for consistent execution in volatile environments, maximizing risk-adjusted returns.',
  value3Title: 'Reliability',
  value3Text: 'Code that works. Our bots are built to run 24/5 on VPS environments with zero downtime.',

  // Support & Contact
  supportEmail: 'support@eastafricastore.com',
  supportPhone: '+254 700 123 456',
  supportAddress: 'Nairobi Financial Centre, Kenya',
  workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM (EAT)'
};

const defaultBinAccessCodes: BinAccessCode[] = [
  {
    id: 'bac-1',
    code: 'BIN-PRO-100',
    price: 100,
    maxGenerations: 500,
    durationHours: 24,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
    generationsLeft: 500
  },
  {
    id: 'bac-2',
    code: 'VIP-FREE-PASS',
    price: 0,
    maxGenerations: 100,
    durationHours: 72,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
    generationsLeft: 100
  }
];

const defaultMarketActivities: MarketActivityItem[] = [
  {
    id: 'act-1',
    category: 'crypto',
    title: 'BTC/USD Volatility EA',
    subtitle: 'Algorithmic Long Order Executed @ $68,420.00 | Take Profit $69,800.00',
    value: '+$640.00',
    status: 'profit',
    timestamp: 'Just now',
    author: 'Deriv AutoBot v4.2',
    isApproved: true
  },
  {
    id: 'act-2',
    category: 'forex',
    title: 'XAU/USD Gold Scalper EA',
    subtitle: 'Buy Limit Triggered @ $2,650.40 | Target $2,675.00 | Risk 1:3',
    value: '+28 Pips',
    status: 'profit',
    timestamp: '3 mins ago',
    author: 'Gold Scalper EA',
    isApproved: true
  },
  {
    id: 'act-3',
    category: 'announcement',
    title: '⚡ Flash Discount Alert!',
    subtitle: 'Use code LIVE30 during today live stream to unlock 30% off all Forex & Deriv Bots!',
    value: '30% OFF',
    status: 'alert',
    timestamp: '8 mins ago',
    author: 'East Africa Store Admin',
    isApproved: true
  },
  {
    id: 'act-4',
    category: 'crypto',
    title: 'ETH/USD Grid Scalper',
    subtitle: 'Closed Position with +4.2% Gain | 10x Leverage | Execution 0.12s',
    value: '+$310.20',
    status: 'profit',
    timestamp: '12 mins ago',
    author: 'Crypto Grid Bot',
    isApproved: true
  },
  {
    id: 'act-5',
    category: 'forex',
    title: 'EUR/USD Asian Session Bot',
    subtitle: 'Position Auto-Closed @ +18 Pips | Zero Slippage Execution',
    value: '+18 Pips',
    status: 'info',
    timestamp: '18 mins ago',
    author: 'Asian Session EA',
    isApproved: true
  },
  {
    id: 'act-6',
    category: 'announcement',
    title: '🎉 Trader Milestone Reached',
    subtitle: 'VIP Trader Sam from Nairobi surpassed $10,000 profit milestone using Volatility 75 EA!',
    value: '$10,000+',
    status: 'info',
    timestamp: '25 mins ago',
    author: 'Community Leaderboard',
    isApproved: true
  },
  {
    id: 'act-7',
    category: 'announcement',
    title: 'Unverified Community Post',
    subtitle: 'User post claiming 1000% daily gains without backtest proof. Awaiting admin review.',
    value: 'Pending Review',
    status: 'alert',
    timestamp: 'Just now',
    author: 'Trader Alex',
    isApproved: false
  }
];

export const useStore = create<StoreState>((set, get) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    });
  },

  cart: [],
  products: initialProducts.map(p => ({ ...p, status: 'available' as const })),
  orders: mockOrders,
  users: mockUsers,
  messages: mockMessages,
  news: [
    { id: 'n1', title: 'Holiday Special!', content: 'Enjoy our new holiday offers on all coffee products.', date: new Date().toISOString() }
  ],
  chatMessages: [
    { id: 'c1', sender: 'agent', text: 'Hello! How can I help you today?', timestamp: new Date().toISOString() }
  ],
  offersTitle: 'Special Offers',
  liveStreams: [
    { id: 'live-1', broadcasterId: 'admin1', broadcasterName: 'AlgoTrade Official', title: 'Live Q&A: Deriv Bot Strategy Demo', description: 'Watch us back-test automated trading bots live and ask questions in real-time!', isActive: true, viewers: 142, startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), accessType: 'free' },
    { id: 'live-2', broadcasterId: 'u2', broadcasterName: 'Forex Mastery Kenya', title: 'VIP Scalping & Live Trade Signals', description: 'Exclusive live scalping masterclass demonstrating high probability entries and risk management.', isActive: true, viewers: 88, startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), accessType: 'paid', price: 5.00 },
    { id: 'live-3', broadcasterId: 'u3', broadcasterName: 'Nairobi Trading Hub', title: 'Automated Bot Setup & Config Walkthrough', description: 'Step-by-step setup walkthrough for beginners using automated trading software.', isActive: true, viewers: 204, startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), accessType: 'free' }
  ],
  liveComments: [
    { id: 'lc-1', streamId: 'live-1', userName: 'John Trader', text: 'Does this Deriv bot work on Volatility 100 index?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'lc-2', streamId: 'live-1', userName: 'Sarah FX', text: 'Yes! It works great on V100 and V75.', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
    { id: 'lc-3', streamId: 'live-1', userName: 'AlgoTrade Official', text: 'Welcome everyone! Drop your questions in the chat.', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() }
  ],
  addLiveComment: (comment) => set((state) => ({
    liveComments: [...state.liveComments, { ...comment, id: `lc-${Date.now()}`, timestamp: new Date().toISOString() }]
  })),
  vouchers: [
    { id: 'v1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), isActive: true },
    { id: 'v2', code: 'LIVE30', discountType: 'percentage', discountValue: 30, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), isActive: true },
    { id: 'v3', code: 'PROMO15', discountType: 'fixed', discountValue: 15, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), isActive: true }
  ],
  appliedVoucher: null,
  emailCampaigns: [],
  liveSettings: {
    isEnabled: true,
    scheduleEnabled: false,
    scheduleDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00'
  },
  appViews: 128500,
  siteSettings: (() => {
    try {
      const saved = localStorage.getItem('siteSettings');
      return saved ? { ...defaultSiteSettings, ...JSON.parse(saved) } : defaultSiteSettings;
    } catch {
      return defaultSiteSettings;
    }
  })(),
  updateSiteSettings: (settings) => set((state) => {
    const updated = { ...state.siteSettings, ...settings };
    try {
      localStorage.setItem('siteSettings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { siteSettings: updated };
  }),
  
  // Mock customer session
  currentUser: mockUsers[0],
  favorites: ['p-1', 'p-4'], // some mock favorites
  
  toggleFavorite: (productId) => set((state) => {
    const isFav = state.favorites.includes(productId);
    const updatedFavorites = isFav 
      ? state.favorites.filter(id => id !== productId) 
      : [...state.favorites, productId];
    
    const updatedProducts = state.products.map(p => {
      if (p.id === productId) {
        const currentLikes = p.likes ?? 0;
        return { ...p, likes: isFav ? Math.max(0, currentLikes - 1) : currentLikes + 1 };
      }
      return p;
    });

    return { favorites: updatedFavorites, products: updatedProducts };
  }),
  isFavorite: (productId) => {
    return get().favorites.includes(productId);
  },
  placeOrder: (orderData) => set((state) => {
    let discount = 0;
    const subtotal = get().cartTotal();
    
    if (state.appliedVoucher) {
      if (state.appliedVoucher.discountType === 'percentage') {
        discount = subtotal * (state.appliedVoucher.discountValue / 100);
      } else {
        discount = Math.min(subtotal, state.appliedVoucher.discountValue);
      }
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: state.currentUser?.name || orderData.name,
      email: state.currentUser?.email || orderData.email,
      total: Math.max(0, subtotal - discount), // Exact payment without shipping
      status: 'pending',
      date: new Date().toISOString(),
      items: get().cartCount(),
      deliveryMethod: orderData.deliveryMethod || 'email',
      whatsappNumber: orderData.whatsappNumber,
      voucherCode: state.appliedVoucher?.code,
      discountApplied: discount
    };
    return { 
      orders: [newOrder, ...state.orders],
      cart: [], // Clear cart on success
      appliedVoucher: null // Clear voucher
    };
  }),
  sendMessage: (messageData) => set((state) => {
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
      date: new Date().toISOString(),
      read: false
    };
    return { messages: [newMessage, ...state.messages] };
  }),

  toastNotification: null,
  showToast: (message) => set({ toastNotification: message }),
  clearToast: () => set({ toastNotification: null }),

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      const newCart = existingItem
        ? state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...state.cart, { product, quantity }];

      return {
        cart: newCart,
        toastNotification: `Successfully added ${product.name} to cart!`
      };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) return;
    set((state) => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),
  cartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  cartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Admin Actions
  addProduct: (product) => set((state) => ({
    products: [{ ...product, id: `p-${Date.now()}` }, ...state.products]
  })),
  updateProduct: (product) => set((state) => ({
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  incrementProductViews: (productId) => set((state) => ({
    products: state.products.map(p => p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p)
  })),
  deleteProduct: (productId) => set((state) => ({
    products: state.products.filter(p => p.id !== productId)
  })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
  })),
  deleteOrder: (orderId) => set((state) => ({
    orders: state.orders.filter(o => o.id !== orderId)
  })),
  markMessageRead: (messageId) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, read: true } : m)
  })),
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m.id !== messageId)
  })),
  addNews: (news) => set((state) => ({
    news: [{ ...news, id: `n-${Date.now()}` }, ...state.news]
  })),
  updateNews: (news) => set((state) => ({
    news: state.news.map(n => n.id === news.id ? news : n)
  })),
  deleteNews: (newsId) => set((state) => ({
    news: state.news.filter(n => n.id !== newsId)
  })),
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...msg, id: `c-${Date.now()}`, timestamp: new Date().toISOString() }]
  })),
  setOffersTitle: (title) => set({ offersTitle: title }),
  setAppViews: (views) => set({ appViews: views }),
  unlockBroadcasting: () => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, canBroadcast: true } : null
  })),
  startStream: (title, description, accessType = 'free', price = 0) => set((state) => {
    if (!state.currentUser) return state;
    const newStream: LiveStream = {
      id: `live-${Date.now()}`,
      broadcasterId: state.currentUser.id,
      broadcasterName: state.currentUser.name,
      title,
      description,
      isActive: true,
      viewers: 1,
      startedAt: new Date().toISOString(),
      accessType,
      price: accessType === 'paid' ? price : 0
    };
    return { liveStreams: [newStream, ...state.liveStreams] };
  }),
  endStream: (streamId) => set((state) => ({
    liveStreams: state.liveStreams.map(s => s.id === streamId ? { ...s, isActive: false } : s)
  })),
  addVoucher: (voucher) => set((state) => ({
    vouchers: [{ ...voucher, id: `v-${Date.now()}` }, ...state.vouchers]
  })),
  deleteVoucher: (voucherId) => set((state) => ({
    vouchers: state.vouchers.filter(v => v.id !== voucherId)
  })),
  toggleVoucherActive: (voucherId) => set((state) => ({
    vouchers: state.vouchers.map(v => v.id === voucherId ? { ...v, isActive: !v.isActive } : v),
    appliedVoucher: state.appliedVoucher?.id === voucherId ? null : state.appliedVoucher // invalidate if applied
  })),
  applyVoucher: (voucher) => set({ appliedVoucher: voucher }),
  sendEmailCampaign: (campaign) => set((state) => ({
    emailCampaigns: [{ ...campaign, id: `emp-${Date.now()}`, sentAt: new Date().toISOString() }, ...state.emailCampaigns]
  })),
  replyMessage: (messageId, reply) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, adminReply: reply, read: true } : m)
  })),
  updateLiveSettings: (settings) => set({ liveSettings: settings }),

  marketActivities: (() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('marketActivities') : null;
      return saved ? JSON.parse(saved) : defaultMarketActivities;
    } catch {
      return defaultMarketActivities;
    }
  })(),
  addMarketActivity: (itemData) => set((state) => {
    const newItem: MarketActivityItem = {
      ...itemData,
      id: `act-${Date.now()}`,
      timestamp: 'Just now'
    };
    const updated = [newItem, ...state.marketActivities];
    try {
      if (typeof window !== 'undefined') localStorage.setItem('marketActivities', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { marketActivities: updated };
  }),
  approveMarketActivity: (id) => set((state) => {
    const updated = state.marketActivities.map(a => a.id === id ? { ...a, isApproved: true } : a);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('marketActivities', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { marketActivities: updated };
  }),
  deleteMarketActivity: (id) => set((state) => {
    const updated = state.marketActivities.filter(a => a.id !== id);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('marketActivities', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { marketActivities: updated };
  }),

  // BIN Access Control Implementation
  binAccessCodes: (() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('binAccessCodes') : null;
      return saved ? JSON.parse(saved) : defaultBinAccessCodes;
    } catch {
      return defaultBinAccessCodes;
    }
  })(),
  activeBinAccess: (() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('activeBinAccess') : null;
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (new Date(parsed.expiresAt).getTime() < Date.now() || parsed.generationsLeft <= 0) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  })(),
  createBinAccessCode: (options) => {
    const price = options?.price ?? 100;
    const maxGen = options?.maxGenerations ?? 100;
    const durHours = options?.durationHours ?? 24;
    const code = `BIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAccessCode: BinAccessCode = {
      id: `bac-${Date.now()}`,
      code,
      price,
      maxGenerations: maxGen,
      durationHours: durHours,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + durHours * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      generationsLeft: maxGen
    };

    set((state) => {
      const updated = [newAccessCode, ...state.binAccessCodes];
      try {
        if (typeof window !== 'undefined') localStorage.setItem('binAccessCodes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { binAccessCodes: updated };
    });

    return newAccessCode;
  },
  deleteBinAccessCode: (id) => set((state) => {
    const updated = state.binAccessCodes.filter(c => c.id !== id);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('binAccessCodes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return { binAccessCodes: updated };
  }),
  unlockBinAccessWithCode: (codeStr) => {
    const cleanCode = codeStr.trim().toUpperCase();
    const codes = get().binAccessCodes;
    const matched = codes.find(c => c.code.toUpperCase() === cleanCode);

    if (!matched) {
      return { success: false, message: 'Invalid unlock code. Please check or request a code from Admin.' };
    }

    if (new Date(matched.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This unlock code has expired. Please acquire a new $100 BIN pass.' };
    }

    if (matched.generationsLeft <= 0) {
      return { success: false, message: 'This unlock code has reached its maximum generation usage limit.' };
    }

    const activeObj: BinAccessCode = { ...matched, isUsed: true };
    set({ activeBinAccess: activeObj });

    try {
      if (typeof window !== 'undefined') localStorage.setItem('activeBinAccess', JSON.stringify(activeObj));
    } catch (e) {
      console.error(e);
    }

    return { success: true, message: `Access granted! ${activeObj.generationsLeft} generations available.` };
  },
  decrementBinGeneration: (count = 1) => {
    const active = get().activeBinAccess;
    const currentUser = get().currentUser;

    if (currentUser?.role === 'admin') {
      return true;
    }

    if (!active) return false;

    if (new Date(active.expiresAt).getTime() < Date.now()) {
      set({ activeBinAccess: null });
      if (typeof window !== 'undefined') localStorage.removeItem('activeBinAccess');
      return false;
    }

    if (active.generationsLeft < count) {
      return false;
    }

    const updatedActive = {
      ...active,
      generationsLeft: active.generationsLeft - count
    };

    set((state) => {
      const updatedCodes = state.binAccessCodes.map(c => c.id === active.id ? updatedActive : c);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeBinAccess', JSON.stringify(updatedActive));
          localStorage.setItem('binAccessCodes', JSON.stringify(updatedCodes));
        }
      } catch (e) {
        console.error(e);
      }
      return { activeBinAccess: updatedActive, binAccessCodes: updatedCodes };
    });

    return true;
  },
  purchaseBinAccess: () => {
    const newPass = get().createBinAccessCode({ price: 100, maxGenerations: 100, durationHours: 24 });
    const activeObj = { ...newPass, isUsed: true };
    set({ activeBinAccess: activeObj });
    try {
      if (typeof window !== 'undefined') localStorage.setItem('activeBinAccess', JSON.stringify(activeObj));
    } catch (e) {
      console.error(e);
    }
    return activeObj;
  }
}));
