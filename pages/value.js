import { useState } from 'react';
import VehicleSelector, { TRIMS } from '../components/VehicleSelector';
import DesirabilityBadge from '../components/DesirabilityBadge';
import ResultCard from '../components/ResultCard';
import { segmentFor, hybridPremiumFor } from '../data/vehicles';
import { estimateCleanValue } from '../lib/calculations';

const currentYear = new Date().getFullYear();

export default function ValuePage() {
  const [vehicle, setVehicle] = useState({
    year: currentYear - 5,
    make: '',
    model: '',
    segment: '',
    mileage: 60000,
    trim: 'mid',
  });

  const isRealModel = vehicle.make && vehicle.model && vehicle.model !== '__other__';
  const segment = isRealModel ? segmentFor(vehicle.make, vehicle.model) : vehicle.segment;
  const hybridPremium = isRealModel ? hybridPremiumFor(vehicle.make, vehicle.model) : 1;

  const cleanValue = estimateCleanValue({
    segment,
    year: vehicle.year,
    mileage: vehicle.mileage,
    trimMultiplier: TRIMS[vehicle.trim]?.multiplier,
    hybridPremium,
  });

  const rebuiltValue = cleanValue !== null ? Math.round(cleanValue * 0.75) : null;

  const kbbQuery = encodeURIComponent(`${vehicle.year} ${vehicle.make} ${vehicle.model} value kbb`);
  const kbbSearchUrl = `https://www.google.com/search?q=${kbbQuery}`;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Value estimator</h1>
      <p className="mt-2 text-steel">
        Estimate a rough clean-title value for a vehicle based on segment, age, mileage, and trim.
      </p>

      <div className="mt-8 rounded-lg border border-steel/20 bg-white p-6">
        <VehicleSelector value={vehicle} onChange={setVehicle} />
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultCard
          label="Estimated clean value"
          value={cleanValue !== null ? `$${cleanValue.toLocaleString()}` : '—'}
        />
        <ResultCard
          label="At 75% (typical rebuilt-title resale)"
          value={rebuiltValue !== null ? `$${rebuiltValue.toLocaleString()}` : '—'}
        />
      </div>

      {vehicle.make && vehicle.model && (
        <a
          href={kbbSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block text-sm font-medium text-teal underline underline-offset-2"
        >
          Cross-check on KBB →
        </a>
      )}
    </div>
  );
}
