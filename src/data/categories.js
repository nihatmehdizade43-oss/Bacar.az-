/* ============================================================
   Bacar.az — Azərbaycana uyğun 50 iş kateqoriyası
   Top 10 (listingCount > 0) avtomatik öndə göstərilir
   ============================================================ */

export const CATEGORIES = [
  // ── TOP 10 (ən çox elan olan sahələr) ──────────────────────
  { value: 'proqramlasdirma',  label: 'Proqramlaşdırma',     icon: '💻', listingCount: 95 },
  { value: 'dizayn',           label: 'Qrafik Dizayn',        icon: '🎨', listingCount: 88 },
  { value: 'muhasibat',        label: 'Mühasibat & Maliyyə',  icon: '📊', listingCount: 76 },
  { value: 'marketinq',        label: 'Rəqəmsal Marketinq',   icon: '📈', listingCount: 71 },
  { value: 'tercume',          label: 'Tərcümə',              icon: '🌐', listingCount: 64 },
  { value: 'muellimlik',       label: 'Müəllimlik & Dərslər', icon: '🎓', listingCount: 60 },
  { value: 'video',            label: 'Video & Montaj',       icon: '🎬', listingCount: 57 },
  { value: 'smm',              label: 'SMM & Sosial Media',   icon: '📱', listingCount: 53 },
  { value: 'foto',             label: 'Fotoqrafiya',          icon: '📷', listingCount: 49 },
  { value: 'yaziliq',          label: 'Mətn & Kopiraytinq',   icon: '✍️', listingCount: 45 },

  // ── İT & Texnologiya ───────────────────────────────────────
  { value: 'web_dizayn',       label: 'Veb Dizayn',           icon: '🖥️', listingCount: 38 },
  { value: 'mobil_app',        label: 'Mobil Tətbiq',         icon: '📲', listingCount: 34 },
  { value: 'kiber_tehlukesiz', label: 'Kibertəhlükəsizlik',   icon: '🔒', listingCount: 22 },
  { value: 'verilənlər_elmi',  label: 'Data Elm & AI',        icon: '🤖', listingCount: 20 },
  { value: 'seo',              label: 'SEO Optimallaşdırma',  icon: '🔍', listingCount: 18 },
  { value: 'it_destek',        label: 'İT Dəstək',            icon: '🛠️', listingCount: 15 },
  { value: 'ecommerce',        label: 'E-ticarət',            icon: '🛒', listingCount: 14 },

  // ── Təhsil & Müəllimlik ────────────────────────────────────
  { value: 'ingilis_dili',     label: 'İngilis Dili Dərsi',   icon: '🇬🇧', listingCount: 42 },
  { value: 'rus_dili',         label: 'Rus Dili Dərsi',       icon: '🇷🇺', listingCount: 28 },
  { value: 'riyaziyyat',       label: 'Riyaziyyat Dərsi',     icon: '📐', listingCount: 35 },
  { value: 'fizika',           label: 'Fizika Dərsi',         icon: '⚛️', listingCount: 19 },
  { value: 'kimya',            label: 'Kimya Dərsi',          icon: '🧪', listingCount: 17 },
  { value: 'tarix',            label: 'Tarix Dərsi',          icon: '📜', listingCount: 12 },
  { value: 'musiqi',           label: 'Musiqi Dərsi',         icon: '🎵', listingCount: 21 },
  { value: 'rəsm',             label: 'Rəsm & İncəsənət',     icon: '🖌️', listingCount: 16 },

  // ── Biznes & Hüquq ─────────────────────────────────────────
  { value: 'huquqi_xidmet',    label: 'Hüquqi Xidmət',        icon: '⚖️', listingCount: 29 },
  { value: 'biznes_plan',      label: 'Biznes Plan',           icon: '📋', listingCount: 23 },
  { value: 'konsaltinq',       label: 'Konsaltinq',            icon: '💼', listingCount: 25 },
  { value: 'kadr_xidmeti',     label: 'Kadr & HR',             icon: '👥', listingCount: 18 },
  { value: 'vergi',            label: 'Vergi & Audit',         icon: '🧾', listingCount: 20 },

  // ── Yaradıcı Sənət ─────────────────────────────────────────
  { value: 'musiqi_istehsal',  label: 'Musiqi İstehsal',      icon: '🎧', listingCount: 24 },
  { value: 'animasiya',        label: 'Animasiya & Motion',   icon: '🎞️', listingCount: 19 },
  { value: 'illüstrasiya',     label: 'İllüstrasiya',         icon: '🖼️', listingCount: 17 },
  { value: 'oyun_dizayn',      label: 'Oyun Dizaynı',         icon: '🎮', listingCount: 13 },
  { value: '3d_modellemə',     label: '3D Modelleme',         icon: '🧊', listingCount: 11 },
  { value: 'podcast',          label: 'Podcast & Səs',        icon: '🎙️', listingCount: 9  },

  // ── Ev & Təmir ─────────────────────────────────────────────
  { value: 'santexnik',        label: 'Santexnik',             icon: '🔧', listingCount: 31 },
  { value: 'elektrik',         label: 'Elektrikçi',            icon: '⚡', listingCount: 29 },
  { value: 'temir',            label: 'Ev Təmiri',             icon: '🏠', listingCount: 27 },
  { value: 'mebelci',          label: 'Mebelçi',               icon: '🪑', listingCount: 14 },
  { value: 'boya_usda',        label: 'Boya & Suvaq',          icon: '🎨', listingCount: 22 },

  // ── Sağlamlıq & Gözəllik ───────────────────────────────────
  { value: 'psixoloq',         label: 'Psixoloji Dəstək',     icon: '🧠', listingCount: 26 },
  { value: 'dietoloq',         label: 'Dietoloq & Nutrisiya', icon: '🥗', listingCount: 14 },
  { value: 'gozəllik',         label: 'Gözəllik & Makiyaj',   icon: '💅', listingCount: 23 },
  { value: 'idman_merbesi',    label: 'İdman Məşqçisi',       icon: '🏋️', listingCount: 19 },

  // ── Nəqliyyat & Logistika ──────────────────────────────────
  { value: 'kuryer',           label: 'Kuryer & Çatdırılma',  icon: '🚴', listingCount: 33 },
  { value: 'surucu',           label: 'Sürücü & Transfer',    icon: '🚗', listingCount: 28 },
  { value: 'anbar',            label: 'Anbar & Logistika',    icon: '📦', listingCount: 16 },

  // ── Digər ──────────────────────────────────────────────────
  { value: 'fotosessiya',      label: 'Toy & Şənlik Foto',    icon: '💍', listingCount: 37 },
  { value: 'catering',         label: 'Ketering & Aşpaz',     icon: '🍽️', listingCount: 20 },
  { value: 'diger',            label: 'Digər',                icon: '📌', listingCount: 8  },
];

/** İlk 10 — ən çox elan olan sahələr */
export const TOP_CATEGORIES = CATEGORIES
  .slice()
  .sort((a, b) => b.listingCount - a.listingCount)
  .slice(0, 10);

/** Kateqoriya dəyərindən label tap */
export function getCategoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value;
}

/** Kateqoriya dəyərindən icon tap */
export function getCategoryIcon(value) {
  return CATEGORIES.find(c => c.value === value)?.icon ?? '📌';
}
