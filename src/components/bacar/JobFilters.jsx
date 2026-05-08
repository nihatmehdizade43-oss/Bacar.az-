/* ============================================================
   Bacar.az — JobFilters
   • Top-10 kateqoriya öndə, qalanları "Hamısına bax" açılır
   • Büdcə sürgüsü: 1₼ → 2000₼, axıcı, eksponensial miqyas
   ============================================================ */
'use client';
import { useState } from 'react';
import { CATEGORIES, TOP_CATEGORIES } from '@/data/categories';

/* ── Eksponensial miqyas: 1→2000 dəyər hamar hiss verir ──── */
function sliderToValue(slider) {
  // slider: 0..100  →  value: 1..2000 (exponential)
  const min = 1, max = 2000;
  return Math.round(min * Math.pow(max / min, slider / 100));
}
function valueToSlider(value) {
  const min = 1, max = 2000;
  if (value <= min) return 0;
  if (value >= max) return 100;
  return Math.round((Math.log(value / min) / Math.log(max / min)) * 100);
}

export default function JobFilters({ filters, onChange }) {
  const [showAll, setShowAll] = useState(false);
  const visibleCats = showAll ? CATEGORIES : TOP_CATEGORIES;
  const update = (key, val) => onChange({ ...filters, [key]: val });

  const sliderVal = valueToSlider(filters.minBudget || 0);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-5 fade-in-up">
      <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
        🔍 Filtrlər
      </h3>

      {/* ── Axtarış ──────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
          Axtarış
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={e => update('search', e.target.value)}
          placeholder="İş axtar..."
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-blue/50 transition-colors"
        />
      </div>

      {/* ── Kateqoriyalar ────────────────────────────────── */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
          Sahə {!showAll && <span className="text-[var(--text-muted)] normal-case font-normal">(top 10)</span>}
        </label>

        {/* "Hamısı" düyməsi */}
        <button
          onClick={() => update('category', '')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-all ${
            !filters.category
              ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-transparent'
          }`}
        >
          <span>📋</span> Hamısı
        </button>

        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          {visibleCats.map(cat => (
            <button
              key={cat.value}
              onClick={() => update('category', cat.value)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </span>
              <span className="text-[10px] font-bold opacity-40">{cat.listingCount}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium text-brand-blue hover:bg-brand-blue/5 transition-colors border border-brand-blue/20"
        >
          {showAll ? '▲ Az göstər' : `▼ Hamısını gör (${CATEGORIES.length})`}
        </button>
      </div>

      {/* ── Büdcə sürgüsü ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            Min. Büdcə
          </label>
          <span className="text-sm font-black text-brand-blue tabular-nums">
            {filters.minBudget > 0 ? `${filters.minBudget} ₼` : 'Hər büdcə'}
          </span>
        </div>

        {/* Custom slider */}
        <div className="relative py-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={sliderVal}
            onChange={e => {
              const raw = Number(e.target.value);
              update('minBudget', raw === 0 ? 0 : sliderToValue(raw));
            }}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-blue"
            style={{
              background: `linear-gradient(to right, var(--brand-blue, #0066FF) ${sliderVal}%, var(--border-color, #333) ${sliderVal}%)`
            }}
          />
          {/* Tick markers */}
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
            <span>0</span>
            <span>50₼</span>
            <span>200₼</span>
            <span>500₼</span>
            <span>1K</span>
            <span>2K</span>
          </div>
        </div>

        {/* Sürətli seçim düymələri */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[0, 50, 100, 250, 500, 1000].map(v => (
            <button
              key={v}
              onClick={() => update('minBudget', v)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filters.minBudget === v
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-blue/50'
              }`}
            >
              {v === 0 ? 'Hamısı' : `${v}₼+`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sıfırla ──────────────────────────────────────── */}
      {(filters.search || filters.category || filters.minBudget > 0) && (
        <button
          onClick={() => onChange({ search: '', category: '', minBudget: 0 })}
          className="w-full py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-all"
        >
          ✕ Filtrləri sıfırla
        </button>
      )}
    </div>
  );
}