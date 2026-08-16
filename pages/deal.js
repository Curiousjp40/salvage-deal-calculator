import { useState } from 'react';
import VehicleSelector, { TRIMS } from '../components/VehicleSelector';
import DamageSelector from '../components/DamageSelector';
import DesirabilityBadge from '../components/DesirabilityBadge';
import ResultCard from '../components/ResultCard';
import VerdictBanner from '../components/VerdictBanner';
import { segmentFor } from '../data/vehicles';
import { STATE_TAX_RATES } from '../data/stateTax';
import { estimateCleanValue, estimateRepairCost, computeDeal } from '../lib/calculations';

const currentYear = new Date().getFullYear();

const STATE_LABELS = Object.keys(STATE_TAX_RATES).sort();

function NumberField({ label, value, onChange, step = 1, min = 0, prefix, suffix }) {
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
  const [auctionFeePct, setAuctionFeePct] = useState(10);
  const [docFees, setDocFees] = useState(200);
  const [shipping, setShipping] = useState(350);
  const [state, setState] = useState('');
  const [titleFees, setTitleFees] = useState(150);
  const [rebuiltDiscountPct, setRebuiltDiscountPct] = useState(25);
  const [targetPct, setTargetPct] = useState(65);

  const isRealModel = vehicle.make && vehicle.model && vehicle.model !== '__other__';
  const segment = isRealModel ? segmentFor(vehicle.make, vehicle.model) : vehicle.segment;

  const autoCleanValue = estimateCleanValue({
    segment,
    year: vehicle.year,
    mileage: vehicle.mileage,
    trimMultiplier: TRIMS[vehicle.trim]?.multiplier,
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
    auctionFeePct,
    docFees,
    shipping,
    repairCost,
    titleFees,
    taxRate,
    rebuiltDiscountPct,
    targetPct,
  });

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
          <div className="mt-4">
            <DesirabilityBadge make={vehicle.make} model={vehicle.model} />
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
            suffix="%"
            value={auctionFeePct}
            onChange={setAuctionFeePct}
            step={0.5}
          />
          <NumberField
            label="Doc / transaction fees"
            prefix="$"
            value={docFees}
            onChange={setDocFees}
            step={25}
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
      </section>
    </div>
  );
}
