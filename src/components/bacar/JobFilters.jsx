/* Bacar.az — Job Filters Sidebar */
'use client';

const CATEGORIES = [
  { value: '', label: 'Hamısı', icon: '📋' },
  { value: 'dizayn', label: 'Dizayn', icon: '🎨' },
  { value: 'kod', label: 'Kod', icon: '💻' },
  { value: 'tərcümə', label: 'Tərcümə', icon: '🌐' },
  { value: 'marketinq', label: 'Marketing', icon: '📈' },
  { value: 'video', label: 'Video', icon: '🎬' },
];

export default function JobFilters({ filters, onChange }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 fade-in-up">
      <h3 className="text-lg font-bold text-[var(--text-primary)]">🔍 Filtrlər</h3>

      {/* Axtarış */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Axtarış</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={e => update('search', e.target.value)}
          placeholder="İş axtar..."
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] input-focus"
        />
      </div>

      {/* Kateqoriya */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Kateqoriya</label>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => update('category', cat.value)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-transparent'
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Büdcə */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Minimum büdcə: <span className="text-brand-blue">{filters.minBudget || 0} AZN</span>
        </label>
        <input
          type="range"
          min="0" max="2000" step="100"
          value={filters.minBudget || 0}
          onChange={e => update('minBudget', Number(e.target.value))}
          className="w-full accent-brand-blue"
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
          <span>0 AZN</span><span>2000 AZN</span>
        </div>
      </div>

      {/* Sıfırla */}
      <button
        onClick={() => onChange({ search: '', category: '', minBudget: 0 })}
        className="w-full py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/5 transition-all"
      >
        Filtrləri sıfırla
      </button>
    </div>
  );
}