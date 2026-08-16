import { useEffect, useState } from 'react';
import VehicleSelector, { TRIMS } from '../components/VehicleSelector';
import DamageSelector from '../components/DamageSelector';
import DesirabilityBadge from '../components/DesirabilityBadge';
import ResultCard from '../components/ResultCard';
import VerdictBanner from '../components/VerdictBanner';
import { segmentFor, hybridPremiumFor } from '../data/vehicles';
import { STATE_TAX_RATES } from '../data/stateTax';
import { estimateCleanValue, estimateRepairCost, computeDeal } from '../lib/calculations';
import { saveDeal } from '../lib/savedDeals';

const currentYear = new Date().getFullYear();

const STATE_LABELS = Object.keys(STATE_TAX_RATES).sort();

function NumberField({ label, value, onChange, step = 1, min = 0, prefix, suffix, caption }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-steel">{label}</label>
      <div className="flex items-center rounded-md border border-steel/30 bg-white px-3">
        {prefix && <span className="text-steel">{prefix}</span>}
        <input
          type="number"
          step={step}
          min={min}
          className="w-full bg-transparent py-2 outline-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="text-steel">{suffix}</span>}
      </div>
      {caption && <p className="mt-1 text-xs text-steel">{caption}</p>}
    </div>
  );
}

