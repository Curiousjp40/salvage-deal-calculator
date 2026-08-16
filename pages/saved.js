import { useEffect, useState } from 'react';
import { getSavedDeals, removeDeal } from '../lib/savedDeals';
import { TIER_CLASSES } from '../components/VerdictBanner';

function money(value) {
  return typeof value === 'number' ? `$${value.toLocaleString()}` : '—';
}

function DealCard({ deal, onRemove }) {
  const { vehicle = {}, result = {}, url, label, savedAt } = deal;
  const title = label || [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Saved deal';
  const verdict = result.verdict;
  const badgeClasses = TIER_CLASSES[verdict?.tier] || TIER_CLASSES.gray;
  const savedDate = savedAt ? new Date(savedAt).toLocaleDateString() : null;

  return (
    <div className="rounded-lg border border-steel/20 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {savedDate && <p className="text-xs text-steel">Saved {savedDate}</p>}
        </div>
        {verdict && (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses}`}>
            {verdict.label}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-steel">All-in cost</div>
          <div className="font-mono-num text-lg font-semibold">{money(result.totalCost)}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-steel">Suggested max bid</div>
          <div className="font-mono-num text-lg font-semibold">{money(result.suggestedBid)}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-steel">% of clean value</div>
          <div className="font-mono-num text-lg font-semibold">
            {typeof result.pctOfClean === 'number' ? `${result.pctOfClean}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-steel">Projected equity</div>
          <div className="font-mono-num text-lg font-semibold">{money(result.projectedEquity)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-teal underline underline-offset-2"
          >
            View listing →
          </a>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => onRemove(deal.id)}
          className="rounded-md border border-rust px-3 py-1.5 text-sm font-medium text-rust hover:bg-rust/10"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    setDeals(getSavedDeals());
  }, []);

  function handleRemove(id) {
    removeDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Saved deals</h1>
      <p className="mt-2 text-steel">
        Deals you&apos;ve saved from the deal calculator, stored locally in this browser.
      </p>

      {deals.length === 0 ? (
        <p className="mt-8 text-steel">No saved deals yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
