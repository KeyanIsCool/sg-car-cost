export interface DepreciationInput {
  purchasePrice: number;
  expectedResale: number;
  ownershipYears: number;
}

export interface DepreciationResult {
  totalDepreciation: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
}

export function calcDepreciation(input: DepreciationInput): DepreciationResult {
  const total = Math.max(0, input.purchasePrice - input.expectedResale);
  const years = Math.max(0.0001, input.ownershipYears);
  const annual = total / years;
  return {
    totalDepreciation: total,
    annualDepreciation: annual,
    monthlyDepreciation: annual / 12,
  };
}

/**
 * Rough resale estimator when the user has no number. Uses a declining
 * balance until COE expiry, where value floors at the PARF rebate (if any).
 */
export function estimateResale(opts: {
  purchasePrice: number;
  ownershipYears: number;
  totalCoeYears: number; // remaining COE at purchase
  parfRebate?: number;
  annualDeclinePct?: number; // default 10%
}): number {
  const decline = opts.annualDeclinePct ?? 0.1;
  const years = Math.min(opts.ownershipYears, opts.totalCoeYears);
  const raw = opts.purchasePrice * Math.pow(1 - decline, years);
  const floor = opts.ownershipYears >= opts.totalCoeYears ? opts.parfRebate ?? 0 : 0;
  return Math.max(raw, floor);
}
