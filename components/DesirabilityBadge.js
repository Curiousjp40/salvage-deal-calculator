import { DESIRABILITY_TIERS, desirabilityFor } from '../data/desirability';

const TIER_CLASSES = {
  high: 'bg-moss/10 border-moss text-moss',
  medium: 'bg-steel/10 border-steel text-steel',
  low: 'bg-rust/10 border-rust text-rust',
};

export default function DesirabilityBadge({ make, model }) {
  if (!make || !model) return null;

  const tier = desirabilityFor(make, model);
  const info = DESIRABILITY_TIERS[tier];
  const classes = TIER_CLASSES[tier] || TIER_CLASSES.medium;
  const [lowPct, highPct] = info.discountRange;
  const discountLabel = lowPct === highPct ? `~${lowPct}%` : `${lowPct}–${highPct}%`;

  return (
    <div className={`rounded-md border-l-4 p-3 text-sm ${classes}`}>
      <span className="font-semibold">{info.label}</span> — {info.note} Typical rebuilt-title
      discount: <span className="font-mono-num">{discountLabel}</span>.
    </div>
  );
}
