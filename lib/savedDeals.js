// localStorage-backed persistence for saved deals. All reads/writes are
// wrapped in try/catch and only ever called from useEffect or an event
// handler — never at module load or render time — so this stays safe
// under Next.js static-export prerendering, which runs without a browser.

const STORAGE_KEY = 'salvage-calculator-saved-deals';

export function getSavedDeals() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDeal(deal) {
  if (typeof window === 'undefined') return null;
  try {
    const existing = getSavedDeals();
    const record = {
      ...deal,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, record]));
    return record;
  } catch {
    return null;
  }
}

export function removeDeal(id) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedDeals();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((d) => d.id !== id)));
  } catch {
    // ignore — nothing we can do if localStorage is unavailable/full
  }
}
