import { useEffect, useRef, useState } from 'react';
import { getSavedDeals, removeDeal, exportDealsAsJson, importDeals } from '../lib/savedDeals';
import { TIER_CLASSES } from '../components/VerdictBanner';

function money(value) {
  return typeof value === 'number' ? `$${value.toLocaleString()}` : '—';
}

function dealTitle(deal) {
  const vehicle = deal.vehicle || {};
  return (
    deal.label || [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Saved deal'
  );
}

function DealCard({ deal, onRemove, compareChecked, onToggleCompare }) {
  const { result = {}, url, savedAt } = deal;
  const title = dealTitle(deal);
  const verdict = result.verdict;
  const badgeClasses = TIER_CLASSES[verdict?.tier] || TIER_CLASSES.gray;
  const savedDate = savedAt ? new Date(savedAt).toLocaleDateString() : null;

  return (
    <div className="rounded-lg border border-steel/20 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className="print:hidden mt-1.5"
            checked={compareChecked}
            onChange={() => onToggleCompare(deal.id)}
            aria-label={`Compare ${title}`}
          />
          <div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            {savedDate && <p className="text-xs text-steel">Saved {savedDate}</p>}
          </div>
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
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

const COMPARE_ROWS = [
  { key: 'totalCost', label: 'All-in cost', format: money },
  { key: 'suggestedBid', label: 'Suggested max bid', format: money },
  {
    key: 'pctOfClean',
    label: '% of clean value',
    format: (v) => (typeof v === 'number' ? `${v}%` : '—'),
  },
  { key: 'repairCost', label: 'Repair cost', format: money },
  { key: 'resaleValue', label: 'Projected resale value', format: money },
  { key: 'projectedEquity', label: 'Projected equity', format: money },
];

function CompareTable({ deals, onClear }) {
  return (
    <div className="mt-8 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Comparing {deals.length} deals</h2>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-steel hover:bg-steel/5"
        >
          Clear comparison
        </button>
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-steel/20 bg-white">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-steel/20 text-left">
              <th className="p-3 font-medium text-steel">&nbsp;</th>
              {deals.map((deal) => (
                <th key={deal.id} className="p-3 font-display font-semibold">
                  {dealTitle(deal)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.key} className="border-b border-steel/10 last:border-0">
                <td className="p-3 font-medium text-steel">{row.label}</td>
                {deals.map((deal) => (
                  <td key={deal.id} className="font-mono-num p-3">
                    {row.format((deal.result || {})[row.key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 font-medium text-steel">Verdict</td>
              {deals.map((deal) => {
                const verdict = (deal.result || {}).verdict;
                const classes = TIER_CLASSES[verdict?.tier] || TIER_CLASSES.gray;
                return (
                  <td key={deal.id} className="p-3">
                    {verdict ? (
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${classes}`}>
                        {verdict.label}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const [deals, setDeals] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setDeals(getSavedDeals());
  }, []);

  function handleRemove(id) {
    removeDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
  }

  function toggleCompare(id) {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]));
  }

  function handleExport() {
    const json = exportDealsAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salvage-deal-calculator-saved-deals-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const { imported, error } = importDeals(String(reader.result || ''));
      if (error) {
        setImportMessage(error);
      } else {
        setDeals(getSavedDeals());
        setImportMessage(imported > 0 ? `Imported ${imported} deal${imported === 1 ? '' : 's'}.` : 'Nothing new to import — already had all of those.');
      }
    };
    reader.onerror = () => setImportMessage("Couldn't read that file.");
    reader.readAsText(file);
  }

  const comparedDeals = deals.filter((d) => compareIds.includes(d.id));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Saved deals</h1>
          <p className="mt-2 text-steel">
            Deals you&apos;ve saved from the deal calculator, stored locally in this browser. Check
            two or more to compare them, or print the page to take a copy with you.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-steel/30 bg-white px-3 py-2 text-sm font-medium hover:bg-steel/5"
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={deals.length === 0}
            className="rounded-md border border-steel/30 bg-white px-3 py-2 text-sm font-medium hover:bg-steel/5 disabled:opacity-40"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-md border border-steel/30 bg-white px-3 py-2 text-sm font-medium hover:bg-steel/5"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </div>

      {importMessage && <p className="mt-3 text-sm font-medium text-moss print:hidden">{importMessage}</p>}

      {deals.length === 0 ? (
        <p className="mt-8 text-steel">No saved deals yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-1">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onRemove={handleRemove}
              compareChecked={compareIds.includes(deal.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {comparedDeals.length >= 2 && (
        <CompareTable deals={comparedDeals} onClear={() => setCompareIds([])} />
      )}
    </div>
  );
}
