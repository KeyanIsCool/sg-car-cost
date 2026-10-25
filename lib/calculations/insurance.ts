export interface InsuranceInput {
  age: number;
  yearsLicensed: number;
  ncdPct: number; // 0..0.5
  vehicleValue: number;
  highPerformance?: boolean;
}
export interface InsuranceRange {
  low: number;
  high: number;
  mid: number;
  monthlyLow: number;
  monthlyHigh: number;
  monthlyMid: number;
}

/**
 * Indicative range only. NOT an insurance quote.
 * Base premium scales ~1% of vehicle value, adjusted for age/experience/NCD.
 */
export function estimateInsurance(input: InsuranceInput): InsuranceRange {
  const base = Math.max(900, input.vehicleValue * 0.012);
  let ageMult = 1;
  if (input.age < 25) ageMult = 1.6;
  else if (input.age < 30) ageMult = 1.2;
  else if (input.age > 65) ageMult = 1.25;

  let expMult = 1;
  if (input.yearsLicensed < 2) expMult = 1.4;
  else if (input.yearsLicensed < 5) expMult = 1.1;

  const ncdMult = 1 - Math.min(0.5, Math.max(0, input.ncdPct));
  const perfMult = input.highPerformance ? 1.3 : 1;

  const mid = base * ageMult * expMult * ncdMult * perfMult;
  const low = mid * 0.85;
  const high = mid * 1.2;
  return {
    low,
    mid,
    high,
    monthlyLow: low / 12,
    monthlyMid: mid / 12,
    monthlyHigh: high / 12,
  };
}
