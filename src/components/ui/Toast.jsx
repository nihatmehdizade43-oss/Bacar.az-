/* ============================================
   Bacar.az — Toast Bildirimi Bileşeni
   ============================================ */
'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

const TOAST_TYPES = {
  success: {
    icon: '✅',
    bg: 'bg-green-500/10 border-green-500/30',
    text: 'text-green-500',
  },
  error: {
    icon: '❌',
    bg: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-500',
  },
  info: {
    icon: 'ℹ️',
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-500',
  },
  warning: {
    icon: '⚠️',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    text: 'text-yellow-500',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    const timeoutId = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timeoutRefs.current.delete(id);
    }, duration);
    timeoutRefs.current.set(id, timeoutId);
  }, []);

  const removeToast = useCallback((id) => {
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const activeTimeouts = timeoutRefs.current;
    return () => {
      activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeouts.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3 max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => {
            const style = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-lg ${style.bg}`}
              >
                <span className="text-lg">{style.icon}</span>
                <p className={`text-sm font-medium ${style.text}`}>{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
