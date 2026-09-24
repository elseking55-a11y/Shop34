import React, { useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, Copy, Check, Download, AlertCircle, Play, Pause, Trash2, Sparkles, Filter, ShieldAlert, Cpu, ArrowRight, Zap, Globe, Building2, Key, Lock, Unlock, DollarSign, Smartphone, CheckCircle, Clock } from 'lucide-react';
import { POPULAR_BINS, generateCardFromBin, getBinInfo, parseCardsInput, simulateCardCheck, CardData, isValidLuhn } from '../utils/binChecker';
import { useStore } from '../store';

export default function BinGenerator() {
  const showToast = useStore(state => state.showToast);
  const currentUser = useStore(state => state.currentUser);
  const activeBinAccess = useStore(state => state.activeBinAccess);
  const unlockBinAccessWithCode = useStore(state => state.unlockBinAccessWithCode);
  const decrementBinGeneration = useStore(state => state.decrementBinGeneration);
  const purchaseBinAccess = useStore(state => state.purchaseBinAccess);

  // Active Tab: 'generator' | 'checker' | 'lookup'
  const [activeTab, setActiveTab] = useState<'generator' | 'checker' | 'lookup'>('generator');

  // --- ACCESS CONTROL STATE ---
  const [codeInput, setCodeInput] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<'mpesa' | 'card' | 'crypto'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('0700123456');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // --- BIN GENERATOR STATE ---
  const [binInput, setBinInput] = useState('453211');
  const [genMonth, setGenMonth] = useState('random');
  const [genYear, setGenYear] = useState('random');
  const [customCvv, setCustomCvv] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);
  const [copiedGen, setCopiedGen] = useState(false);

  // --- CARD CHECKER STATE ---
  const [rawInput, setRawInput] = useState('');
  const [checkerCards, setCheckerCards] = useState<CardData[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedLive, setCopiedLive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'dead' | 'unknown'>('all');

  // --- BIN LOOKUP STATE ---
  const [lookupBin, setLookupBin] = useState('414720');

  // Access validation
  const isAdmin = currentUser?.role === 'admin';
  const isAccessValid = isAdmin || (
    activeBinAccess &&
    new Date(activeBinAccess.expiresAt).getTime() > Date.now() &&
    activeBinAccess.generationsLeft > 0
  );

  // Calculate remaining time
  const getTimeRemainingStr = () => {
    if (!activeBinAccess) return '';
    const diffMs = new Date(activeBinAccess.expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  // BIN Info calculation for Generator
  const currentBinInfo = getBinInfo(binInput);
  const lookupBinInfo = getBinInfo(lookupBin);

  // Unlock with Code handler
  const handleUnlockCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    const res = unlockBinAccessWithCode(codeInput);
    if (res.success) {
      showToast(res.message);
      setCodeInput('');
    } else {
      showToast(res.message);
    }
  };

  // Handle $100 Payment Unlock
  const handleSimulatePayment = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      const pass = purchaseBinAccess();
      setIsProcessingPay(false);
      setShowPayModal(false);
      showToast(`$100 Payment Received! BIN Access unlocked (Code: ${pass.code})`);
    }, 1500);
  };

  // Handle Generate Cards
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!binInput.trim()) return;

    if (!isAccessValid) {
      showToast('BIN Access is locked. Please pay $100 or enter an Admin unlock code.');
      setShowPayModal(true);
      return;
    }

    // Attempt generation & decrement limit
    const allowed = decrementBinGeneration(quantity);
    if (!allowed && !isAdmin) {
      showToast('Generation limit reached or access code expired. Please renew access.');
      return;
    }

    const cards: string[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < Math.min(quantity, 50); i++) {
      const cardNumber = generateCardFromBin(binInput);

      // Month
      let mm = genMonth;
      if (mm === 'random') {
        mm = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
      } else {
        mm = mm.padStart(2, '0');
      }

      // Year
      let yyyy = genYear;
      if (yyyy === 'random') {
        yyyy = (currentYear + Math.floor(Math.random() * 5)).toString();
      }

      // CVV
      let cvv = customCvv.trim();
      if (!cvv || cvv.length !== 3) {
        cvv = (Math.floor(100 + Math.random() * 900)).toString();
      }

      cards.push(`${cardNumber}|${mm}|${yyyy}|${cvv}`);
    }

    setGeneratedCards(cards);
    showToast(`Generated ${cards.length} valid cards for BIN ${binInput}!`);
  };

  // Copy Generated Cards
  const handleCopyGenerated = () => {
    if (generatedCards.length === 0) return;
    navigator.clipboard.writeText(generatedCards.join('\n'));
    setCopiedGen(true);
    showToast('All generated cards copied to clipboard!');
    setTimeout(() => setCopiedGen(false), 2000);
  };

  // Send Generated Cards to Checker Tab
  const handleSendToChecker = () => {
    if (generatedCards.length === 0) return;
    const cardsText = generatedCards.join('\n');
    setRawInput(cardsText);
    const parsed = parseCardsInput(cardsText);
    setCheckerCards(parsed);
    setActiveTab('checker');
    showToast('Transferred cards to Live Card Checker!');
  };

  // Parse Cards in Checker from Raw Input
  const handleParseInput = (text: string) => {
    setRawInput(text);
    const parsed = parseCardsInput(text);
    setCheckerCards(parsed);
  };

  // Start Batch Card Verification Process
  const handleStartChecker = async () => {
    if (!isAccessValid) {
      showToast('BIN Checker is locked. Please pay $100 or enter an Admin unlock code.');
      setShowPayModal(true);
      return;
    }

    if (checkerCards.length === 0) {
      if (rawInput.trim()) {
        const parsed = parseCardsInput(rawInput);
        setCheckerCards(parsed);
        if (parsed.length === 0) {
          showToast('No valid card format found in input box.');
          return;
        }
      } else {
        showToast('Please paste or generate cards first.');
        return;
      }
    }

    setIsChecking(true);
    showToast('Starting real-time gateway card verification...');

    for (let i = 0; i < checkerCards.length; i++) {
      setCurrentIndex(i);
      setCheckerCards(prev => prev.map((c, idx) => idx === i ? { ...c, status: 'checking' } : c));
      const res = await simulateCardCheck(checkerCards[i]);
      setCheckerCards(prev => prev.map((c, idx) => idx === i ? {
        ...c,
        status: res.status,
        responseCode: res.code,
        responseMsg: res.message
      } : c));
    }

    setIsChecking(false);
    showToast('Card checking batch completed!');
  };

  // Stats Counters for Checker
  const stats = {
    total: checkerCards.length,
    checked: checkerCards.filter(c => c.status !== 'pending' && c.status !== 'checking').length,
    live: checkerCards.filter(c => c.status === 'live').length,
    dead: checkerCards.filter(c => c.status === 'dead').length,
    unknown: checkerCards.filter(c => c.status === 'unknown').length,
  };

  const progressPercent = stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0;

  // Filtered Checker Cards
  const filteredCheckerCards = checkerCards.filter(card => {
    if (statusFilter === 'all') return true;
    return card.status === statusFilter;
  });

  // Copy Live Cards Only
  const handleCopyLive = () => {
    const liveCards = checkerCards.filter(c => c.status === 'live').map(c => c.raw);
    if (liveCards.length === 0) {
      showToast('No live cards available to copy.');
      return;
    }
    navigator.clipboard.writeText(liveCards.join('\n'));
    setCopiedLive(true);
    showToast(`Copied ${liveCards.length} Live cards!`);
    setTimeout(() => setCopiedLive(false), 2000);
  };

  // Download Live Cards File
  const handleDownloadLive = () => {
    const liveCards = checkerCards.filter(c => c.status === 'live').map(c => `${c.raw} | ${c.brand} | ${c.bank} | ${c.responseCode}`);
    if (liveCards.length === 0) {
      showToast('No live cards available to download.');
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([liveCards.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `live_approved_cards_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Downloaded Live cards list file.');
  };

  return (
    <div className="min-h-screen bg-amber-50/40 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 text-white rounded-3xl p-8 shadow-2xl border border-amber-800/30">
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <CreditCard size={280} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-black uppercase tracking-widest">
                <Cpu size={14} className="animate-spin" /> Luhn Engine v4.2 & Gateway Verification
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                BIN Card Generator & Live Checker
              </h1>

              <p className="text-amber-100/80 text-sm sm:text-base leading-relaxed">
                Generate mathematically valid credit and debit card numbers from any BIN. Test real-time authorization status and Luhn checksums.
              </p>
            </div>

            {/* Access Pass Status Box */}
            <div className="shrink-0 w-full md:w-auto bg-amber-900/50 backdrop-blur-md p-5 rounded-2xl border border-amber-700/50 text-center md:text-right space-y-2">
              {isAdmin ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
                    👑 Admin Mode (Unlimited Access)
                  </div>
                  <p className="text-[11px] text-amber-200/70">No unlock payment or code required for store admin.</p>
                </div>
              ) : isAccessValid ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-black">
                    <Unlock size={14} /> BIN Pass Active ({activeBinAccess?.code})
                  </div>
                  <div className="text-xs text-amber-100 font-bold">
                    ⚡ {activeBinAccess?.generationsLeft} Generations Remaining
                  </div>
                  <div className="text-[11px] text-amber-200/70 flex items-center justify-end gap-1">
                    <Clock size={12} /> {getTimeRemainingStr()}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-300 border border-red-400/30 rounded-full text-xs font-black">
                    <Lock size={14} /> BIN Generator Locked ($100 Pass)
                  </div>
                  <button
                    onClick={() => setShowPayModal(true)}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <DollarSign size={14} /> Pay $100 or Enter Unlock Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-amber-900/10 dark:border-zinc-800 pb-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100/50'
              }`}
            >
              <CreditCard size={18} /> BIN Generator
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'checker'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100/50'
              }`}
            >
              <ShieldCheck size={18} /> Live / Dead Checker
              {stats.live > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {stats.live} Live
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'lookup'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-300 hover:bg-amber-100/50'
              }`}
            >
              <Globe size={18} /> BIN Lookup Tool
            </button>
          </div>
        </div>

        {/* LOCKED GATEWAY OVERLAY IF NOT UNLOCKED AND ATTEMPTING ACCESS */}
        {!isAccessValid && activeTab !== 'lookup' && (
          <div className="bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-orange-500/30 space-y-8 text-center relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Lock size={36} />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                BIN Generator Access Locked
              </h2>

              <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed">
                To use the BIN Card Generator & Live Gateway Checker, you need a <span className="text-orange-400 font-bold">$100 Access Pass</span> or an <span className="text-orange-400 font-bold">Admin Unlock Code</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
              {/* Option 1: Buy Pass $100 */}
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-black rounded-full">
                    Instant Automated Access
                  </div>
                  <h3 className="font-bold text-lg text-white">Pay $100 for BIN Pass</h3>
                  <p className="text-xs text-amber-200/70">
                    Includes 24-Hour Unlimited Access, 100 Card Generations per batch, and Live Gateway Authorization Checker.
                  </p>
                </div>

                <button
                  onClick={() => setShowPayModal(true)}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign size={18} /> Pay $100 & Instant Unlock
                </button>
              </div>

              {/* Option 2: Admin Unlock Code */}
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-[11px] font-black rounded-full">
                    Admin Access Code
                  </div>
                  <h3 className="font-bold text-lg text-white">Enter Unlock Code</h3>
                  <p className="text-xs text-amber-200/70">
                    Received an unlock code from the Store Admin? Enter your authorization code below to activate.
                  </p>
                </div>

                <form onSubmit={handleUnlockCodeSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value)}
                      placeholder="e.g. BIN-PRO-100"
                      className="w-full p-3 pl-9 rounded-xl bg-black/40 border border-amber-500/30 text-white font-mono font-bold text-xs uppercase focus:outline-none focus:border-orange-500"
                    />
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-950 border border-amber-700 hover:bg-amber-900 text-white font-extrabold text-xs rounded-xl transition-all"
                  >
                    Activate Code
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BIN GENERATOR */}
        {activeTab === 'generator' && (
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${!isAccessValid ? 'opacity-40 pointer-events-none select-none filter blur-[1px]' : ''}`}>
            
            {/* Left Column: Generator Form */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-900/10 dark:border-zinc-800">
                <h3 className="font-serif text-xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                  <Zap className="text-orange-600" size={20} /> BIN Generator Setup
                </h3>
              </div>

              {/* Quick Select Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-950 dark:text-zinc-300">
                  Popular Trading BIN Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_BINS.slice(0, 6).map(p => (
                    <button
                      key={p.bin}
                      type="button"
                      onClick={() => setBinInput(p.bin)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        binInput === p.bin
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50 text-amber-900/80 dark:text-zinc-300 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-mono text-xs">{p.bin}xxxxxx</div>
                      <div className="text-[10px] text-amber-900/60 dark:text-zinc-400 truncate">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                {/* BIN Input */}
                <div>
                  <label className="block text-xs font-extrabold text-amber-950 dark:text-zinc-200 mb-1">
                    Enter BIN Number (6 or 8 Digits)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={8}
                      value={binInput}
                      onChange={e => setBinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 453211 or 510510"
                      className="w-full p-3.5 pl-4 pr-24 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono font-bold text-base focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-orange-600/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {currentBinInfo.brand}
                    </span>
                  </div>

                  {/* Realtime BIN Info Chip */}
                  <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold">{currentBinInfo.bank}</span>
                      <span className="block text-[10px] text-amber-900/60 dark:text-zinc-400">
                        {currentBinInfo.type} • {currentBinInfo.level} • {currentBinInfo.country}
                      </span>
                    </div>
                    <span className="text-lg">{currentBinInfo.flag}</span>
                  </div>
                </div>

                {/* Expiry Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">
                      Expiration Month
                    </label>
                    <select
                      value={genMonth}
                      onChange={e => setGenMonth(e.target.value)}
                      className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="random">🎲 Random MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {(i + 1).toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">
                      Expiration Year
                    </label>
                    <select
                      value={genYear}
                      onChange={e => setGenYear(e.target.value)}
                      className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value="random">🎲 Random YYYY</option>
                      {Array.from({ length: 7 }, (_, i) => {
                        const yr = new Date().getFullYear() + i;
                        return (
                          <option key={yr} value={yr.toString()}>
                            {yr}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* CVV & Quantity Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={customCvv}
                      onChange={e => setCustomCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="Random CVV"
                      className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 dark:text-zinc-200 mb-1">
                      Quantity ({quantity} Cards)
                    </label>
                    <select
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value, 10))}
                      className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:border-orange-500"
                    >
                      <option value={5}>5 Cards</option>
                      <option value={10}>10 Cards</option>
                      <option value={20}>20 Cards</option>
                      <option value={50}>50 Cards</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-600/30 transition-all hover:scale-[1.02]"
                >
                  <Sparkles size={18} /> Generate Valid Luhn Cards
                </button>
              </form>
            </div>

            {/* Right Column: Generated Output */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between pb-4 border-b border-amber-900/10 dark:border-zinc-800">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                      <CreditCard className="text-orange-600" size={20} /> Generated Card Output
                    </h3>
                    <p className="text-xs text-amber-900/60 dark:text-zinc-400 mt-0.5">
                      Formatted as <code className="font-mono text-orange-600 dark:text-orange-400">CARD|MM|YYYY|CVV</code> with valid Luhn checksums.
                    </p>
                  </div>

                  {generatedCards.length > 0 && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl">
                      {generatedCards.length} Cards Ready
                    </span>
                  )}
                </div>

                {/* Output Textbox */}
                {generatedCards.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-amber-900/20 dark:border-zinc-700 rounded-2xl bg-amber-50/30 dark:bg-zinc-800/20 text-amber-900/50 dark:text-zinc-500">
                    <CreditCard size={48} className="mb-3 opacity-30" />
                    <p className="font-bold text-sm">No cards generated yet.</p>
                    <p className="text-xs mt-1">Select a BIN and click "Generate Valid Luhn Cards" to create card data.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={12}
                      value={generatedCards.join('\n')}
                      className="w-full p-4 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-950 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none shadow-inner scrollbar-thin"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generatedCards.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-amber-900/10 dark:border-zinc-800">
                  <button
                    onClick={handleCopyGenerated}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 bg-amber-950 dark:bg-zinc-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    {copiedGen ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    {copiedGen ? 'Copied to Clipboard!' : 'Copy All Cards'}
                  </button>

                  <button
                    onClick={handleSendToChecker}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-orange-600/20"
                  >
                    <ShieldCheck size={16} /> Send to Live Card Checker <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CARD CHECKER */}
        {activeTab === 'checker' && (
          <div className={`space-y-8 ${!isAccessValid ? 'opacity-40 pointer-events-none select-none filter blur-[1px]' : ''}`}>
            
            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-md">
                <div className="text-xs font-extrabold uppercase text-amber-900/60 dark:text-zinc-400">Total Cards</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-zinc-100 mt-1">{stats.total}</div>
                <div className="text-[11px] text-amber-900/50 dark:text-zinc-500 mt-1">{stats.checked} Processed</div>
              </div>

              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl shadow-md">
                <div className="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400">Live / Approved</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.live}</div>
                <div className="text-[11px] text-emerald-700/70 dark:text-emerald-300 mt-1">Passed Auth Ping</div>
              </div>

              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl shadow-md">
                <div className="text-xs font-extrabold uppercase text-red-700 dark:text-red-400">Dead / Declined</div>
                <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-1">{stats.dead}</div>
                <div className="text-[11px] text-red-700/70 dark:text-red-300 mt-1">Declined or Invalid</div>
              </div>

              <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl shadow-md">
                <div className="text-xs font-extrabold uppercase text-yellow-700 dark:text-yellow-400">Unknown / Timeout</div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-1">{stats.unknown}</div>
                <div className="text-[11px] text-yellow-700/70 dark:text-yellow-300 mt-1">Referral Required</div>
              </div>
            </div>

            {/* Input & Live Checker Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Input Area */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-zinc-800">
                  <h3 className="font-serif text-lg font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="text-orange-600" size={20} /> Input Cards List
                  </h3>
                  <button
                    onClick={() => {
                      setRawInput('');
                      setCheckerCards([]);
                    }}
                    className="text-xs font-bold text-amber-900/50 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                </div>

                <p className="text-xs text-amber-900/60 dark:text-zinc-400">
                  Paste cards in <code className="font-mono text-orange-600 dark:text-orange-400">CARD|MM|YY|CVV</code> format (one per line).
                </p>

                <textarea
                  rows={10}
                  value={rawInput}
                  onChange={e => handleParseInput(e.target.value)}
                  placeholder="Paste cards here:&#10;4532110098234123|08|2028|412&#10;5105108849201948|11|2027|891"
                  className="w-full p-4 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:border-orange-500 resize-none shadow-inner"
                />

                {/* Progress Bar */}
                {isChecking && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-amber-950 dark:text-zinc-200">
                      <span>Gateway Verification Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-amber-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-600 to-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3 pt-2">
                  {!isChecking ? (
                    <button
                      onClick={handleStartChecker}
                      disabled={checkerCards.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-600/30 transition-all"
                    >
                      <Play size={16} /> Start Gateway Checker ({checkerCards.length} Cards)
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsChecking(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-950 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
                    >
                      <Pause size={16} /> Pause Checker Process
                    </button>
                  )}
                </div>
              </div>

              {/* Results Stream Area */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-amber-900/10 dark:border-zinc-800">
                    <h3 className="font-serif text-lg font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
                      <Cpu className="text-orange-600" size={20} /> Real-Time Live Results Feed
                    </h3>

                    {/* Filters */}
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-amber-950 text-white' : 'text-amber-900/60 dark:text-zinc-400'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setStatusFilter('live')}
                        className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'live' ? 'bg-emerald-600 text-white' : 'text-amber-900/60 dark:text-zinc-400'}`}
                      >
                        Live ({stats.live})
                      </button>
                      <button
                        onClick={() => setStatusFilter('dead')}
                        className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'dead' ? 'bg-red-600 text-white' : 'text-amber-900/60 dark:text-zinc-400'}`}
                      >
                        Dead ({stats.dead})
                      </button>
                    </div>
                  </div>

                  {/* Feed items list */}
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredCheckerCards.length === 0 ? (
                      <div className="text-center py-16 text-amber-900/40 dark:text-zinc-600 border-2 border-dashed border-amber-900/10 dark:border-zinc-800 rounded-2xl">
                        <ShieldAlert size={36} className="mx-auto mb-2 opacity-30" />
                        <p className="font-bold text-sm">No cards matching filter.</p>
                      </div>
                    ) : (
                      filteredCheckerCards.map((card, idx) => {
                        const isLive = card.status === 'live';
                        const isDead = card.status === 'dead';
                        const isCheckingThis = card.status === 'checking';

                        return (
                          <div
                            key={card.id || idx}
                            className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition-all ${
                              isLive
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                                : isDead
                                ? 'bg-red-500/5 border-red-500/20 text-red-950 dark:text-red-300'
                                : isCheckingThis
                                ? 'bg-orange-500/10 border-orange-500/30 text-orange-950 dark:text-orange-200 animate-pulse'
                                : 'bg-amber-50/50 dark:bg-zinc-800/40 border-amber-900/10 dark:border-zinc-800'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-mono font-extrabold text-sm">
                                <span>{card.raw}</span>
                                <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded-full bg-amber-900/10 dark:bg-zinc-700">
                                  {card.brand} • {card.type}
                                </span>
                              </div>
                              <div className="text-[11px] text-amber-900/60 dark:text-zinc-400">
                                {card.bank} ({card.country})
                              </div>
                            </div>

                            <div className="self-end sm:self-center shrink-0">
                              {isCheckingThis && (
                                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
                                  <RefreshCw size={12} className="animate-spin" /> Verifying Gateway...
                                </span>
                              )}
                              {isLive && (
                                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-xl">
                                  <Check size={14} /> LIVE | {card.responseCode}
                                </span>
                              )}
                              {isDead && (
                                <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-xl">
                                  DECLINED
                                </span>
                              )}
                              {card.status === 'unknown' && (
                                <span className="inline-flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-xl">
                                  UNKNOWN / TIMEOUT
                                </span>
                              )}
                              {card.status === 'pending' && (
                                <span className="text-amber-900/40 dark:text-zinc-500 font-medium">Pending...</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Footer Copy & Export Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-amber-900/10 dark:border-zinc-800">
                  <button
                    onClick={handleCopyLive}
                    disabled={stats.live === 0}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    {copiedLive ? <Check size={16} /> : <Copy size={16} />}
                    {copiedLive ? 'Copied Live Cards!' : `Copy Live Cards (${stats.live})`}
                  </button>

                  <button
                    onClick={handleDownloadLive}
                    disabled={stats.live === 0}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 bg-amber-950 dark:bg-zinc-800 hover:bg-amber-900 text-white disabled:opacity-50 font-bold text-xs rounded-xl transition-all"
                  >
                    <Download size={16} /> Download .TXT Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIN LOOKUP TOOL */}
        {activeTab === 'lookup' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="p-3 bg-orange-600/10 text-orange-600 rounded-2xl w-fit mx-auto">
                <Globe size={28} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-amber-950 dark:text-zinc-100">
                Bank Identification Number (BIN) Lookup
              </h2>
              <p className="text-xs text-amber-900/60 dark:text-zinc-400">
                Enter the first 6 digits of any card to inspect issuing bank, card scheme, tier level, and country origin.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={lookupBin}
                onChange={e => setLookupBin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit BIN (e.g. 414720)"
                className="w-full p-4 text-center font-mono font-black text-2xl rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />

              {/* Info Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-amber-50/50 dark:bg-zinc-800/50 rounded-2xl border border-amber-900/10 dark:border-zinc-800">
                  <span className="text-[10px] font-black uppercase text-amber-900/50 dark:text-zinc-400">Card Scheme</span>
                  <div className="font-bold text-base text-amber-950 dark:text-zinc-100 mt-0.5">{lookupBinInfo.brand}</div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-zinc-800/50 rounded-2xl border border-amber-900/10 dark:border-zinc-800">
                  <span className="text-[10px] font-black uppercase text-amber-900/50 dark:text-zinc-400">Card Type</span>
                  <div className="font-bold text-base text-amber-950 dark:text-zinc-100 mt-0.5">{lookupBinInfo.type}</div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-zinc-800/50 rounded-2xl border border-amber-900/10 dark:border-zinc-800">
                  <span className="text-[10px] font-black uppercase text-amber-900/50 dark:text-zinc-400">Tier Level</span>
                  <div className="font-bold text-base text-amber-950 dark:text-zinc-100 mt-0.5">{lookupBinInfo.level}</div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-zinc-800/50 rounded-2xl border border-amber-900/10 dark:border-zinc-800">
                  <span className="text-[10px] font-black uppercase text-amber-900/50 dark:text-zinc-400">Country Origin</span>
                  <div className="font-bold text-base text-amber-950 dark:text-zinc-100 mt-0.5 flex items-center gap-2">
                    {lookupBinInfo.country}
                  </div>
                </div>

                <div className="col-span-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
                  <Building2 className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-900/60 dark:text-amber-300">Issuing Bank</span>
                    <div className="font-extrabold text-sm text-amber-950 dark:text-zinc-100">{lookupBinInfo.bank}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PAYMENT MODAL FOR $100 UNLOCK */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 text-amber-950 dark:text-zinc-100 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/10 dark:border-zinc-800 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute top-5 right-5 text-amber-900/50 dark:text-zinc-500 hover:text-amber-950 dark:hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="p-3 bg-orange-600/10 text-orange-600 rounded-2xl w-fit mx-auto">
                <DollarSign size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold">
                Unlock BIN Pass ($100 USD)
              </h3>
              <p className="text-xs text-amber-900/60 dark:text-zinc-400 max-w-xs mx-auto">
                Select payment method below to purchase 24-hour full access to BIN Generator & Checker.
              </p>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod('mpesa')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'mpesa'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50'
                }`}
              >
                <Smartphone size={18} /> M-Pesa Express
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'card'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50'
                }`}
              >
                <CreditCard size={18} /> Card Pay ($100)
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('crypto')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'crypto'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50'
                }`}
              >
                <Zap size={18} /> Crypto USDT
              </button>
            </div>

            {/* Form Fields */}
            {payMethod === 'mpesa' && (
              <div className="space-y-2 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-xs">
                <label className="block font-bold text-emerald-900 dark:text-emerald-300">
                  M-Pesa Phone Number (KES 13,000 ≈ $100 USD)
                </label>
                <input
                  type="tel"
                  value={mpesaPhone}
                  onChange={e => setMpesaPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full p-3 rounded-xl border border-emerald-500/30 bg-white dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono font-bold"
                />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  An STK push prompt will be sent to your mobile phone to complete payment.
                </p>
              </div>
            )}

            {payMethod === 'card' && (
              <div className="p-4 bg-amber-50 dark:bg-zinc-800/50 rounded-2xl text-xs space-y-2 text-amber-900/80 dark:text-zinc-300">
                <p className="font-bold">Instant Gateway Verification Charge ($100.00)</p>
                <p className="text-[11px]">Supports Visa, Mastercard, and American Express with 3D Secure.</p>
              </div>
            )}

            {payMethod === 'crypto' && (
              <div className="p-4 bg-amber-50 dark:bg-zinc-800/50 rounded-2xl text-xs space-y-1 font-mono text-amber-900/80 dark:text-zinc-300">
                <p className="font-bold">TRC20 USDT Address:</p>
                <code className="block bg-black/20 p-2 rounded text-[11px] break-all select-all text-orange-600">
                  T9xZ3mW8K2pQ7L1vN4rE6yU0jS5aD3fH8g
                </code>
              </div>
            )}

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessingPay}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessingPay ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Confirming $100 Payment...
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> Complete $100 Payment & Unlock Access
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
