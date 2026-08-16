// Rough depreciation curve: fraction of original MSRP a vehicle is worth
// at a given age in years. Steep in the first couple of years, then
// flattens out as the vehicle gets older.

export const DEPRECIATION_CURVE = {
  0: 0.85,
  1: 0.72,
  2: 0.64,
  3: 0.58,
  4: 0.53,
  5: 0.49,
  6: 0.45,
  7: 0.42,
  8: 0.39,
  9: 0.36,
  10: 0.33,
  11: 0.3,
  12: 0.27,
  13: 0.24,
  14: 0.21,
  15: 0.19,
};

export const DEPRECIATION_FLOOR = 0.17;

export function getDepreciationFactor(age) {
  const clampedAge = Math.max(0, age);
  if (clampedAge in DEPRECIATION_CURVE) {
    return DEPRECIATION_CURVE[clampedAge];
  }
  return DEPRECIATION_FLOOR;
}
