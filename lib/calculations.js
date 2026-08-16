import { SEGMENTS } from '../data/vehicles';
import { getDepreciationFactor } from '../data/depreciation';
import { DAMAGE_CATEGORIES, SEVERITY_LEVELS } from '../data/damage';

const EXPECTED_MILES_PER_YEAR = 12000;
const MILEAGE_ADJUST_PER_12K = 0.02; // value swing per 12k miles away from expected
const MILEAGE_ADJUST_MIN = -0.25;
const MILEAGE_ADJUST_MAX = 0.15;

/**
 * Estimate a clean-title value for a vehicle from its segment, age, trim,
 * hybrid status, and actual mileage vs. an expected-mileage baseline.
 */
export function estimateCleanValue({ segment, year, mileage, trimMultiplier, hybridPremium }) {
  const segmentInfo = SEGMENTS[segment];
  if (!segmentInfo || !year) return null;

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - Number(year));
  const depreciationFactor = getDepreciationFactor(age);
  const multiplier = trimMultiplier || 1;

  let value = segmentInfo.baseValue * depreciationFactor * multiplier * (hybridPremium || 1);

  if (typeof mileage === 'number' && !Number.isNaN(mileage)) {
    const expectedMileage = age * EXPECTED_MILES_PER_YEAR;
    const mileageDelta = mileage - expectedMileage;
    const rawAdjustment = -(mileageDelta / EXPECTED_MILES_PER_YEAR) * MILEAGE_ADJUST_PER_12K;
    const adjustment = Math.max(MILEAGE_ADJUST_MIN, Math.min(MILEAGE_ADJUST_MAX, rawAdjustment));
    value *= 1 + adjustment;
  }

  return Math.max(0, Math.round(value));
}

/**
 * Sum estimated repair costs across selected damage categories.
 * `selections` is a map of categoryId -> severityId ('minor' | 'moderate' | 'severe').
 * Returns the interpolated estimate plus the full low/high range across
 * whatever categories are selected.
 */
export function estimateRepairCost(selections = {}) {
  let estimate = 0;
  let low = 0;
  let high = 0;

  DAMAGE_CATEGORIES.forEach((category) => {
    const severityId = selections[category.id];
    if (!severityId) return;

    const severity = SEVERITY_LEVELS.find((s) => s.id === severityId);
    const factor = severity ? severity.factor : 0;
    const range = category.high - category.low;

    estimate += category.low + range * factor;
    low += category.low;
    high += category.high;
  });

  return {
    estimate: Math.round(estimate),
    low: Math.round(low),
    high: Math.round(high),
  };
}

function verdictFor(pctOfClean) {
  if (pctOfClean === null) {
    return {
      tier: 'gray',
      label: 'Add a vehicle value',
      message: 'Enter a clean value (or pick a vehicle) to see how this bid stacks up.',
    };
  }
  if (pctOfClean <= 50) {
    return {
      tier: 'green',
      label: 'Great deal',
      message: 'All-in cost is well under clean value — plenty of margin for surprises.',
    };
  }
  if (pctOfClean <= 65) {
    return {
      tier: 'teal',
      label: 'Good deal',
      message: 'Solid margin between all-in cost and clean value.',
    };
  }
  if (pctOfClean <= 80) {
    return {
      tier: 'amber',
      label: 'Fair, thin margin',
      message: 'This works, but the cushion is thin — double-check repair costs and resale assumptions.',
    };
  }
  return {
    tier: 'red',
    label: 'Pass',
    message: 'All-in cost is too close to (or over) clean value. Little to no room for error.',
  };
}

/**
 * Run the full salvage-deal math: fees, tax, all-in cost, resale value,
 * projected equity, a suggested max bid for a target % of clean value,
 * and a verdict tier.
 *
 * `auctionFeeAmt` is a flat dollar buyer fee (real auctions like Copart/IAAI
 * charge a tiered flat fee by bid range, not a clean percentage), not a
 * percentage of the bid.
 */
export function computeDeal({
  cleanValue,
  bid = 0,
  auctionFeeAmt = 0,
  docFees = 0,
  shipping = 0,
  repairCost = 0,
  titleFees = 0,
  taxRate = 0,
  rebuiltDiscountPct = 25,
  targetPct = 65,
}) {
  const auctionFee = auctionFeeAmt;
  const tax = (bid + auctionFee) * (taxRate / 100);
  const fixedCosts = docFees + shipping + repairCost + titleFees;
  const totalCost = bid + auctionFee + tax + fixedCosts;

  const hasCleanValue = typeof cleanValue === 'number' && cleanValue > 0;
  const pctOfClean = hasCleanValue ? (totalCost / cleanValue) * 100 : null;
  const resaleValue = hasCleanValue ? cleanValue * (1 - rebuiltDiscountPct / 100) : null;
  const equity = hasCleanValue ? resaleValue - totalCost : null;

  // totalCost(bid) = bid + auctionFeeAmt + (bid + auctionFeeAmt) * taxRate/100 + fixedCosts
  //                = bid * taxMultiplier + auctionFeeAmt * taxMultiplier + fixedCosts
  // Solve for bid at the target % of clean value.
  let suggestedMaxBid = null;
  if (hasCleanValue) {
    const taxMultiplier = 1 + taxRate / 100;
    const targetCost = cleanValue * (targetPct / 100);
    suggestedMaxBid = Math.max(
      0,
      (targetCost - fixedCosts - auctionFeeAmt * taxMultiplier) / taxMultiplier
    );
  }

  return {
    auctionFee: Math.round(auctionFee),
    tax: Math.round(tax),
    totalCost: Math.round(totalCost),
    pctOfClean: pctOfClean === null ? null : Math.round(pctOfClean * 10) / 10,
    resaleValue: resaleValue === null ? null : Math.round(resaleValue),
    equity: equity === null ? null : Math.round(equity),
    suggestedMaxBid: suggestedMaxBid === null ? null : Math.round(suggestedMaxBid),
    verdict: verdictFor(pctOfClean === null ? null : Math.round(pctOfClean * 10) / 10),
  };
}
