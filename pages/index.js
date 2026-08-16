import Link from 'next/link';

const CARDS = [
  {
    href: '/deal',
    title: 'Deal calculator',
    description: 'Run the full numbers — bid, fees, tax, repairs, and a verdict on the deal.',
  },
  {
    href: '/value',
    title: 'Value estimator',
    description: 'Estimate a clean-title value for a vehicle from year, mileage, and trim.',
  },
  {
    href: '/damage',
    title: 'Repair cost',
    description: 'Rough out repair costs across common salvage damage categories.',
  },
];

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Size up a salvage deal before you bid.
        </h1>
        <p className="mt-4 text-lg text-steel">
          Quick, rough-and-ready tools for estimating clean value, repair costs, and all-in
          numbers on rebuildable and salvage-title vehicle auction listings.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-steel/20 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h2 className="font-display text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-steel">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
