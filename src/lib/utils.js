/* ============================================
   Bacar.az — Yardımcı Fonksiyonlar
   ============================================ */

/**
 * Benzersiz ID oluşturur (8 karakter)
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Tarihi Azerbaycan formatında döndürür
 * @param {string|Date} date
 */
export function formatDate(date) {
  const d = new Date(date);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Bütçeyi AZN formatında gösterir
 * @param {number} min
 * @param {number} max
 */
export function formatBudget(min, max) {
  if (!min && !max) return 'Razılaşmaya görə';
  if (!max || min === max) return `${min} ₼`;
  return `${min} – ${max} ₼`;
}

/**
 * Kategori ikon SVG yolu
 */
export function getCategoryIcon(category) {
  const icons = {
    'dizayn': '🎨',
    'kod': '💻',
    'tərcümə': '🌐',
    'marketinq': '📈',
    'video': '🎬',
  };
  return icons[category?.toLowerCase()] || '📋';
}

/**
 * Class names birleştirici
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
