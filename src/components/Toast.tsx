import { useEffect } from 'react';
import { useStore } from '../store';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Toast() {
  const toastNotification = useStore(state => state.toastNotification);
  const clearToast = useStore(state => state.clearToast);

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastNotification, clearToast]);

  return (
    <AnimatePresence>
      {toastNotification && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md bg-amber-950 text-amber-50 rounded-2xl p-4 shadow-2xl border border-amber-800 flex items-center justify-between gap-3 backdrop-blur-lg bg-opacity-95"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-green-500/20 text-green-400 p-2 rounded-xl shrink-0 border border-green-500/30">
              <CheckCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs uppercase tracking-wider text-green-400">
                Item Added
              </div>
              <p className="text-xs sm:text-sm font-medium text-amber-100 truncate">
                {toastNotification}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/cart"
              onClick={clearToast}
              className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">View Cart</span>
            </Link>
            <button
              onClick={clearToast}
              className="text-amber-200/60 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
