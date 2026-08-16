import { useState } from 'react';
import DamageSelector from '../components/DamageSelector';
import ResultCard from '../components/ResultCard';
import { estimateRepairCost } from '../lib/calculations';

export default function DamagePage() {
  const [selections, setSelections] = useState({});
  const { estimate, low, high } = estimateRepairCost(selections);
  const hasSelections = Object.keys(selections).length > 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Repair cost estimator</h1>
      <p className="mt-2 text-steel">
        Select the damage categories that apply and a severity for each to rough out a repair
        bill.
      </p>

      <div className="mt-8">
        <DamageSelector selections={selections} onChange={setSelections} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultCard
          label="Total estimated repair cost"
          value={hasSelections ? `$${estimate.toLocaleString()}` : '—'}
        />
        <ResultCard
          label="Full low–high range"
          value={hasSelections ? `$${low.toLocaleString()}–$${high.toLocaleString()}` : '—'}
        />
      </div>
    </div>
  );
}
