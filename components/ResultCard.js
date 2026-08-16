export default function ResultCard({ label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'text-ink',
    green: 'text-moss',
    teal: 'text-teal',
    amber: 'text-amber-700',
    red: 'text-rust',
  };

  return (
    <div className="rounded-lg border border-steel/20 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-steel">{label}</div>
      <div className={`font-mono-num mt-1 text-2xl font-semibold ${toneClasses[tone] || toneClasses.default}`}>
        {value}
      </div>
    </div>
  );
}
