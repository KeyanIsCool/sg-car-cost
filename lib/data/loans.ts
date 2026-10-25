export interface LoanRate {
  lender: string;
  flat_rate: number;
  max_tenure_years: number;
  effective_date: string;
  source: string;
}
export const LOAN_RATES: LoanRate[] = [
  { lender: "DBS", flat_rate: 0.0248, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
  { lender: "OCBC", flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
  { lender: "UOB", flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
  { lender: "Maybank", flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
  { lender: "Hong Leong Finance", flat_rate: 0.0248, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
  { lender: "Tokyo Century", flat_rate: 0.0288, max_tenure_years: 7, effective_date: "2026-10-01", source: "indicative" },
];