export default function DealPage() {
  const [vehicle, setVehicle] = useState({
    year: currentYear - 5,
    make: '',
    model: '',
    segment: '',
    mileage: 60000,
    trim: 'mid',
  });
  const [cleanValueOverride, setCleanValueOverride] = useState('');
  const [damageSelections, setDamageSelections] = useState({});

  const [bid, setBid] = useState(5000);
  const [auctionFeeAmt, setAuctionFeeAmt] = useState(450);
  const [documentationFee, setDocumentationFee] = useState(139);
  const [transactionFee, setTransactionFee] = useState(349);
  const [shipping, setShipping] = useState(350);
  const [state, setState] = useState('');
  const [titleFees, setTitleFees] = useState(150);
  const [rebuiltDiscountPct, setRebuiltDiscountPct] = useState(25);
  const [targetPct, setTargetPct] = useState(65);

  // Bid ceiling lock (for tracking a live auction against a hard max).
  const [lockedMax, setLockedMax] = useState(null);
  const [maxBidInput, setMaxBidInput] = useState('');
  const [liveBid, setLiveBid] = useState('');

  // Save this deal.
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [saveUrl, setSaveUrl] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const isRealModel = vehicle.make && vehicle.model && vehicle.model !== '__other__';
  const segment = isRealModel ? segmentFor(vehicle.make, vehicle.model) : vehicle.segment;
  const hybridPremium = isRealModel ? hybridPremiumFor(vehicle.make, vehicle.model) : 1;

  const autoCleanValue = estimateCleanValue({
    segment,
    year: vehicle.year,
    mileage: vehicle.mileage,
    trimMultiplier: TRIMS[vehicle.trim]?.multiplier,
    hybridPremium,
  });

  const cleanValue =
    cleanValueOverride !== '' && !Number.isNaN(Number(cleanValueOverride))
      ? Number(cleanValueOverride)
      : autoCleanValue;

  const { estimate: repairCost } = estimateRepairCost(damageSelections);
  const taxRate = state ? STATE_TAX_RATES[state] : 0;

  const deal = computeDeal({
    cleanValue,
    bid,
    auctionFeeAmt,
    docFees: documentationFee + transactionFee,
    shipping,
    repairCost,
    titleFees,
    taxRate,
    rebuiltDiscountPct,
    targetPct,
  });

  // Pre-fill the lock input with the current suggested max bid until the
  // user edits it themselves.
  const displayedMaxBidInput =
    maxBidInput !== '' ? maxBidInput : deal.suggestedMaxBid !== null ? String(deal.suggestedMaxBid) : '';

  function handleLock() {
    const value = Number(displayedMaxBidInput);
    if (!Number.isNaN(value) && value > 0) {
      setLockedMax(value);
    }
  }

  function handleUnlock() {
    setLockedMax(null);
    setMaxBidInput('');
    setLiveBid('');
  }

  const liveBidNum = liveBid === '' ? null : Number(liveBid);
  const roomLeft =
    lockedMax !== null && liveBidNum !== null && !Number.isNaN(liveBidNum) ? lockedMax - liveBidNum : null;

  function handleSaveConfirm() {
    saveDeal({
      label: saveLabel.trim(),
      url: saveUrl.trim(),
      vehicle: {
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        mileage: vehicle.mileage,
        trim: vehicle.trim,
      },
      damageSelections,
      fees: {
        bid,
        auctionFeeAmt,
        documentationFee,
        transactionFee,
        shipping,
        state,
        titleFees,
        rebuiltDiscountPct,
        targetPct,
      },
      result: {
        totalCost: deal.totalCost,
        pctOfClean: deal.pctOfClean,
        suggestedBid: deal.suggestedMaxBid,
        repairCost,
        resaleValue: deal.resaleValue,
        projectedEquity: deal.equity,
        verdict: deal.verdict,
      },
    });
    setShowSaveForm(false);
    setSaveLabel('');
    setSaveUrl('');
    setJustSaved(true);
  }

  useEffect(() => {
    if (!justSaved) return undefined;
    const timer = setTimeout(() => setJustSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [justSaved]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Deal calculator</h1>
      <p className="mt-2 text-steel">
        Work through the vehicle, the damage, and the bid to see the full all-in picture.
      </p>

      {/* 1. Vehicle */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">1. Vehicle</h2>
        <div className="mt-4 rounded-lg border border-steel/20 bg-white p-6">
          <VehicleSelector value={vehicle} onChange={setVehicle} />

          <div className="mt-4 max-w-xs">
            <label className="mb-1 block text-sm font-medium text-steel">
              Clean value override (optional)
            </label>
            <div className="flex items-center rounded-md border border-steel/30 bg-white px-3">
              <span className="text-steel">$</span>
              <input
                type="number"
                min="0"
                step="500"
                placeholder={autoCleanValue !== null ? String(autoCleanValue) : ''}
                className="w-full bg-transparent py-2 outline-none"
                value={cleanValueOverride}
                onChange={(e) => setCleanValueOverride(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isRealModel && (
          <div className="mt-4 space-y-2">
            <DesirabilityBadge make={vehicle.make} model={vehicle.model} />
            {hybridPremium > 1 && (
              <p className="text-xs text-steel">
                Hybrid value premium applied (×{hybridPremium.toFixed(2)}).
              </p>
            )}
          </div>
        )}
      </section>

      {/* 2. Damage */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">2. Damage</h2>
        <div className="mt-4">
          <DamageSelector selections={damageSelections} onChange={setDamageSelections} />
        </div>
      </section>

      {/* 3. Bid, fees, and shipping */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">3. Bid, fees, and shipping</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-steel/20 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3">
          <NumberField label="Bid amount" prefix="$" value={bid} onChange={setBid} step={100} />
          <NumberField
            label="Auction fee"
            prefix="$"
            value={auctionFeeAmt}
            onChange={setAuctionFeeAmt}
            step={25}
            caption="Flat buyer fee — varies by bid amount. Use the listing's own fee calculator (e.g. Copart/IAAI)."
          />
          <NumberField
            label="Documentation fee"
            prefix="$"
            value={documentationFee}
            onChange={setDocumentationFee}
            step={1}
            caption="Tends to stay constant across listings."
          />
          <NumberField
            label="Transaction fee"
            prefix="$"
            value={transactionFee}
            onChange={setTransactionFee}
            step={1}
            caption="Varies by auction."
          />
          <NumberField label="Shipping" prefix="$" value={shipping} onChange={setShipping} step={25} />

          <div>
            <label className="mb-1 block text-sm font-medium text-steel">State (for tax rate)</label>
            <select
              className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select a state…</option>
              {STATE_LABELS.map((code) => (
                <option key={code} value={code}>
                  {code} — {STATE_TAX_RATES[code]}%
                </option>
              ))}
            </select>
          </div>

          <NumberField
            label="Title / BMV fees"
            prefix="$"
            value={titleFees}
            onChange={setTitleFees}
            step={10}
          />
          <NumberField
            label="Rebuilt-title discount"
            suffix="%"
            value={rebuiltDiscountPct}
            onChange={setRebuiltDiscountPct}
            step={1}
          />
          <NumberField
            label="Target % of clean value"
            suffix="%"
            value={targetPct}
            onChange={setTargetPct}
            step={1}
          />
        </div>
      </section>

      {/* Result */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Result</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard label="All-in cost" value={`$${deal.totalCost.toLocaleString()}`} />
          <ResultCard
            label="% of clean value"
            value={deal.pctOfClean !== null ? `${deal.pctOfClean}%` : '—'}
          />
          <ResultCard
            label="Suggested max bid"
            value={deal.suggestedMaxBid !== null ? `$${deal.suggestedMaxBid.toLocaleString()}` : '—'}
          />
          <ResultCard label="Estimated repair cost" value={`$${repairCost.toLocaleString()}`} />
          <ResultCard
            label="Projected resale value"
            value={deal.resaleValue !== null ? `$${deal.resaleValue.toLocaleString()}` : '—'}
          />
          <ResultCard
            label="Projected equity"
            value={deal.equity !== null ? `$${deal.equity.toLocaleString()}` : '—'}
            tone={deal.equity !== null ? (deal.equity >= 0 ? 'green' : 'red') : 'default'}
          />
        </div>

        <div className="mt-6">
          <VerdictBanner verdict={deal.verdict} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!showSaveForm && (
            <button
              type="button"
              onClick={() => setShowSaveForm(true)}
              className="rounded-md border border-steel/30 bg-white px-4 py-2 text-sm font-medium hover:bg-steel/5"
            >
              Save this deal
            </button>
          )}
          {justSaved && <span className="text-sm font-medium text-moss">Saved ✓</span>}
        </div>

        {showSaveForm && (
          <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-steel/20 bg-white p-4">
            <div className="w-full sm:w-56">
              <label className="mb-1 block text-sm font-medium text-steel">
                Label (e.g. lot # or nickname)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-64">
              <label className="mb-1 block text-sm font-medium text-steel">Listing URL</label>
              <input
                type="url"
                placeholder="https://…"
                className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
                value={saveUrl}
                onChange={(e) => setSaveUrl(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleSaveConfirm}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowSaveForm(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-steel hover:bg-steel/5"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Bid ceiling lock */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Bid ceiling lock</h2>
        <p className="mt-1 text-sm text-steel">
          For use during a live auction: lock in a hard max, then track the auction&apos;s current
          bid against it.
        </p>

        {lockedMax === null ? (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-steel/20 bg-white p-4">
            <div className="w-40">
              <label className="mb-1 block text-sm font-medium text-steel">Max bid to lock</label>
              <div className="flex items-center rounded-md border border-steel/30 bg-white px-3">
                <span className="text-steel">$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  className="w-full bg-transparent py-2 outline-none"
                  value={displayedMaxBidInput}
                  onChange={(e) => setMaxBidInput(e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleLock}
              disabled={!displayedMaxBidInput}
              className="rounded-md bg-rust px-4 py-2 font-medium text-paper transition-opacity disabled:opacity-40"
            >
              Lock this as my max
            </button>
          </div>
        ) : (
          <div className="sticky top-4 z-20 mt-4 rounded-lg border-4 border-rust bg-rust/10 p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-display text-2xl font-bold text-rust">
                Your max: ${lockedMax.toLocaleString()} — do not bid above this
              </div>
              <button
                type="button"
                onClick={handleUnlock}
                className="rounded-md border border-rust px-3 py-1.5 text-sm font-medium text-rust hover:bg-rust/10"
              >
                Unlock / reset
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="w-48">
                <label className="mb-1 block text-sm font-medium text-steel">Current live bid</label>
                <div className="flex items-center rounded-md border border-steel/30 bg-white px-3">
                  <span className="text-steel">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="0"
                    className="w-full bg-transparent py-2 outline-none"
                    value={liveBid}
                    onChange={(e) => setLiveBid(e.target.value)}
                  />
                </div>
              </div>

              {roomLeft !== null &&
                (roomLeft > 0 ? (
                  <div className="font-mono-num text-lg font-semibold text-moss">
                    ${roomLeft.toLocaleString()} of room left
                  </div>
                ) : (
                  <div className="font-display text-lg font-bold text-rust">
                    STOP — at or over your max
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
