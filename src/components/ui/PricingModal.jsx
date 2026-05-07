'use client';
/* ================================================
   PricingModal — Elan planı seçimi (Günlük→İllik)
   ================================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LISTING_PLANS, SECTIONS, ALOVLU_MULTIPLIER } from '@/lib/pricing';

export default function PricingModal({ section = 'bacar', onSelect, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAlovlu, setIsAlovlu] = useState(false);
  const sectionInfo = SECTIONS[section] || SECTIONS.bacar;

  function handleConfirm() {
    if (!selectedPlan) return;
    const plan = LISTING_PLANS.find(p => p.id === selectedPlan);
    const amount = isAlovlu ? plan.alovluPrice : plan.price;
    onSelect({ planId: selectedPlan, isAlovlu, amount, days: plan.days });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sectionInfo.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Elan Planı Seçin</h2>
                <p className="text-xs text-[var(--text-muted)]">{sectionInfo.label}</p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="px-6 py-4 grid grid-cols-2 gap-3">
            {LISTING_PLANS.map((plan) => {
              const price = isAlovlu ? plan.alovluPrice : plan.price;
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-brand-blue/50'
                  }`}
                >
                  {plan.id === 'monthly' && (
                    <span className="absolute -top-2 left-3 rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold text-white">
                      ÇOX SEÇILƏN
                    </span>
                  )}
                  <p className="font-bold text-[var(--text-primary)]">{plan.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{plan.days} gün</p>
                  <p className={`mt-2 text-xl font-black ${isSelected ? 'text-brand-blue' : 'text-[var(--text-primary)]'}`}>
                    {price.toFixed(2)} ₼
                  </p>
                </button>
              );
            })}
          </div>

          {/* Alovlu Toggle */}
          <div className="px-6 py-3 mx-6 mb-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-sm font-bold text-orange-400">Alovlu Elan</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    3x qiymət — hamının görəcəyi yerdə göstərilir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlovlu(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAlovlu ? 'bg-orange-500' : 'bg-[var(--border-color)]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  isAlovlu ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
            {isAlovlu && selectedPlan && (
              <p className="mt-2 text-xs text-orange-300">
                Seçilmiş plan: {LISTING_PLANS.find(p => p.id === selectedPlan)?.alovluPrice.toFixed(2)} ₼
                ({ALOVLU_MULTIPLIER}x çarpan)
              </p>
            )}
          </div>

          {/* Info */}
          <div className="px-6 pb-4">
            <div className="rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 text-xs text-[var(--text-muted)] space-y-1">
              <p>💳 Ödəniş məlumatları növbəti addımda göstəriləcək</p>
              <p>📋 Ödəniş admin tərəfindən təsdiqlənəcək</p>
              <p>⚡ Elanınız təsdiqləndikdən sonra aktivləşəcək</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--border-color)] py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Geri
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPlan}
              className="flex-1 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition-all hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAlovlu ? '🔥 Alovlu Elan — Davam et' : '✅ Planı Təsdiqlə'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
