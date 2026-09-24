import { create } from 'zustand';
import { CartItem, Product, Order, User, ContactMessage, NewsItem, ChatMessage, LiveStream, Voucher, EmailCampaign, LiveSettings, LiveComment, SiteSettings, MarketActivityItem, BinAccessCode } from './types';

interface StoreState {
  adminToken: string | null;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  loadProducts: () => Promise<void>;
  loadOrders: () => Promise<void>;
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

const defaultSiteSettings: SiteSettings = {
  // General & Branding
  siteName: 'East Africa Store',
  tagline: 'Real products. Real orders. Secure payments.',
  announcementText: '',
  announcementEnabled: true,

  // Appearance & Colors
  primaryTheme: 'amber',
  customAccentColor: '#ea580c',
  
  // Animation & Motion
  animationSpeed: 'normal',
  motionEffectsEnabled: true,

  // Hero Section
  heroBadge: 'SHOP ONLINE • SECURE CHECKOUT',
  heroTitle: 'Shop with confidence',
  heroSubtitle: 'Browse available products, place a real order, and pay securely through the configured payment gateway.',
  heroCtaText: 'Explore Verified EAs',
  heroCtaLink: '/shop',
  heroSecondaryCtaText: '',
  heroSecondaryCtaLink: '/shop',
  heroImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',

  // About Us & Mission
  aboutHeadline: 'A real online store',
  aboutSubtitle: 'We are building Shop34 around real products, real inventory, real payments and real orders.',
  ourStoryTitle: 'Our Story: Fighting the Influence & Selling Truth',
  ourStoryContent: 'The trading space is saturated with fake gurus, rented supercars, and photoshopped profit screenshots. They sell dreams, while followers suffer the reality of blown accounts. We bypass the industry standard of selling illusions. Instead, we equip traders with rigorously back-tested bots, real-time software, and algorithms that actually work in live markets.',
  ourMission: 'To eliminate fake influencer hype and empower retail traders with transparent, automated algorithmic tools that deliver consistent risk-managed results.',
  ourVision: 'To become the premier algorithmic trading hub in East Africa, democratizing access to high-grade quantitative trading software.',
  statTradersCount: '0',
  statAlgorithmsCount: '0',
  value1Title: 'Transparency',
  value1Text: 'Product availability is based on store inventory.',
  value2Title: 'Performance',
  value2Text: 'Prices and stock are controlled by the store administrator.',
  value3Title: 'Reliability',
  value3Text: 'Payments are confirmed by the payment provider before an order is marked paid.',

  // Support & Contact
  supportEmail: 'support@eastafricastore.com',
  supportPhone: '+254 700 123 456',
  supportAddress: 'Nairobi Financial Centre, Kenya',
  workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM (EAT)'
};

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const adminHeaders = () => ({ Authorization: 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('shop34_admin_token') || '' : ''), 'Content-Type': 'application/json' });

export const useStore = create<StoreState>((set, get) => ({
  adminToken: typeof window !== 'undefined' ? localStorage.getItem('shop34_admin_token') : null,
  loginAdmin: async (email, password) => {
    const response = await fetch(API_URL + '/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
    if (!response.ok) return false;
    const data = await response.json();
    localStorage.setItem('shop34_admin_token', data.token);
    set({ adminToken: data.token });
    return true;
  },
  logoutAdmin: () => { localStorage.removeItem('shop34_admin_token'); set({ adminToken:null }); },
  loadProducts: async () => {
    const response = await fetch(API_URL + '/api/products');
    if (response.ok) set({ products: await response.json() });
  },
  loadOrders: async () => {
    const response = await fetch(API_URL + '/api/orders', { headers: adminHeaders() });
    if (response.ok) set({ orders: await response.json() });
  },
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
  products: [],
  orders: [],
  users: [],
  messages: [],
  news: [],
  chatMessages: [],
  offersTitle: 'Special Offers',
  liveStreams: [],
  liveComments: [],
  addLiveComment: (comment) => set((state) => ({
    liveComments: [...state.liveComments, { ...comment, id: `lc-${Date.now()}`, timestamp: new Date().toISOString() }]
  })),
  vouchers: [],
  appliedVoucher: null,
  emailCampaigns: [],
  liveSettings: {
    isEnabled: false,
    scheduleEnabled: false,
    scheduleDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00'
  },
  appViews: 0,
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
  currentUser: null,
  favorites: [],
  
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
  addProduct: (product) => { fetch(API_URL + '/api/products', { method:'POST', headers:adminHeaders(), body:JSON.stringify(product) }).then(async r => { if(r.ok){ const p=await r.json(); set(state=>({products:[p,...state.products]})); } }); },
  updateProduct: (product) => { fetch(API_URL + '/api/products/' + product.id, { method:'PUT', headers:adminHeaders(), body:JSON.stringify(product) }).then(async r => { if(r.ok){ const p=await r.json(); set(state=>({products:state.products.map(x=>x.id===p.id?p:x)})); } }); },
  incrementProductViews: (productId) => set((state) => ({ products: state.products.map(p => p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p) })),
  deleteProduct: (productId) => { fetch(API_URL + '/api/products/' + productId, { method:'DELETE', headers:adminHeaders() }).then(r=>{ if(r.ok) set(state=>({products:state.products.filter(p=>p.id!==productId)})); }); },
  updateOrderStatus: (orderId, status) => { fetch(API_URL + '/api/orders/' + orderId + '/status', { method:'PATCH', headers:adminHeaders(), body:JSON.stringify({status}) }).then(r=>{ if(r.ok) set(state=>({orders:state.orders.map(o=>o.id===orderId?{...o,status}:o)})); }); },
  deleteOrder: (orderId) => { fetch(API_URL + '/api/orders/' + orderId, { method:'DELETE', headers:adminHeaders() }).then(r=>{ if(r.ok) set(state=>({orders:state.orders.filter(o=>o.id!==orderId)})); }); },
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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
