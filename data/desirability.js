// How quickly a rebuilt/salvage-title example of a given make+model tends
// to resell, and how big a discount off clean-title value buyers typically
// expect as a result.

export const DESIRABILITY_TIERS = {
  high: {
    label: 'High Desirability',
    note: 'Strong, steady demand — rebuilt-title copies tend to sell quickly. A smaller discount off clean value is usually enough.',
    discountRange: [15, 20],
  },
  medium: {
    label: 'Medium Desirability',
    note: 'Average resale speed. Buyers typically expect a mid-range rebuilt-title discount.',
    discountRange: [25, 25],
  },
  low: {
    label: 'Low Desirability',
    note: 'Slower-moving on the resale market — buyers expect a steeper discount to take on a rebuilt title.',
    discountRange: [30, 35],
  },
};

// "Make|Model" keys for well-known strong resellers.
export const HIGH = [
  'Ford|F-150',
  'Chevrolet|Silverado 1500',
  'GMC|Sierra 1500',
  'Ram|1500',
  'Toyota|Tacoma',
  'Toyota|Tundra',
  'Toyota|4Runner',
  'Toyota|Camry',
  'Honda|CR-V',
  'Honda|Civic',
  'Honda|Accord',
  'Toyota|RAV4',
  'Subaru|Outback',
  'Jeep|Wrangler',
  'Jeep|Grand Cherokee',
];

// "Make|Model" keys for known weaker resellers.
export const LOW = [
  'Nissan|Altima',
  'Chrysler|300',
  'Dodge|Charger',
  'BMW|3 Series',
  'BMW|5 Series',
  'Mercedes-Benz|C-Class',
  'Mercedes-Benz|E-Class',
  'Audi|A4',
  'Audi|A6',
  'Lexus|IS',
  'Lexus|ES',
  'Cadillac|CT5',
  'Volvo|S60',
];

export function desirabilityFor(make, model) {
  const key = `${make}|${model}`;
  if (HIGH.includes(key)) return 'high';
  if (LOW.includes(key)) return 'low';
  return 'medium';
}
