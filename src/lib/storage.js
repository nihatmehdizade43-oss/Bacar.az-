/* ============================================
   Bacar.az — localStorage Yardımcıları
   ============================================ */

const STORAGE_KEYS = {
  USER: 'bacar_user',
  THEME: 'bacar_theme',
  PORTFOLIOS: 'bacar_portfolios',
  JOBS: 'bacar_jobs',
  APPLICATIONS: 'bacar_applications',
  FREELANCERS: 'bacar_freelancers',
};

/**
 * localStorage'dan veri okur
 */
export function getItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`localStorage okuma xətası (${key}):`, error);
    return null;
  }
}

/**
 * localStorage'a veri yazar
 */
export function setItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`localStorage yazma xətası (${key}):`, error);
  }
}

/**
 * localStorage'dan veri siler
 */
export function removeItem(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`localStorage silmə xətası (${key}):`, error);
  }
}

/**
 * Kullanıcı verilerini kaydeder
 */
export function saveUser(user) {
  setItem(STORAGE_KEYS.USER, user);
}

/**
 * Kullanıcı verilerini okur
 */
export function getUser() {
  return getItem(STORAGE_KEYS.USER);
}

/**
 * Kullanıcı verilerini siler
 */
export function removeUser() {
  removeItem(STORAGE_KEYS.USER);
}

/**
 * Tema tercihini kaydeder
 */
export function saveTheme(theme) {
  setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Tema tercihini okur
 */
export function getTheme() {
  return getItem(STORAGE_KEYS.THEME);
}

/**
 * Portfolio kaydeder
 */
export function savePortfolio(portfolio) {
  const portfolios = getItem(STORAGE_KEYS.PORTFOLIOS) || [];
  const existingIndex = portfolios.findIndex(p => p.id === portfolio.id);
  if (existingIndex >= 0) {
    portfolios[existingIndex] = portfolio;
  } else {
    portfolios.push(portfolio);
  }
  setItem(STORAGE_KEYS.PORTFOLIOS, portfolios);
}

/**
 * Tüm portfolioları okur
 */
export function getPortfolios() {
  return getItem(STORAGE_KEYS.PORTFOLIOS) || [];
}

/**
 * Belirli bir portfolioyu okur
 */
export function getPortfolioById(id) {
  const portfolios = getPortfolios();
  return portfolios.find(p => p.id === id) || null;
}

/**
 * Başvuruları kaydeder
 */
export function saveApplication(application) {
  const apps = getItem(STORAGE_KEYS.APPLICATIONS) || [];
  apps.push(application);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
}

/**
 * Kullanıcının başvurularını getirir
 */
export function getUserApplications(userId) {
  const apps = getItem(STORAGE_KEYS.APPLICATIONS) || [];
  return apps.filter(a => a.userId === userId);
}

/**
 * İş ilanlarını kaydeder
 */
export function saveJob(job) {
  const jobs = getItem(STORAGE_KEYS.JOBS) || [];
  jobs.push(job);
  setItem(STORAGE_KEYS.JOBS, jobs);
}

/**
 * Kullanıcının ilanlarını getirir
 */
export function getUserJobs(userId) {
  const jobs = getItem(STORAGE_KEYS.JOBS) || [];
  return jobs.filter(j => j.userId === userId);
}

export { STORAGE_KEYS };
