const TIER_CLASSES = {
  green: 'bg-moss/10 border-moss text-moss',
  teal: 'bg-teal/10 border-teal text-teal',
  amber: 'bg-amber/10 border-amber-600 text-amber-700',
  red: 'bg-rust/10 border-rust text-rust',
  gray: 'bg-steel/10 border-steel text-steel',
};

export default function VerdictBanner({ verdict }) {
  if (!verdict) return null;
  const classes = TIER_CLASSES[verdict.tier] || TIER_CLASSES.gray;

  return (
    <div className={`rounded-lg border-l-4 p-4 ${classes}`}>
      <div className="font-display text-lg font-bold">{verdict.label}</div>
      <p className="mt-1 text-sm text-ink/80">{verdict.message}</p>
    </div>
  );
}
