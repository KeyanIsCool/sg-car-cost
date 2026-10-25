export interface LoanInput {
  purchasePrice: number;
  downpaymentPct: number; // 0..1
  flatRate: number; // annual flat interest rate, e.g. 0.0278
  tenureYears: number;
}

export interface LoanResult {
  loanAmount: number;
  totalInterest: number;
  totalRepayable: number;
  monthlyInstalment: number;
  effectiveRateApprox: number;
}

/**
 * Singapore car loans are usually quoted on a flat-rate basis.
 * Total interest = principal x flat rate x years.
 * Effective rate (APR) is roughly ~1.8-1.9x the flat rate for typical tenures.
 */
export function calcLoan(input: LoanInput): LoanResult {
  const { purchasePrice, downpaymentPct, flatRate, tenureYears } = input;
  const loanAmount = Math.max(0, purchasePrice * (1 - downpaymentPct));
  const totalInterest = loanAmount * flatRate * tenureYears;
  const totalRepayable = loanAmount + totalInterest;
  const months = Math.max(1, tenureYears * 12);
  const monthlyInstalment = totalRepayable / months;
  // Approximate effective (APR) via: 2 * n * I / (P * (n+1))
  const n = months;
  const effectiveRateApprox =
    loanAmount > 0 ? (2 * n * totalInterest) / (loanAmount * (n + 1)) : 0;
  return {
    loanAmount,
    totalInterest,
    totalRepayable,
    monthlyInstalment,
    effectiveRateApprox,
  };
}
