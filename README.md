# Salvage Deal Calculator

A small toolkit for sizing up salvage and rebuildable-title vehicle auction listings
*before* you bid. Three tools, all in the browser, no accounts or data collection:

- **Deal calculator** (`/deal`) — the full picture: vehicle value, damage, bid, fees,
  tax, shipping, and title costs rolled into an all-in cost, a suggested max bid, and a
  green/teal/amber/red verdict on the deal. Includes a **bid ceiling lock** for use
  during a live auction — lock in a hard max bid, then track the auction's current bid
  against it with a room-left/stop warning.
- **Value estimator** (`/value`) — a standalone clean-title value estimate from year,
  make/model, mileage, and trim.
- **Repair cost** (`/damage`) — a standalone repair-cost rollup across common salvage
  damage categories and severities.

## How the estimates work (and their limits)

Every number this app produces is a **rough planning estimate**, not an appraisal, a
quote, or a guarantee:

- **Clean value** starts from a rough typical new price for the vehicle's segment
  (`data/vehicles.js`), applies an age-based depreciation curve
  (`data/depreciation.js`), a trim multiplier, a hybrid-variant value premium (hybrid
  models are their own selectable entries with a `hybridPremium`, ~1.08×, since they
  cost more new and tend to hold value slightly better), and an adjustment for mileage
  above or below an expected 12,000 miles/year baseline (capped at ±25%/+15%). See
  `estimateCleanValue` in `lib/calculations.js`.
- **Repair cost** interpolates within a low/high dollar range per damage category
  (`data/damage.js`) based on a minor/moderate/severe severity factor. See
  `estimateRepairCost`.
- **Desirability** (`data/desirability.js`) flags a handful of well-known strong and
  weak resellers and suggests a rebuilt-title resale discount range; anything not
  listed defaults to "medium."
- **Tax rate** uses base state sales tax rates only (`data/stateTax.js`) — county and
  city add-ons aren't included.
- **The deal math** (`computeDeal` in `lib/calculations.js`) totals the bid, a flat
  auction fee, tax, a documentation fee, a transaction fee, shipping, repair cost, and
  title fees into an all-in cost, then compares that to clean value to produce a
  percentage, a suggested max bid for your target percentage, a projected resale value
  and equity, and a verdict tier. The auction fee is a flat dollar amount rather than a
  percentage of the bid — real auctions like Copart/IAAI charge tiered flat buyer fees
  by bid range, not a clean percentage, so pull the actual figure from the listing's own
  fee calculator.

**Before you actually bid:** cross-check the vehicle's value on KBB or Edmunds (the
value estimator links out to a KBB search for you), get a real repair estimate from a
shop, and confirm the auction's fee schedule plus your state/county's actual sales tax
and rebuilt-title rules — they vary by state and this app doesn't know your county.

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment

This repo builds as a static export and deploys to GitHub Pages via GitHub Actions
(`.github/workflows/deploy.yml`). Every push to `main` runs `npm run build` (which
produces a static `out/` directory, since `next.config.js` sets `output: 'export'`)
and publishes it to Pages.

To build the static export locally:

```bash
npm run build
# static site is in ./out
```

`next.config.js` sets `basePath`/`assetPrefix` to `/salvage-deal-calculator` in
production (so assets resolve correctly under a project Pages URL) and leaves them
empty in development.

## Extending the datasets

All of the app's data lives in `/data` and is plain JS, so it's easy to extend:

- **`vehicles.js`** — add a segment to `SEGMENTS`, or a `{ make, model, segment }` entry
  to `VEHICLES`. `MAKES`, `modelsForMake`, and `segmentFor` derive automatically. For a
  hybrid variant, add it as its own `{ make, model: '<Model> Hybrid', segment,
  hybridPremium: HYBRID_PREMIUM }` entry (same segment as the gas version); pick it up
  with `hybridPremiumFor(make, model)`.
- **`depreciation.js`** — adjust `DEPRECIATION_CURVE` (keyed by age in years) or the
  `DEPRECIATION_FLOOR` used for anything older than the curve covers.
- **`damage.js`** — add a category to `DAMAGE_CATEGORIES` with a `low`/`high` repair
  cost range, or tweak the `SEVERITY_LEVELS` interpolation factors.
- **`stateTax.js`** — update `STATE_TAX_RATES` if a state's base rate changes.
- **`desirability.js`** — add `"Make|Model"` keys to `HIGH` or `LOW` to steer the
  suggested rebuilt-title discount for that model.

## License

MIT — see [LICENSE](./LICENSE).
