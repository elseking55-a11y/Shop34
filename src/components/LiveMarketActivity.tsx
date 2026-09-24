import React, { useState, useEffect } from 'react';
import { Activity, Coins, TrendingUp, Megaphone, Filter, Search, Clock, RefreshCw, PlusCircle, CheckCircle, ShieldAlert, Sparkles, Send, Check, Trash2, AlertCircle, Eye, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';
import { MarketActivityItem } from '../types';

export type ActivityCategory = 'all' | 'crypto' | 'forex' | 'announcement' | 'pending';

export default function LiveMarketActivity() {
  const { 
    currentUser, 
    marketActivities, 
    addMarketActivity, 
    approveMarketActivity, 
    deleteMarketActivity, 
    showToast 
  } = useStore();

  const isAdmin = currentUser?.role === 'admin';
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  // New Announcement Modal state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState<'crypto' | 'forex' | 'announcement'>('announcement');

  // Simulated live tick for demo
  useEffect(() => {
    if (!isAutoRefreshing) return;

    const interval = setInterval(() => {
      const mockTicks = [
        {
          category: 'crypto' as const,
          title: 'BTC/USD Scalp Order',
          subtitle: `Bot executed Micro Buy @ $${(68000 + Math.random() * 800).toFixed(2)}`,
          value: `+$${(80 + Math.random() * 250).toFixed(2)}`,
          status: 'profit' as const,
          author: 'Deriv Crypto Bot',
          isApproved: true
        },
        {
          category: 'forex' as const,
          title: 'XAU/USD Gold Micro Trade',
          subtitle: `Gold Scalper EA locked +${(10 + Math.random() * 20).toFixed(0)} pips in live session`,
          value: `+${(12 + Math.random() * 15).toFixed(1)} Pips`,
          status: 'profit' as const,
          author: 'Gold Scalper EA',
          isApproved: true
        }
      ];

      const randomTick = mockTicks[Math.floor(Math.random() * mockTicks.length)];
      addMarketActivity(randomTick);
    }, 20000); // add subtle live tick

    return () => clearInterval(interval);
  }, [isAutoRefreshing, addMarketActivity]);

  // Counts
  const pendingCount = marketActivities.filter(a => !a.isApproved).length;

  // Filter items based on user role & category & search query
  const visibleActivities = marketActivities.filter(item => {
    // Admin sees all. Regular users see approved items OR their own unapproved posts
    const isVisibleToUser = isAdmin || item.isApproved || (currentUser && item.authorEmail === currentUser.email);
    if (!isVisibleToUser) return false;

    // Category filter
    let matchesCategory = false;
    if (activeCategory === 'pending') {
      matchesCategory = !item.isApproved;
    } else if (activeCategory === 'all') {
      matchesCategory = true;
    } else {
      matchesCategory = item.category === activeCategory;
    }

    // Search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: marketActivities.filter(a => isAdmin || a.isApproved || (currentUser && a.authorEmail === currentUser.email)).length,
    crypto: marketActivities.filter(a => a.category === 'crypto' && (isAdmin || a.isApproved)).length,
    forex: marketActivities.filter(a => a.category === 'forex' && (isAdmin || a.isApproved)).length,
    announcement: marketActivities.filter(a => a.category === 'announcement' && (isAdmin || a.isApproved)).length,
    pending: pendingCount
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementText.trim()) return;

    const willAutoApprove = isAdmin;

    addMarketActivity({
      category: announcementCategory,
      title: announcementTitle.trim(),
      subtitle: announcementText.trim(),
      value: announcementCategory === 'crypto' ? 'Crypto Alert' : announcementCategory === 'forex' ? 'Forex Signal' : 'Announcement',
      status: announcementCategory === 'announcement' ? 'alert' : 'info',
      author: currentUser?.name || 'Community Member',
      authorEmail: currentUser?.email,
      isApproved: willAutoApprove
    });

    setShowAnnouncementModal(false);
    setAnnouncementTitle('');
    setAnnouncementText('');

    if (willAutoApprove) {
      showToast('Announcement posted LIVE for all users!');
    } else {
      showToast('Announcement submitted! Awaiting Admin review before going live.');
    }
  };

  const handleApprove = (id: string, title: string) => {
    approveMarketActivity(id);
    showToast(`Approved "${title}"! It is now LIVE for all users.`);
  };

  const handleDelete = (id: string, isFake: boolean = false) => {
    deleteMarketActivity(id);
    if (isFake) {
      showToast('Fake announcement rejected and removed.');
    } else {
      showToast('Activity item removed.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-amber-900/5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-amber-900/10 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/30">
              <Activity size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                Live Market Activity <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </h2>
              <p className="text-amber-900/70 dark:text-zinc-400 text-xs sm:text-sm">
                Real-time algorithmic trade executions, Forex signal alerts, and admin-verified announcements.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isAutoRefreshing
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-amber-100 dark:bg-zinc-800 text-amber-900/60 dark:text-zinc-400'
            }`}
            title="Toggle Live Ticker Stream"
          >
            <RefreshCw size={14} className={isAutoRefreshing ? 'animate-spin' : ''} />
            <span>{isAutoRefreshing ? 'Live Stream Active' : 'Stream Paused'}</span>
          </button>

          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
          >
            <PlusCircle size={14} /> Post Announcement
          </button>
        </div>
      </div>

      {/* Admin Moderation Alert Banner (If pending items exist) */}
      {isAdmin && pendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
            <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Admin Moderation Queue: {pendingCount} user post(s) pending review to prevent fake announcements.</span>
          </div>
          <button
            onClick={() => setActiveCategory('pending')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shrink-0 transition-colors"
          >
            Review Pending ({pendingCount})
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-amber-950 dark:bg-orange-600 text-white shadow-md'
                : 'bg-amber-50 dark:bg-zinc-800 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Filter size={14} /> All Feeds
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-amber-200/60 dark:bg-zinc-700 text-amber-950 dark:text-zinc-200'}`}>
              {categoryCounts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('crypto')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'crypto'
                ? 'bg-amber-950 dark:bg-orange-600 text-white shadow-md'
                : 'bg-amber-50 dark:bg-zinc-800 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Coins size={14} className="text-yellow-500" /> Crypto Trades
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeCategory === 'crypto' ? 'bg-white/20 text-white' : 'bg-amber-200/60 dark:bg-zinc-700 text-amber-950 dark:text-zinc-200'}`}>
              {categoryCounts.crypto}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('forex')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'forex'
                ? 'bg-amber-950 dark:bg-orange-600 text-white shadow-md'
                : 'bg-amber-50 dark:bg-zinc-800 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <TrendingUp size={14} className="text-emerald-500" /> Forex Updates
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeCategory === 'forex' ? 'bg-white/20 text-white' : 'bg-amber-200/60 dark:bg-zinc-700 text-amber-950 dark:text-zinc-200'}`}>
              {categoryCounts.forex}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('announcement')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'announcement'
                ? 'bg-amber-950 dark:bg-orange-600 text-white shadow-md'
                : 'bg-amber-50 dark:bg-zinc-800 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Megaphone size={14} className="text-orange-500" /> Announcements
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeCategory === 'announcement' ? 'bg-white/20 text-white' : 'bg-amber-200/60 dark:bg-zinc-700 text-amber-950 dark:text-zinc-200'}`}>
              {categoryCounts.announcement}
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveCategory('pending')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === 'pending'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
              }`}
            >
              <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" /> Pending Review
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900/40 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search feed..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-amber-900/10 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800/80 text-amber-950 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Activity Items List */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        {visibleActivities.length === 0 ? (
          <div className="text-center py-12 bg-amber-50/50 dark:bg-zinc-800/30 rounded-2xl border border-dashed border-amber-900/20 dark:border-zinc-700">
            <Activity size={32} className="mx-auto text-amber-900/30 dark:text-zinc-600 mb-2" />
            <p className="font-bold text-amber-950 dark:text-zinc-300 text-sm">
              {activeCategory === 'pending' ? 'No pending announcements requiring moderation.' : 'No activity items match your filter.'}
            </p>
            <p className="text-xs text-amber-900/60 dark:text-zinc-500 mt-1">Try switching categories or clearing search filters.</p>
          </div>
        ) : (
          visibleActivities.map(item => {
            const isCrypto = item.category === 'crypto';
            const isForex = item.category === 'forex';
            const isAnnouncement = item.category === 'announcement';

            return (
              <div
                key={item.id}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 ${
                  !item.isApproved
                    ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/30'
                    : 'bg-amber-50/30 dark:bg-zinc-800/50 border-amber-900/10 dark:border-zinc-800 hover:bg-amber-100/50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Category Icon Badge */}
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 ${
                      isCrypto
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                        : isForex
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {isCrypto && <Coins size={20} />}
                    {isForex && <TrendingUp size={20} />}
                    {isAnnouncement && <Megaphone size={20} />}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-amber-950 dark:text-zinc-100 text-sm group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h4>

                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCrypto
                            ? 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'
                            : isForex
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                            : 'bg-orange-500/20 text-orange-800 dark:text-orange-300'
                        }`}
                      >
                        {isCrypto ? 'Crypto' : isForex ? 'Forex' : 'Announcement'}
                      </span>

                      {/* Approval status indicator */}
                      {item.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={11} /> Admin Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertCircle size={11} /> Pending Admin Approval
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-amber-900/80 dark:text-zinc-300 leading-relaxed">
                      {item.subtitle}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-amber-900/50 dark:text-zinc-500 pt-0.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={12} /> {item.timestamp}
                      </span>
                      {item.author && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-amber-900/70 dark:text-zinc-400">By {item.author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side controls: Moderation Actions for Admin */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-900/10 dark:border-zinc-800">
                  {item.value && (
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-xl ${
                        item.status === 'profit'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : item.status === 'alert'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.value}
                    </span>
                  )}

                  {/* Admin Moderation Buttons */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {!item.isApproved && (
                        <button
                          onClick={() => handleApprove(item.id, item.title)}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                          title="Approve post and push live for all users"
                        >
                          <Check size={12} /> Approve Live
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item.id, !item.isApproved)}
                        className="flex items-center gap-1 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors"
                        title={!item.isApproved ? "Reject & delete fake announcement" : "Delete announcement"}
                      >
                        <Trash2 size={12} /> {!item.isApproved ? "Reject Fake" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Posting Announcement */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-amber-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-900/10 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-amber-900/10 dark:border-zinc-800">
              <h3 className="font-serif text-xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                <Megaphone className="text-orange-600" size={20} /> Post Announcement
              </h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="text-amber-900/50 dark:text-zinc-400 hover:text-amber-950 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              {/* Notice regarding Admin Moderation */}
              {!isAdmin && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Admin Verification Active:</strong> To prevent fake announcements, your post will be reviewed by an Admin before going live publicly.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">Target Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnnouncementCategory('crypto')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      announcementCategory === 'crypto'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                        : 'border-amber-900/10 dark:border-zinc-800 text-amber-900/60 dark:text-zinc-400'
                    }`}
                  >
                    🪙 Crypto
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnouncementCategory('forex')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      announcementCategory === 'forex'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-amber-900/10 dark:border-zinc-800 text-amber-900/60 dark:text-zinc-400'
                    }`}
                  >
                    📈 Forex
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnouncementCategory('announcement')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      announcementCategory === 'announcement'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400'
                        : 'border-amber-900/10 dark:border-zinc-800 text-amber-900/60 dark:text-zinc-400'
                    }`}
                  >
                    📢 Notice
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">Title / Headline</label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={e => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. BTC/USD Signal Alert or Flash Discount"
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">Details / Description</label>
                <textarea
                  rows={3}
                  required
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Enter details of trade, strategy update, or community announcement..."
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-amber-900/60 dark:text-zinc-400 hover:bg-amber-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20"
                >
                  <Send size={14} /> {isAdmin ? 'Post Directly Live' : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
