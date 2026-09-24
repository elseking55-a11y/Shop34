export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  rating: number;
  reviewsCount: number;
  likes?: number;
  views?: number;
  featured?: boolean;
  status?: 'available' | 'coming_soon';
  stock: number;
  offerLabel?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface Voucher {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  date: string;
  items: number;
  deliveryMethod?: 'email' | 'whatsapp';
  whatsappNumber?: string;
  voucherCode?: string;
  discountApplied?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  joinDate: string;
  canBroadcast?: boolean;
}

export interface LiveComment {
  id: string;
  streamId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface LiveStream {
  id: string;
  broadcasterId: string;
  broadcasterName: string;
  title: string;
  description?: string;
  isActive: boolean;
  viewers: number;
  startedAt: string;
  accessType?: 'free' | 'paid';
  price?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  adminReply?: string;
}

export interface MarketActivityItem {
  id: string;
  category: 'crypto' | 'forex' | 'announcement';
  title: string;
  subtitle: string;
  value?: string;
  status: 'profit' | 'loss' | 'entry' | 'alert' | 'info';
  timestamp: string;
  author?: string;
  isApproved: boolean;
  authorEmail?: string;
}

export interface LiveSettings {
  isEnabled: boolean;
  scheduleEnabled: boolean;
  scheduleDays: number[]; // 0-6 (Sun-Sat)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  recipientCount: number;
}

export interface SiteSettings {
  // General & Branding
  siteName: string;
  tagline: string;
  announcementText: string;
  announcementEnabled: boolean;

  // Appearance & Colors
  primaryTheme: 'amber' | 'emerald' | 'sapphire' | 'crimson' | 'purple' | 'gold';
  customAccentColor?: string;
  
  // Animation & Motion
  animationSpeed: 'normal' | 'fast' | 'slow' | 'minimal';
  motionEffectsEnabled: boolean;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImageUrl: string;

  // About Us & Mission
  aboutHeadline: string;
  aboutSubtitle: string;
  ourStoryTitle: string;
  ourStoryContent: string;
  ourMission: string;
  ourVision: string;
  statTradersCount: string;
  statAlgorithmsCount: string;
  value1Title: string;
  value1Text: string;
  value2Title: string;
  value2Text: string;
  value3Title: string;
  value3Text: string;

  // Support & Contact
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
  workingHours: string;
}

export interface BinAccessCode {
  id: string;
  code: string;
  price: number;
  maxGenerations: number;
  durationHours: number;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedBy?: string;
  generationsLeft: number;
}
