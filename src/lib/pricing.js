// Purpose: Centralized pricing config for all 5 sections.
// Same price across all sections — Bacar.az keeps it simple & affordable.

export const LISTING_PLANS = [
  { id: 'daily',   label: 'Günlük',   days: 1,   price: 0.45,  alovluPrice: 1.35  },
  { id: 'weekly',  label: 'Həftəlik', days: 7,   price: 4.56,  alovluPrice: 13.68 },
  { id: 'monthly', label: 'Aylıq',    days: 30,  price: 12.93, alovluPrice: 38.79 },
  { id: 'yearly',  label: 'İllik',    days: 365, price: 47.65, alovluPrice: 142.95 },
];

export const SECTIONS = {
  bacar:  { label: 'BACAR — Freelance',   icon: '💼', color: '#0066FF' },
  ortaq:  { label: 'ORTAQ — Şəriklər',    icon: '🤝', color: '#00C853' },
  rehber: { label: 'RƏHBƏR — Mentorluq', icon: '🎓', color: '#FF6B00' },
  layihe: { label: 'LAYİHƏ — Proyektlər', icon: '🚀', color: '#9C27B0' },
  vizit:  { label: 'VİZİT — Portfolio',   icon: '✨', color: '#FFD600' },
};

export const ALOVLU_MULTIPLIER = 3;

// How many alovlu listings to reach VIP status
export const VIP_THRESHOLD = 5;

export function getPlanById(id) {
  return LISTING_PLANS.find(p => p.id === id);
}

export function calcPrice(planId, isAlovlu = false) {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  return isAlovlu ? plan.alovluPrice : plan.price;
}
