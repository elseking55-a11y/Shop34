import React, { useState } from 'react';
import { CreditCard, Key, Plus, Copy, Check, Trash2, Clock, Zap, ShieldCheck, AlertCircle, DollarSign, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminBinUnlockCodes() {
  const binAccessCodes = useStore(state => state.binAccessCodes);
  const createBinAccessCode = useStore(state => state.createBinAccessCode);
  const deleteBinAccessCode = useStore(state => state.deleteBinAccessCode);
  const showToast = useStore(state => state.showToast);

  // Form state
  const [price, setPrice] = useState<number>(100);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [maxGenerations, setMaxGenerations] = useState<number>(100);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = createBinAccessCode({
      price,
      durationHours,
      maxGenerations
    });
    showToast(`Created BIN Unlock Code: ${newCode.code}`);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast(`Copied code ${code} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-500/30">
            <Key size={14} /> BIN Generator Access Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-orange-400">
            BIN Unlock Access Codes
          </h1>
          <p className="text-amber-200/80 text-xs sm:text-sm mt-1 max-w-xl">
            Generate and manage $100 unlock authorization codes for the BIN Card Generator & Live Checker. Control expiration time and maximum generation limits.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-900/40 p-4 rounded-2xl border border-amber-800/50">
          <div className="p-3 bg-orange-600/20 text-orange-400 rounded-xl">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-xs text-amber-200/70 font-semibold uppercase">Total Generated Codes</div>
            <div className="text-2xl font-black text-white">{binAccessCodes.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-amber-900/10 dark:border-zinc-800">
            <Plus className="text-orange-600" size={20} />
            <h2 className="font-serif text-xl font-bold text-amber-950 dark:text-zinc-100">
              Generate New Unlock Code
            </h2>
          </div>

          <form onSubmit={handleGenerateCode} className="space-y-5">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-zinc-300 mb-1.5">
                Unlock Price ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900/50 dark:text-zinc-500 font-bold">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <p className="text-[11px] text-amber-900/60 dark:text-zinc-400 mt-1">
                Standard rate is $100. Set 0 for free promotional passes.
              </p>
            </div>

            {/* Expiration Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-zinc-300 mb-1.5">
                Expiration Duration
              </label>
              <select
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold text-xs focus:outline-none focus:border-orange-500"
              >
                <option value={1}>1 Hour (Quick Pass)</option>
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours (1 Day)</option>
                <option value={48}>48 Hours (2 Days)</option>
                <option value={168}>168 Hours (7 Days)</option>
                <option value={720}>720 Hours (30 Days)</option>
              </select>
            </div>

            {/* Generation Limit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-zinc-300 mb-1.5">
                Max BIN Card Generations
              </label>
              <select
                value={maxGenerations}
                onChange={e => setMaxGenerations(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/30 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold text-xs focus:outline-none focus:border-orange-500"
              >
                <option value={10}>10 Card Generations</option>
                <option value={50}>50 Card Generations</option>
                <option value={100}>100 Card Generations</option>
                <option value={250}>250 Card Generations</option>
                <option value={500}>500 Card Generations</option>
                <option value={1000}>1000 Card Generations</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Key size={18} /> Create BIN Unlock Code
            </button>
          </form>
        </div>

        {/* Right Column: Code Table & List */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-amber-900/10 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-amber-900/10 dark:border-zinc-800">
            <h2 className="font-serif text-xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Key className="text-orange-600" size={20} /> Generated Access Codes List
            </h2>
            <span className="text-xs font-bold bg-amber-100 dark:bg-zinc-800 text-amber-900 dark:text-zinc-300 px-3 py-1 rounded-full">
              {binAccessCodes.length} Codes
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {binAccessCodes.length === 0 ? (
              <div className="text-center py-12 text-amber-900/40 dark:text-zinc-500">
                <Key size={40} className="mx-auto mb-2 opacity-30" />
                <p className="font-bold text-sm">No access codes created yet.</p>
                <p className="text-xs mt-1">Use the generator on the left to issue a $100 BIN unlock code.</p>
              </div>
            ) : (
              binAccessCodes.map((c) => {
                const isExpired = new Date(c.expiresAt).getTime() < Date.now();
                const isDepleted = c.generationsLeft <= 0;

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-amber-900/10 dark:border-zinc-800 bg-amber-50/30 dark:bg-zinc-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:border-orange-500/30"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-500/20">
                          {c.code}
                        </span>
                        
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 text-[10px] font-bold">
                            Expired
                          </span>
                        ) : isDepleted ? (
                          <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 text-[10px] font-bold">
                            Depleted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                            Active Pass
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-amber-900/70 dark:text-zinc-400 font-medium pt-1">
                        <span className="flex items-center gap-1 font-bold text-amber-950 dark:text-zinc-200">
                          <DollarSign size={12} className="text-emerald-600" /> ${c.price} USD
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Zap size={12} className="text-orange-500" /> {c.generationsLeft} / {c.maxGenerations} gens left
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {c.durationHours}h validity
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleCopy(c.code, c.id)}
                        className="px-3 py-2 bg-amber-950 dark:bg-zinc-800 text-white text-xs font-bold rounded-xl hover:bg-amber-900 transition-all flex items-center gap-1.5"
                      >
                        {copiedId === c.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedId === c.id ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        onClick={() => {
                          deleteBinAccessCode(c.id);
                          showToast(`Revoked code ${c.code}`);
                        }}
                        className="p-2 text-amber-900/40 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 rounded-xl transition-all"
                        title="Delete Code"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
