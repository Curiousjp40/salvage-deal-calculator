// Repair cost ranges by damage category, and severity multipliers used to
// interpolate within a category's low-high range.

export const DAMAGE_CATEGORIES = [
  {
    id: 'minor-dent-scratches',
    label: 'Minor Dents & Scratches',
    low: 300,
    high: 1200,
  },
  {
    id: 'hail',
    label: 'Hail Damage',
    low: 1000,
    high: 6000,
  },
  {
    id: 'front-end',
    label: 'Front-End Collision',
    low: 2500,
    high: 9000,
  },
  {
    id: 'rear-end',
    label: 'Rear-End Collision',
    low: 1800,
    high: 7000,
  },
  {
    id: 'side-door',
    label: 'Side / Door Damage',
    low: 1500,
    high: 6500,
  },
  {
    id: 'theft-recovery',
    label: 'Theft Recovery',
    low: 800,
    high: 5000,
  },
  {
    id: 'vandalism',
    label: 'Vandalism',
    low: 500,
    high: 4000,
  },
  {
    id: 'water-flood',
    label: 'Water / Flood Damage',
    low: 3000,
    high: 12000,
  },
  {
    id: 'mechanical',
    label: "Mechanical / Won't Start",
    low: 600,
    high: 5500,
  },
  {
    id: 'airbag',
    label: 'Airbag Deployment',
    low: 2000,
    high: 6000,
  },
  {
    id: 'frame-structural',
    label: 'Frame / Structural Damage',
    low: 4000,
    high: 15000,
  },
  {
    id: 'normal-wear',
    label: 'Normal Wear & Tear',
    low: 200,
    high: 1500,
  },
];

export const SEVERITY_LEVELS = [
  { id: 'minor', label: 'Minor', factor: 0.15 },
  { id: 'moderate', label: 'Moderate', factor: 0.5 },
  { id: 'severe', label: 'Severe', factor: 0.9 },
];
