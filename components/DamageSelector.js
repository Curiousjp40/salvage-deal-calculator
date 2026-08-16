import { DAMAGE_CATEGORIES, SEVERITY_LEVELS } from '../data/damage';

// selections: { [categoryId]: severityId | undefined }
export default function DamageSelector({ selections, onChange }) {
  function toggle(categoryId) {
    const next = { ...selections };
    if (next[categoryId]) {
      delete next[categoryId];
    } else {
      next[categoryId] = 'moderate';
    }
    onChange(next);
  }

  function setSeverity(categoryId, severityId) {
    onChange({ ...selections, [categoryId]: severityId });
  }

  return (
    <ul className="divide-y divide-steel/15 overflow-hidden rounded-lg border border-steel/20 bg-white">
      {DAMAGE_CATEGORIES.map((category) => {
        const active = Boolean(selections[category.id]);
        return (
          <li key={category.id} className="p-4">
            <button
              type="button"
              onClick={() => toggle(category.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    active ? 'border-amber-600 bg-amber text-ink' : 'border-steel/40 bg-white'
                  }`}
                >
                  {active ? '✓' : ''}
                </span>
                <span className="font-medium">{category.label}</span>
              </span>
              <span className="font-mono-num text-sm text-steel">
                ${category.low.toLocaleString()}–${category.high.toLocaleString()}
              </span>
            </button>

            {active && (
              <div className="mt-3 pl-8">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-steel">
                  Severity
                </label>
                <select
                  className="w-full max-w-xs rounded-md border border-steel/30 bg-white px-3 py-2 sm:w-auto"
                  value={selections[category.id]}
                  onChange={(e) => setSeverity(category.id, e.target.value)}
                >
                  {SEVERITY_LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
