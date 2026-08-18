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

// Pretty-printed JSON of every saved deal, for download/backup.
export function exportDealsAsJson() {
  return JSON.stringify(getSavedDeals(), null, 2);
}

// Merge deals from a previously exported JSON string into what's already
// saved. Entries whose id already exists locally are skipped (so
// re-importing the same file twice is a no-op) rather than duplicated.
export function importDeals(jsonString) {
  if (typeof window === 'undefined') return { imported: 0, error: null };
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { imported: 0, error: 'That file doesn’t look like a saved-deals export.' };
    }

    const existing = getSavedDeals();
    const existingIds = new Set(existing.map((d) => d.id));
    const merged = [...existing];
    let imported = 0;

    parsed.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const id = entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (existingIds.has(id)) return;
      merged.push({ ...entry, id });
      existingIds.add(id);
      imported += 1;
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return { imported, error: null };
  } catch {
    return { imported: 0, error: "Couldn't read that file — make sure it's a JSON export from this app." };
  }
}
