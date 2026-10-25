// Indicative Singapore car loan rates. Flat rate per annum. These are
// placeholder values with effective_date — the production app should
// refresh them via a cron job polling each lender's published rates.

export interface LoanRate {
  lender: string;
  type: "bank" | "inhouse";
  flat_rate: number;
  max_tenure_years: number;
  effective_date: string;
  source: string;
  note?: string;
}

export const LOAN_RATES: LoanRate[] = [
  // Banks
  { lender: "DBS",                  type: "bank",    flat_rate: 0.0248, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  { lender: "OCBC",                 type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  { lender: "UOB",                  type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  { lender: "Maybank",              type: "bank",    flat_rate: 0.0278, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  { lender: "Standard Chartered",   type: "bank",    flat_rate: 0.0288, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  { lender: "Citibank",             type: "bank",    flat_rate: 0.0298, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative" },
  // Finance houses
  { lender: "Hong Leong Finance",   type: "inhouse", flat_rate: 0.0248, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative", note: "Finance co." },
  { lender: "Sing Investments",     type: "inhouse", flat_rate: 0.0268, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative", note: "Finance co." },
  { lender: "Tokyo Century",        type: "inhouse", flat_rate: 0.0288, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative", note: "In-house" },
  { lender: "ORIX",                 type: "inhouse", flat_rate: 0.0308, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative", note: "In-house" },
  { lender: "SMB Automobile",       type: "inhouse", flat_rate: 0.0328, max_tenure_years: 7, effective_date: "2026-10-26", source: "indicative", note: "Dealer in-house" },
];
