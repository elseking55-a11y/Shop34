import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Video, X, Lock, CheckCircle, Clock, Tag, Ticket, Check, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Broadcast() {
  const { currentUser, unlockBroadcasting, startStream, endStream, liveStreams, liveSettings, vouchers } = useStore();
  const [hasPaid, setHasPaid] = useState(currentUser?.canBroadcast || currentUser?.role === 'admin');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamAccess, setStreamAccess] = useState<'free' | 'paid'>('free');
  const [streamPrice, setStreamPrice] = useState<number>(5.00);
  const [isLive, setIsLive] = useState(false);

  // Fullscreen state
  const studioContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!studioContainerRef.current) return;
    if (!document.fullscreenElement) {
      studioContainerRef.current.requestFullscreen?.().catch(err => console.error(err));
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

  // Promo Code State for Live Unlock
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
  const [promoError, setPromoError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentStreamId = useRef<string | null>(null);
  const navigate = useNavigate();

  const BASE_PRICE = 30.00;

  const calculateFinalPrice = () => {
    if (!appliedPromo) return BASE_PRICE;
    if (appliedPromo.type === 'percentage') {
      return Math.max(0, BASE_PRICE - (BASE_PRICE * (appliedPromo.discount / 100)));
    }
    return Math.max(0, BASE_PRICE - appliedPromo.discount);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const matched = vouchers.find(v => v.code.toUpperCase() === promoCodeInput.trim().toUpperCase() && v.isActive);
    if (matched) {
      setAppliedPromo({
        code: matched.code,
        discount: matched.discountValue,
        type: matched.discountType
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid or expired promo code. Try LIVE30 or WELCOME10.');
    }
  };

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

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (currentStreamId.current) {
        endStream(currentStreamId.current);
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment API (Paystack / Stripe)
    setTimeout(() => {
      unlockBroadcasting();
      setHasPaid(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleGoLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamTitle) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      startStream(streamTitle, streamDescription, streamAccess, streamPrice);
      // Find the ID that was just created
      const latest = useStore.getState().liveStreams[0];
      currentStreamId.current = latest.id;
      
      setIsLive(true);
    } catch (err) {
      console.error("Failed to access camera", err);
      alert("Could not access camera or microphone. Please allow permissions.");
    }
  };

  const handleEndStream = () => {
    stopCamera();
    if (currentStreamId.current) {
      endStream(currentStreamId.current);
      currentStreamId.current = null;
    }
    setIsLive(false);
  };

  if (!isAvailable) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="py-20 text-center bg-white rounded-3xl border border-amber-900/10 max-w-2xl mx-auto w-full shadow-sm">
          <Clock size={48} className="mx-auto mb-4 text-amber-900/30" />
          <h3 className="text-2xl font-bold text-amber-950 mb-2">Live Streaming is Currently Offline</h3>
          <p className="text-amber-900/70 px-8 mb-6">
            {!liveSettings.isEnabled 
              ? "The administrator has disabled live streaming." 
              : `Live streaming is only available on scheduled days between ${liveSettings.startTime} and ${liveSettings.endTime}.`}
          </p>
          <button onClick={() => navigate('/live')} className="px-6 py-2 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-amber-950 mb-4">Please log in to broadcast</h2>
      </div>
    );
  }

  // Payment Wall for standard users
  if (!hasPaid) {
    const finalPrice = calculateFinalPrice();

    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-amber-50/30 p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-amber-900/10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-amber-950 mb-3">Unlock Live Broadcasting</h1>
          <p className="text-amber-900/70 mb-6 leading-relaxed text-sm sm:text-base">
            Broadcast live to our community. One-time unlock fee is <strong>$30.00</strong>.
          </p>

          {/* Promo Code Section */}
          <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-900/10 text-left">
            <label className="block text-xs font-bold text-amber-950 uppercase mb-2 flex items-center gap-1.5">
              <Ticket size={14} className="text-orange-600" /> Have a Promo Code?
            </label>
            
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-green-100 border border-green-300 text-green-800 p-3 rounded-xl text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  <Check size={16} /> Code <strong>{appliedPromo.code}</strong> Applied!
                </span>
                <span className="text-xs bg-green-200 px-2 py-0.5 rounded-full">
                  {appliedPromo.type === 'percentage' ? `-${appliedPromo.discount}%` : `-$${appliedPromo.discount}`}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. LIVE30 or WELCOME10"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 uppercase font-bold text-amber-950"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {promoError && <p className="text-xs text-red-600 font-medium mt-1.5">{promoError}</p>}
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <input required type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              <input required type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
            </div>
            
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors mt-4 text-base shadow-lg shadow-orange-600/20"
            >
              {isProcessing ? 'Processing Payment...' : `Pay $${finalPrice.toFixed(2)} & Unlock`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Broadcaster Studio
  return (
    <div className="min-h-screen bg-neutral-900 p-4 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        
        <div className="flex justify-between items-center mb-6 text-white bg-black/40 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center font-bold text-xl">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{currentUser.name}</h2>
              <p className="text-white/60 text-sm">Broadcaster Studio</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/live')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Exit Studio"
          >
            <X size={24} />
          </button>
        </div>

        <div ref={studioContainerRef} className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 flex flex-col items-center justify-center">
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${isLive ? 'opacity-100' : 'opacity-0 hidden'}`}
          />

          {isLive && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-6 right-6 z-20 bg-black/70 hover:bg-orange-600 text-white p-2.5 rounded-xl border border-white/15 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg"
              title={isFullscreen ? "Exit Fullscreen" : "Watch Fullscreen"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          )}
          
          {!isLive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-neutral-900 z-10 overflow-y-auto">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-6">
                <Video size={36} />
              </div>
              <form onSubmit={handleGoLive} className="w-full max-w-md space-y-5">
                <div>
                  <label className="block text-white/80 font-bold mb-1.5 text-sm">Stream Title <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={streamTitle}
                    onChange={e => setStreamTitle(e.target.value)}
                    placeholder="e.g., Live Bot Demo & Market Q&A" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 font-medium text-base"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-1.5 text-sm">Stream Description <span className="text-white/40 font-normal">(Shown to viewers)</span></label>
                  <textarea 
                    rows={2}
                    value={streamDescription}
                    onChange={e => setStreamDescription(e.target.value)}
                    placeholder="Describe what you will demonstrate or discuss during this live broadcast..." 
                    className="w-full px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 font-medium text-sm"
                  />
                </div>

                {/* Free vs Paid Access Setting */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                  <label className="block text-white font-bold text-xs uppercase tracking-wider mb-2">Stream Access Setting</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setStreamAccess('free')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        streamAccess === 'free'
                          ? 'bg-green-600 text-white border-green-500 shadow-md'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400"></span> Free for Everyone
                    </button>
                    <button
                      type="button"
                      onClick={() => setStreamAccess('paid')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        streamAccess === 'paid'
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Lock size={12} /> Pay-To-Watch
                    </button>
                  </div>

                  {streamAccess === 'paid' ? (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <label className="block text-white/80 text-xs font-bold mb-1">Set Ticket Price ($ USD)</label>
                      <input 
                        type="number"
                        min="1"
                        step="0.5"
                        value={streamPrice}
                        onChange={e => setStreamPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-[11px] text-white/50 mt-1">Viewers will pay this fee (or use promo codes) to unlock live access.</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-green-400 font-medium">Any user can join and watch your live stream for free!</p>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg transition-colors shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)]"
                >
                  Start Camera & Go Live
                </button>
              </form>
            </div>
          )}

          {isLive && (
            <div className="absolute top-6 left-6 flex flex-col gap-2 max-w-md">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse text-xs">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div> LIVE BROADCAST
                </div>
                <div className="bg-black/60 backdrop-blur-md text-white font-medium px-3 py-1.5 rounded-full border border-white/10 text-xs">
                  1 Viewer
                </div>
              </div>
              <div className="bg-black/70 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10">
                <h3 className="font-bold text-sm text-white">{streamTitle}</h3>
                {streamDescription && <p className="text-xs text-white/70 mt-1 line-clamp-2">{streamDescription}</p>}
              </div>
            </div>
          )}

          {isLive && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <button 
                onClick={handleEndStream}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold shadow-2xl transition-colors flex items-center gap-2"
              >
                End Stream
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
