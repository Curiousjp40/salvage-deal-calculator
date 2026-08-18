import { MAKES, SEGMENTS, modelsForMake } from '../data/vehicles';
import VinDecoder from './VinDecoder';

export const TRIMS = {
  base: { label: 'Base', multiplier: 0.85 },
  mid: { label: 'Mid', multiplier: 1.0 },
  upper: { label: 'Upper', multiplier: 1.15 },
  top: { label: 'Top / Performance', multiplier: 1.3 },
};

const OTHER_MAKE = '__other__';
const currentYear = new Date().getFullYear();
// Starts at 1990 (rather than the site's original 2010 floor) so a
// VIN-decoded older salvage vehicle doesn't land on an unsupported year.
const YEARS = [];
for (let y = currentYear; y >= 1990; y -= 1) YEARS.push(y);

// value: { year, make, model, segment, mileage, trim }
export default function VehicleSelector({ value, onChange }) {
  const isOther = value.make === OTHER_MAKE;
  const models = isOther ? [] : modelsForMake(value.make);

  function patch(fields) {
    onChange({ ...value, ...fields });
  }

  function handleMakeChange(make) {
    if (make === OTHER_MAKE) {
      patch({ make, model: '', segment: value.segment || '' });
      return;
    }
    const models = modelsForMake(make);
    const model = models[0] || '';
    patch({ make, model, segment: '' });
  }

  return (
    <div>
      <VinDecoder onDecode={patch} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-steel">Model year</label>
          <select
            className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
            value={value.year}
            onChange={(e) => patch({ year: Number(e.target.value) })}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-steel">Make</label>
          <select
            className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
            value={value.make}
            onChange={(e) => handleMakeChange(e.target.value)}
          >
            <option value="">Select a make…</option>
            {MAKES.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
            <option value={OTHER_MAKE}>Other / not listed</option>
          </select>
        </div>

        {isOther ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-steel">Model (free text)</label>
              <input
                type="text"
                className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
                placeholder="e.g. Something Custom"
                value={value.model}
                onChange={(e) => patch({ model: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-steel">Closest segment</label>
              <select
                className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
                value={value.segment}
                onChange={(e) => patch({ segment: e.target.value })}
              >
                <option value="">Select a segment…</option>
                {Object.entries(SEGMENTS).map(([id, seg]) => (
                  <option key={id} value={id}>
                    {seg.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-steel">Model</label>
            <select
              className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
              value={value.model}
              onChange={(e) => patch({ model: e.target.value })}
              disabled={!value.make}
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-steel">Mileage</label>
          <input
            type="number"
            min="0"
            step="1000"
            className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
            value={value.mileage}
            onChange={(e) => patch({ mileage: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-steel">Trim level</label>
          <select
            className="w-full rounded-md border border-steel/30 bg-white px-3 py-2"
            value={value.trim}
            onChange={(e) => patch({ trim: e.target.value })}
          >
            {Object.entries(TRIMS).map(([id, trim]) => (
              <option key={id} value={id}>
                {trim.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
