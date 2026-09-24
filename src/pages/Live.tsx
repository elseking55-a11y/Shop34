import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Video, Users, Circle, X, Clock, Ticket, Check, CreditCard, ShoppingBag, Send, Lock, MessageSquare, Shield, Play, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LiveMarketActivity from '../components/LiveMarketActivity';

export default function Live() {
  const { liveStreams, liveComments, addLiveComment, currentUser, liveSettings, vouchers, products, addToCart } = useStore();
  const activeStreams = liveStreams.filter(s => s.isActive);
  const [viewingStream, setViewingStream] = useState<string | null>(null);

  // Video container & Fullscreen state
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(err => console.error(err));
    } else {
      document.exitFullscreen?.().catch(err => console.error(err));
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Unlocked streams state (ID array)
  const [unlockedStreams, setUnlockedStreams] = useState<string[]>([]);

  // Paywall unlock state for paid streams
  const [unlockPromoCode, setUnlockPromoCode] = useState('');
  const [appliedUnlockPromo, setAppliedUnlockPromo] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
  const [unlockPromoError, setUnlockPromoError] = useState('');
  const [isProcessingUnlock, setIsProcessingUnlock] = useState(false);

  // Live Purchase / Support State
  const [tipAmount, setTipAmount] = useState<number>(10);
  const [livePromoCode, setLivePromoCode] = useState('');
  const [appliedLivePromo, setAppliedLivePromo] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
  const [livePromoError, setLivePromoError] = useState('');
  const [isProcessingLivePay, setIsProcessingLivePay] = useState(false);
  const [livePaySuccess, setLivePaySuccess] = useState(false);

  // Live Comment State
  const [commentInput, setCommentInput] = useState('');
  const [commenterName, setCommenterName] = useState(currentUser?.name || 'Guest Trader');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const activeStreamData = liveStreams.find(s => s.id === viewingStream);
  const streamComments = activeStreamData 
    ? liveComments.filter(c => c.streamId === activeStreamData.id)
    : [];

  useEffect(() => {
    if (streamComments.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamComments.length, viewingStream]);

  const isLiveStreamingAvailable = () => {
    if (!liveSettings.isEnabled) return false;
    if (!liveSettings.scheduleEnabled) return true;
    
    const now = new Date();
    const currentDay = now.getDay();
    if (!liveSettings.scheduleDays.includes(currentDay)) return false;

    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (currentTime < liveSettings.startTime || currentTime > liveSettings.endTime) return false;

    return true;
  };

  const isAvailable = isLiveStreamingAvailable();

  const handleApplyLivePromo = () => {
    setLivePromoError('');
    if (!livePromoCode.trim()) return;

    const matched = vouchers.find(v => v.code.toUpperCase() === livePromoCode.trim().toUpperCase() && v.isActive);
    if (matched) {
      setAppliedLivePromo({
        code: matched.code,
        discount: matched.discountValue,
        type: matched.discountType
      });
      setLivePromoCode('');
    } else {
      setLivePromoError('Invalid or expired promo code. Try LIVE30 or WELCOME10');
    }
  };

  const handleApplyUnlockPromo = () => {
    setUnlockPromoError('');
    if (!unlockPromoCode.trim()) return;

    const matched = vouchers.find(v => v.code.toUpperCase() === unlockPromoCode.trim().toUpperCase() && v.isActive);
    if (matched) {
      setAppliedUnlockPromo({
        code: matched.code,
        discount: matched.discountValue,
        type: matched.discountType
      });
      setUnlockPromoCode('');
    } else {
      setUnlockPromoError('Invalid code. Try LIVE30 or WELCOME10');
    }
  };

  const calculateUnlockPrice = (basePrice: number = 5.00) => {
    if (!appliedUnlockPromo) return basePrice;
    if (appliedUnlockPromo.type === 'percentage') {
      return Math.max(0, basePrice - (basePrice * (appliedUnlockPromo.discount / 100)));
    }
    return Math.max(0, basePrice - appliedUnlockPromo.discount);
  };

  const handleUnlockPaidStream = (e: React.FormEvent, streamId: string, basePrice: number = 5.00) => {
    e.preventDefault();
    setIsProcessingUnlock(true);

    setTimeout(() => {
      setIsProcessingUnlock(false);
      setUnlockedStreams(prev => [...prev, streamId]);
    }, 1200);
  };

  const calculateDiscountedTip = () => {
    if (!appliedLivePromo) return tipAmount;
    if (appliedLivePromo.type === 'percentage') {
      return Math.max(0, tipAmount - (tipAmount * (appliedLivePromo.discount / 100)));
    }
    return Math.max(0, tipAmount - appliedLivePromo.discount);
  };

  const handleLivePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingLivePay(true);

    setTimeout(() => {
      setIsProcessingLivePay(false);
      setLivePaySuccess(true);
      setTimeout(() => setLivePaySuccess(false), 4000);
    }, 1500);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeStreamData) return;

    addLiveComment({
      streamId: activeStreamData.id,
      userName: commenterName.trim() || 'Guest Trader',
      text: commentInput.trim()
    });

    setCommentInput('');
  };

  const isStreamUnlocked = (stream?: typeof activeStreamData) => {
    if (!stream) return false;
    if (stream.accessType === 'free' || !stream.accessType) return true;
    if (currentUser?.role === 'admin' || currentUser?.id === stream.broadcasterId) return true;
    return unlockedStreams.includes(stream.id);
  };

  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-zinc-950 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950 dark:text-zinc-100 mb-2 flex items-center gap-3">
              Live Broadcasts {isAvailable && <Circle className="text-red-500 fill-red-500 animate-pulse" size={18} />}
            </h1>
            <p className="text-amber-900/70 dark:text-zinc-400 text-sm sm:text-base">
              Watch live demonstrations for free or host-set paid broadcasts, and chat with viewers in real time.
            </p>
          </div>
          
          {isAvailable && (
            <button 
              onClick={() => navigate('/broadcast')}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md shadow-orange-600/20"
            >
              <Video size={18} />
              Go Live
            </button>
          )}
        </div>

        {!isAvailable ? (
          <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 max-w-2xl mx-auto">
            <Clock size={48} className="mx-auto mb-4 text-amber-900/30 dark:text-zinc-600" />
            <h3 className="text-2xl font-bold text-amber-950 dark:text-zinc-100 mb-2">Live Streaming is Currently Offline</h3>
            <p className="text-amber-900/70 dark:text-zinc-400 px-8">
              {!liveSettings.isEnabled 
                ? "The administrator has disabled live streaming." 
                : `Live streaming is only available on scheduled days between ${liveSettings.startTime} and ${liveSettings.endTime}.`}
            </p>
          </div>
        ) : viewingStream && activeStreamData ? (
          /* Live Stream Viewing Modal / Fullscreen Player */
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-amber-900/10 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                  Currently Watching
                </span>
                {activeStreamData.accessType === 'paid' ? (
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <Lock size={12} /> Paid Stream (${(activeStreamData.price || 5).toFixed(2)})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/40 px-2.5 py-1 rounded-full border border-green-300 dark:border-green-800 flex items-center gap-1">
                    <Check size={12} /> Free Watch
                  </span>
                )}
              </div>

              <button 
                onClick={() => setViewingStream(null)}
                className="flex items-center gap-2 bg-amber-100 dark:bg-zinc-800 hover:bg-amber-200 dark:hover:bg-zinc-700 text-amber-950 dark:text-zinc-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                <X size={16} /> Exit Stream
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player / Paywall Container */}
              <div 
                ref={playerContainerRef}
                className="lg:col-span-2 bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center border border-amber-900/20 dark:border-zinc-800 group"
              >
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <Circle size={8} className="fill-white" /> LIVE
                  </div>
                  <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <Users size={12} /> {activeStreamData.viewers} Viewers
                  </div>
                </div>

                {/* Fullscreen Button */}
                {isStreamUnlocked(activeStreamData) && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-orange-600 text-white p-2.5 rounded-xl border border-white/15 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg"
                    title={isFullscreen ? "Exit Fullscreen" : "Watch Fullscreen"}
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                  </button>
                )}

                {/* If Paid and NOT Unlocked -> Show Paywall */}
                {!isStreamUnlocked(activeStreamData) ? (
                  <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-16 h-16 bg-orange-600/20 text-orange-500 rounded-full flex items-center justify-center mb-4 border border-orange-500/30">
                      <Lock size={32} />
                    </div>

                    <h3 className="font-serif text-2xl font-bold mb-2">Host Set This Broadcast to Pay</h3>
                    <p className="text-white/70 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                      <strong>{activeStreamData.broadcasterName}</strong> marked this stream as premium content. Unlock live viewing for <strong>${(activeStreamData.price || 5.00).toFixed(2)}</strong> or use a promo code.
                    </p>

                    <form onSubmit={(e) => handleUnlockPaidStream(e, activeStreamData.id, activeStreamData.price || 5.00)} className="w-full max-w-sm space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                      {/* Promo Code Input */}
                      <div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Promo Code (e.g. LIVE30)" 
                            value={unlockPromoCode}
                            onChange={e => setUnlockPromoCode(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none uppercase font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleApplyUnlockPromo}
                            className="bg-orange-600 text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-orange-500"
                          >
                            Apply
                          </button>
                        </div>
                        {unlockPromoError && <p className="text-[11px] text-red-400 font-medium mt-1 text-left">{unlockPromoError}</p>}
                        {appliedUnlockPromo && (
                          <p className="text-[11px] text-green-400 font-bold mt-1 text-left">
                            Code {appliedUnlockPromo.code} Applied! ({appliedUnlockPromo.type === 'percentage' ? `-${appliedUnlockPromo.discount}%` : `-$${appliedUnlockPromo.discount}`})
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingUnlock}
                        className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                      >
                        {isProcessingUnlock ? 'Unlocking Stream...' : `Pay $${calculateUnlockPrice(activeStreamData.price || 5.00).toFixed(2)} & Watch Live`}
                      </button>
                    </form>
                  </div>
                ) : (
                  <>
                    {/* Video Overlay with Title & Description */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
                      <h3 className="font-bold text-base sm:text-lg">{activeStreamData.title}</h3>
                      {activeStreamData.description && (
                        <p className="text-xs sm:text-sm text-white/80 mt-1">{activeStreamData.description}</p>
                      )}
                    </div>

                    {/* Simulated WebRTC Feed */}
                    <div className="text-center p-8 z-10 text-white">
                      <Video size={48} className="mx-auto mb-4 text-orange-500 animate-bounce" />
                      <p className="text-xl font-bold mb-2">Live WebRTC Video Feed</p>
                      <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto">
                        Streaming live from {activeStreamData.broadcasterName}'s studio...
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Real-time Live Comments & Chat Section */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm flex flex-col h-[420px] lg:h-auto overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-amber-900/10 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                    <MessageSquare size={16} className="text-orange-600" /> Live Chat ({streamComments.length})
                  </h3>
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                    Real-Time
                  </span>
                </div>

                {/* Comment Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {streamComments.length === 0 ? (
                    <div className="text-center py-12 text-amber-900/40 dark:text-zinc-500">
                      <p>No comments yet. Be the first to say hello!</p>
                    </div>
                  ) : (
                    streamComments.map(c => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-800/60 border border-amber-900/5 dark:border-zinc-700/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-amber-950 dark:text-zinc-200 text-[11px]">{c.userName}</span>
                          <span className="text-[9px] text-amber-900/40 dark:text-zinc-500">
                            {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-amber-900/80 dark:text-zinc-300 leading-relaxed break-words">{c.text}</p>
                      </div>
                    ))
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleSendComment} className="p-3 border-t border-amber-900/10 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                  {!currentUser && (
                    <input 
                      type="text" 
                      placeholder="Your Display Name" 
                      value={commenterName}
                      onChange={e => setCommenterName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-900/15 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 focus:outline-none"
                    />
                  )}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a comment..." 
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold p-2 rounded-xl transition-all"
                      title="Send comment"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Live Stream Grid displaying Title, Description, Broadcaster & Viewers */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                Active Live Streams <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-xs px-2.5 py-0.5 rounded-full font-bold">{activeStreams.length} Live</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeStreams.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800">
                  <Video size={48} className="mx-auto mb-4 text-amber-900/30 dark:text-zinc-600" />
                  <h3 className="text-xl font-bold text-amber-950 dark:text-zinc-100 mb-2">No active broadcasts</h3>
                  <p className="text-amber-900/60 dark:text-zinc-400">Check back later or start your own stream.</p>
                </div>
              ) : (
                activeStreams.map(stream => (
                  <div 
                    key={stream.id} 
                    className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-amber-900/10 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-500 transition-all cursor-pointer group hover:shadow-lg"
                    onClick={() => setViewingStream(stream.id)}
                  >
                    <div className="aspect-video bg-amber-950 relative overflow-hidden flex items-center justify-center">
                      <img 
                        src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600`}
                        alt="Stream thumbnail"
                        className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                        <Circle size={8} className="fill-white" /> LIVE
                      </div>

                      {/* Access Badge (Free vs Paid) */}
                      <div className="absolute top-3 left-20">
                        {stream.accessType === 'paid' ? (
                          <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md uppercase">
                            <Lock size={10} /> Paid ${(stream.price || 5).toFixed(2)}
                          </span>
                        ) : (
                          <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md uppercase">
                            <Check size={10} /> FREE
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                        <Users size={12} /> {stream.viewers} Viewers
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl scale-95 group-hover:scale-100 transition-transform">
                          {stream.accessType === 'paid' ? <Lock size={14} /> : <Play size={14} />}
                          {stream.accessType === 'paid' ? `Unlock ($${(stream.price || 5).toFixed(2)})` : 'Watch Free Live'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-bold mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                          {stream.broadcasterName.charAt(0)}
                        </span>
                        {stream.broadcasterName}
                      </div>

                      <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-zinc-100 mb-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {stream.title}
                      </h3>

                      <p className="text-amber-900/70 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                        {stream.description || 'Watch live demonstration and strategy breakdown from this broadcaster.'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Live Market Activity Category Feed */}
            <div className="mt-16">
              <LiveMarketActivity />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
